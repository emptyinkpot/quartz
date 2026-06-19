# Quartz v5

> “[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important.” — Richard Hamming

## MyBlog fork policy

This fork keeps Quartz core infrastructure aligned with the upstream `jackyzha0/quartz` `v5` source. MyBlog-specific adaptation must live in plugins, content, and configuration extension surfaces only.

Current local extensions are:

- `plugins/myblog-frontmatter`
- `plugins/myblog-note-facts`
- `content/`
- `quartz.config.yaml`

Do not carry MyBlog behavior by patching Quartz core runtime files such as `quartz/build.ts`, `quartz/worker.ts`, component internals, plugin loader internals, or package infrastructure.

Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.

🔗 Read the documentation and get started: https://quartz.jzhao.xyz/

[Join the Discord Community](https://discord.gg/cRFFHYye7t)

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/jackyzha0">
    <img src="https://cdn.jsdelivr.net/gh/jackyzha0/jackyzha0/sponsorkit/sponsors.svg" />
  </a>
</p>
