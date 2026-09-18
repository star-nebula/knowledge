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
pnpm install        # 安装依赖
pnpm docs:dev       # 本地开发
pnpm docs:build     # 构建静态页面（CI 自动部署到 GitHub Pages）
pnpm check:boundary # 发布边界校验（见下方「私密与发布的边界」）
```

## 私密与发布的边界

- **发布面（唯一事实来源）**：`vault/作坊`、`vault/档案`、`vault/Knowledge`。这三目录是全部会进 GitHub 并渲染成站点的内容；新增/移除发布目录只改 `.vitepress/config.ts` 顶部的 `PUBLISHED_DIRS`。
- **发布判定**：三面共用同一份 `PUBLISHED_DIRS`——`srcExclude` 排除所有非发布目录（不渲染）、nolebase 双链索引同源排除（不编入 `[[ ]]`）、`scripts/check-publish-boundary.mjs` 校验 git 跟踪面与构建产物链接都 ⊆ 发布面。跑 `pnpm check:boundary` 即可发现「私人目录被误 add / 产物出现非发布链接」。
- **附件**：`vault/Attachments/` 默认整体忽略；`pnpm sync:assets` 只把「已发布笔记引用到的图片」强制入库，私人图绝不进 GitHub。
- **私人目录**：同时被 `.gitignore`（不入库）和 VitePress `srcExclude`（不渲染）双重排除，本地构建也不会把私人笔记带上站点。
- **构建要求**：Node 22+，`NODE_OPTIONS=--max-old-space-size=6144`（全量构建吃内存，CI 已内置）。

## 许可

- 代码：[MIT](./LICENSE)
- 笔记内容：[CC BY-SA 4.0](./LICENSE-CC-BY-SA)
