---
type: concept
tags:
  - AI
  - OpenClaw
  - Skills
  - 技能系统
domain: AI
description: Skills System——技能发现/加载/安装生命周期管理，结构化 Markdown 技能文件
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/10-skills-system]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-Plugin-System]]"
  - "[[OpenClaw-Context-Engine]]"
  - "[[OpenClaw-Agent-Engine]]"
---

# Skills System 技能系统

**源码路径**：`src/skills/`（~100+ 文件）

Skills System 是 OpenClaw 的可复用能力模块。技能是结构化的 Markdown 文件（SKILL.md），包含提示词、工具调用序列和工作流知识。

## 核心职责

| 职责 | 说明 |
|------|------|
| 技能发现 | 扫描工作区、内置目录，发现 SKILL.md |
| 技能加载 | 安全读取（root boundary）、解析 frontmatter |
| 技能安装 | 协调归档/URL/注册表安装（brew/node/go/uv/download） |
| 技能过滤 | 归一化过滤，按技能键匹配 |
| 运行时暴露 | 将技能注入 Agent 上下文 |

## 核心类型

```typescript
type OpenClawSkillMetadata = {
  always?: boolean;       // 始终可用
  skillKey?: string;      // 唯一键
  requires?: string[];    // 依赖
  install?: SkillInstallSpec;
};

type SkillInstallSpec = {
  brew?: string;    // Homebrew
  node?: string;    // npm
  go?: string;      // go install
  uv?: string;      // uv pip
  download?: string; // 直接下载
};

type SkillSnapshot = {
  prompt: string;
  skills: SkillEntry[];
  version: number;
};
```

## 安装流程

```
技能安装请求
  → 解析 SkillInstallSpec
  → brew? → npm? → go? → uv? → download?
  → 执行安装命令
  → 验证安装结果
  → 更新技能注册表
```

## 安全设计

- **Root Boundary**：本地加载器通过根边界安全读取 SKILL.md
- **沙箱隔离**：安装过程在沙箱中执行
- **权限控制**：始终技能（always）与按需技能分离

## 设计模式

| 模式 | 应用 |
|------|------|
| 过滤器归一化 | normalizeSkillFilter() 标准化技能过滤 |
| 多源安装协调 | 统一接口管理不同安装方式 |
| 快照版本化 | SkillSnapshot 支持版本追踪 |
