---
type: concept
tags:
  - AI
  - OpenClaw
  - LLM
  - 流式接口
  - 提供商
domain: AI
description: LLM Client——8+ 模型提供商统一流式接口，AssistantMessageEvent 协议，懒加载注册
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/07-llm-client]]、[[Resources/OpenClaw/核心组件/04-LLM-Stream]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-Agent-Engine]]"
  - "[[OpenClaw-Model-Catalog]]"
  - "[[OpenClaw-Secrets]]"
  - "[[OpenClaw-Context-Engine]]"
---

# LLM Client 大语言模型客户端

**源码路径**：`src/llm/`（~40 文件）

LLM Client 是 OpenClaw 的 AI 模型接入层。将 Anthropic、OpenAI、Google 等提供商统一到一致的 `StreamFunction` 接口。

## 通俗类比：LLM Stream 是「电话线」

OpenClaw 支持 40+ 个 AI 模型提供商，每个 API 格式不同。LLM Stream 层通过统一接口 + 多 Provider 适配，让上层代码只写一次就能和所有模型通信。

**关键**：返回 `AsyncIterable<AssistantMessageEvent>`——不是等 AI 全部回复完再返回，而是边生成边返回（流式）。

## 核心职责

| 职责 | 说明 |
|------|------|
| API 统一抽象 | `KnownApi` 枚举统一 8 种 API 家族 |
| 模型注册表 | 管理所有可用模型，支持认证状态检测 |
| 流式协议 | `AssistantMessageEventStream` 标准化事件流 |
| 使用统计 | 统一 `Usage` 统计（token 数 + 成本） |
| 提供者注册 | 懒加载注册内置提供者 |
| OAuth 支持 | OAuth 认证流程支持 |

## KnownApi 枚举

```typescript
type KnownApi =
  | "openai-completions"
  | "mistral-conversations"
  | "openai-responses"
  | "azure-openai-responses"
  | "openai-chatgpt-responses"
  | "anthropic-messages"
  | "bedrock-converse-stream"
  | "google-generative-ai"
  | "google-vertex";
```

## 流式事件协议

```typescript
type AssistantMessageEvent =
  | { type: "start"; partial: AssistantMessage }
  | { type: "text_delta"; contentIndex: number; delta: string }
  | { type: "toolcall_start"; contentIndex: number }
  | { type: "done"; reason: StopReason; message: AssistantMessage }
  | { type: "error"; reason: StopReason; error: AssistantMessage };
```

事件流设计的好处：
- 用户实时看到 AI 在打字
- 工具调用可以边生成边执行

## 使用统计

```typescript
interface Usage {
  input: number;      // 输入 token
  output: number;     // 输出 token
  cacheRead: number;  // 缓存读取
  cacheWrite: number; // 缓存写入
  cost: { input; output; cacheRead; cacheWrite; total };
}
```

## 内置提供者

| 提供商 | API 家族 |
|--------|----------|
| Anthropic | `anthropic-messages` |
| OpenAI Completions | `openai-completions` |
| OpenAI Responses | `openai-responses` |
| Azure OpenAI | `azure-openai-responses` |
| Google | `google-generative-ai` |
| Google Vertex | `google-vertex` |
| Mistral | `mistral-conversations` |
| Cloudflare | — |

## 懒加载注册

```typescript
// register-builtins.ts
{
  "anthropic-messages": () => import("./anthropic.js"),
  "openai-completions": () => import("./openai-completions.js"),
  // ... 首次调用时才加载
}
```

每个提供者导出 `stream()` 和 `streamSimple()` 函数。

## 流包装器

| 包装器 | 用途 |
|--------|------|
| `anthropic-cache-control-payload.ts` | Anthropic 缓存控制 |
| `google.ts` | Google 流适配 |
| `openai.ts` | OpenAI 流适配 |
| `reasoning-effort-utils.ts` | 推理力度工具 |

## 设计模式

| 模式 | 应用 |
|------|------|
| 策略模式 | 每个 API 家族对应一个 stream 策略 |
| 注册表模式 | ModelRegistry / ApiRegistry |
| 懒加载模式 | 提供者模块延迟加载 |
| 事件流 | AssistantMessageEventStream 标准化事件 |
| 适配器 | stream-wrappers 适配各提供者差异 |

## 依赖关系

- **上游**：Agent Engine（chatCompletion 调用）
- **下游**：40+ 模型提供商 API
- **横切**：Secrets（API Key 管理）、Model Catalog（模型目录）
