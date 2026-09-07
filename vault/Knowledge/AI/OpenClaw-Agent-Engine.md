---
type: concept
tags:
  - AI
  - OpenClaw
  - Agent
  - 执行引擎
domain: AI
description: Agent 执行引擎——命令编排、工具管理、模型选择、ACP 子代理生成，Agent 的大脑
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/02-agent-engine]]、[[Resources/OpenClaw/核心组件/01-AgentCommand]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-架构总览]]"
  - "[[OpenClaw-LLM-Client]]"
  - "[[OpenClaw-Tools-System]]"
  - "[[OpenClaw-ACP]]"
  - "[[OpenClaw-Context-Engine]]"
---

# Agent Engine 代理引擎

**源码路径**：`src/agents/`（~97 文件）
**核心文件**：`agent-command.ts`（86KB）

Agent Engine 是 OpenClaw 的执行核心。每次用户消息触发 Agent 运行时，Engine 负责模型选择 → 工具装配 → 上下文注入 → 执行 → 结果交付。

## 通俗类比：AgentCommand 是「大脑」

当用户发消息给 AI 时，AgentCommand 决定：
1. **用哪个 Agent？** — 默认助手还是代码助手
2. **用哪个模型？** — GPT-4o、Claude 3.5、Gemini…，支持 fallback
3. **会话状态在哪？** — 历史消息存在哪个 session 文件
4. **哪些工具可用？** — 根据配置、插件、权限动态计算
5. **怎么把回复发出去？** — 调 `dispatchReply`

## 核心职责

| 职责 | 说明 |
|------|------|
| 命令编排 | 处理 Agent 命令全生命周期（规范化→模型选择→交付→重试） |
| 工具管理 | 组装核心/Shell/频道/插件/MCP 工具，应用多层策略过滤 |
| 模型选择 | 规范化模型引用，自动回退探测 |
| 作用域配置 | 管理 Agent 作用域（模型回退、技能、工作区） |
| ACP 生成 | 生成子代理和 ACP 会话，处理父流绑定 |
| 工具定义适配 | 将运行时 AgentTool 适配为 ToolDefinition |

## 命令编排流程

```
用户消息到达
  → normalizeAgentCommandModelRef()  // 规范化模型引用
  → hasConfiguredProvider()          // 检查提供商配置
  → 解析会话上下文
  → buildEffectiveAgentToolSurface() // 构建工具表面
  → 注入系统提示词/上下文
  → chatCompletion()                 // 调用 LLM
  → 处理工具调用结果
  → 交付回复
```

## 工具策略系统（多层过滤）

通过多层策略管道控制工具可见性：

```
所有可用工具
  → sandbox policy    (沙箱策略过滤)
  → profile policy    (配置文件策略过滤)
  → provider policy   (提供商策略过滤)
  → sender policy     (发送者策略过滤)
  → group policy      (组策略过滤)
  → sub-agent policy  (子代理策略过滤)
  → 最终工具表面
```

关键常量：`MEMORY_FLUSH_ALLOWED_TOOL_NAMES`（允许触发内存刷新的工具白名单）

## 模型选择与回退

```typescript
normalizeAgentCommandModelRef()      // 规范化模型引用
hasExactConfiguredProviderModel()    // 精确匹配
autoFallbackPrimaryProbeStateKey()   // 主模型探测状态
pruneAutoFallbackPrimaryProbeState() // 清理过期探测
```

主模型不可用时，Engine 记录探测状态并自动切换到回退模型，状态过期后自动清理。

## ACP 子代理生成

```
acp-spawn.ts
  → 创建 ACP 会话标识
  → 设置父流绑定
  → 应用线程绑定策略
  → 注入通道解析上下文
  → 返回子代理引用
```

## 设计模式

| 模式 | 应用 |
|------|------|
| 策略模式 | 工具过滤 pipeline（多层策略） |
| 适配器模式 | AgentTool → ToolDefinition |
| 规范化管道 | normalize* 函数族 |
| 子代理生成 | ACP spawn 生命周期管理 |
| 回退探测 | 主模型健康状态追踪 |

## 依赖关系

- **上游**：Auto-Reply（触发引擎执行）
- **下游**：LLM Client、Tools System、MCP、Memory、Context Engine
- **横切**：Hook System、Session Manager
