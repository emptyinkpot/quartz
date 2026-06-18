import { QuartzComponentConstructor } from "../components/types"
import { QuartzComponentProps } from "../components/types"
import { MyBlogCollection, MyBlogObject } from "./objectModel"

export const MyBlogHomePage: QuartzComponentConstructor = () => {
  function MyBlogHome(props: QuartzComponentProps) {
    const objects = (props.fileData.myblogObjects ?? []) as MyBlogObject[]
    const collections = (props.fileData.myblogCollections ?? []) as MyBlogCollection[]
    const feedObjects = objects.filter((object) => object.feed)
    const readerObjects = objects.filter((object) => object.reader)
    const kinds = ["all", ...new Set(feedObjects.map((object) => object.kind))]

    return (
      <div class="myblog-home-shell">
        <aside class="myblog-rail" aria-label="MyBlog runtime navigation">
          <div class="myblog-brand">
            <span>emptyinkpot</span>
            <strong>Runtime Surface</strong>
          </div>
          <div class="myblog-command" aria-label="Command palette">
            <button type="button" data-myblog-filter="all">
              全局检索 / Ctrl K
            </button>
            <a href="/tags/obsidian">Obsidian</a>
            <a href="/tags/quartz">Quartz</a>
          </div>
          <div class="myblog-stats">
            <div>
              <strong>{feedObjects.length}</strong>
              <span>Feed objects</span>
            </div>
            <div>
              <strong>{collections.length}</strong>
              <span>Collections</span>
            </div>
            <div>
              <strong>{readerObjects.length}</strong>
              <span>Reader templates</span>
            </div>
          </div>
        </aside>

        <main class="myblog-main">
          <section class="myblog-hero">
            <span class="myblog-kicker">Quartz-native MyBlog rewrite</span>
            <h1>把 Obsidian 笔记投成首页 Feed、阅读抽屉和知识对象。</h1>
            <p>
              这是第一条垂直切片：Quartz 负责内容解析和静态生成，MyBlog 逻辑在 Quartz
              体系内重新实现对象模型、首页 Feed、过滤、悬浮预览和阅读抽屉。
            </p>
          </section>

          <section class="myblog-toolbar" aria-label="Feed filters">
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
          </section>

          <section class="myblog-feed" aria-label="MyBlog feed">
            {collections.map((collection) => (
              <article
                class="myblog-card"
                tabIndex={0}
                data-myblog-card
                data-myblog-kind="collection"
                data-summary={collection.summary}
              >
                <div class="myblog-card__meta">
                  <span>collection</span>
                  <span>{collection.objects.length} objects</span>
                </div>
                <h2>{collection.title}</h2>
                <p>{collection.summary}</p>
                <div class="myblog-card__tags">
                  {collection.tags.map((tag) => (
                    <span>{tag}</span>
                  ))}
                </div>
              </article>
            ))}

            {feedObjects.map((object) => (
              <article
                class="myblog-card"
                tabIndex={0}
                data-myblog-card
                data-myblog-kind={object.kind}
                data-summary={object.summary}
                data-myblog-open-card={object.id}
              >
                <div class="myblog-card__meta">
                  <span>{object.kind}</span>
                  <span>{object.readingMinutes} min</span>
                </div>
                <h2>{object.title}</h2>
                <p>{object.summary}</p>
                <div class="myblog-card__tags">
                  {object.tags.slice(0, 5).map((tag) => (
                    <span>{tag}</span>
                  ))}
                </div>
                <div class="myblog-card__actions">
                  <button type="button" data-myblog-open={object.id}>
                    阅读抽屉
                  </button>
                  <a href={object.href}>完整页</a>
                </div>
              </article>
            ))}
          </section>
        </main>

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
                <a href={object.href}>打开完整 Quartz 页面</a>
              </p>
            </article>
          </template>
        ))}
      </div>
    )
  }

  return MyBlogHome
}
