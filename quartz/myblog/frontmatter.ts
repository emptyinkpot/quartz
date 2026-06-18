import YAML from "yaml"
import { QuartzTransformerPlugin } from "../plugins/types"

const markerPrefix = "MYBLOG_FRONTMATTER:"

function parseFrontmatter(src: string): { data: Record<string, unknown>; content: string } {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: src }

  try {
    return { data: YAML.parse(match[1]) ?? {}, content: match[2] ?? "" }
  } catch {
    return { data: {}, content: match[2] ?? src }
  }
}

export const MyBlogFrontmatter: QuartzTransformerPlugin = () => ({
  name: "MyBlogFrontmatter",
  textTransform(_ctx, src) {
    const parsed = parseFrontmatter(src)
    if (Object.keys(parsed.data).length === 0) return src.trim()

    const encoded = encodeURIComponent(JSON.stringify(parsed.data))
    return `<!--${markerPrefix}${encoded}-->\n\n${parsed.content.trim()}`
  },
  markdownPlugins() {
    return [
      () => (tree: any, file) => {
        const value = String(file.value ?? "")
        const marker = value.match(/<!--MYBLOG_FRONTMATTER:([\s\S]*?)-->/)
        const data = marker ? JSON.parse(decodeURIComponent(marker[1])) : {}
        const frontmatter = {
          ...(file.data.frontmatter ?? {}),
          ...data,
        }
        file.data.frontmatter = frontmatter
        if (typeof frontmatter.title === "string") file.data.title = frontmatter.title
        if (typeof frontmatter.description === "string") file.data.description = frontmatter.description

        if (Array.isArray(tree.children)) {
          tree.children = tree.children.filter(
            (node: any) =>
              !(node.type === "html" && String(node.value ?? "").includes(markerPrefix)),
          )
        }
      },
    ]
  },
})
