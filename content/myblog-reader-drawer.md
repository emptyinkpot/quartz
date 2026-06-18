---
title: MyBlog Reader Drawer
myblogKind: project
collection: runtime-shell
summary: 把旧 MyBlog 首页的阅读抽屉逻辑改写为 Quartz 体系内的 layout component 和 client resource。
date: 2026-06-18
tags:
  - drawer
  - reader
  - myblog
---

# MyBlog Reader Drawer

旧实现里，抽屉是首页 Runtime Surface 的主阅读面。

Quartz rewrite 的第一阶段先完成最小能力：

1. Feed 卡片携带对象 ID。
2. 点击卡片打开右侧阅读抽屉。
3. 抽屉显示标题、摘要、正文摘录和完整页链接。
4. `Esc` 关闭抽屉，`J/K/Enter` 支持基本键盘流。

下一阶段再接入 reader memory、highlight、seal 和 mini graph。
