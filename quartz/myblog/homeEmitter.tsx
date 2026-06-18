import { QuartzPageTypePlugin } from "../plugins/types"
import { FullSlug } from "../util/path"
import { MyBlogHomePage } from "./homePage"
import { collectMyBlogCollections, collectMyBlogObjects } from "./objectModel"

export const MyBlogHomePageType: QuartzPageTypePlugin = () => ({
  name: "MyBlogHomePage",
  priority: 100,
  match({ slug }) {
    return slug === "index"
  },
  generate({ content }) {
    const objects = collectMyBlogObjects(content)
    const collections = collectMyBlogCollections(objects)
    return [
      {
        slug: "index" as FullSlug,
        title: "emptyinkpot runtime surface",
        data: {
          frontmatter: {
            title: "emptyinkpot runtime surface",
            description: "Quartz-native rewrite of the MyBlog homepage, feed, and reader drawer.",
            tags: ["myblog", "quartz", "runtime"],
          },
          myblogObjects: objects,
          myblogCollections: collections,
        },
      },
    ]
  },
  layout: "myblog-home",
  frame: "default",
  body: () => MyBlogHomePage(undefined),
})

export function getMyBlogHomeResources() {
  return {
    css: [{ content: myblogHomeCss, inline: true }],
    js: [
      {
        loadTime: "afterDOMReady" as const,
        contentType: "inline" as const,
        script: myblogHomeScript,
      },
    ],
  }
}

const myblogHomeCss = `
.myblog-quartz-home > p {
  margin-top: 0;
}

.myblog-quartz-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
  border-top: 1px solid var(--lightgray);
  border-bottom: 1px solid var(--lightgray);
  padding: 1rem 0;
}

.myblog-quartz-summary p {
  margin: 0;
  color: var(--gray);
}

.myblog-quartz-summary strong {
  display: block;
  color: var(--dark);
  font-size: 1.4rem;
}

.myblog-quartz-filter {
  margin: 0.75rem 0 1rem;
}

.myblog-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.myblog-tabs button,
.myblog-row-actions button,
.myblog-drawer button {
  border: 1px solid var(--lightgray);
  background: var(--light);
  color: var(--secondary);
  border-radius: 5px;
  padding: 0.25rem 0.45rem;
  font: inherit;
  font-size: 0.92rem;
  cursor: pointer;
}

.myblog-tabs button {
  border-color: var(--lightgray);
}

.myblog-tabs button.is-active {
  background: var(--highlight);
  color: var(--dark);
}

.myblog-quartz-collections {
  margin: 1rem 0 1.5rem;
}

.myblog-quartz-collections details {
  border-top: 1px solid var(--lightgray);
  padding: 0.7rem 0;
}

.myblog-quartz-collections summary {
  cursor: pointer;
  color: var(--dark);
  font-weight: 600;
}

.myblog-quartz-collections summary span {
  color: var(--gray);
  font-family: var(--codeFont);
  font-size: 0.85rem;
  margin-left: 0.35rem;
}

.myblog-object-row {
  border-top: 1px solid var(--lightgray);
  padding: 1rem 0;
}

.myblog-object-row:focus {
  outline: 2px solid var(--highlight);
  outline-offset: 4px;
}

.myblog-object-row .desc p {
  margin: 0.25rem 0 0;
}

.myblog-row-actions {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  margin: 0.6rem 0 0;
}

.myblog-quartz-sidebar h2,
.myblog-quartz-sidebar h3 {
  margin-top: 0;
}

.myblog-quartz-sidebar nav {
  display: grid;
  gap: 0.45rem;
}

.myblog-quartz-sidebar section {
  border-top: 1px solid var(--lightgray);
  padding-top: 0.8rem;
}

.myblog-quartz-sidebar p {
  color: var(--gray);
  margin: 0;
}

.myblog-page-back {
  margin-top: 0;
  font-size: 0.92rem;
}

.myblog-kicker {
  color: var(--gray);
  font-family: var(--codeFont);
  font-size: 0.85rem;
  margin: 0 0 0.4rem;
}

.myblog-content-page__body {
  margin-top: 1.5rem;
}

.myblog-content-page__body > h1:first-child {
  display: none;
}

.myblog-drawer-layer {
  position: fixed;
  inset: 0;
  z-index: 30;
  pointer-events: none;
}

.myblog-drawer-layer.is-open {
  pointer-events: auto;
}

.myblog-drawer-backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  transition: background 180ms ease;
}

.myblog-drawer-layer.is-open .myblog-drawer-backdrop {
  background: color-mix(in srgb, var(--light) 72%, transparent);
}

.myblog-drawer {
  position: absolute;
  top: 1rem;
  right: 1rem;
  bottom: 1rem;
  width: min(44rem, calc(100vw - 2rem));
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  background: var(--light);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
  transform: translateX(calc(100% + 2rem));
  transition: transform 200ms ease;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.myblog-drawer-layer.is-open .myblog-drawer {
  transform: translateX(0);
}

.myblog-drawer__head {
  padding: 1rem;
  border-bottom: 1px solid var(--lightgray);
  display: grid;
  gap: 0.5rem;
}

.myblog-drawer__head-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.myblog-drawer__body {
  overflow: auto;
  padding: 1rem;
}

.myblog-drawer__body p {
  max-width: 68ch;
}

.myblog-hover-card {
  position: fixed;
  z-index: 40;
  width: min(20rem, calc(100vw - 2rem));
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  background: var(--light);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  color: var(--darkgray);
  padding: 0.75rem;
  pointer-events: none;
}

@media (max-width: 860px) {
  .myblog-quartz-summary {
    grid-template-columns: 1fr;
  }
}
`

