// src/index.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
var MyBlogFrontmatter = () => ({
  name: "MyBlogFrontmatter",
  markdownPlugins() {
    return [
      () => (_tree, file) => {
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
var index_default = MyBlogFrontmatter
export { MyBlogFrontmatter, index_default as default }
