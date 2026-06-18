import { QuartzComponentConstructor, QuartzComponentProps } from "../components/types"
import { FullSlug, resolveRelative } from "../util/path"

export const MyBlogLeftSidebar: QuartzComponentConstructor = () => {
  function LeftSidebar(props: QuartzComponentProps) {
    const current = props.fileData.slug ?? ("index" as FullSlug)

    return (
      <div class="myblog-quartz-sidebar myblog-quartz-sidebar-left">
        <h2>
          <a class="internal internal-link" href={resolveRelative(current, "index" as FullSlug)}>
            emptyinkpot
          </a>
        </h2>
        <nav aria-label="MyBlog navigation">
          <a class="internal internal-link" href={resolveRelative(current, "index" as FullSlug)}>
            Notes
          </a>
          <a class="internal internal-link" href={resolveRelative(current, "tags/quartz" as FullSlug)}>
            Quartz
          </a>
          <a
            class="internal internal-link"
            href={resolveRelative(current, "tags/obsidian" as FullSlug)}
          >
            Obsidian
          </a>
        </nav>
      </div>
    )
  }

  return LeftSidebar
}

export const MyBlogRightSidebar: QuartzComponentConstructor = () => {
  function RightSidebar(props: QuartzComponentProps) {
    const current = props.fileData.slug ?? ("index" as FullSlug)
    const pages = props.allFiles.filter((file) => file.slug && file.slug !== "index")
    const tags = [
      ...new Set(
        pages.flatMap((file) =>
          Array.isArray(file.frontmatter?.tags) ? file.frontmatter.tags.map(String) : [],
        ),
      ),
    ].slice(0, 8)

    return (
      <aside class="myblog-quartz-sidebar myblog-quartz-sidebar-right">
        <section>
          <h3>Graph</h3>
          <p>{pages.length} notes projected through Quartz.</p>
        </section>
        <section>
          <h3>Tags</h3>
          <ul class="tags">
            {tags.map((tag) => (
              <li>
                <a class="internal tag-link" href={resolveRelative(current, `tags/${tag}` as FullSlug)}>
                  {tag}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    )
  }

  return RightSidebar
}

export const MyBlogFooter: QuartzComponentConstructor = () => {
  function Footer() {
    return (
      <footer>
        <p>
          Built on <a href="https://quartz.jzhao.xyz">Quartz</a>.
        </p>
      </footer>
    )
  }

  return Footer
}
