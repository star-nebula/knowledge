---
title: DeepSeek-Harness-桌面端安装
created: 2026-09-25
tags:
  - DeepSeek
  - Harness
  - 桌面端
  - Electron
  - pnpm
type: 步骤操作
related:
  - "[[DeepSeek Harness 部署流程]]"
  - "[[模型部署-MOC]]"
category: ["🤖 AI大模型", "模型部署"]
---

# DeepSeek-Harness-桌面端安装

DeepSeek Harness **没有桌面安装包可下载**：官方 Releases 全是 alpha / rc 预发布且**不含任何附件**，npm 上的 `@deepseek-ai/dsh` 只是 Web UI 的 CLI。桌面端（Electron 44）**只能从源码构建**，且代码只存在于较新的 master——旧 checkout 里连 `apps/desktop` 都没有。

**前置条件**：Node.js `^22.19.0` 或 `>=24.0.0`（硬门槛，低版本直接报错）；pnpm `11.7.0`（`corepack enable` 启用）；只能用 pnpm，npm / yarn 会破坏 workspace 链接。

## 路径一：从未装过 Harness

先用 Web UI 确认需求（官方主推路径，约 2 分钟）：

```shell
npx @deepseek-ai/dsh web        # 自动打开 http://127.0.0.1:3080（latest ≈ 0.1.5-rc.3）
```

再构建桌面端：

```shell
git clone https://github.com/deepseek-ai/deepseek-harness
cd deepseek-harness
pnpm install            # 首次会拉 Electron 44，几百 MB
pnpm run build          # 准备仓库产物
pnpm run start:desktop  # 内部为 --skip-build，所以必须先 build
```

打成自己的 Windows 安装包：

```shell
pnpm run package:desktop:win:x64:unsigned
```

## 路径二：已装过 Harness

先对号入座，三种「装过」处理方式不同：

| 当初的装法 | 能直接跑桌面端 | 做法 |
|------------|----------------|------|
| `npx @deepseek-ai/dsh web` | 不能 | 桌面端不在 npm 包里，须 clone 源码（同路径一） |
| `npm i -g @deepseek-ai/dsh` | 不能 | 同上 |
| 已 clone 过仓库 | 看版本 | 旧 checkout 里没有桌面端代码，`git pull` 后才有 ↓ |

```shell
git pull --ff-only      # 拉到含桌面端的版本
ls apps                 # 必须出现 desktop，否则后面脚本不存在
pnpm install            # 依赖可能变了，别跳过
pnpm run build
pnpm run start:desktop
```

- 只改了桌面端代码 → `pnpm run build:desktop`
- 边改边看 → `pnpm run dev:desktop`（先构建再启动，一步顶两步）

## 注意事项

- `package:desktop:win:x64` 需要代码签名证书，**自用必须加 `:unsigned`**；加 `:dir` 则只产出解包目录、不生成安装器。产物位于 `apps/desktop/.desktop-build`
- win-x64 目标**只能在 Windows x64 主机上构建**，不能在其他机器代编
- Windows 上没有 `make`，别用 `make desktop`，直接跑 pnpm 脚本
- **桌面端与 `npx` 跑的 Web 版共用同一份 `~/.dsh`**（profiles / sessions / 凭据都在里面）：启动前建议整目录备份
- npm 的 `latest` 仍是 `0.1.5-rc.3`，`0.1.7-rc.2` 在 **`@next`** 标签下；全局 CLI 与源码桌面端可并存，但版本不一致，别混用
- 开发者预览版，动手前先读仓库的 `SAFETY.zh.md`（会给 Agent shell 与文件系统权限）

## 相关笔记

- Web UI 拉起与四种模式 → [[DeepSeek Harness 部署流程]]
- 同类终端 Agent 工具 → [[Claude Code 接入 DeepSeek 与 GLM]]

---

*（内容由 AI 生成，截至 2026-09-25 有效。来源：[GitHub 仓库](https://github.com/deepseek-ai/deepseek-harness)、[官网](https://deepseek.com/harness)，访问于 2026-09-25）*
