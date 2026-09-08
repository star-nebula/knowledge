---
type: concept
tags:
  - AI
  - OpenClaw
  - Tools
  - 工具系统
  - 布尔表达式
domain: AI
description: Tools System——工具描述符、可用性评估（布尔表达式树）、协议适配、工具规划
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/09-tools-system]]、[[Resources/OpenClaw/核心组件/05-ToolExecution]]"
related:
  - "[[🦀 OpenClaw-MOC]]"
  - "[[OpenClaw-Agent-Engine]]"
  - "[[OpenClaw-LLM-Client]]"
  - "[[OpenClaw-Plugin-System]]"
  - "[[OpenClaw-MCP]]"
category: ["🦀 OpenClaw", "能力层"]
---

# Tools System 工具系统

**源码路径**：`src/tools/`

Tools System 是 OpenClaw 的工具能力抽象。管理所有可用于 Agent 的工具（核心/Shell/频道/插件/MCP），通过声明式描述符和布尔表达式实现灵活的可用性控制。

## 通俗类比：ToolExecution 是「工具间」

AI 模型不能直接执行工具。工具调用分两步：
1. AI 输出「我想调用 search(query="OpenClaw")」
2. 系统执行调用，把结果返回给 AI

ToolExecution 负责第 2 步，以及第 1 步前的工具规划。

## 核心职责

| 职责 | 说明 |
|------|------|
| 工具描述 | 声明式工具描述符（名称/描述/Schema/拥有者/执行器） |
| 可用性评估 | 布尔表达式树（AND/OR 嵌套）控制工具可见性 |
| 协议适配 | ToolDescriptor → 模型可理解的运行时负载 |
| 工具规划 | 生成 visible/hidden 分离的 ToolPlan |

## 核心类型

### 工具拥有者

```typescript
type ToolOwnerRef = 
  | { type: "core" }
  | { type: "plugin"; pluginId: string }
  | { type: "channel"; channelId: string }
  | { type: "mcp"; serverId: string };
```

### 可用性条件（布尔表达式树）

```typescript
type ToolAvailabilitySignal =
  | "always" | "auth" | "config" | "env" | "plugin-enabled" | "context";

type ToolAvailabilityExpression = {
  allOf?: ToolAvailabilityExpression[];  // AND
  anyOf?: ToolAvailabilityExpression[];  // OR
  signal?: ToolAvailabilitySignal;       // 原子条件
};
```

### 工具描述符

```typescript
type ToolDescriptor = {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  owner: ToolOwnerRef;
  executor: ToolExecutorRef;
  availability: ToolAvailabilityExpression;
};
```

### 工具规划

```typescript
type ToolPlan = {
  visible: ToolDescriptor[];  // 对模型可见
  hidden: ToolDescriptor[];   // 对模型隐藏但可用
};
```

## 可用性评估

```
ToolDescriptor.availability
  → 求值布尔表达式树
  → allOf: 所有子条件为真 → 工具可用
  → anyOf: 任一子条件为真 → 工具可用
  → signal: 检查单个信号
  → 决定是否包含在 ToolPlan 中
```

## 协议适配

`protocol.ts` 将内部 `ToolDescriptor` 转换为 LLM 模型可理解的函数调用格式：
- OpenAI：`{"type": "function", "function": {...}}`
- Anthropic：`[{"name": "...", "input_schema": {...}}]`
- Google：`[{"function_declarations": [...]}]`

## 设计模式

| 模式 | 应用 |
|------|------|
| 声明式描述符 | ToolDescriptor 描述工具而不指定实现 |
| 布尔表达式 | 灵活嵌套的可用性条件 |
| 描述符驱动规划 | 先生成 ToolPlan 再执行 |
| 协议适配 | 内部描述符 → 模型运行时格式 |
