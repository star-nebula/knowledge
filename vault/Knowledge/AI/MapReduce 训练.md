---
title: MapReduce 训练
created: 2026-07-10
tags:
  - 机器学习
  - 分布式
type: 概念解释
category: ["🤖 AI大模型", "机器学习"]
---


# MapReduce 训练

将机器学习训练扩展到大规模数据或模型的分布式计算范式。

## 核心思想

利用 MapReduce 编程模型，将训练任务拆分到多机并行执行：

- **Map 阶段**：各机器算局部梯度（数据并行）或局部模型更新
- **Reduce 阶段**：汇总 Map 输出的中间结果，合并为全局新参数

## 数据并行（SGD 分布式版）

每台机器持有完整模型的副本，处理不同数据分片：

1. **Map**：每机器在该分片上算梯度 $\nabla L_i(\theta)$
2. **Reduce**：汇总梯度求均值 $\frac{1}{m}\sum\nolimits_i \nabla L_i(\theta)$
3. 更新 $\theta \leftarrow \theta - \eta \cdot$ 平均梯度

## 两种同步策略

| 策略 | 同步 | 容错 | 适用 |
|------|------|------|------|
| 同步 SGD | 所有机器算完再更新 | 慢机器拖后腿 | 网络均衡 |
| 异步 SGD | 各机器独立更新参数 | 梯度陈旧（stale gradient） | 弹性伸缩 |

MapReduce 训练被更现代的 Parameter Server 和 AllReduce（如 Horovod）逐步取代，但核心的分而治之思想一致。
