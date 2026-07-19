---
title: RoPE（旋转位置编码）详解
created: 2026-07-10
tags:
  - 大模型
  - 位置编码
  - Transformer
type: 概念解释
category: ["🤖 AI大模型", "NLP基础"]
---


# RoPE（旋转位置编码）详解

RoPE 通过**旋转矩阵**将位置信息融入注意力计算，实现相对位置编码，支持任意长度外推。

## 核心思想

将词向量视为复数空间中的向量，通过旋转操作引入位置信息：

$$q_m = R_{\theta,m} \cdot q_0, \quad k_n = R_{\theta,n} \cdot k_0$$

其中 $R_{\theta,m}$ 是旋转矩阵，旋转角度 $\theta$ 与位置 $m$ 成线性关系。

## 数学形式

对于维度 $d$ 的向量，每两个维度为一组，旋转矩阵为：

$$R_{\theta,m} = \begin{bmatrix}
\cos m\theta_i & -\sin m\theta_i \\
\sin m\theta_i & \phantom{-}\cos m\theta_i
\end{bmatrix}$$

其中 $\theta_i = 10000^{-2(i-1)/d}$，$i$ 是维度组索引。

## 注意力计算

$q_m^T k_n = (R_{\theta,m} q_0)^T (R_{\theta,n} k_0) = q_0^T R_{\theta,n-m} k_0$

仅依赖相对位置 $n-m$，满足相对位置编码的平移不变性。

## 优势

- **外推性**：训练时未见的长序列仍可计算（旋转矩阵可任意扩展）
- **相对位置**：注意力分数仅依赖相对距离
- **线性注意力**：可改写为线性形式，提升长序列效率

## 应用

RoPE 是 LLaMA、Qwen 等主流开源大模型的标准位置编码方案，也是 FlashAttention-2 等优化技术的基础。
