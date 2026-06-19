// src/components/MyBlogNoteFacts.tsx
import { jsx, jsxs } from "preact/jsx-runtime"
var labels = {
  myblogKind: "Kind",
  collection: "Collection",
  feed: "Feed",
  reader: "Reader",
}
function stringifyFactValue(value) {
  if (typeof value === "string" && value.trim().length > 0) return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  if (Array.isArray(value) && value.length > 0) {
    return value
      .map((item) => (typeof item === "string" ? item : void 0))
      .filter(Boolean)
      .join(", ")
  }
  return void 0
}
var MyBlogNoteFacts = () => {
  const Component = ({ fileData }) => {
    const frontmatter = fileData.frontmatter ?? {}
    const facts = Object.entries(labels)
      .map(([key, label]) => {
        const value = stringifyFactValue(frontmatter[key])
        return value ? { label, value } : void 0
      })
      .filter((fact) => Boolean(fact))
    if (facts.length === 0) return null
    return /* @__PURE__ */ jsx("aside", {
      class: "myblog-note-facts",
      "data-myblog-note-facts": true,
      children: facts.map((fact) =>
        /* @__PURE__ */ jsxs(
          "span",
          {
            class: "myblog-note-fact",
            children: [
              /* @__PURE__ */ jsx("span", {
                class: "myblog-note-fact-label",
                children: fact.label,
              }),
              /* @__PURE__ */ jsx("span", {
                class: "myblog-note-fact-value",
                children: fact.value,
              }),
            ],
          },
          fact.label,
        ),
      ),
    })
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
var MyBlogNoteFacts_default = MyBlogNoteFacts
export { MyBlogNoteFacts_default as MyBlogNoteFacts }
