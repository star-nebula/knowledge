---
title: win11 部署 Docker
created: 2026-07-08
tags:
  - Docker
  - Windows
  - WSL2
type: 步骤操作
related:
  - "[[Docker 核心概念]]"
reference:
category: ["🛠️ 工程工具", "模型部署"]
---

# win11 部署 Docker

## 前置条件

- 开启 Windows 虚拟化功能（Hyper-V、虚拟机平台、WSL）
- Docker 账号（首次使用需注册登录）

## 安装步骤

1. 从 [Docker 官网](https://docs.docker.com/desktop/install/windows-install/) 下载 Docker Desktop 安装包
2. 启用 Windows 功能：控制面板 → 程序 → 启用或关闭 Windows 功能，勾选：
   - Hyper-V
   - Windows 虚拟机监控程序平台
   - 适用于 Linux 的 Windows 子系统
   - 虚拟机平台
3. 运行安装程序，按提示完成安装后重启
4. 启动 Docker Desktop，选择 Accept → 勾选 "Use recommended settings" → Finish
5. 注册/登录 Docker 账号，等待 Docker Engine 启动

## 常见问题

### WSL 版本过旧

若启动时提示 WSL 相关错误，在终端执行更新：

![[image-20240808183402-ab80u2v.png]]

```shell
wsl --update
```

## 相关笔记

- 概念基础 → [[Docker 核心概念]]
- Linux 环境部署 → [[Ubuntu 部署 DeepSeek]]
