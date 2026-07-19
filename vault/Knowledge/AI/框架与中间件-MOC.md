---
title: 框架与中间件-MOC
created: 2026-07-08
tags:
  - moc
  - framework
  - middleware
  - langchain
  - openclaw
  - n8n
  - claude-code
type: 专题聚合页
abstract: LLM 应用框架与工程中间件聚合——LangChain、n8n、OpenClaw、Claude Code 等工具导航。
---

# 框架与中间件-MOC

框架与中间件专题知识库，覆盖 LLM 应用框架、自动化工作流和 Agent 平台的完整学习体系。

## 框架层

### LangChain

LLM 应用开发框架，6 大组件：Models / Prompts / Chains / Agents / Memory / Indexes。

LangChain 是围绕大语言模型的应用开发框架（Harrison Chase，2022），将各类组件"链接"以简化复杂 LLM 应用开发。安装：`pip install langchain langchain-community`。

| 组件 | 职责 | 原子笔记 |
|------|------|----------|
| Models | 三种模型类型：LLMs / Chat Models / Embeddings | [[LangChain Models 组件]] |
| Prompts | 提示模板化，支持 zero-shot / few-shot | [[LangChain Prompts 组件]] |
| Chains | 将 LLM 与其他组件组合成链 | [[LangChain Chains 组件]] |
| Agents | 自动选择并调用第三方工具 | [[LangChain Agents 组件]] |
| Memory | 解决无状态问题，短期/长期记忆 | [[LangChain Memory 组件]] |
| Indexes | 结构化文档以便与模型交互（RAG） | [[LangChain Indexes 组件]] |

### Claude Code 接入

| 笔记 |
|------|
| [[Claude Code 接入 DeepSeek 与 GLM]] |

## 工程化层

### n8n 工作流自动化

| 笔记 |
|------|
| [[n8n 本地部署]] |

### OpenClaw 多通道 AI 网关

OpenClaw 是个人 AI 助手平台，30+ 消息渠道 + 40+ 模型提供商 + Agent 执行引擎 + Plugin SDK。

→ [[OpenClaw-MOC]]

## 学习路径

```
入门阶段 → LangChain 基础（Prompt + Model + Chain）
进阶阶段 → Agent + Memory + RAG（Indexes）
工程化 → n8n 自动化工作流
平台级 → OpenClaw 全栈 Agent 网关
```
