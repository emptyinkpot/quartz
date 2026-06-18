import { QuartzComponentConstructor } from "../components/types"
import { QuartzComponentProps } from "../components/types"
import { QuartzPageTypePlugin } from "../plugins/types"
import { htmlToJsx } from "../util/jsx"
import { FilePath, FullSlug, resolveRelative } from "../util/path"

export const MyBlogContentPage: QuartzComponentConstructor = () => {
  function ContentPage(props: QuartzComponentProps) {
    const title = props.fileData.frontmatter?.title ?? props.fileData.slug ?? "Untitled"
    const tags = Array.isArray(props.fileData.frontmatter?.tags)
      ? (props.fileData.frontmatter.tags as unknown[])
      : []
    const current = props.fileData.slug ?? ("index" as FullSlug)
    const relativePath = (props.fileData.relativePath ?? "virtual.md") as FilePath

    return (
      <article class="popover-hint myblog-content-page">
        <p class="myblog-page-back">
          <a class="internal internal-link" href={resolveRelative(current, "index" as FullSlug)}>
            首页 Feed
          </a>
        </p>
        <h1>{title}</h1>
        {tags.length ? (
          <ul class="tags">
            {tags.map((tag: unknown) => (
              <li>
                <a
                  class="internal tag-link"
                  href={resolveRelative(current, `tags/${String(tag)}` as FullSlug)}
                >
                  {String(tag)}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <section class="myblog-content-page__body">
          {htmlToJsx(relativePath, props.tree)}
        </section>
      </article>
    )
  }

  return ContentPage
}

export const MyBlogContentPageType: QuartzPageTypePlugin = () => ({
  name: "MyBlogContentPage",
  priority: 10,
  match({ slug }) {
    return slug !== "index" && slug !== "404"
  },
  layout: "content",
  frame: "default",
  body: () => MyBlogContentPage(undefined),
})
