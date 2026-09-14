# Star Nebula Knowledge

**记录回忆，知识和畅想的地方**

个人知识库，基于 [VitePress](https://vitepress.dev) 构建，使用 [Obsidian](https://obsidian.md) 管理。在线阅读：<https://star-nebula.github.io/knowledge/>

## 内容板块

| 目录 | 内容 |
|---|---|
| `vault/Knowledge/` | 主题笔记（AI / 工程 / 方法论），按 category frontmatter 自动生成侧边栏 |
| `vault/作坊/` | 项目 Demo 与实验记录 |
| `vault/档案/` | 项目复盘笔记 |

其余目录（`Memory/`、`发布/`、`Resources/`、`DailyNotes/` 等）为私人笔记，被 `.gitignore` 排除，不入库也不参与构建。

## 使用

```shell
pnpm install     # 安装依赖
pnpm docs:dev    # 本地开发
pnpm docs:build  # 构建静态页面（CI 自动部署到 GitHub Pages）
```

## 私密与发布的边界

- **附件**：`vault/Attachments/` 默认整体忽略；`pnpm sync:assets` 只把「已发布笔记引用到的图片」强制入库，私人图绝不进 GitHub。
- **私人目录**：同时被 `.gitignore`（不入库）和 VitePress `srcExclude`（不渲染）双重排除，本地构建也不会把私人笔记带上站点。
- **构建要求**：Node 22+，`NODE_OPTIONS=--max-old-space-size=6144`（全量构建吃内存，CI 已内置）。

## 许可

- 代码：[MIT](./LICENSE)
- 笔记内容：[CC BY-SA 4.0](./LICENSE-CC-BY-SA)
