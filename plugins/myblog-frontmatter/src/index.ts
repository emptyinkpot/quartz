import type { QuartzTransformerPlugin } from "@quartz-community/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

const MyBlogFrontmatter: QuartzTransformerPlugin = () => ({
  name: "MyBlogFrontmatter",
  markdownPlugins() {
    return [
      () => (_tree: any, file) => {
        const frontmatter = file.data.frontmatter
        if (!isRecord(frontmatter)) return

        if (typeof frontmatter.title === "string") file.data.title = frontmatter.title
        if (typeof frontmatter.description === "string") {
          file.data.description = frontmatter.description
        }

        if (typeof frontmatter.myblogKind === "string") {
          file.data.myblog = {
            ...(isRecord(file.data.myblog) ? file.data.myblog : {}),
            kind: frontmatter.myblogKind,
            collection: frontmatter.collection,
            feed: frontmatter.feed === true,
            reader: frontmatter.reader === true,
          }
        }
      },
    ]
  },
})

export default MyBlogFrontmatter
export { MyBlogFrontmatter }
