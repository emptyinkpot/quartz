---
title: Obsidian Object Model
myblogKind: post
collection: architecture
summary: 将 Obsidian frontmatter、wikilink、folder 和 tags 映射成 Quartz-native MyBlogObject。
date: 2026-06-18
tags:
  - obsidian
  - object-model
  - architecture
---

# Obsidian Object Model

MyBlog 的重写不是把 Astro 页面搬进 Quartz，而是在 Quartz pipeline 内重新定义对象模型。

当前第一版对象字段：

- `id`
- `kind`
- `title`
- `summary`
- `tags`
- `collection`
- `feed`
- `reader`
- `graph`
- `search`

这对应旧 MyBlog 里的 `RuntimeMarkdownObject`，但落点已经变成 Quartz transformer/pageType/emitter。
