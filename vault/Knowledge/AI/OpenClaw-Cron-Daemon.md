---
type: concept
tags:
  - AI
  - OpenClaw
  - Cron
  - Daemon
  - 定时任务
  - 守护进程
domain: AI
description: Cron & Daemon——定时任务调度与跨平台守护进程管理（launchd/systemd/schtasks）
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/18-cron-daemon]]"
related:
  - "[[OpenClaw-MOC]]"
  - "[[OpenClaw-Config-System]]"
  - "[[OpenClaw-Agent-Engine]]"
  - "[[OpenClaw-Gateway-Server]]"
---

# Cron & Daemon 定时任务与守护进程

**源码路径**：`src/cron/` + `src/daemon/`

Cron 提供定时任务调度能力（按 cron 表达式执行 Agent 工作流），Daemon 负责将 OpenClaw 注册为系统服务。

## 核心职责

| 模块 | 职责 |
|------|------|
| Cron Service | 定时任务调度（start/stop/list/add/update/remove/run） |
| Daemon Service | 跨平台系统服务注册 |

## Cron Service

```typescript
interface CronService {
  start(): Promise<void>;
  stop(): Promise<void>;
  list(): Task[];
  add(task): void;
  update(id, task): void;
  remove(id): void;
  run(id): Promise<void>;  // 手动触发
}
```

- 有状态服务门面，包装无状态的 cron 操作
- 支持标准 cron 表达式
- 任务执行通过 Agent Engine

## Daemon 平台适配

| 平台 | 服务管理器 | 注册方式 |
|------|-----------|----------|
| macOS | launchd | plist 文件写入 ~/Library/LaunchAgents/ |
| Linux | systemd | unit 文件写入 /etc/systemd/system/ |
| Windows | schtasks | 通过 Task Scheduler API 注册 |

```typescript
type GatewayService = {
  install(): Promise<void>;
  uninstall(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;
  status(): Promise<ServiceStatus>;
};
```

## 设计模式

| 模式 | 应用 |
|------|------|
| 门面模式 | CronService 包装底层 cron 操作 |
| 平台适配 | GatewayService 抽象统一平台差异 |
