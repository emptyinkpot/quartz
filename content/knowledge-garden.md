---
title: Knowledge Runtime
myblogKind: note
collection: knowledge
summary: 用 Quartz 重新实现 MyBlog 的知识对象、集合、反链和阅读抽屉入口。
date: 2026-06-18
tags:
  - garden
  - quartz
  - runtime
---

# Knowledge Runtime

Quartz 在这里不只是渲染 Markdown，而是作为 MyBlog 的内容编译内核。

- 笔记进入首页 Feed。
- 笔记可以打开阅读抽屉。
- 标签和集合参与首页过滤。
- 后续会把 backlink、seal、highlight 和 graph focus 纳入同一对象模型。

相关对象：[[myblog-reader-drawer]]。
