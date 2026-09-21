# Star Nebula Knowledge

**记录回忆，知识和畅想的地方**

个人知识库，基于 [VitePress](https://vitepress.dev) 构建，使用 [Obsidian](https://obsidian.md) 管理。在线阅读：<https://star-nebula.github.io/knowledge/>

## 内容板块

| 目录 | 内容 |
|---|---|
| `vault/Knowledge/` | 主题笔记（AI / 工程 / 方法论），按 category frontmatter 自动生成侧边栏 |
| `vault/作坊/` | 项目 Demo 与实验记录 |
| `vault/档案/` | 项目复盘笔记 |

其余目录（`Memory/`、`Resources/`、`DailyNotes/`、`Interview/` 等）为私人笔记，**内容**被 `.gitignore` 排除，不入库也不参与构建；其中 `Archive/` `Canvas/` `DailyNotes/` `Inbox/` `Resources/` `Templates/` 六个目录只在仓库里各保留一个空文件夹占位文件（`.gitkeep`），用于在 GitHub 上显出目录结构。
`vault/rules/` 是例外：知识库操作规范，**入库**（随仓库做版本管理）但**不发布**（不渲染到站点），见下节。

## 知识库规则（`vault/rules/`）

`vault/rules/` 收录本库的笔记规范与场景指南，共 13 个文件。它**随仓库公开**（便于版本管理），但**不渲染到站点**。

| 文件 | 作用 |
|---|---|
| `原子笔记编写规范.md` | 类型枚举、frontmatter 字段、粒度与链接边界 |
| `笔记命名规范.md` | 分隔符约定、领域前缀、MOC 后缀 |
| `分类映射表.md` | 内容 → 物理路径的唯一映射标准 |
| `指南-创建笔记.md` / `指南-更新笔记.md` | 新笔记入库、更新已有笔记的工作流 |
| `指南-目录整理.md` / `指南-健康检查.md` | 目录结构评估、定期体检清单 |
| `指南-链接维护.md` / `指南-异常处理.md` | 链接写法与发布边界、断链与重复内容的处理流程 |
| `定期清理规则.md` | 过期与废弃内容的清理周期 |
| `指南-发布内容.md` | 发布单元的结构与命名规则 |
| `知识库日志规范.md` / `log.md` | 结构变更日志的格式、标签与历次记录 |

> 这些规范面向**本机 Obsidian 库**编写，文中行内路径（如 `vault/Memory/`）对应不随仓库发布的私人目录。

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
- **私人目录**：同时被 `.gitignore`（内容不入库）和 VitePress `srcExclude`（不渲染）双重排除，本地构建也不会把私人笔记带上站点。`Archive/` `Canvas/` `DailyNotes/` `Inbox/` `Resources/` `Templates/` 六个目录例外地在仓库里各保留一个 `.gitkeep` 占位文件（只表明目录存在，不含任何内容）。
- **构建要求**：Node 22+，`NODE_OPTIONS=--max-old-space-size=6144`（全量构建吃内存，CI 已内置）。

## 许可

- 代码：[MIT](./LICENSE)
- 笔记内容：[CC BY-SA 4.0](./LICENSE-CC-BY-SA)
