---
title: 模型部署
created: 2026-07-08
tags:
  - 模型部署
  - Docker
  - Ollama
type: 专题聚合页
abstract: Docker 容器化、Ollama 本地模型服务、FastAPI 部署工具链、Streamlit 产品化——模型部署全流程导航。
---

# 模型部署

模型部署是 AI 应用从「能跑」到「能上线」的关键环节，涵盖环境搭建、容器化、模型服务和产品化。

## 知识点

### 容器化基础

| 笔记 | 说明 |
|------|------|
| [[Knowledge/Engineering/Docker]] | Docker 入门与基础操作全指南 |
| [[Docker 核心概念]] | 镜像/容器/仓库基础、常用命令 |
| [[win11 部署 Docker]] | Windows 11 下 Docker Desktop 安装与 WSL2 配置 |

### 本地模型服务

| 笔记 | 说明 |
|------|------|
| [[Ollama 概述]] | Ollama 特点、多平台支持 |
| [[Ollama 安装与配置]] | Linux 安装、自启服务、模型路径修改 |
| [[Ollama 命令参考]] | CLI 命令 + REPL 对话指令 |
| [[Ollama API 调试]] | API 接口一览、Apifox 调试、远程访问配置 |
| [[Ollama 集成 Chatbox]] | Chatbox 客户端配置本地 Ollama 模型 |
| [[Ubuntu 部署 DeepSeek]] | Ubuntu 服务器上 Ollama + DeepSeek 部署流程 |

### 部署工具链

| 笔记 | 说明 |
|------|------|
| [[FastAPI 后端]] | 异步推理、Pydantic 验证、流式响应、限流与监控 |

### 产品化

| 笔记 | 说明 |
|------|------|
| [[聊天机器人实现]] | Python + Ollama API + Streamlit 聊天机器人搭建 |
| [[Streamlit 入门]] | Streamlit 基础组件与聊天组件 |

## 学习路径

```
Docker 基础 → win11/Ubuntu 环境搭建 → Ollama 本地部署 → 聊天机器人产品化
```

## 关联专题

- [[AI 应用核心范式]]：RAG/Agent 等范式的工程落地
- [[Python-MOC]]：Python 环境管理与依赖打包
- [[Linux-MOC]]：服务器部署基础操作
