---
title: Ollama 安装与配置
created: 2026-07-08
tags:
  - Ollama
  - Linux
  - 配置
type: 步骤操作
related:
  - "[[模型部署-MOC]]"
  - "[[Ollama 概述]]"
category: ["🤖 AI大模型", "模型部署"]
---

# Ollama 安装与配置

## Linux 手动安装

若官网脚本不可用，使用离线包安装：

```shell
tar -C /usr -xzf ollama-linux-amd64.tgz
ollama -v    # 验证安装
```

## 添加自启服务

创建 `/etc/systemd/system/ollama.service`：

```ini
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/bin/ollama serve
User=root
Group=root
Restart=always
RestartSec=3

[Install]
WantedBy=default.target
```

```shell
sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl start ollama
```

## 修改模型存储路径

默认路径：`~/.ollama/models`（各平台一致）。

### Windows

设置系统环境变量 `OLLAMA_MODELS`，值为目标路径（如 `C:\ollama_models`），然后将已有模型迁移到新路径。

### Linux

在 `/etc/profile` 末尾添加：

```shell
export OLLAMA_MODELS=/root/ollama
```

```shell
source /etc/profile
systemctl stop ollama
mkdir -p /root/ollama
cp -r ~/.ollama/models/* /root/ollama/
```

**重启后仍生效**：在 `/etc/systemd/system/ollama.service` 的 `[Service]` 段添加：

```ini
Environment="OLLAMA_MODELS=/root/ollama"
```

```shell
systemctl daemon-reload
systemctl restart ollama
```

## 相关笔记

- 运行模型 & 命令 → [[Ollama 命令参考]]
- API 调试 → [[Ollama API 调试]]
