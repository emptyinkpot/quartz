import { QuartzComponentConstructor } from "../components/types"
import { QuartzComponentProps } from "../components/types"
import { MyBlogCollection, MyBlogObject } from "./objectModel"
import { FullSlug, resolveRelative } from "../util/path"

export const MyBlogHomePage: QuartzComponentConstructor = () => {
  function MyBlogHome(props: QuartzComponentProps) {
    const objects = (props.fileData.myblogObjects ?? []) as MyBlogObject[]
    const collections = (props.fileData.myblogCollections ?? []) as MyBlogCollection[]
    const feedObjects = objects.filter((object) => object.feed)
    const readerObjects = objects.filter((object) => object.reader)
    const kinds = ["all", ...new Set(feedObjects.map((object) => object.kind))]
    const current = props.fileData.slug ?? ("index" as FullSlug)

    return (
      <article class="popover-hint myblog-quartz-home">
        <h1>emptyinkpot</h1>
        <p>
          基于 Quartz 的知识库首页。Obsidian 笔记仍由 Quartz 解析、链接、生成和索引；MyBlog
          只在这个结构里扩展对象列表、集合和阅读抽屉。
        </p>

        <section class="myblog-quartz-summary" aria-label="Notebook summary">
          <p>
            <strong>{feedObjects.length}</strong> notes
          </p>
          <p>
            <strong>{collections.length}</strong> collections
          </p>
          <p>
            <strong>{readerObjects.length}</strong> drawer entries
          </p>
        </section>

        <section aria-label="Feed filters">
          <h2>Notes</h2>
          <div class="myblog-quartz-filter">
            <div class="myblog-tabs">
              {kinds.map((kind) => (
                <button
                  class={kind === "all" ? "is-active" : ""}
                  type="button"
                  data-myblog-filter={kind}
                >
                  {kind === "all" ? "全部" : kind}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section class="myblog-quartz-collections" aria-label="Collections">
          {collections.map((collection) => (
            <details>
              <summary>
                {collection.title} <span>{collection.objects.length}</span>
              </summary>
              <p>{collection.summary}</p>
              <ul class="tags">
                {collection.tags.map((tag) => (
                  <li>
                    <a class="internal tag-link" href={resolveRelative(current, `tags/${tag}` as FullSlug)}>
                      {tag}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </section>

        <section class="myblog-feed" aria-label="MyBlog feed">
          <ul class="section-ul">
            {collections.map((collection) => (
              <li
                class="section-li myblog-object-row"
                tabIndex={0}
                data-myblog-card
                data-myblog-kind="collection"
                data-summary={collection.summary}
              >
                <div class="section">
                  <p class="meta">collection / {collection.objects.length} objects</p>
                  <div class="desc">
                    <h3>{collection.title}</h3>
                    <p>{collection.summary}</p>
                  </div>
                </div>
              </li>
            ))}

            {feedObjects.map((object) => (
              <li
                class="section-li myblog-object-row"
                tabIndex={0}
                data-myblog-card
                data-myblog-kind={object.kind}
                data-summary={object.summary}
                data-myblog-open-card={object.id}
              >
                <div class="section">
                  <p class="meta">
                    {object.kind} / {object.readingMinutes} min
                  </p>
                  <div class="desc">
                    <h3>
                    <a class="internal internal-link" href={resolveRelative(current, object.slug as FullSlug)}>
                      {object.title}
                    </a>
                    </h3>
                    <p>{object.summary}</p>
                  </div>
                  <ul class="tags">
                    {object.tags.slice(0, 5).map((tag) => (
                      <li>
                        <a
                          class="internal tag-link"
                          href={resolveRelative(current, `tags/${tag}` as FullSlug)}
                        >
                          {tag}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p class="myblog-row-actions">
                    <button type="button" data-myblog-open={object.id}>
                      阅读抽屉
                    </button>
                    <a
                      class="internal internal-link"
                      href={resolveRelative(current, object.slug as FullSlug)}
                    >
                      完整页
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div class="myblog-drawer-layer" data-myblog-drawer-layer hidden>
          <button
            class="myblog-drawer-backdrop"
            type="button"
            aria-label="关闭阅读抽屉"
            data-myblog-drawer-close
          />
          <aside class="myblog-drawer" role="dialog" aria-modal="true">
            <header class="myblog-drawer__head">
              <div class="myblog-drawer__head-row">
                <div>
                  <span class="myblog-kicker" data-myblog-drawer-meta>
                    reader
                  </span>
                  <h2 data-myblog-drawer-title>Reader</h2>
                </div>
                <button type="button" data-myblog-drawer-close>
                  关闭
                </button>
              </div>
            </header>
            <div class="myblog-drawer__body" data-myblog-drawer-body />
          </aside>
        </div>

        {readerObjects.map((object) => (
          <template
            data-myblog-drawer-template={object.id}
            data-title={object.title}
            data-kind={object.kind}
            data-minutes={String(object.readingMinutes)}
          >
            <article>
              <p class="myblog-kicker">{object.collection}</p>
              <h1>{object.title}</h1>
              <p>{object.summary}</p>
              <p>{object.bodyText}</p>
              <p>
                <a class="internal internal-link" href={resolveRelative(current, object.slug as FullSlug)}>
                  打开完整 Quartz 页面
                </a>
              </p>
            </article>
          </template>
        ))}
      </article>
    )
  }

  return MyBlogHome
}
