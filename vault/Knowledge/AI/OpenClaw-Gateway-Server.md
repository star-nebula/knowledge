---
type: concept
tags:
  - AI
  - OpenClaw
  - Gateway
  - 网关
domain: AI
description: Gateway Server——统一外部入口，WebSocket 实时通信、HTTP REST API、频道生命周期管理
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/01-gateway-server]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-架构总览]]"
  - "[[OpenClaw-Config-System]]"
  - "[[OpenClaw-Plugin-System]]"
  - "[[OpenClaw-Channels]]"
---

# Gateway Server 网关服务器

**源码路径**：`src/gateway/`（~30 文件）
**核心实现**：`server.impl.ts`（67KB）

Gateway Server 是 OpenClaw 的唯一外部入口。所有消息渠道、第三方 API 调用、控制 UI 访问全部经过 Gateway。

## 核心职责

| 职责 | 说明 |
|------|------|
| 消息路由 | 接收所有渠道入站消息，分发到 Auto-Reply |
| HTTP API | OpenAI 兼容 API、控制 UI、插件 HTTP 路由 |
| WebSocket | 实时推送 Agent 事件流给订阅者 |
| 方法注册表 | 管理核心和插件 RPC 方法，懒加载处理器 |
| 频道生命周期 | 启动/停止/重启渠道插件，健康监控 |
| 启动引导 | 运行工作区 BOOT.md 初始化检查 |

## 关键源文件

| 文件 | 职责 |
|------|------|
| `server.ts` | 公共入口（门面），懒加载 impl |
| `server.impl.ts` | 主实现（67KB），编排所有子系统启动 |
| `server-http.ts` | HTTP 服务器路由与控制 UI |
| `server-chat.ts` | Agent 事件→聊天流投影 |
| `server-channels.ts` | 渠道运行时管理、健康监控 |
| `server-plugins.ts` | 插件加载与回退上下文 |
| `boot.ts` | BOOT.md 初始化运行器 |
| `control-ui.ts` | 打包 UI 资源、CSP 安全头 |

## 设计模式

### 懒加载模式（核心模式）

大量使用动态 `import()` 延迟加载子系统，减少冷启动时间：

```typescript
// server.ts - 入口点，不直接导入实现
export async function startGatewayServer(...args) {
  const { createGatewayServer } = await import('../gateway/server.impl.js');
  return createGatewayServer(...args);
}
```

### 门面模式

`server.ts` 作为公共门面，只暴露最小接口，隐藏 67KB 实现细节。

### 回退上下文模式

为非 WebSocket 请求提供进程级网关上下文：
```typescript
export function setFallbackGatewayContext(ctx: GatewayContext | null): void;
export function hasInProcessGatewayContext(): boolean;
```

### 退避重启策略

频道故障时使用指数退避：
```typescript
const CHANNEL_RESTART_POLICY = {
  initialMs: 5000,   // 5秒
  maxMs: 300000,     // 5分钟
  factor: 2          // 2倍增长
};
const MAX_RESTART_ATTEMPTS = 10;
const CHANNEL_STARTUP_CONCURRENCY = 4;
```

## 启动流程

```
startGatewayServer()
  → 动态 import server.impl.ts
  → 加载配置 (Config System)
  → 加载插件清单 (Plugin Loader)
  → 初始化模型目录 (Model Catalog)
  → 启动频道运行时 (Channels)
  → 初始化 MCP 桥接
  → 启动 HTTP 服务器
  → 启动 WebSocket
  → 运行 BOOT.md 启动会话
  → 进入就绪状态
```

## 关键协议

| 协议 | 用途 |
|------|------|
| WebSocket | Agent 事件流实时推送 |
| HTTP REST | OpenAI 兼容 API、控制 UI、插件路由 |
| JSON-RPC | Gateway 内部方法调用 |

## 依赖关系

- **依赖**：Config System、Plugin System、Channels、Agent Engine、Auto-Reply、Cron、Secrets、Security
- **被依赖**：所有外部系统（渠道、API 调用方、控制 UI）
