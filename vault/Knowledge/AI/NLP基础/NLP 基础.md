---
title: NLP 基础
date: 2026-07-02
tags:
  - NLP
  - Transformer
  - 注意力机制
  - 深度学习
type: 专题聚合页
related:
  - AI 应用核心范式
  - 深度学习基础
  - 机器学习基础
status: curated
---

# NLP 基础

## 概述

自然语言处理（NLP）是 AI 应用开发的底层语言能力。从文本预处理到 Transformer 架构，再到注意力机制，这一知识链决定了你是否真正理解大模型的工作方式。本专题覆盖 NLP 核心概念、经典架构和现代方法。

## 知识点

### 基础概念与预处理

- [[基础概念]]：NLP 的核心任务（分类、序列标注、生成）和评估指标
- [[文本预处理]]：分词、去停用词、词干提取、文本向量化（TF-IDF、Word2Vec）
- [[fasttext]]：Facebook 开源的高效文本分类与词向量训练工具

### RNN 及其变体

- [[RNN及其变体]]：从 RNN 到 LSTM/GRU 的演进，解决长序列梯度消失问题的思路

### Transformer 架构

- [[Archive/2026-07-模型与对齐迁移备份/NLP基础/Transformer]]：自注意力、多头注意力、位置编码、Encoder-Decoder 架构，所有现代大模型的基石

### 注意力机制

- [[注意力机制]]：从 Soft Attention 到 Self-Attention 的完整推导，Q/K/V 的直观理解，注意力可视化的工程意义

## 学习路径

```
基础概念 → 文本预处理 → RNN/LSTM → 注意力机制 → Transformer
```

> 建议先理解「为什么需要注意力机制」，再去看 Transformer 的具体实现，这样更容易建立直觉。

## 关联专题

- [[深度学习基础]]：CNN、RNN、损失函数等前置知识
- [[AI 应用核心范式]]：RAG、Agent 等上层应用范式
- [[模型与对齐]]：大语言模型全景、强化学习对齐

*（内容由 AI 辅助生成，请根据实际学习进度更新）*
