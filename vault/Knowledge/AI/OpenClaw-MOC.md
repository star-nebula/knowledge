---
type: maps
tags:
  - AI
  - OpenClaw
  - MOC
  - 架构
domain: AI
description: OpenClaw 多通道 AI 网关项目知识地图——架构总览、18 个核心模块、记忆系统、部署指南
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw]]"
related:
  - "[[AI 应用核心范式-MOC]]"
  - "[[LLM 产品形态]]"
  - "[[Transformer 应用开发视角]]"
---

# OpenClaw 知识地图

> **OpenClaw** 是一个多通道 AI 网关（Multi-channel AI Gateway），定位为个人 AI 助手。支持 30+ 消息渠道、40+ 模型提供商、全功能 Agent 执行引擎和插件生态。

**项目仓库**: <https://github.com/openclaw/openclaw>
**许可证**: MIT
**运行时**: Node.js + TypeScript
**存储**: SQLite（嵌入式）

---

## 架构总览

| 笔记 | 说明 |
|------|------|
| [[OpenClaw-架构总览]] | 分层插件化架构、6 层架构图、启动流程、核心数据流、技术栈、设计原则 |

---

## 核心模块（按层分组）

### 基础层 — Gateway 与入口

| # | 笔记 | 一句话 |
|---|------|--------|
| 1 | [[OpenClaw-Gateway-Server]] | 统一入口，WebSocket 实时通信，HTTP REST API |
| 2 | [[OpenClaw-Agent-Engine]] | 命令编排、工具管理、模型选择执行核心 |
| 3 | [[OpenClaw-Auto-Reply]] | 入站消息调度、指令提取、栅栏模式 |
| 4 | [[OpenClaw-Config-System]] | 配置加载/验证/原子变更/默认值管理 |

### 扩展层 — 插件与渠道

| # | 笔记 | 一句话 |
|---|------|--------|
| 5 | [[OpenClaw-Plugin-System]] | 70+ API 方法，插件生命周期管理 |
| 6 | [[OpenClaw-Channels]] | 30+ 消息渠道统一抽象，适配器接口 |

### 能力层 — AI 与协议

| # | 笔记 | 一句话 |
|---|------|--------|
| 7 | [[OpenClaw-LLM-Client]] | 8+ 模型提供商统一流式接口 |
| 8 | [[OpenClaw-Model-Catalog]] | 40+ 模型元数据中心 |
| 9 | [[OpenClaw-Tools-System]] | 工具描述符、可用性评估、协议适配 |
| 10 | [[OpenClaw-Skills-System]] | 技能发现/加载/安装生命周期 |
| 11 | [[OpenClaw-MCP]] | Model Context Protocol 桥接 |

### 支撑层 — 状态与安全

| # | 笔记 | 一句话 |
|---|------|--------|
| 12 | [[OpenClaw-Memory-System]] | 记忆刷新/搜索、Dreaming 三阶段、事件审计 |
| 13 | [[OpenClaw-Context-Engine]] | 可插拔上下文组装与压缩 |
| 14 | [[OpenClaw-Session-Manager]] | 会话 ID/标签/生命周期事件 |
| 15 | [[OpenClaw-Hook-System]] | 多来源钩子注册与加载 |
| 16 | [[OpenClaw-Security]] | 多维度安全审计与沙箱隔离 |
| 17 | [[OpenClaw-Secrets]] | 密钥引用/迁移/运行时准备 |
| 18 | [[OpenClaw-Cron-Daemon]] | 定时任务调度与跨平台守护进程 |

---

## 专题分析

| 笔记 | 说明 |
|------|------|
| [[OpenClaw-Memory-对比分析]] | OpenClaw 记忆模块 vs 传统 Agent 记忆系统 11 项改进 |
| [[OpenClaw-ACP]] | 多 Agent 协作的生命周期管理（Agent Control Plane） |

---

## 操作指南

| 笔记 | 说明 |
|------|------|
| [[OpenClaw-部署与配置]] | 安装、CLI 命令、配置文件、环境变量、守护进程 |
| [[OpenClaw-学习路径]] | 四梯队学习路径 + 四周路线图 |
| [[OpenClaw-代码组织与技术债务]] | 目录结构、命名规范、技术债务跟踪 |

---

## 核心数据流

```
用户消息 → [渠道插件]
  → Gateway Server（统一入口）
  → Auto-Reply（指令提取 + 调度）
  → Hook System（inbound hook）
  → Agent Engine（工具准备 + 模型选择）
  → Context Engine（上下文组装）
  → LLM Client（chatCompletion）
  → 模型提供商 API
  → 响应处理（工具调用循环）
  → Hook System（outbound hook）
  → Auto-Reply（信封格式化 + 交付）
  → Gateway Server（WebSocket 推送）
```

---

## 跨模块设计模式汇总

| 模式 | 应用模块 |
|------|---------|
| 懒加载 | Gateway, LLM Client, HTTP 子系统 |
| 注册表模式 | Channels, Plugins, Context Engine, MCP |
| 策略模式 | Agent Engine（工具过滤）, LLM Client（API 家族） |
| 适配器模式 | Agent Engine, Channels, MCP |
| 观察者模式 | Session Manager, Config System |
| 门面模式 | Gateway, Config System, Cron |
| 原子变更 | Config System, Secrets |
| 事件溯源 | Memory（JSONL 审计） |
| 栅栏模式 | Auto-Reply（dispatch.ts） |
| 运行时隔离 | Context Engine |