const myblogHomeScript = `
(() => {
  const layer = document.querySelector('[data-myblog-drawer-layer]');
  const drawerTitle = document.querySelector('[data-myblog-drawer-title]');
  const drawerMeta = document.querySelector('[data-myblog-drawer-meta]');
  const drawerBody = document.querySelector('[data-myblog-drawer-body]');
  const cards = [...document.querySelectorAll('[data-myblog-card]')];
  const tabs = [...document.querySelectorAll('[data-myblog-filter]')];
  let activeCardIndex = -1;

  const templates = new Map(
    [...document.querySelectorAll('[data-myblog-drawer-template]')].map((template) => [
      template.getAttribute('data-myblog-drawer-template'),
      template
    ])
  );

  function setFilter(kind) {
    tabs.forEach((tab) => tab.classList.toggle('is-active', tab.getAttribute('data-myblog-filter') === kind));
    cards.forEach((card) => {
      const show = kind === 'all' || card.getAttribute('data-myblog-kind') === kind;
      card.hidden = !show;
    });
  }

  function openDrawer(id) {
    const template = templates.get(id);
    if (!template || !layer || !drawerBody) return;
    const content = template.content ? template.content.cloneNode(true) : template.cloneNode(true);
    const title = template.getAttribute('data-title') || 'Untitled';
    const kind = template.getAttribute('data-kind') || 'object';
    const minutes = template.getAttribute('data-minutes') || '1';
    if (drawerTitle) drawerTitle.textContent = title;
    if (drawerMeta) drawerMeta.textContent = kind + ' / ' + minutes + ' min';
    drawerBody.replaceChildren(content);
    layer.hidden = false;
    requestAnimationFrame(() => layer.classList.add('is-open'));
  }

  function closeDrawer() {
    if (!layer) return;
    layer.classList.remove('is-open');
    window.setTimeout(() => {
      layer.hidden = true;
      drawerBody?.replaceChildren();
    }, 200);
  }

  document.addEventListener('click', (event) => {
    const filter = event.target.closest?.('[data-myblog-filter]');
    if (filter) {
      setFilter(filter.getAttribute('data-myblog-filter') || 'all');
      return;
    }

    const opener = event.target.closest?.('[data-myblog-open]');
    if (opener) {
      event.preventDefault();
      openDrawer(opener.getAttribute('data-myblog-open'));
      return;
    }

    if (event.target.closest?.('[data-myblog-drawer-close]')) {
      closeDrawer();
    }
  });

  document.addEventListener('keydown', (event) => {
    const visibleCards = cards.filter((card) => !card.hidden);
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      document.querySelector('[data-myblog-filter="all"]')?.focus();
    }
    if (event.key === 'Escape') closeDrawer();
    if (event.key.toLowerCase() === 'j') {
      activeCardIndex = Math.min(visibleCards.length - 1, activeCardIndex + 1);
      visibleCards[activeCardIndex]?.focus();
    }
    if (event.key.toLowerCase() === 'k' && !(event.metaKey || event.ctrlKey)) {
      activeCardIndex = Math.max(0, activeCardIndex - 1);
      visibleCards[activeCardIndex]?.focus();
    }
    if (event.key === 'Enter' && document.activeElement?.hasAttribute('data-myblog-card')) {
      const id = document.activeElement.getAttribute('data-myblog-open-card');
      if (id) openDrawer(id);
    }
  });

  let hover;
  document.addEventListener('pointerover', (event) => {
    const card = event.target.closest?.('[data-myblog-card]');
    if (!card) return;
    hover?.remove();
    hover = document.createElement('aside');
    hover.className = 'myblog-hover-card';
    hover.textContent = card.getAttribute('data-summary') || card.querySelector('h2')?.textContent || '';
    document.body.append(hover);
  });
  document.addEventListener('pointermove', (event) => {
    if (!hover) return;
    hover.style.left = Math.min(window.innerWidth - hover.offsetWidth - 12, event.clientX + 18) + 'px';
    hover.style.top = Math.min(window.innerHeight - hover.offsetHeight - 12, event.clientY + 18) + 'px';
  });
  document.addEventListener('pointerout', (event) => {
    if (!event.target.closest?.('[data-myblog-card]')) return;
    hover?.remove();
    hover = null;
  });
})();
`
