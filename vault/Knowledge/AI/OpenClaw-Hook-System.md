---
type: concept
tags:
  - AI
  - OpenClaw
  - Hook
  - 钩子
domain: AI
description: Hook System——多来源钩子注册与加载，inbound/outbound 钩子，全局单例管理
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/15-hook-system]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-Auto-Reply]]"
  - "[[OpenClaw-Agent-Engine]]"
  - "[[OpenClaw-Plugin-System]]"
---

# Hook System 钩子系统

**源码路径**：`src/hooks/`

Hook System 是 OpenClaw 的可扩展钩子层。允许内置功能、插件和用户自定义代码在消息处理各阶段插入逻辑（入站前、出站前、工具调用前后等）。

## 核心职责

| 职责 | 说明 |
|------|------|
| 钩子注册 | 管理 built-in / managed / workspace 三个来源 |
| 钩子加载 | 动态加载钩子处理器模块 |
| 配置钩子 | 根据配置启用/禁用特定钩子 |
| 全局单例 | 通过 Symbol 键防止钩子命名冲突 |

## 三种钩子来源

| 来源 | 目录 | 安全性 |
|------|------|--------|
| bundled | 内置打包 | 可信 |
| managed | 插件/包管理 | 可信（来源可控） |
| workspace | 用户工作区 | 受信任的本地代码 |

## 全局单例注册

- 使用 `Symbol.for("openclaw.hookGlobalSingleton")` 作为全局键
- 通过 `resolveGlobalSingleton()` 解析
- 防止多实例键冲突

## 关键源文件

| 文件 | 职责 |
|------|------|
| `hooks.ts` | 钩子处理器别名导出 |
| `configured.ts` | 配置钩子助手 |
| `loader.ts` | 钩子处理器动态加载器 |

## 设计模式

| 模式 | 应用 |
|------|------|
| 钩子模式 | 在消息处理管线中插入可扩展逻辑 |
| 全局单例 | Symbol 键防止冲突 |
| 目录发现 | 从多目录自动发现钩子 |
