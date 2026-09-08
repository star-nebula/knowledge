---
type: guides
tags:
  - AI
  - OpenClaw
  - 部署
  - 配置
  - CLI
domain: AI
description: OpenClaw 安装、部署与配置完整指南——安装方式、CLI 命令、配置文件结构、环境变量、守护进程
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/部署与配置]]"
related:
  - "[[🦀 OpenClaw-MOC]]"
  - "[[OpenClaw-Config-System]]"
  - "[[OpenClaw-Cron-Daemon]]"
  - "[[OpenClaw-Secrets]]"
  - "[[OpenClaw-代码组织与技术债务]]"
category: ["🦀 OpenClaw", "操作指南"]
---

# OpenClaw 部署与配置

## 快速参考

| 项目 | 值 |
|------|-----|
| 配置文件 | `~/.openclaw/openclaw.json`（JSON5 格式） |
| 状态目录 | `~/.openclaw/`（旧版 `~/.clawdbot/`） |
| 共享数据库 | `~/.openclaw/state/openclaw.sqlite` |
| Agent 数据库 | `~/.openclaw/agents/<id>/agent/openclaw-agent.sqlite` |
| 默认端口 | `18789` |
| 运行时依赖 | Node.js ≥ 18 + pnpm + SQLite（嵌入式） |
| 许可证 | MIT |

## 安装方式

**直接安装**（推荐个人使用）：
```bash
npm install -g openclaw
# 或
pnpm add -g openclaw
```

**初始化与启动**：
```bash
openclaw onboard          # 初始化向导（配置模型、频道等）
openclaw gateway start    # 启动网关
openclaw doctor --fix     # 诊断并修复配置/状态问题
```

**Docker**：
```bash
docker compose up -d
```
项目根目录 `docker-compose.yml` 定义容器化部署，`Dockerfile` 使用多阶段构建。

**Nix**：
```bash
nix run github:openclaw/nix-openclaw
```

**Render / Fly.io**：项目包含 `render.yaml` 和 `fly.toml`，支持一键部署。

## CLI 常用命令

```bash
openclaw onboard           # 初始化设置向导
openclaw configure         # 配置管理
openclaw doctor --fix      # 诊断并修复
openclaw gateway start     # 启动网关
openclaw gateway stop      # 停止网关
openclaw gateway status    # 查看网关状态
openclaw agent run "msg"  # 运行一次 Agent 命令
openclaw agent list        # 列出所有 Agent
openclaw channels list     # 列出已配置频道
openclaw channels start x  # 启动指定频道
openclaw channels stop x   # 停止指定频道
```

## 配置文件

主配置文件 `~/.openclaw/openclaw.json`（JSON5 格式，支持注释和尾逗号）。

| 配置段 | 说明 |
|--------|------|
| `auth` | 认证配置 |
| `agents` | Agent 定义（模型、系统提示、工具策略） |
| `models` | 模型提供商配置（40+ 提供商） |
| `channels` | 消息频道配置（30+ 频道） |
| `tools` | 工具策略配置 |
| `plugins` | 插件配置 |
| `skills` | 技能配置 |
| `logging` | 日志配置 |
| `security` | 安全策略 |

## 关键环境变量

| 变量 | 说明 |
|------|------|
| `OPENCLAW_CONFIG_PATH` | 配置文件路径（覆盖默认） |
| `OPENCLAW_STATE_DIR` | 状态目录路径（覆盖默认） |
| `OPENCLAW_GATEWAY_STARTUP_TRACE` | 启用网关启动追踪 |
| `HTTP_PROXY` / `HTTPS_PROXY` | HTTP/HTTPS 代理 |
| `ALL_PROXY` | 全协议代理 |
| `NO_PROXY` | 代理排除列表 |

## 守护进程

OpenClaw 可作为系统服务长期运行：

| 平台 | 服务管理器 | 注册位置 |
|------|-----------|----------|
| macOS | launchd | `~/Library/LaunchAgents/` plist |
| Linux | systemd | `/etc/systemd/system/` unit |
| Windows | schtasks | Task Scheduler API |

## 常见问题

**修改配置**：`openclaw configure`（交互式）或 `openclaw doctor --fix`（自动修复迁移问题），也可直接编辑 `~/.openclaw/openclaw.json`。

**切换模型**：在 `models` 段配置 Provider，然后在 `agents.defaults.model` 中引用。

**端口冲突**：在配置文件或环境变量中修改 Gateway 端口。
