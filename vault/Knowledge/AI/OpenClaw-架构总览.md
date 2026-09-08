---
type: overviews
tags:
  - AI
  - OpenClaw
  - 架构
domain: AI
description: OpenClaw 分层插件化架构总览——6 层架构、启动流程、核心数据流、技术栈、设计原则
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/OpenClaw 架构详解]]、[[Resources/OpenClaw/OpenClaw 核心结构详解]]、[[Resources/OpenClaw/OpenClaw 框架详解]]、[[Resources/OpenClaw/技术架构]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-Gateway-Server]]"
  - "[[OpenClaw-Agent-Engine]]"
  - "[[OpenClaw-Auto-Reply]]"
  - "[[OpenClaw-Plugin-System]]"
category: ["🤖 AI大模型", "OpenClaw"]
---

# OpenClaw 架构总览

> 合并三篇架构详解（架构详解 867 行、核心结构详解 711 行、框架详解 1071 行）的独特内容。

---

## 1. 项目概览

**OpenClaw** 是一个多通道 AI 网关平台，提供可扩展的消息集成、AI 代理执行和插件生态。设计目标是作为个人 AI 助手的统一后端。

| 属性 | 值 |
|------|-----|
| 定位 | 多通道 AI 网关 / 个人 AI 助手 |
| 许可证 | MIT |
| 运行时 | Node.js >= 22.19.0 |
| 包管理 | pnpm@11.2.2 (workspace) |
| 语言 | TypeScript 6.0.3（tsgo 编译器） |
| 构建工具 | esbuild + tsdown |
| 代码规模 | src/ 80+ 子模块, extensions/ 145+ 插件, packages/ 21 独立包 |

### 核心能力域

| 功能域 | 说明 |
|---------|------|
| 多通道消息接入 | 30+ 渠道：WhatsApp、Telegram、Slack、Discord、微信、飞书、LINE、QQ 等 |
| AI 模型路由 | 40+ 模型提供商：OpenAI、Anthropic、Google、AWS Bedrock、Ollama、vLLM 等 |
| Agent 执行引擎 | 全功能 AI Agent：工具调用、子 Agent 分发、技能系统 |
| 插件体系 | 完整 Plugin SDK：频道插件、Provider 插件、工具插件、Hook 扩展 |
| MCP 协议 | 原生 Model Context Protocol 支持，双向工具桥接 |
| OpenAI 兼容 API | 网关层暴露标准 Chat Completions API |

---

## 2. 分层架构

OpenClaw 采用分层插件化架构（Layered Plugin Architecture），分为 6 层：

```
┌──────────────────────────────────────────────────┐
│              Entry Points 入口层                  │
│       CLI (entry.ts) + Library (library.ts)      │
├──────────────────────────────────────────────────┤
│              Gateway Layer 网关层                 │
│  HTTP/WebSocket/Control UI/OpenAI API/RPC        │
├──────────────────────────────────────────────────┤
│              Core Services 核心服务层             │
│  Auto-Reply ←→ Agent Engine ←→ Session Manager  │
│  Hook System + Config System + Routing           │
├──────────────────────────────────────────────────┤
│              Extension Layer 扩展层               │
│   Plugin Loader + Plugin SDK + Channel Plugins    │
│         (30+ channels, 40+ providers)             │
├──────────────────────────────────────────────────┤
│              Capabilities 能力层                  │
│   LLM Client · MCP · Memory · Skills · Tools     │
│                Context Engine                      │
├──────────────────────────────────────────────────┤
│              Infrastructure 基础设施层           │
│   SQLite · Security/Sandbox · Secrets · Cron     │
└──────────────────────────────────────────────────┘
```

各层职责：
- **入口层**：CLI 引导（`entry.ts`）和库模式公共 API（`library.ts`）
- **网关层**：统一外部入口，HTTP/WS/控制 UI/OpenAI 兼容 API
- **核心服务层**：消息处理 → Agent 执行 → 会话管理，Hook 与 Config 横切
- **扩展层**：插件发现/加载/激活，渠道适配器
- **能力层**：LLM 调用、MCP 桥接、记忆、技能、工具、上下文管理
- **基础设施层**：存储、安全、密钥、定时任务

---

## 3. Monorepo 结构

