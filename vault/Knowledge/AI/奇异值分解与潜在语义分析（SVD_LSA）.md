---
title: 奇异值分解与潜在语义分析（SVD/LSA）
created: 2026-07-10
tags:
  - 机器学习
  - 降维
  - NLP
  - 线性代数
type: 概念解释
category: ["🤖 AI大模型", "机器学习"]
---


# 奇异值分解与潜在语义分析（SVD/LSA）

## SVD（奇异值分解）

任意矩阵 $A \in \mathbb{R}^{m \times n}$ 可分解为 $A = U \Sigma V^T$：
- $U$：$m \times m$ 左奇异向量（列空间）
- $\Sigma$：$m \times n$ 对角矩阵（奇异值降序排列）
- $V$：$n \times n$ 右奇异向量（行空间）

**截断 SVD**：取前 $k$ 个最大奇异值，$A_k = U_k \Sigma_k V_k^T$ 是最优 $k$ 秩近似（Eckart-Young 定理）。

## LSA（潜在语义分析）

将 SVD 用于**词-文档矩阵**：
1. 构建 TF-IDF 加权的词-文档矩阵 $X$
2. 对 $X$ 做截断 SVD，保留前 $k$ 维
3. 词和文档被映射到同一 $k$ 维语义空间
4. 可通过余弦相似度计算词-词、文档-文档、词-文档相似度

LSA 解决了同义词和一词多义带来的词汇不匹配问题，但缺乏概率解释、不处理词序。后续被 pLSA 和 LDA 取代，但其降维思想仍是 NLP 经典基础。
