---
title: 隐含狄利克雷分配（LDA）
created: 2026-07-10
tags:
  - 机器学习
  - 主题模型
  - NLP
type: 概念解释
category: ["🤖 AI大模型", "机器学习"]
---


# 隐含狄利克雷分配（LDA）

LDA 是一种生成式概率主题模型，假设每篇文档由多个主题混合而成，每个主题是词的概率分布。

## 核心假设

文档 → 主题分布 $\theta_d \sim \text{Dir}(\alpha)$，主题 → 词分布 $\phi_k \sim \text{Dir}(\beta)$。每篇文档中每个词 $w$ 的生成：
1. 从 $\theta_d$ 采样主题 $z$
2. 从 $\phi_z$ 采样词 $w$

## 推断方法

- **Gibbs Sampling**：迭代采样每个词的主题分配，利用 Collapsed Gibbs Sampling 消去 $\theta$ 和 $\phi$
- **变分推断（VB）**：用简单分布近似后验

## 与 LSA / pLSA 对比

| 模型 | 特点 |
|------|------|
| LSA | 基于 SVD，无概率解释 |
| pLSA | 概率化，但无文档级主题先验，易过拟合 |
| LDA | 加入 Dirichlet 先验，贝叶斯化 pLSA，泛化更好 |

## 应用

文档聚类、主题关键词提取、推荐系统的内容理解、学术文献趋势分析。
