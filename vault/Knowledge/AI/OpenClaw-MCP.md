---
type: concept
tags:
  - AI
  - OpenClaw
  - MCP
  - Model Context Protocol
domain: AI
description: MCP 模块——Model Context Protocol 桥接，Channel Bridge 与工具服务器
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/11-mcp]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-Tools-System]]"
  - "[[OpenClaw-Gateway-Server]]"
  - "[[OpenClaw-Agent-Engine]]"
category: ["🧩 AI框架与Agent", "OpenClaw"]
---

# MCP（Model Context Protocol）

**源码路径**：`src/mcp/`（~15 文件）

MCP 模块实现 Model Context Protocol 的 OpenClaw 适配层，将内部工具通过 MCP 协议暴露给外部 AI 客户端（如 Claude Desktop），或将外部 MCP 服务器集成到 OpenClaw 中。

## 核心职责

| 职责 | 说明 |
|------|------|
| Channel Bridge | 将 Gateway 工具暴露为 MCP 服务器 |
| Stdio Server | 标准输入输出 MCP 服务器 |
| 内置工具暴露 | 将 OpenClaw 内置工具通过 MCP 暴露 |
| SDK 集成 | 使用 `@modelcontextprotocol/sdk` |

## 核心设计

### Channel Bridge

```
外部 MCP 客户端
  ↕ stdio / SSE 传输
McpServer (channel-server.ts)
  ↕ 内部调用
Gateway Tools (Tools System)
```

- `createOpenClawChannelMcpServer()` 创建桥接服务器
- 将 OpenClaw 的 ToolDescriptor 映射为 MCP Tool
- 支持双向工具调用

### Stdio Server

- 使用 `StdioServerTransport` 作为传输层
- 通过标准输入输出与 MCP 客户端通信
- 适用于 Claude Desktop 等支持 stdio MCP 的客户端

### 独立工具服务器

`openclaw-tools-serve.ts` 启动独立 MCP 服务器，暴露 OpenClaw 内置工具给外部 AI 应用。

## 设计模式

| 模式 | 应用 |
|------|------|
| 桥接模式 | Channel Bridge 连接外部 MCP 客户端与内部工具 |
| 适配器模式 | MCP Tool 与 ToolDescriptor 格式互转 |
