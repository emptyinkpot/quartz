import { ProcessedContent, QuartzPluginData } from "../plugins/vfile"
import { ElementContent, Root } from "hast"

export type MyBlogObjectKind = "note" | "post" | "project" | "collection" | "visual"

export type MyBlogObject = {
  id: string
  kind: MyBlogObjectKind
  title: string
  summary: string
  href: string
  slug: string
  tags: string[]
  collection: string
  date?: string
  updated?: string
  readingMinutes: number
  feed: boolean
  reader: boolean
  graph: boolean
  search: boolean
  bodyText: string
}

export type MyBlogCollection = {
  id: string
  title: string
  summary: string
  tags: string[]
  objects: MyBlogObject[]
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value
  if (typeof value === "string") return ["true", "yes", "1"].includes(value.toLowerCase())
  return fallback
}

function asTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((tag) => tag.trim()).filter(Boolean)
  if (typeof value === "string") {
    return value
      .split(/[,\s]+/)
      .map((tag) => tag.trim())
      .filter(Boolean)
  }
  return []
}

function getTitle(data: QuartzPluginData): string {
  return asString(data.frontmatter?.title) || asString(data.title) || asString(data.slug) || "Untitled"
}

function getFrontmatter(data: QuartzPluginData): Record<string, unknown> {
  return typeof data.frontmatter === "object" && data.frontmatter !== null
    ? (data.frontmatter as Record<string, unknown>)
    : {}
}

function textFromNode(node: ElementContent | Root): string {
  if ("value" in node && typeof node.value === "string") return node.value
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map((child) => textFromNode(child as ElementContent)).join(" ")
  }
  return ""
}

function estimateReadingMinutes(text: string): number {
  return Math.max(1, Math.round(text.trim().length / 520))
}

function summarize(text: string, data: QuartzPluginData): string {
  const explicit =
    asString(data.frontmatter?.summary) ||
    asString(data.frontmatter?.description) ||
    asString(data.description)
  if (explicit) return explicit

  return text
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 150)
}

function hrefFor(slug: string): string {
  return slug === "index" ? "/" : `/${slug}`
}

export function toMyBlogObject(content: ProcessedContent): MyBlogObject {
  const [tree, file] = content
  const data = file.data
  const frontmatter = getFrontmatter(data)
  const slug = asString(data.slug)
  const bodyText = textFromNode(tree)
  const title = getTitle(data)
  const kind = (asString(frontmatter.myblogKind) ||
    asString(frontmatter.kind) ||
    "note") as MyBlogObjectKind
  const tags = asTags(frontmatter.tags)
  const collection =
    asString(frontmatter.collection) ||
    tags[0] ||
    (kind === "project" ? "projects" : kind === "post" ? "posts" : "notes")

  return {
    id: asString(frontmatter.myblogId) || slug,
    kind,
    title,
    summary: summarize(bodyText, data),
    href: hrefFor(slug),
    slug,
    tags,
    collection,
    date: asString(frontmatter.date),
    updated: asString(frontmatter.updated),
    readingMinutes: estimateReadingMinutes(bodyText),
    feed: asBoolean(frontmatter.feed, slug !== "index"),
    reader: asBoolean(frontmatter.reader, slug !== "index"),
    graph: asBoolean(frontmatter.graph, true),
    search: asBoolean(frontmatter.search, true),
    bodyText,
  }
}

export function collectMyBlogObjects(content: ProcessedContent[]): MyBlogObject[] {
  return content
    .map(toMyBlogObject)
    .filter((object) => object.feed || object.reader || object.graph || object.search)
    .sort((a, b) => {
      const dateA = a.updated || a.date || ""
      const dateB = b.updated || b.date || ""
      return dateB.localeCompare(dateA) || a.title.localeCompare(b.title)
    })
}

export function collectMyBlogCollections(objects: MyBlogObject[]): MyBlogCollection[] {
  const map = new Map<string, MyBlogObject[]>()
  for (const object of objects.filter((item) => item.feed)) {
    const list = map.get(object.collection) ?? []
    list.push(object)
    map.set(object.collection, list)
  }

  return [...map.entries()]
    .map(([id, collectionObjects]) => ({
      id,
      title: id
        .split(/[-_\s]+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      summary: `${collectionObjects.length} objects projected into the Quartz-native MyBlog feed.`,
      tags: [...new Set(collectionObjects.flatMap((object) => object.tags))].slice(0, 8),
      objects: collectionObjects,
    }))
    .sort((a, b) => b.objects.length - a.objects.length || a.title.localeCompare(b.title))
}
