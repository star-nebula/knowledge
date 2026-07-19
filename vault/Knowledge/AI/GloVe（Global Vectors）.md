---
title: GloVe（Global Vectors for Word Representation）
created: 2026-07-10
tags:
  - NLP
  - 词向量
  - 表示学习
type: 概念解释
category: ["🤖 AI大模型", "NLP基础"]
---


# GloVe（Global Vectors for Word Representation）

GloVe 结合了**全局矩阵分解**（共现矩阵 $M$）和**局部上下文窗口**（Word2Vec）的优点，通过词-词共现统计学习词向量。

## 核心思想

**共现矩阵**：$X_{ij}$ 表示词 $j$ 出现在词 $i$ 上下文的次数（窗口内统计）。

训练目标：使词向量的点积近似等于共现概率比值的对数。

$$J = \sum_{i,j=1}^V f(X_{ij}) (w_i^T \tilde{w}_j + b_i + \tilde{b}_j - \log X_{ij})^2$$

其中 $f(X_{ij})$ 是权重函数，限制高频词的过度影响。

## 与 Word2Vec 对比

| 维度 | Word2Vec（Skip-gram） | GloVe |
|------|----------------------|-------|
| 训练方式 | 逐样本在线更新 | 全局共现矩阵 + 加权回归 |
| 利用信息 | 局部窗口 | 全局统计 |
| 速度 | 训练快，利用率低 | 需先统计共现矩阵 |
| 小数据 | 表现更好 | 需要足够统计量 |

## 影响

GloVe 提出后与 Word2Vec 并列为静态词向量两大主流方法，两者在下游任务性能相近。后被 BERT 等上下文词向量取代。
