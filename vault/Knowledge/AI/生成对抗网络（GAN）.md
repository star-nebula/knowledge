---
title: 生成对抗网络（GAN）
created: 2026-07-10
tags:
  - 深度学习
  - 生成模型
type: 概念解释
category: ["🤖 AI大模型", "深度学习基础"]
---


# 生成对抗网络（GAN）

GAN 由生成器 $G$ 和判别器 $D$ 组成，通过**对抗训练**使 $G$ 生成逼近真实分布的数据。

## 核心公式

$$\min_G \max_D V(D, G) = \mathbb{E}_{x \sim p_{\text{data}}}[\log D(x)] + \mathbb{E}_{z \sim p_z}[\log(1 - D(G(z)))]$$

- $D$ 最大化：正确区分真实样本和生成样本
- $G$ 最小化：生成样本被 $D$ 判定为真实

## 训练难点

| 问题 | 表现 | 对策 |
|------|------|------|
| 模式坍缩 | $G$ 只生成单一类型 | Minibatch Discrimination、WGAN |
| 梯度消失 | $D$ 太强 | WGAN（Wasserstein 距离）、LSGAN |
| 训练不稳定 | 损失震荡 | 梯度惩罚（WGAN-GP）、谱归一化 |

## 经典变体

- **DCGAN**：用卷积替换全连接
- **CGAN**：条件控制生成（类别标签）
- **CycleGAN**：无配对图像翻译
- **StyleGAN**：可控制风格的生成

GAN 已被扩散模型（Diffusion Models）在图像生成质量上超越，但在可控生成和数据增强领域仍有应用价值。
