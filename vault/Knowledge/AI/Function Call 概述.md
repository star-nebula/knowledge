---
title: Function Call 概述
created: 2026-07-09
tags:
  - AI
  - Function Call
type: 概念解释
related:
  - "[[AI 应用核心范式-MOC]]"
  - "[[Function Call 实战]]"
reference: ""
category: ["🧩 AI框架与Agent", "AI 应用核心范式"]
---



# Function Call 概述

## 定义

2023年6月 OpenAI 发布 Function Call（函数调用）功能：在语言模型中集成外部函数或 API 的调用能力，模型可在生成文本的过程中调用外部函数或服务，获取额外数据或执行特定任务。

> **关键约束**：大模型不会真正执行函数，仅返回函数名称和参数 JSON。开发者需在应用层解析参数后自行调用函数，再将结果返回给模型生成最终回复。

![[Function Call 应用基本流程.svg]]

## 能解决的问题

| 问题 | 说明 |
|------|------|
| **信息实时性** | 训练数据截止时间限制，无法获取最新信息（新闻、股价等）。通过 Function Call 可实时调取外部数据 |
| **数据局限性** | 训练数据无法覆盖所有专业领域（医学、法律等）。Function Call 允许调用外部数据库或专业 API |
| **功能扩展性** | 大模型无法内置所有功能。通过 Function Call 可扩展计算、分析等外部能力 |

## 工作原理

### 无函数调用时

用户 → Chat Server → GPT 模型 → 返回文本 → 用户（简单一问一答循环）

### 有函数调用时

1. 用户发请求（含 prompt + functions 定义）给 Chat Server
2. GPT 根据 prompt 判断：直接文本回复 or 返回函数调用 JSON
3. 若为函数调用格式，Chat Server **执行该函数**，将结果返回给 GPT
4. GPT 综合函数结果，生成自然语言回复

## 调用流程

```
用户提问
  → 模型判断是否需调用工具
    → 是：返回 {function_name, arguments}
      → 后端解析参数，执行函数
      → 函数结果注入对话上下文
      → 模型基于结果生成最终回复
    → 否：直接生成回复
```

## 核心要素

- **tools 定义**：JSON Schema 格式描述函数名、用途、参数类型和必填项
- **tool_choice**：`auto` 让模型自行决定是否调用；可强制 `none` 或指定函数
- **多轮对话**：函数调用结果需以 `role: tool` 消息追加到对话历史
*（内容由AI生成，仅供参考）*
