---
type: concept
tags:
  - AI
  - OpenClaw
  - Secrets
  - 密钥管理
domain: AI
description: Secrets Manager——密钥引用解析、迁移计划执行、认证配置文件管理、原子写入
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/17-secrets]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-LLM-Client]]"
  - "[[OpenClaw-Channels]]"
  - "[[OpenClaw-Config-System]]"
category: ["🤖 AI大模型", "OpenClaw"]
---

# Secrets Manager 秘密管理器

**源码路径**：`src/secrets/`

Secrets Manager 是 OpenClaw 的凭证管理层。管理所有 API Key、OAuth 密钥、通道凭据等敏感数据的存储、迁移和运行时准备。

## 核心职责

| 职责 | 说明 |
|------|------|
| 密钥迁移 | 执行跨配置文件/认证存储/env 文件的密钥迁移计划 |
| 运行时准备 | 准备密钥运行时快照供启动使用 |
| 引用解析 | 解析 SecretRef（如 `${env:KEY}`） |
| 安全存储 | 认证配置文件存储（AuthProfileStore） |

## 密钥引用语法

```
${env:OPENAI_API_KEY}        → 从环境变量读取
${auth:my-profile}           → 从认证配置文件读取
${secrets:my-secret}         → 从密钥存储读取
```

## 快速路径优化

```typescript
canUseSecretsRuntimeFastPath() // 快速路径检测
```

如果密钥状态未变更，跳过完整迁移流程，直接使用缓存快照。

## 原子文件写入

```typescript
writeTextFileAtomic(path, content) // 原子写入
```

确保密钥文件不会因写入中断而损坏。

## 设计模式

| 模式 | 应用 |
|------|------|
| 迁移计划 | 声明式密钥迁移（apply.ts） |
| 快速路径 | 跳过无变更的密钥准备 |
| 原子写入 | 防止文件损坏 |
