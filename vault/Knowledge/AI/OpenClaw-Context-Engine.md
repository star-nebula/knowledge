---
type: concept
tags:
  - AI
  - OpenClaw
  - Context
  - 上下文引擎
  - 压缩
domain: AI
description: Context Engine——可插拔上下文管理，消息组装、压缩委托、引擎注册表、运行时隔离
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/13-context-engine]]、[[Resources/OpenClaw/核心组件/08-ContextCompaction]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-Agent-Engine]]"
  - "[[OpenClaw-LLM-Client]]"
  - "[[OpenClaw-Memory-System]]"
  - "[[OpenClaw-Skills-System]]"
  - "[[OpenClaw-Plugin-System]]"
category: ["🤖 AI大模型", "OpenClaw"]
---

# Context Engine 上下文引擎

**源码路径**：`src/context-engine/`

Context Engine 是 OpenClaw 的上下文管理中间件。将 Agent 上下文（系统提示词、对话历史、工具定义、技能、记忆）组装为 LLM 可消费的形式，并支持上下文压缩和自定义引擎注册。

## 通俗类比：ContextCompaction 是「秘书」

AI 模型有上下文窗口限制（如 GPT-4o 128K tokens）。对话太长时会报错。ContextCompaction 的解决方案：

```
把第 1-50 轮的消息压缩成一段摘要
  → 新上下文 = 摘要（短）+ 第 51-100 轮消息（原始）
  → 总 tokens < 128K ✅
```

触发阈值：`currentTokens > tokenBudget * 0.9`

压缩规则：不能压缩有工具调用结果的消息（后面可能要引用）。

## 核心职责

| 职责 | 说明 |
|------|------|
| 上下文组装 | 将系统提示词/消息/工具/技能/记忆合并为完整上下文 |
| 上下文压缩 | 超 token 限制时自动压缩/裁剪 |
| 引擎注册表 | 管理可插拔的引擎实现 |
| 运行时隔离 | 失败引擎自动降级到默认引擎 |

## ContextEngine 契约

```typescript
interface ContextEngine {
  assemble(params: AssembleParams): Promise<AssembleResult>;
  compact(params: CompactParams): Promise<CompactResult>;
}

type AssembleResult = {
  messages: Message[];
  estimatedTokens: number;
  contextProjection: ContextProjection;
};

type CompactResult = {
  ok: boolean;
  compacted: boolean;
  reason: string;
};
```

## 引擎注册表

```typescript
registerContextEngine(name, engine)    // 注册自定义引擎
resolveContextEngine(name)            // 解析引擎
ensureContextEnginesInitialized()     // 确保内置引擎注册
```

插件可通过 `PluginSystem.registerContextEngine()` 注册自定义上下文引擎。

## 运行时隔离（Runtime Quarantine）

```
自定义引擎执行
  → 成功 → 正常使用
  → 失败 → 自动降级到默认引擎
  → 隔离模式 → 后续请求不再调用失败引擎
```

## 设计模式

| 模式 | 应用 |
|------|------|
| 策略模式 | 可插拔引擎，插件可自定义 |
| 降级机制 | 运行时隔离，失败自动回退 |
| 注册表模式 | 引擎注册表管理所有实现 |
| AbortSignal | compact 操作可中止 |
