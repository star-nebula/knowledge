---
title: Jev-MOC
created: 2026-09-23
tags:
  - MOC
  - AI
  - Jev
  - 决策模型
type: 专题聚合页
abstract: Jev（TypeSafe AI 面向决策的模型）专题聚合页——定位、调用模型、三大决策原语、零幻觉与置信度、与 Agent 的协作架构、适用场景与局限。
---

# Jev 知识地图

> **Jev** 是 TypeSafe AI 推出的、面向**决策**的 AI 模型。它的核心主张是 **Decisions, not strings**——不生成自然语言让程序去解析，而是直接返回结构化决策（含置信度）。定位上，它是 AI 应用里位于 LLM 与 Code 之间的**智能判断层**，适合高频、低延迟、边界明确的判断任务。

## 概述

理解 Jev 的最短路径是三句话：

```text
LLM 负责生成，Jev 负责判断
Jev 的输入是 State + Question，输出是带类型的决策
AI 应用 = Code + Jev + LLM
```

## 知识全景

```text
Jev/
├── 定位/   是什么、与 LLM 的分工、Decisions not strings
├── 调用/   State + Question → Typed Decision
├── 能力/   Noul（是/否）、Choice（选哪个）、Score（打几分）
└── 落地/   置信度兜底、Agent 协作架构、场景与边界
```

## 知识点

### 定位 — 它解决什么问题

- [[Jev-概述]]：定义、Decisions not strings、为什么需要把高频判断从 LLM 中拆出来
- [[Jev-与传统LLM的区别]]：十维对比、为什么更快（自回归 vs 并行采样）、分析师 vs 决策引擎

### 调用 — 怎么用它

- [[Jev-决策调用模型]]：State（现在发生了什么）+ Question（要判断什么）→ Typed Decision
- [[Jev-三大决策原语]]：Noul / Choice / Score 的定义、示例与能力速查表

### 落地 — 怎么用得稳

- [[Jev-零幻觉与置信度]]：零幻觉只保证类型与结构，语义仍可能错；置信度阈值 + 业务规则 + 人工兜底
- [[Jev-与Agent的协作架构]]：Code / Jev / LLM 三层分工、客服 Agent 拆解、含质检环节的工程架构
- [[Jev-适用场景与局限]]：客服路由、内容审核、工具选择、RAG 过滤、风控等场景；不适合的任务；对官方指标的理性认识

## 学习路径

```text
定位层：Jev 概述 → Jev 与传统 LLM 的区别
调用层：Jev 决策调用模型 → Jev 三大决策原语
落地层：Jev 的零幻觉与置信度 → Jev 与 Agent 的协作架构 → Jev 适用场景与局限
```

## 关联专题

- [[AI 应用核心范式-MOC]]：RAG、Agent、Function Call、LLM 产品化
- [[AI Agent 概述]]：Agent 的核心组成与工作流程
- [[Function Call 概述]]：LLM 侧的工具调用协议（与 Jev 的「工具选择」互补）
- [[RAG 概述]]：Jev 可作为 RAG 检索后的过滤层

> 官方公布的延迟 / 成本数据均为官方测试环境下的评测结果，参考时请结合自身任务规模与上下文长度判断。

*（内容由AI生成，仅供参考）*
