---
title: Claude Code 接入 DeepSeek 与 GLM
tags: [Claude Code, DeepSeek, GLM, 模型接入, LLM应用]
type: 步骤操作
created: 2026-07-08
related:
  - "[[框架与中间件-MOC]]"
reference: ""
category: ["🧩 AI框架与Agent", "框架与中间件"]
---

# Claude Code 接入 DeepSeek 与 GLM

## 1. 安装 Claude Code

### 官方方法

```bash
# macOS/Linux
curl -fsSL https://claude.ai/install.sh | bash

# Windows
irm https://claude.ai/install.ps1 | iex
```

### npm 方式安装

```bash
npm install -g @anthropic-ai/claude-code
```

### 检查安装

```bash
claude --version
```

## 2. 申请 API Key

- **DeepSeek**：在 [DeepSeek 开放平台](https://platform.deepseek.com/api_keys) 创建 API key，创建后立即保存，之后无法复制
- **智谱 GLM**：在 [智谱开放平台](https://open.bigmodel.cn/) 获取 API key

## 3. 配置 Claude Code 环境

### DeepSeek 配置

```powershell
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_AUTH_TOKEN <your DeepSeek API Key>
export ANTHROPIC_MODEL=deepseek-chat
export ANTHROPIC_SMALL_FAST_MODEL=deepseek-chat
```

### 智谱 GLM 配置

```powershell
# Cmd 中
setx ANTHROPIC_AUTH_TOKEN <your_zhipu_api_key>
setx ANTHROPIC_BASE_URL https://open.bigmodel.cn/api/anthropic
setx CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC 1

# PowerShell 中
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_AUTH_TOKEN', '<your_zhipu_api_key>', 'User')
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_BASE_URL', 'https://open.bigmodel.cn/api/anthropic', 'User')
[System.Environment]::SetEnvironmentVariable('CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC', '1', 'User')
```

## 4. 开始使用 Claude Code

```powershell
cd <your-project>
claude  # 启动并选择 yes
```

首次使用时会提示登录：执行 `/login` 按提示完成。

- **DeepSeek**：API Base URL 变为 DeepSeek 地址即配置成功
- **GLM**：显示 `/model to try Opus 4.5` 即配置成功

## 常见问题

**问题 1**：启动报错 → 在 `C:\Users\<你的用户名>\.claude.json` 中加入：
```json
"hasCompletedOnboarding": true
```

**问题 2**：禁止运行脚本 → 执行：
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```
