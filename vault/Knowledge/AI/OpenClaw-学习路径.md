---
type: guides
tags:
  - AI
  - OpenClaw
  - 学习路径
  - 入门
domain: AI
description: OpenClaw 学习与掌握核心指南——按重要性分四梯队的学习路径与4周路线图
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/OpenClaw 学习与掌握核心指南]]"
related:
  - "[[🦀 OpenClaw-MOC]]"
  - "[[OpenClaw-Agent-Engine]]"
  - "[[OpenClaw-Plugin-System]]"
  - "[[OpenClaw-架构总览]]"
category: ["🦀 OpenClaw", "操作指南"]
---

# OpenClaw 学习路径

> 按重要性分层的核心学习路径，从「必须掌握的核心引擎」到「进阶扩展能力」。

## 第一梯队：必须掌握的核心引擎

### 1. Agent 执行引擎（`src/agents/embedded-agent-runner/`）

整个 OpenClaw 的心脏。理解它就理解了产品。

| 文件 | 核心概念 |
|------|---------|
| `run.ts` | `while(true)` 主循环 — Agent 如何无限循环运行 |
| `run/attempt.ts` | 单次 LLM 尝试 — 发 prompt、处理工具调用、返回结果 |
| `run/backend.ts` | 后端调度 — 委托给 LLM SDK |
| `model-fallback.ts` | 模型故障转移 — 失败时切换提供商/模型 |
| `tool-loop-detection.ts` | 工具循环检测 — 防止无限循环 |

核心原理：Agent 在 `while(true)` 循环中运行，每次循环 = 一次"尝试"：构建 prompt → 调用 LLM → LLM 内部工具循环 → 返回 → 压缩上下文 → 检查溢出/失败 → 重试或结束。

### 2. Auto-Reply 回复管道（`src/auto-reply/`）

消息从渠道进来到回复出去的全链路：Dispatch → Context Prep → Command Routing → Reply Dispatcher → Pre-flight Compaction。

## 第二梯队：插件与扩展体系

### 3. Plugin SDK（`src/plugin-sdk/`）

扩展 OpenClaw 的唯一官方入口。三种插件类型：

| 类型 | 目录 | 职责 |
|------|------|------|
| Channel | `extensions/*/` | 接入消息渠道（Telegram、微信、Discord…） |
| Provider | `extensions/*/` | 接入 AI 模型（OpenAI、Claude、Gemini…） |
| Tool | `extensions/*/` | 扩展工具能力（搜索、浏览器、代码执行…） |

关键 SDK 文件：`src/plugin-sdk/api.ts`（公开类型和接口）、`src/plugin-sdk/runtime-api.ts`（插件运行时获取的助手函数）。

### 4. Plugin Loader（`src/plugins/`）

插件如何被发现、加载、注册、生命周期管理。核心概念：Manifest（`openclaw.plugin.json`）、Registration、Lifecycle。

## 第三梯队：Gateway 与基础设施

### 5. Gateway 控制平面（`src/gateway/`）

系统的总线和调度中心：HTTP/WS Server、Auth、Config Hot Reload、Plugin Manager、Cron、Channel Manager。

### 6. 配置系统（`src/config/`）

300+ 配置项，`openclaw.json` 主配置文件，配置引擎加载/验证/合并默认值，`openclaw doctor --fix` 配置迁移机制。

### 7. 上下文引擎（`src/context-engine/`）

管理 Agent 上下文窗口：Compaction（自动压缩）、Token Budget（按模型分配）、Truncation Strategy（截断策略）。

## 第四梯队：进阶扩展能力

| 模块 | 说明 |
|------|------|
| 记忆系统（`src/memory/`） | ActiveMemory / Wiki / Vector 三种模式，SQLite 统一存储 |
| MCP（`src/mcp/`） | Model Context Protocol，让外部工具接入 Agent |
| Skills（`src/skills/`） | 可安装的技能包系统 |
| Hooks（`src/hooks/`） | 生命周期钩子：`before_agent_start`、`after_agent_finalize` 等 |

## 4 周学习路线图

```
第1周：运行起来
├── pnpm install && pnpm gateway:watch
├── 配置一个最简单的 agent + 一个 channel
└── 体验一条消息从发送到回复的完整流程

第2周：理解 Agent 引擎
├── 读 src/agents/embedded-agent-runner/run.ts
├── 跟踪一次 while(true) 循环的全过程
├── 理解工具调用、压缩、重试的触发条件
└── 看 test/agents/ 中的测试用例

第3周：掌握插件体系
├── 读 src/plugin-sdk/api.ts
├── 仿写一个最简单的 channel 插件
├── 理解 manifest 和注册流程
└── 读一个官方插件源码（如 extensions/telegram）

第4周：深入基础设施
├── 配置引擎和热重载
├── 上下文管理和压缩策略
├── 记忆系统和 SQLite 存储
└── Hooks 和 MCP 集成
```

## 关键文件速查

| 想看什么 | 读什么 |
|---------|-------|
| Agent 怎么跑起来的 | `src/agents/embedded-agent-runner/run.ts` |
| 消息怎么处理的 | `src/auto-reply/` |
| 怎么写插件 | `src/plugin-sdk/api.ts` |
| 怎么接新渠道 | `extensions/telegram/src/index.ts` 参考 |
| 配置怎么加载 | `src/config/` |
| 上下文怎么压缩 | `src/context-engine/` |
| 测试怎么写 | `test/` 目录下对应模块 |

> 想用 OpenClaw → 学配置；想扩展 OpenClaw → 学 Plugin SDK；想理解 OpenClaw 原理 → 学 Agent 执行引擎的 `while(true)` 主循环。
