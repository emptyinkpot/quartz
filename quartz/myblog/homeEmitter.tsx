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
  frame: "minimal",
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
:root {
  --myblog-bg: #f7f3ea;
  --myblog-panel: rgba(255, 255, 255, 0.74);
  --myblog-panel-strong: rgba(255, 255, 255, 0.92);
  --myblog-ink: #25211d;
  --myblog-muted: #6e665f;
  --myblog-line: rgba(71, 61, 48, 0.16);
  --myblog-accent: #6d3b59;
  --myblog-gold: #b98c27;
  --myblog-green: #315d50;
}

.myblog-runtime-body {
  margin: 0;
  background:
    linear-gradient(120deg, rgba(109, 59, 89, 0.11), transparent 34%),
    linear-gradient(220deg, rgba(49, 93, 80, 0.12), transparent 32%),
    var(--myblog-bg);
  color: var(--myblog-ink);
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

#quartz-root .center.minimal {
  margin: 0;
  max-width: none;
}

#quartz-root .page-footer {
  display: none;
}

body:has(.myblog-home-shell) {
  margin: 0;
  background:
    linear-gradient(120deg, rgba(109, 59, 89, 0.11), transparent 34%),
    linear-gradient(220deg, rgba(49, 93, 80, 0.12), transparent 32%),
    var(--myblog-bg);
}

.myblog-home-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 24px;
  padding: 28px;
}

.myblog-rail,
.myblog-hero,
.myblog-toolbar,
.myblog-card,
.myblog-drawer {
  border: 1px solid var(--myblog-line);
  background: var(--myblog-panel);
  box-shadow: 0 24px 80px rgba(37, 33, 29, 0.10);
  backdrop-filter: blur(18px) saturate(1.2);
}

.myblog-rail {
  position: sticky;
  top: 28px;
  height: calc(100vh - 56px);
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.myblog-brand span {
  display: block;
  color: var(--myblog-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.myblog-brand strong {
  display: block;
  margin-top: 8px;
  font-size: 24px;
  letter-spacing: 0;
}

.myblog-command button,
.myblog-tabs button,
.myblog-card button,
.myblog-drawer button {
  border: 1px solid var(--myblog-line);
  background: rgba(255, 255, 255, 0.72);
  color: var(--myblog-ink);
  border-radius: 999px;
  padding: 9px 12px;
  font: inherit;
  cursor: pointer;
}

.myblog-command {
  display: grid;
  gap: 8px;
}

.myblog-command button {
  text-align: left;
}

.myblog-stats {
  margin-top: auto;
  display: grid;
  gap: 10px;
}

.myblog-stats div {
  border-top: 1px solid var(--myblog-line);
  padding-top: 10px;
}

.myblog-stats strong {
  display: block;
  font-size: 24px;
}

.myblog-main {
  min-width: 0;
}

.myblog-hero {
  border-radius: 22px;
  padding: 28px;
}

.myblog-kicker {
  color: var(--myblog-accent);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.myblog-hero h1 {
  max-width: 920px;
  margin: 10px 0 12px;
  font-size: clamp(34px, 5vw, 72px);
  line-height: 0.98;
  letter-spacing: 0;
}

.myblog-hero p {
  max-width: 760px;
  color: var(--myblog-muted);
  font-size: 17px;
  line-height: 1.7;
}

.myblog-toolbar {
  position: sticky;
  top: 0;
  z-index: 5;
  margin: 18px 0;
  border-radius: 16px;
  padding: 12px;
}

.myblog-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.myblog-tabs button.is-active {
  background: var(--myblog-ink);
  color: white;
}

.myblog-feed {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.myblog-card {
  min-height: 210px;
  border-radius: 18px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
}

.myblog-card:hover,
.myblog-card:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 28px 88px rgba(37, 33, 29, 0.14);
}

.myblog-card__meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--myblog-muted);
  font-size: 12px;
  text-transform: uppercase;
}

.myblog-card h2 {
  margin: 0;
  font-size: 22px;
  letter-spacing: 0;
}

.myblog-card p {
  margin: 0;
  color: var(--myblog-muted);
  line-height: 1.6;
}

.myblog-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}

.myblog-card__tags span {
  border-radius: 999px;
  background: rgba(109, 59, 89, 0.10);
  color: var(--myblog-accent);
  padding: 4px 8px;
  font-size: 12px;
}

.myblog-card__actions {
  display: flex;
  gap: 8px;
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
  background: rgba(37, 33, 29, 0);
  transition: background 180ms ease;
}

.myblog-drawer-layer.is-open .myblog-drawer-backdrop {
  background: rgba(37, 33, 29, 0.24);
}

.myblog-drawer {
  position: absolute;
  top: 18px;
  right: 18px;
  bottom: 18px;
  width: min(720px, calc(100vw - 36px));
  border-radius: 24px;
  background: var(--myblog-panel-strong);
  transform: translateX(calc(100% + 32px));
  transition: transform 200ms ease;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.myblog-drawer-layer.is-open .myblog-drawer {
  transform: translateX(0);
}

.myblog-drawer__head {
  padding: 20px;
  border-bottom: 1px solid var(--myblog-line);
  display: grid;
  gap: 8px;
}

.myblog-drawer__head-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.myblog-drawer__body {
  overflow: auto;
  padding: 22px;
  line-height: 1.8;
}

.myblog-drawer__body p {
  max-width: 68ch;
}

.myblog-hover-card {
  position: fixed;
  z-index: 40;
  width: min(320px, calc(100vw - 24px));
  border: 1px solid var(--myblog-line);
  border-radius: 14px;
  background: var(--myblog-panel-strong);
  box-shadow: 0 24px 80px rgba(37, 33, 29, 0.16);
  padding: 14px;
  pointer-events: none;
}

.myblog-content-page {
  min-height: 100vh;
  padding: 28px;
  color: var(--myblog-ink);
}

.myblog-content-page__nav {
  max-width: 860px;
  margin: 0 auto 16px;
}

.myblog-content-page__article {
  max-width: 860px;
  margin: 0 auto;
  border: 1px solid var(--myblog-line);
  border-radius: 24px;
  background: var(--myblog-panel-strong);
  box-shadow: 0 24px 80px rgba(37, 33, 29, 0.10);
  padding: clamp(20px, 4vw, 42px);
}

.myblog-content-page__article h1 {
  font-size: clamp(32px, 6vw, 64px);
  line-height: 1;
  letter-spacing: 0;
}

.myblog-content-page__body {
  margin-top: 28px;
  font-size: 18px;
  line-height: 1.8;
}

.myblog-content-page__body :where(p, ul, ol, blockquote) {
  max-width: 68ch;
}

@media (max-width: 860px) {
  .myblog-home-shell {
    grid-template-columns: 1fr;
    padding: 14px;
  }

  .myblog-rail {
    position: static;
    height: auto;
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
