---
title: Ubuntu 部署 DeepSeek
created: 2026-07-08
tags:
  - DeepSeek
  - Ollama
  - Ubuntu
type: 步骤操作
related:
  - "[[模型部署-MOC]]"
  - "[[Ollama 安装与配置]]"
  - "[[Ollama 集成 Chatbox]]"
category: ["🤖 AI大模型", "模型部署"]
---

# Ubuntu 部署 DeepSeek

通过 Ollama 在 Ubuntu 服务器上部署 DeepSeek 模型，支持本地和远程调用。

## 安装 Ollama

### 标准安装

```shell
curl -fsSL https://ollama.com/install.sh | sh
```

### 网络受限时手动安装

1. 下载安装脚本：

   ```shell
   curl -fsSL https://ollama.com/install.sh -o ollama_install.sh
   chmod +x ollama_install.sh
   ```

2. 修改下载地址为 GitHub：

   ```shell
   sed -i 's|https://ollama.com/download/|https://github.com/ollama/ollama/releases/download/v0.5.7/|' ollama_install.sh
   ```

   > 将 `v0.5.7` 替换为实际版本号。

3. 执行脚本：

   ```shell
   sh ollama_install.sh
   ```

4. 验证安装：

   ```shell
   ollama --help
   ```

## 拉取 DeepSeek 模型

访问 [Ollama 模型库](https://ollama.com/library/deepseek-r1) 查看可用版本，按硬件条件选择：

```shell
ollama pull deepseek-r1:14b
```

成功输出示例：

```shell
pulling manifest
pulling 6e9f90f02bb3... 100% ▕██████████████████████████▏ 9.0 GB
pulling 369ca498f347... 100% ▕██████████████████████████▏  387 B
...
verifying sha256 digest
writing manifest
success
```

## 启动对话

```shell
ollama run deepseek-r1:14b
```

## 配置 Chatbox 本地调用

1. 下载 [Chatbox](https://chatboxai.app/zh) Linux 版（AppImage）
2. 赋予执行权限：

   ```shell
   chmod +x ~/Chatbox-1.10.4-x86_64.AppImage
   ```

3. 启动 Chatbox → 设置 → 模型提供方选 Ollama → 获取 → 选择 `deepseek-r1:14b` 开始对话。

   ![[image-20250305171507-xw5ckd2.png]]
   ![[image-20250305171612-t78d4po.png]]

## 远程部署

允许其他机器通过 API 调用本机 Ollama：

1. 停止服务：

   ```shell
   sudo systemctl stop ollama
   ```

2. 修改服务配置：

   ```shell
   sudo sed -i '/\[Service\]/a Environment="OLLAMA_HOST=0.0.0.0"\nEnvironment="OLLAMA_ORIGINS=*"' /etc/systemd/system/ollama.service
   ```

3. 重启服务：

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart ollama
   ```

4. 远程客户端配置 API 地址为 `http://<服务器IP>:11434`。

## 相关笔记

- Ollama 基础 → [[Ollama 概述]]
- API 调试 → [[Ollama API 调试]]
