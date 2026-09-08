---
type: concept
tags:
  - AI
  - OpenClaw
  - Security
  - 安全
  - 沙箱
  - 审计
domain: AI
description: Security 模块——多维度安全审计、危险配置检测、沙箱隔离、审计抑制
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/16-security]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-Config-System]]"
  - "[[OpenClaw-Gateway-Server]]"
  - "[[OpenClaw-Plugin-System]]"
  - "[[OpenClaw-Memory-System]]"
category: ["🤖 AI大模型", "OpenClaw"]
---

# Security 安全模块

**源码路径**：`src/security/`（~86 文件）

Security 模块是 OpenClaw 的安全护栏。从多个维度进行审计，检测危险配置，并支持审计抑制机制。

## 核心职责

| 职责 | 说明 |
|------|------|
| 安全审计 | 多维度审计收集与报告格式化 |
| 危险标志检测 | 识别可能导致安全风险的配置项 |
| 沙箱安全 | 执行隔离、文件系统保护 |
| 审计抑制 | 已知安全发现可标记为抑制 |

## 审计维度

| 维度 | 检测内容 |
|------|----------|
| 配置审计 | 检查 OpenClaw 配置中的安全隐患 |
| 文件系统审计 | 检查工作区文件权限和结构 |
| 网关审计 | 检查 HTTP/WebSocket 暴露面 |
| 插件审计 | 检查已安装插件的安全性 |
| 沙箱审计 | 检查沙箱隔离有效性 |

## 审计发现类型

```typescript
type SecurityAuditFinding = {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  message: string;
  recommendation: string;
  suppressed?: boolean;
};

type SecurityAuditReport = {
  findings: SecurityAuditFinding[];
  summary: { critical; high; medium; low };
};
```

## 深度审计 vs 浅层审计

- **Deep audit**：完整检查所有维度（耗时较长）
- **Non-deep audit**：快速检查关键风险点

## 审计抑制

对于已知的安全发现，可通过审计抑制机制标记为「已知并接受」，避免重复告警。

## 设计模式

| 模式 | 应用 |
|------|------|
| 审计管道 | 多维度审计收集→合并→报告 |
| 抑制机制 | 已知风险标记 |
