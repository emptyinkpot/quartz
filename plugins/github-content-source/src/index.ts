import type { QuartzTransformerPlugin } from "@quartz-community/types"
import { mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"

type GitHubContentSourceOptions = {
  owner: string
  repo: string
  ref?: string
  sourcePath: string
  targetDir: string
  include?: string[]
  exclude?: string[]
  tokenEnv?: string
  concurrency?: number
}

type GitHubTreeItem = {
  path: string
  mode: string
  type: "blob" | "tree" | "commit"
  sha: string
  size?: number
  url: string
}

type GitHubTreeResponse = {
  tree?: GitHubTreeItem[]
  truncated?: boolean
}

type GitHubBlobResponse = {
  content?: string
  encoding?: string
}

type SyncSummary = {
  files: number
  targetDir: string
  owner: string
  repo: string
  ref: string
  sourcePath: string
}

type PluginOptions = {
  configPath?: string
}

function normalizePosixPath(input: string): string {
  return input.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "")
}

function isMarkdownPath(filePath: string): boolean {
  return filePath.endsWith(".md") || filePath.endsWith(".mdx")
}

function globToRegExp(glob: string): RegExp {
  const normalized = normalizePosixPath(glob)
  let pattern = ""

  for (let index = 0; index < normalized.length; index++) {
    const current = normalized[index]
    const next = normalized[index + 1]
    const afterNext = normalized[index + 2]

    if (current === "*" && next === "*" && afterNext === "/") {
      pattern += "(?:.*/)?"
      index += 2
      continue
    }
    if (current === "*" && next === "*") {
      pattern += ".*"
      index += 1
      continue
    }
    if (current === "*") {
      pattern += "[^/]*"
      continue
    }
    pattern += current.replace(/[.+^${}()|[\]\\]/g, "\\$&")
  }

  return new RegExp(`^${pattern}$`)
}

function matchesAny(filePath: string, patterns: string[] | undefined): boolean {
  if (!patterns || patterns.length === 0) return false
  return patterns.some((pattern) => globToRegExp(normalizePosixPath(pattern)).test(filePath))
}

function shouldProject(filePath: string, options: GitHubContentSourceOptions): boolean {
  if (!isMarkdownPath(filePath)) return false
  if (matchesAny(filePath, options.exclude)) return false
  if (options.include && options.include.length > 0) return matchesAny(filePath, options.include)
  return true
}

function getGitHubHeaders(tokenEnv?: string): Record<string, string> {
  const tokenName = tokenEnv ?? "OBSIDIAN_GITHUB_TOKEN"
  const token = process.env[tokenName]
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "quartz-github-content-source",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function hasAuthHeader(headers: Record<string, string>): boolean {
  return typeof headers.Authorization === "string" && headers.Authorization.length > 0
}

function isRetryableGitHubFetchError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return /terminated|ECONNRESET|ETIMEDOUT|UND_ERR_SOCKET/i.test(message)
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJson<T>(
  url: string,
  headers: Record<string, string>,
  tokenEnv?: string,
): Promise<T> {
  const maxAttempts = 3
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, { headers })
      if (!response.ok) {
        if (response.status === 404 && !hasAuthHeader(headers)) {
          const tokenName = tokenEnv ?? "OBSIDIAN_GITHUB_TOKEN"
          throw new Error(
            `GitHub returned 404 for ${url}. If this repository is private, set ${tokenName} with read access.`,
          )
        }
        throw new Error(`GitHub request failed: ${response.status} ${response.statusText} ${url}`)
      }
      return (await response.json()) as T
    } catch (error) {
      if (attempt < maxAttempts && isRetryableGitHubFetchError(error)) {
        await delay(attempt * 1000)
        continue
      }
      throw error
    }
  }

  throw new Error(`GitHub request failed after ${maxAttempts} attempts: ${url}`)
}

async function fetchBlobText(url: string, headers: Record<string, string>): Promise<string> {
  const blob = await fetchJson<GitHubBlobResponse>(url, headers)
  if (blob.encoding !== "base64" || typeof blob.content !== "string") {
    throw new Error(`Unsupported GitHub blob encoding for ${url}`)
  }

  return Buffer.from(blob.content.replace(/\s/g, ""), "base64").toString("utf8")
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let nextIndex = 0

  async function worker(): Promise<void> {
    for (;;) {
      const index = nextIndex
      nextIndex += 1
      if (index >= items.length) return
      results[index] = await mapper(items[index])
    }
  }

  const workerCount = Math.min(Math.max(1, concurrency), Math.max(1, items.length))
  await Promise.all(Array.from({ length: workerCount }, () => worker()))
  return results
}

function assertSafeTargetDir(targetDir: string): string {
  const resolved = path.resolve(targetDir)
  const relative = path.relative(process.cwd(), resolved)
  if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`targetDir must stay inside the Quartz repository: ${targetDir}`)
  }

  const normalized = normalizePosixPath(relative)
  if (normalized === "content") {
    throw new Error("targetDir must not be the content root; use a generated subdirectory instead")
  }

  return resolved
}

export async function syncGitHubContentSource(
  options: GitHubContentSourceOptions,
): Promise<SyncSummary> {
  const ref = options.ref ?? "main"
  const sourcePath = normalizePosixPath(options.sourcePath)
  const targetDir = assertSafeTargetDir(options.targetDir)
  const headers = getGitHubHeaders(options.tokenEnv)
  const treeUrl = `https://api.github.com/repos/${options.owner}/${options.repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`
  const tree = await fetchJson<GitHubTreeResponse>(treeUrl, headers, options.tokenEnv)

  if (!Array.isArray(tree.tree)) {
    throw new Error(`GitHub tree response for ${options.owner}/${options.repo}@${ref} had no tree`)
  }
  if (tree.truncated) {
    throw new Error(`GitHub tree for ${options.owner}/${options.repo}@${ref} is truncated`)
  }

  const prefix = sourcePath ? `${sourcePath}/` : ""
  const files = tree.tree
    .filter((item) => item.type === "blob")
    .map((item) => ({
      filePath: normalizePosixPath(item.path),
      url: item.url,
    }))
    .filter((item) => item.filePath.startsWith(prefix))
    .map((item) => ({
      ...item,
      relativePath: item.filePath.slice(prefix.length),
    }))
    .filter((item) => shouldProject(item.relativePath, options))
    .sort((left, right) => left.relativePath.localeCompare(right.relativePath))

  await rm(targetDir, { recursive: true, force: true })
  await mkdir(targetDir, { recursive: true })

  const concurrency = options.concurrency ?? 8
  await mapWithConcurrency(files, concurrency, async (file) => {
    const targetPath = path.join(targetDir, file.relativePath)
    await mkdir(path.dirname(targetPath), { recursive: true })
    let content: string
    try {
      content = await fetchBlobText(file.url, headers)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to project GitHub file ${file.filePath}: ${message}`)
    }
    await writeFile(targetPath, content)
  })

  return {
    files: files.length,
    targetDir,
    owner: options.owner,
    repo: options.repo,
    ref,
    sourcePath,
  }
}

const GitHubContentSource: QuartzTransformerPlugin<PluginOptions> = () => ({
  name: "GitHubContentSource",
})

export default GitHubContentSource
export { GitHubContentSource }
export type { GitHubContentSourceOptions, SyncSummary }
