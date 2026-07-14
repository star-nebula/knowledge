---
title: n8n AI Agent 工作流
created: 2026-07-08
tags:
  - n8n
  - MCP
  - 工作流
  - Agent
type: 步骤操作
---



# n8n AI Agent 工作流

使用 n8n 低代码工作流平台集成 AI Agent，通过 MCP 协议扩展工具能力，实现自动化智能工作流。

## 一、安装 n8n

1. 安装 Docker
2. 在 Docker 中拉取 n8n 镜像并运行容器
3. 新建 n8n 容器时设置：
   - 容器名、端口号、本机路径映射、容器路径
   - 环境变量：`N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true`
4. 容器启动后，浏览器访问对应端口进入登录界面，创建账号
5. 进入 n8n → Settings → Community nodes → 安装社区节点 `n8n-nodes-mcp`

## 二、搭建基础工作流

1. 新建工作流
2. 添加 **Chat Trigger**（聊天触发器）
3. 添加 **AI Agent** 节点
4. 配置 AI Agent 节点：
   - 输入 API Key 和 URL（以 DeepSeek 为例），连接成功显示绿框
   - 选择合适的模型（默认 deepseek）
5. 添加 **Simple Memory** 节点，为 Agent 提供对话记忆

## 三、配置 MCP 工具

> MCP（Model Context Protocol）服务器列表：[github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

以智谱 Web Search MCP 为例：

1. 创建智谱账户，获取 API Key
2. 点击 AI Agent 节点下的 Tool 加号 → 搜索 MCP → 添加 MCP Client Tool
3. 配置 MCP：
   - URL：`https://open.bigmodel.cn/api/mcp/web_search/sse?Authorization`
   - 填入 API Key

## 四、添加系统消息

点击 AI Agent 节点 → 添加系统消息，设定 Agent 的角色和行为指令。

## 关键组件

| 组件 | 作用 |
|------|------|
| **Chat Trigger** | 接收用户输入，触发工作流 |
| **AI Agent** | 核心推理节点，连接 LLM + 工具 + 记忆 |
| **Simple Memory** | 保留对话上下文 |
| **MCP Client Tool** | 通过 MCP 协议接入外部工具（搜索、文件系统等） |


## 相关阅读

- [[网页笔记四步工作流]]
- [[LangChain Agents 组件|LangChain Agents]]
- [[RAG|RAG]]
- [[大模型-基础]]
