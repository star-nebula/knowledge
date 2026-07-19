---
title: Ollama 集成 Chatbox
created: 2026-07-08
tags:
  - Ollama
  - Chatbox
  - 客户端
type: 步骤操作
related:
  - "[[模型部署-MOC]]"
  - "[[Ollama 概述]]"
category: ["🤖 AI大模型", "模型部署"]
---

# Ollama 集成 Chatbox

Chatbox 是一款多平台 AI 聊天客户端，可通过 API 集成 Ollama 本地模型。

官网：[https://chatboxai.app/zh](https://chatboxai.app/zh)

## 配置步骤

1. **启动模型**（保持运行状态）：

   ```shell
   ollama run qwen3:4b --keepalive 1h
   ```

2. **Chatbox 获取模型**：打开 Chatbox → 设置 → 模型提供方选 Ollama → 点击「获取」自动发现本机模型

   ![[image-20251205181554-jxtuih5.png]]

3. **选择模型开始对话**：从模型列表中选择即可对话

   ![[image-20251205183721-m7nkkmu.png]]

## 相关笔记

- API 调试 → [[Ollama API 调试]]
- 服务端部署 → [[Ubuntu 部署 DeepSeek]]
