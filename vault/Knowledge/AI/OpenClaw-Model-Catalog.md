---
type: concept
tags:
  - AI
  - OpenClaw
  - Model
  - 目录
  - 元数据
domain: AI
description: Model Catalog——40+ 模型提供商的元数据中心，清单加载、合并去重、成本计算
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/08-model-catalog]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-LLM-Client]]"
  - "[[OpenClaw-Agent-Engine]]"
category: ["🤖 AI大模型", "OpenClaw"]
---

# Model Catalog 模型目录

**源码路径**：`src/model-catalog/`

Model Catalog 是 OpenClaw 的模型元数据中心。从清单文件和提供者索引中收集所有可用模型信息，合并去重，供 Agent Engine 进行模型选择。

## 核心职责

| 职责 | 说明 |
|------|------|
| 清单加载 | 加载 OpenClaw 内置的模型清单 |
| 提供者索引 | 从各提供商运行时获取模型列表 |
| 合并去重 | 按权威级别合并多个来源的模型行 |
| 成本计算 | 统一模型成本结构（支持阶梯定价） |
| 状态管理 | 模型状态（active/deprecated/beta 等） |

## 核心类型

```typescript
type UnifiedModelCatalogEntry = {
  kind: UnifiedModelCatalogKind;
  source: UnifiedModelCatalogSource;
};

type ModelCatalogTieredCost = {
  input: number;
  output: number;
  cacheRead?: number;
  cacheWrite?: number;
};

type ModelCatalogStatus = "active" | "deprecated" | "beta" | "experimental";
```

## 核心流程

```
loadOpenClawProviderIndex()           // 加载内置提供者索引
  + planManifestModelCatalogRows()    // 规划清单模型行
  + planProviderIndexModelCatalogRows() // 规划提供者索引行
  → mergeModelCatalogRowsByAuthority()  // 按权限合并
  → 统一模型目录
```

## 设计模式

| 模式 | 应用 |
|------|------|
| 合并策略 | 按权威级别多源合并 |
| 清单驱动 | 模型元数据从声明式清单加载 |

## 依赖关系

- **上游**：LLM Client（运行时使用）、Agent Engine（模型选择）
- **下游**：无（被引用）
