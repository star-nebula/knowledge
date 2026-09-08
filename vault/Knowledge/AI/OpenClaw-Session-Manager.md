---
type: concept
tags:
  - AI
  - OpenClaw
  - Session
  - 会话管理
domain: AI
description: Session Manager——会话 ID 管理、标签解析、生命周期事件广播
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/14-session-manager]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-Gateway-Server]]"
  - "[[OpenClaw-Agent-Engine]]"
  - "[[OpenClaw-Channels]]"
  - "[[OpenClaw-Auto-Reply]]"
  - "[[OpenClaw-ACP]]"
category: ["🤖 AI大模型", "OpenClaw"]
---

# Session Manager 会话管理器

**源码路径**：`src/sessions/`

Session Manager 是 OpenClaw 的会话生命周期管理层。生成和验证会话标识，管理会话标签，并通过观察者模式广播会话生命周期事件。

## 核心职责

| 职责 | 说明 |
|------|------|
| 会话 ID | UUID 格式验证和管理 |
| 会话标签 | 标签解析（最大 512 字符） |
| 生命周期事件 | 广播会话创建/更新/关闭事件 |
| 持久化 | 会话状态持久化到 SQLite |

## 核心设计

### 会话 ID

使用标准 UUID v4 格式，正则验证确保格式正确。

### 会话标签

```typescript
resolveSessionLabel(message) → string (max 512 chars)
```

### 生命周期事件

```typescript
type SessionLifecycleEvent = 
  | { type: "created"; session: Session }
  | { type: "updated"; session: Session }
  | { type: "closed"; sessionId: string };

onSessionLifecycleEvent(listener)    // 注册监听
emitSessionLifecycleEvent(event)     // 发送事件
```

- 使用 `Set` 存储监听器（`SESSION_LIFECYCLE_LISTENERS`）
- **最佳实践**：不传播监听器错误（best-effort）

## 设计模式

| 模式 | 应用 |
|------|------|
| 观察者模式 | 生命周期事件广播 |
| UUID 验证 | 正则表达式保证会话 ID 格式 |
