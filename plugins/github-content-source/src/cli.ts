import { readFile } from "node:fs/promises"
import path from "node:path"
import { syncGitHubContentSource, type GitHubContentSourceOptions } from "./index"

async function main(): Promise<void> {
  const configArg = process.argv[2] ?? "github-content-source.config.json"
  const configPath = path.resolve(configArg)
  const raw = await readFile(configPath, "utf8")
  const config = JSON.parse(raw) as GitHubContentSourceOptions | GitHubContentSourceOptions[]
  const sources = Array.isArray(config) ? config : [config]

  for (const source of sources) {
    const summary = await syncGitHubContentSource(source)
    console.log(
      `Projected ${summary.files} GitHub Markdown file(s) from ${summary.owner}/${summary.repo}@${summary.ref}:${summary.sourcePath} to ${summary.targetDir}`,
    )
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
