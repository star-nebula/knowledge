---
type: concept
tags:
  - AI
  - OpenClaw
  - Config
  - 配置系统
domain: AI
description: Config System——配置加载/验证/原子变更/默认值管理，ConfigIO 安全读写
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/04-config-system]]、[[Resources/OpenClaw/核心组件/06-ConfigIO]]"
related:
  - "[[🦀 OpenClaw-MOC]]"
  - "[[OpenClaw-Security]]"
  - "[[OpenClaw-Secrets]]"
  - "[[OpenClaw-Plugin-System]]"
  - "[[OpenClaw-Gateway-Server]]"
category: ["🦀 OpenClaw", "基础层"]
---

# Config System 配置系统

**源码路径**：`src/config/`（~103 文件）
**配置文件**：`~/.openclaw/openclaw.json`（JSON5 格式）

Config System 是 OpenClaw 的配置中枢。所有模块的运行时行为均由配置驱动。

## 通俗类比：ConfigIO 是「安全文件柜」

配置文件是 OpenClaw 的「大脑」。ConfigIO 通过以下机制保证安全：

1. **原子写入** — 要么全部成功，要么全部失败
2. **文件锁** — 防止两个进程同时写配置
3. **自动备份** — 每次写入前自动备份
4. **配置校验** — 写入前检查格式
5. **Last Known Good** — 新配置导致无法启动时自动回退

## 架构分层

```
config.ts (桶文件/门面)
类型层 (types.*.ts)          — OpenClawConfig 完整类型定义
验证层 (validation.ts)       — 多层配置验证管道
IO层 (io.ts, io.*.ts)       — 读写、路径、快照
变更层 (mutate.ts)           — 原子变更、重试、通知
默认值层 (defaults.ts)        — 全局默认值工厂
元数据层 (io.meta.ts)        — 版本/时间戳自动盖章
```

## 顶层配置类型

```typescript
type OpenClawConfig = {
  meta: { lastTouchedVersion; lastTouchedAt };
  auth: AuthConfig;
  agents: AgentDefinitions;
  models: ModelProviderConfigs;
  channels: ChannelConfigs;
  tools: ToolPolicyConfig;
  plugins: PluginConfig;
  skills: SkillConfig;
  security: SecurityConfig;
  // ... 30+ 配置段
};
```

## 原子变更机制

```typescript
const CONFIG_MUTATION_LOCK_OPTIONS = {
  retries: 80,    // 重试80次
  factor: 1.2     // 退避因子
};

// 变更流程
mutateConfigFile()
  → 获取文件锁
  → 读取当前快照
  → 应用变更
  → 验证结果
  → 哈希校验
  → 写入磁盘
  → 通知观察者
```

## 关键设计

### 自动元数据

每次写入自动盖章 `lastTouchedVersion` 和 `lastTouchedAt`。

### 废弃键处理

```typescript
stripDeprecatedValidationKeys(config)  // 去除废弃验证键
LEGACY_REMOVED_PLUGIN_IDS              // 遗留移除插件ID
```

### 环境变量替换

支持在配置值中使用 `${ENV_VAR}` 语法引用环境变量。

## 设计模式

| 模式 | 应用 |
|------|------|
| 门面模式 | config.ts 统一导出 |
| 桶文件 | 聚合所有子模块导出 |
| 原子变更 | 文件锁 + 重试 + 校验 |
| 观察者模式 | 配置变更通知 |
| 默认值工厂 | 集中管理默认值 |

## 依赖关系

- **被几乎所有模块依赖**：Agent、Gateway、Plugins 等都通过 `loadConfig()` 获取运行时配置
- **依赖**：文件系统、环境变量、插件验证钩子