```
openclaw-main/
├── src/                    # 核心 TypeScript 源码 (80+ 子模块)
│   ├── gateway/            # Gateway 控制平面 (500+ 文件)
│   ├── plugins/            # 插件系统 (500+ 文件)
│   ├── channels/           # 频道抽象 (160 文件)
│   ├── config/             # 配置系统 (103 文件)
│   ├── agents/             # Agent 执行引擎 (97 文件)
│   ├── auto-reply/         # 自动回复 (107 文件)
│   ├── llm/                # LLM 客户端 (40 文件)
│   ├── security/           # 安全 (86 文件)
│   ├── context-engine/     # 上下文引擎
│   ├── memory/             # 记忆系统
│   ├── mcp/                # MCP 协议
│   ├── skills/             # 技能系统
│   ├── tools/              # 工具系统
│   ├── hooks/              # Hook 系统
│   ├── sessions/           # 会话管理
│   ├── secrets/            # 密钥管理
│   ├── cron/ + daemon/     # 定时任务 + 守护进程
│   └── ...                 # 更多
├── extensions/             # 145+ 插件目录
├── packages/               # 21 独立包
├── ui/                     # Control UI 前端
├── apps/                   # 移动/桌面应用
└── test/                   # 409 个测试文件
```

### Packages 架构（21 个独立包）

packages/ 下的独立包提供可复用的协议定义和工具：
- `gateway-protocol/` — 网关协议定义
- `terminal-core/` — 终端核心工具
- `llm-core/` — LLM 类型核心
- `plugin-sdk/` — 插件开发 SDK
- 等共 21 个包

### Extensions 系统（145+ 扩展）

extensions/ 下每个目录是一个可插拔功能扩展：
- 频道插件：telegram、discord、whatsapp、微信、飞书等 30+
- Provider 插件：openai、anthropic、google、mistral 等 40+
- 工具插件：search、code-interpreter、media-handler 等
- 其他：语音合成、媒体处理、会话记录等

---

## 4. 启动引导流程

```
openclaw gateway start
  → entry.ts（CLI 引导）
  → 动态 import server.impl.ts
  → 加载配置（Config System）
  → 加载插件清单（Plugin Loader）
  → 初始化模型目录（Model Catalog）
  → 启动频道运行时（Channels）
  → 初始化 MCP 桥接
  → 启动 HTTP 服务器
  → 启动 WebSocket
  → 运行 BOOT.md 启动会话
  → 进入就绪状态
```

关键设计：大量使用动态 `import()` 延迟加载子系统，减少冷启动时间。

---

## 5. 完整请求生命周期

```
用户消息 → [渠道插件]
  → Gateway Server（统一入口）
  → Auto-Reply Dispatch（指令提取 + 调度）
  → Hook System（inbound hook）
  → Agent Engine（工具准备 + 模型选择）
  → Context Engine（上下文组装）
  → LLM Client（chatCompletion）
  → 模型提供商 API
  → 响应处理（工具调用循环）
  → Memory Flush（如果超预算）
  → Hook System（outbound hook）
  → Auto-Reply（信封格式化 + 交付）
  → Gateway Server（WebSocket 推送）
```

---

## 6. 技术栈

| 层面 | 技术 |
|------|------|
| 运行时 | Node.js + TypeScript |
| 存储 | SQLite (Kysely ORM) |
| 配置 | JSON5 + 环境变量 |
| 协议 | WebSocket, HTTP REST, JSON-RPC, MCP |
| 沙箱 | 进程隔离 + 文件系统保护 |
| 守护进程 | launchd (macOS) / systemd (Linux) / schtasks (Windows) |
| 测试 | Vitest (409 测试文件) |
| Lint | Oxlint + Oxfmt |
| 构建 | esbuild + tsdown |

---

## 7. 设计原则汇总

| 原则 | 体现 |
|------|------|
| 懒加载优先 | 核心模块使用 dynamic import() 减少启动时间 |
| 单一入口 | 每个子模块有 barrel 文件，外部只通过 barrel 导入 |
| 插件化 | 30+ 渠道、40+ Provider 均以插件形式集成 |
| 声明式配置 | JSON5 配置 + 环境变量引用 |
| 原子变更 | 配置和密钥使用文件锁 + 重试 + 校验 |
| 事件溯源 | Memory 使用 JSONL 审计日志 |
| 运行时隔离 | Context Engine 失败引擎自动降级 |
| 安全沙箱 | 工具执行在沙箱中，文件系统保护 |

---

## 相关笔记

- [[OpenClaw-MOC]] — 知识地图
- [[OpenClaw-Gateway-Server]] — 网关服务器详解
- [[OpenClaw-Agent-Engine]] — Agent 执行引擎详解
- [[OpenClaw-Auto-Reply]] — 自动回复与调度
- [[OpenClaw-Plugin-System]] — 插件系统详解
- [[OpenClaw-LLM-Client]] — LLM 客户端
- [[OpenClaw-Config-System]] — 配置系统
- [[OpenClaw-Channels]] — 频道抽象层
- [[OpenClaw-Memory-System]] — 记忆系统
- [[OpenClaw-Context-Engine]] — 上下文引擎
- [[OpenClaw-Tools-System]] — 工具系统
- [[OpenClaw-Skills-System]] — 技能系统
- [[OpenClaw-MCP]] — MCP 协议桥接
