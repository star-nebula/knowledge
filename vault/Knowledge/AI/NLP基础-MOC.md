---
title: NLP基础-MOC
created: 2026-07-08
tags:
  - NLP
  - 目录
type: 专题聚合页
abstract: 自然语言处理从文本预处理到 Transformer 架构的完整知识链，含注意力机制、预训练范式、序列标注、位置编码等核心主题。
---

# NLP基础

## 概述

自然语言处理（NLP）是 AI 应用开发的底层语言能力。从文本预处理到 Transformer 架构，再到注意力机制，这一知识链决定了你是否真正理解大模型的工作方式。

## 核心知识

### 基础概念与预处理

- [[NLP-基础概念]]：NLP 的核心任务（分类、序列标注、生成）和评估指标
- [[NLP-文本预处理]]：分词、去停用词、词干提取、文本向量化（TF-IDF、Word2Vec）

### 模型架构

- [[迁移学习]]：fasttext 文本分类与词向量训练
- [[RNN及其变体]]：从 RNN 到 LSTM/GRU 的演进
- [[Knowledge/AI/Transformer]]：自注意力、多头注意力、位置编码、Encoder-Decoder 架构，所有现代大模型的基石
- [[注意力机制]]：从 Soft Attention 到 Self-Attention 的完整推导，Q/K/V 的直观理解，注意力可视化的工程意义

### 预训练范式

| 笔记 | 核心内容 | 类型 |
|------|---------|------|
| [[T5（Text-to-Text Transfer Transformer）]] | Text-to-Text 统一框架、Encoder-Decoder 架构、Span Corruption | 概念解释 |
| [[GloVe（Global Vectors）]] | 共现矩阵 + 加权回归、全局统计与局部窗口结合 | 概念解释 |
| [[ELMo（Embeddings from Language Models）]] | 双向 LSTM 语言模型、多层隐状态加权、上下文词表示先驱 | 概念解释 |

### 序列标注

| 笔记 | 核心内容 | 类型 |
|------|---------|------|
| [[命名实体识别（NER）]] | BIO/BIOES 标注、CRF→BiLSTM-CRF→BERT-CRF 演进、核心挑战 | 概念解释 |

### 位置编码

> Transformer 位置编码的演进路线。

| 笔记 | 核心内容 | 类型 |
|------|---------|------|
| [[RoPE（旋转位置编码）详解]] | 旋转矩阵融入位置信息、相对位置编码、长序列外推 | 概念解释 |

### 实战案例

- [[NLP-案例]]：人名分类、文本生成等完整代码示例

## 学习路径

```
基础概念 → 文本预处理 → fasttext → RNN/LSTM → 注意力机制 → Transformer → 实战案例
```

> 建议先理解「为什么需要注意力机制」，再去看 Transformer 的具体实现。

## 关联专题

- [[深度学习基础]]：CNN、RNN、损失函数等前置知识
- [[AI 应用核心范式]]：RAG、Agent 等上层应用范式
- [[模型与对齐]]：大语言模型全景、强化学习对齐
