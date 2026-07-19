---
title: Docker 核心概念
created: 2026-07-08
tags:
  - Docker
  - 容器
  - 部署
type: 概念解释
related:
  - "[[Docker-MOC]]"
  - "[[win11 部署 Docker]]"
reference:
category: ["🛠️ 工程工具", "模型部署"]
---

# Docker 核心概念

Docker 是一个**容器化平台**，将应用及其依赖打包进轻量级容器，实现"一次构建，到处运行"。

## 三大核心组件

| 组件 | 说明 | 类比 |
|------|------|------|
| **镜像（Image）** | 只读模板，包含应用运行所需的一切 | 类（Class） |
| **容器（Container）** | 镜像的运行实例，相互隔离 | 对象（Object） |
| **仓库（Registry）** | 存储和分发镜像的中心化服务 | GitHub |

## 基本工作流

```shell
docker pull nginx       # 从仓库拉取镜像
docker run -d nginx     # 以后台模式启动容器
docker ps               # 查看运行中的容器
docker stop <id>        # 停止容器
docker rmi nginx        # 删除镜像
```

> 镜像拉取受限时，可借助第三方脚本绕过网络限制。

## 相关笔记

- 环境搭建 → [[win11 部署 Docker]]
- 编排与多容器 → Docker Compose（待补充）
