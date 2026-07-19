---
title: T5（Text-to-Text Transfer Transformer）
created: 2026-07-10
tags:
  - NLP
  - 预训练模型
  - Transformer
type: 概念解释
category: ["🤖 AI大模型", "NLP基础"]
---


# T5（Text-to-Text Transfer Transformer）

T5 将所有 NLP 任务统一为 **Text-to-Text** 格式，输入和输出均为文本序列。

## 统一框架

| 任务 | 输入格式 | 输出 |
|------|---------|------|
| 翻译 | "translate English to German: That is good." | "Das ist gut." |
| 分类 | "sst2 sentence: This movie is great." | "positive" |
| 摘要 | "summarize: (长文本)" | (摘要) |
| QA | "question: (问题) context: (段落)" | (答案) |

## 架构

**Encoder-Decoder** 标准 Transformer：

- Encoder：双向注意力（类似 BERT）
- Decoder：单向自回归注意力（类似 GPT）
- 使用 **relative position bias** 替代绝对位置编码

## 训练策略

- **C4 数据集**：从 Common Crawl 清洗出 750GB 高质量文本
- **Span Corruption**：随机遮蔽连续 token 片段，模型预测被遮蔽的片段序列
- 探索了模型缩放、预训练目标、训练时长等系统消融实验

## 主要结论

T5 的系统性实验表明：Encoder-Decoder 架构在迁移学习中表现最优，span corruption 训练目标效果最好，更大的模型和数据量持续提升性能。
