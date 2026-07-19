---
title: AI 应用核心范式-MOC
created: 2026-07-09
tags:
  - MOC
type: 专题聚合页
abstract: RAG、Agent、Function Call、LLM 产品化、AI 产业格局——AI 应用开发核心范式的全景导航与学习路径。
---



# AI 应用核心范式

## 概述

AI 应用开发的四大核心范式：RAG（检索增强生成）、Agent（智能体）、Function Call（函数调用）、LLM 应用产品化。理解这些范式是从「会用 API」到「能交付产品」的关键分水岭，也是 AI 应用开发岗位面试的核心考察点。

- [[AI全景概览]]：从 AI 起源到 AutoML、神经网络压缩、AI 芯片、量子机器学习的全景地图

## 知识全景

```
AI 应用/
├── Prompt 工程/   ← 提示词设计、思维链、Few-shot
├── NLP 任务/      ← 文本分类、情感分析、NER、翻译、摘要
├── Function Call/ ← 函数调用协议、工具定义、参数解析
├── RAG/           ← 检索增强生成、向量数据库、文档切分
├── Agent/         ← AI 代理架构、工具调用、多代理协作
└── 产品化/        ← 产品形态、低代码编排、模型接入
```

## 知识点

### Prompt 工程 — 提示词设计

核心基础能力，决定 LLM 输出质量的下限。

### NLP 任务 — 文本理解

文本分类、情感分析、命名实体识别、机器翻译、文本摘要。

### LLM 基础原理 — 大模型底层架构

- [[大模型-基础]]：语言模型演进、LLM 架构、ChatGPT 原理、Fine-Tuning 与 Prompt-Tuning
- [[大模型-强化学习]]：RLHF 全流程——On Policy 与 Offline 两大路线
- [[大模型-知识扩展]]：激活函数、归一化、RoPE、推理加速、检索与重排序

### Function Call — 函数调用

- [[Function Call 概述]]：LLM 如何选择和调用外部工具，JSON Schema 定义、多轮纠错
- [[Function Call 实战]]：Function Call 全流程实战指南
- [[Function Call 实战：天气查询]]：单一函数调用完整实战
- [[Function Call 实战：多函数与数据库查询]]：多函数编排与 SQL 自动生成

### RAG — 检索增强生成

- [[RAG 概述]]：原理、项目流程、环境配置
- [[Milvus 向量数据库]]：核心概念、CRUD 操作、索引与检索
- [[RAG Query 改写]]：历史会话改写、关键词扩写、子查询拆分
- [[RAGAS 评估框架]]：上下文相关性、忠实度、答案相关性

### Agent — 智能体

- [[AI Agent 概述]]：Agent 的核心架构、与传统软件对比、应用场景与实现工具
- [[CrewAI 多 Agent 协作实践]]：用 CrewAI 实现自动写信+邮件发送的完整项目
- [[n8n AI Agent 工作流]]：低代码 Agent 工作流编排，可视化搭建 AI 自动化流程

### 产品化 — 从 Demo 到交付

- [[LLM 产品形态]]：API / 聊天机器人 / 嵌入式插件 / SaaS 服务等六类产品形态

### 产业与趋势

- [[AI 产业格局]]：基础设施/模型层/应用层三层生态、闭源 vs 开源、国内格局

## 工具配置

| 文档 | 说明 |
|------|------|
| [[n8n 本地部署]] | n8n 工作流自动化工具本地部署，含汉化 |
| [[n8n AI Agent 工作流]] | n8n 中集成 AI Agent + MCP 工具 |
| [[DeepSeek]] | DeepSeek 基础知识与模型部署使用 |
| [[Claude Code 接入模型]] | Claude Code 接入 DeepSeek/GLM 等第三方模型 |

## 学习路径

```
基础层：Prompt 工程 → NLP 任务
核心层：Function Call → RAG → Agent
实战层：产品化 → 低代码编排（n8n）→ 模型接入（Claude Code）
```

## 关联专题

- [[NLP 基础]]：Transformer、注意力机制等底层原理
- [[模型部署-MOC]]：Docker/Ollama 部署实践
- [[模型与对齐]]：大模型全景、强化学习对齐

*（由 AI 辅助整理，请根据实际学习进度更新）*
*（内容由AI生成，仅供参考）*
