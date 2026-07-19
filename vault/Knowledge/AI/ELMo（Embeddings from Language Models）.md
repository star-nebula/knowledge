---
title: ELMo（Embeddings from Language Models）
created: 2026-07-10
tags:
  - NLP
  - 词向量
  - 表示学习
type: 概念解释
category: ["🤖 AI大模型", "NLP基础"]
---


# ELMo（Embeddings from Language Models）

ELMo 是第一个将**深层上下文**信息融入词表示的模型，解决了传统词向量（Word2Vec、GloVe）一词多义的固有问题。

## 核心架构

**双向 LSTM 语言模型**（BiLM）：

- 前向：从左到右预测下一个词，$\sum \log P(t_k | t_1, ..., t_{k-1})$
- 后向：从右到左预测上一个词，$\sum \log P(t_k | t_{k+1}, ..., t_N)$
- 联合优化双向 log 似然

## 上下文词表示

ELMo 不是一个固定的词向量——**同样的词在不同语境下有不同的向量**。

提取多层隐状态，加权组合：

$$\text{ELMo}_k^{\text{task}} = \gamma^{\text{task}} \sum_{j=0}^L s_j^{\text{task}} \cdot h_{k,j}^{\text{LM}}$$

- 底层 LSTM 捕获语法特征（POS）
- 高层 LSTM 捕获语义特征（词义消歧）

## 历史意义

ELMo（2018）证明了**预训练语言模型 + 微调**范式在 NLP 的有效性，是 BERT 的直接前驱。但它使用 LSTM 而非 Transformer，感受野受限，预训练效率也不如 BERT 的 Masked LM。
