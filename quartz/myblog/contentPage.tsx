import { QuartzComponentConstructor } from "../components/types"
import { QuartzComponentProps } from "../components/types"
import { QuartzPageTypePlugin } from "../plugins/types"

export const MyBlogContentPage: QuartzComponentConstructor = () => {
  function ContentPage(props: QuartzComponentProps) {
    const title = props.fileData.frontmatter?.title ?? props.fileData.slug ?? "Untitled"
    const tags = Array.isArray(props.fileData.frontmatter?.tags)
      ? (props.fileData.frontmatter.tags as unknown[])
      : []

    return (
      <main class="myblog-content-page">
        <nav class="myblog-content-page__nav">
          <a href="/">首页 Feed</a>
        </nav>
        <article class="myblog-content-page__article">
          <p class="myblog-kicker">Quartz page</p>
          <h1>{title}</h1>
          {tags.length ? (
            <div class="myblog-card__tags">
              {tags.map((tag: unknown) => (
                <span>{String(tag)}</span>
              ))}
            </div>
          ) : null}
          <section class="myblog-content-page__body">{props.children}</section>
        </article>
      </main>
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
  frame: "minimal",
  body: () => MyBlogContentPage(undefined),
})
