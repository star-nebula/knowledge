---
type: concept
tags:
  - AI
  - OpenClaw
  - Auto-Reply
  - Dispatch
  - 消息调度
domain: AI
description: Auto-Reply/Dispatch——入站消息调度、指令提取、栅栏模式防止回复覆盖
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/03-auto-reply]]、[[Resources/OpenClaw/核心组件/02-Dispatch]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-Agent-Engine]]"
  - "[[OpenClaw-Hook-System]]"
  - "[[OpenClaw-Session-Manager]]"
  - "[[OpenClaw-Gateway-Server]]"
category: ["🤖 AI大模型", "OpenClaw"]
---

# Auto-Reply / Dispatch 自动回复与调度

**源码路径**：`src/auto-reply/`（~107 文件）
**核心文件**：`dispatch.ts`（697 行）

Auto-Reply 是 OpenClaw 的消息处理中枢。入站消息经过调度 → 指令提取 → Agent 执行 → 回复交付的完整流程。

## 通俗类比：Dispatch 是「调度台」

Dispatch 是所有用户消息的「收件员」。它决定消息该谁来回复、怎么回复、会不会被更新的回复覆盖。

**核心问题**：用户连续发两条消息，第一条触发 AI 回复（需 3 秒），第二条在第 1 秒到达。如果不加控制，两条回复可能交叉发出。

**解决方案**：栅栏模式（Fence）——给每组相关回复加版本号，旧回复检查版本号过期后取消投递。

## 核心职责

| 职责 | 说明 |
|------|------|
| 消息调度 | 分发入站消息到回复解析管道，管理前台回复栅栏 |
| 回复解析 | 提取消息中的指令（/model /think /exec 等） |
| 指令检测 | 控制命令识别、内联指令检测 |
| 心跳管理 | 心跳消息过滤、ACK 管理 |
| 信封格式化 | 消息信封标准化（时间戳、来源标签） |
| 队列管理 | 入站消抖、令牌节流 |

## 前台回复栅栏（Foreground Reply Fence）

```typescript
type ForegroundReplyFenceState = { ... };

beginForegroundReplyFence()       // 开始栅栏
shouldCancelForegroundReplyDelivery() // 检查是否应取消
markForegroundReplyFenceVisibleDelivery() // 标记可见交付
endForegroundReplyFence()         // 结束栅栏
```

复合键：使用 JSON 序列化生成唯一栅栏键，确保同一用户/会话的回复不互相覆盖。

## 指令提取系统

| 指令 | 文件 | 示例 |
|------|------|------|
| `/model` | `model.ts` | `/model gpt-4` → 切换模型 |
| `/think` | `reply.ts` | 控制推理模式 |
| `/verbose` | `reply.ts` | 控制详细程度 |
| `/exec` | `reply.ts` | 执行命令 |
| `/queue` | `reply.ts` | 队列管理 |
| 内联命令 | `command-detection.ts` | `!cmd` / `/cmd` 格式 |

## 信封格式化

```
[频道 来源 +耗时 主机 IP 时间戳] 消息正文
```

支持多时区：本地时区、UTC、用户时区、IANA 时区（如 `Asia/Shanghai`）

## 调度流程

```
入站消息到达
  → dispatchInboundMessage()
  → 解析前台回复栅栏
  → 提取指令 (model/think/exec/verbose/queue)
  → 构建回复负载 (ReplyPayload)
  → 触发 Agent Engine 执行
  → deliverReply() 交付回复
  → 结束前台回复栅栏
```

## 设计模式

| 模式 | 应用 |
|------|------|
| 栅栏模式 | Foreground Reply Fence 防止回复覆盖 |
| 指令提取模式 | 从消息文本提取结构化指令 |
| 注册表模式 | 命令注册表与检测 |
| 时区策略 | 多时区格式化支持 |
| 消抖模式 | 入站消息消抖（inbound-debounce） |

## 依赖关系

- **上游**：Gateway Server（消息到达）→ Channel Plugins
- **下游**：Agent Engine（触发执行）
- **横切**：Hook System（inbound/outbound hooks）、Session Manager
