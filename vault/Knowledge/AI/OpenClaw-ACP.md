---
type: concept
tags:
  - AI
  - OpenClaw
  - ACP
  - 多Agent
  - 协作
domain: AI
description: ACP（Agent Control Plane）——OpenClaw 多 Agent 协调器，管理子 Agent 生命周期、会话状态、消息传递与权限控制
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心组件/07-ACP]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-Agent-Engine]]"
  - "[[OpenClaw-Session-Manager]]"
  - "[[OpenClaw-Context-Engine]]"
---

# OpenClaw ACP——多 Agent 协作

> ACP（Agent Control Plane）是 OpenClaw 的多 Agent 协调器，负责管理子 Agent 的生命周期、会话状态和消息传递。

## 解决的问题

单个 Agent 能力有限，复杂任务需要多 Agent 协作：

```
用户：「帮我分析这段代码的性能问题，然后写一个优化方案」

主 Agent（代码分析）
  → 调用子 Agent A（性能分析专家）
  → 调用子 Agent B（优化方案专家）
  → 汇总结果，回复用户
```

ACP 管理四大职责：
1. 子 Agent 的启动/关闭
2. 子 Agent 的会话状态
3. 父子 Agent 之间的消息传递
4. 子 Agent 的权限控制（工具/文件访问）

## 核心概念：ACP Session

一个 ACP Session 代表一次多 Agent 协作任务：

```
主 Agent 启动子 Agent
  → 创建 ACP Session
  → sessionKey = "acp:parent-session:child-agent-id"
  → 分配 runtime handle（子 Agent 执行环境）
```

每个 ACP Session 独立拥有：
- 会话历史（子 Agent 自己的对话记录）
- 工具权限（可能与主 Agent 不同）
- 模型配置（可以使用不同模型）

## 核心流程

```
主 Agent 需要调用子 Agent
    │
    ▼
AcpSessionManager
  1. initializeSession()
     → 创建 ACP session 元数据
     → 分配 runtime handle
     → 记录到 session 文件
  2. 子 Agent 开始工作
     → 通过 runtime handle 和主 Agent 通信
     → 可以调用工具、读取记忆、访问文件
  3. turn 执行（每轮对话）
     → runManagerTurn()
     → 把消息发给子 Agent → 拿到回复
  4. 关闭 session
     → closeSession()
     → 释放 runtime handle
     → 保存会话历史到文件
    │
    ▼
主 Agent 拿到子 Agent 的结果，继续工作
```

## 关键设计

### 1. Runtime Handle 缓存

子 Agent 的执行环境（runtime handle）被缓存：

```typescript
class ManagerRuntimeHandleCache {
  private handles = new Map<string, AcpRuntimeHandle>();
}
```

同一子 Agent 被多次调用时复用已有 handle，避免重复启动开销。

### 2. 会话身份协调（Identity Reconciliation）

系统重启后需要将磁盘 session 文件与内存 runtime handle 对齐：

```
系统重启
  → 扫描所有 session 文件，找到有 ACP 元数据的
  → 对每个 session，检查 runtime handle 是否还活着
  → 如果死了，清理元数据（避免僵尸 session）
```

### 3. 按会话排队的 Actor 模型

```typescript
class SessionActorQueue {
  // 每个 session 有自己的队列
  // 保证：同一个 session 的消息按顺序处理
}
```

防止同一子 Agent 同时处理多条消息导致状态混乱。

## 关键源码文件

| 文件 | 职责 |
|------|------|
| `src/acp/control-plane/manager.core.ts` | ACP 管理器核心（`AcpSessionManager`） |
| `src/acp/control-plane/manager.initialize-session.ts` | 初始化 session |
| `src/acp/control-plane/manager.turn-runner.ts` | 执行一轮对话（turn） |
| `src/acp/control-plane/manager.close-session.ts` | 关闭 session |
| `src/acp/control-plane/manager.runtime-handle-ensure.ts` | 确保 runtime handle 可用 |
| `src/acp/translator.ts` | 主 Agent 和子 Agent 之间的消息翻译器 |
| `src/acp/types.ts` | ACP 核心类型定义 |

## ACP 与 AgentCommand 的关系

| | AgentCommand | ACP |
|---|---|---|
| 职责 | 编排「一次 AI 调用」 | 管理「多个 Agent 的协作」 |
| 粒度 | 细粒度（一次模型调用 + 工具调用） | 粗粒度（整个子 Agent 的生命周期） |
| 调用关系 | ACP 内部会调用 AgentCommand | AgentCommand 不会调用 ACP |

ACP 是「管理者」，AgentCommand 是「干活的人」。

## 设计亮点

**1. 可观测性**：`AcpSessionManager.getObservabilitySnapshot()` 返回活跃 session 数量、每个 session 的 runtime handle 状态、历史 turn 延迟统计。

**2. 错误分类**：
- `session-not-found` → session 已关闭
- `runtime-handle-lost` → 需要重新创建 handle
- `turn-timeout` → 需要重试

**3. 父流设置（Parent Stream）**：子 Agent 的生成过程可以实时流式返回给主 Agent，无需等待全部完成。

## 源码阅读路线

1. `src/acp/types.ts` — 理解核心类型（最短文件）
2. `src/acp/control-plane/manager.core.ts` 前 150 行 — 理解 `AcpSessionManager` 类结构
3. `src/acp/translator.ts` 前 100 行 — 理解主 Agent 和子 Agent 通信机制
