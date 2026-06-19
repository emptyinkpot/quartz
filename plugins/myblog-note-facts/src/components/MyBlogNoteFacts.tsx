import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"

type Fact = {
  label: string
  value: string
}

const labels: Record<string, string> = {
  myblogKind: "Kind",
  collection: "Collection",
  feed: "Feed",
  reader: "Reader",
}

function stringifyFactValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  if (Array.isArray(value) && value.length > 0) {
    return value
      .map((item) => (typeof item === "string" ? item : undefined))
      .filter(Boolean)
      .join(", ")
  }
  return undefined
}

const MyBlogNoteFacts: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = ({ fileData }) => {
    const frontmatter = (fileData.frontmatter ?? {}) as Record<string, unknown>
    const facts: Fact[] = Object.entries(labels)
      .map(([key, label]) => {
        const value = stringifyFactValue(frontmatter[key])
        return value ? { label, value } : undefined
      })
      .filter((fact): fact is Fact => Boolean(fact))

    if (facts.length === 0) return null

    return (
      <aside class="myblog-note-facts" data-myblog-note-facts>
        {facts.map((fact) => (
          <span class="myblog-note-fact" key={fact.label}>
            <span class="myblog-note-fact-label">{fact.label}</span>
            <span class="myblog-note-fact-value">{fact.value}</span>
          </span>
        ))}
      </aside>
    )
  }

  Component.css = `
.myblog-note-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.75rem;
  margin: 0.75rem 0 1.1rem;
  color: var(--gray);
  font-size: 0.85rem;
  line-height: 1.35;
}

.myblog-note-fact {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  max-width: 100%;
}

.myblog-note-fact-label {
  color: var(--gray);
}

.myblog-note-fact-value {
  color: var(--darkgray);
}
`

  return Component
}

export default MyBlogNoteFacts
