---
title: Docker 核心概念
created: 2026-07-10
tags:
  - Docker
  - 容器
  - DevOps
type: 概念解释
category: ["🛠️ 工程工具", "模型部署"]
---


# Docker 核心概念

Docker 是容器化平台，通过 OS 级虚拟化实现应用的轻量打包和隔离运行。

## 三大核心

| 概念 | 说明 | 类比 |
|------|------|------|
| 镜像（Image） | 只读模板，含运行环境和代码 | 类（Class） |
| 容器（Container） | 镜像的运行实例，隔离的文件系统和进程 | 对象（Instance） |
| 仓库（Registry） | 存储和分发镜像 | Docker Hub / 私有 Registry |

## Docker 与虚拟机对比

| 维度 | Docker | 虚拟机 |
|------|--------|--------|
| 虚拟化层 | OS 级（共享宿主机内核） | 硬件级（Hypervisor + 完整 Guest OS） |
| 启动时间 | 秒级 | 分钟级 |
| 磁盘占用 | MB 级 | GB 级 |
| 隔离性 | 进程级 | 强隔离（独立内核） |

## 关键机制

- **联合文件系统（UnionFS）**：分层构建镜像，共享底层 layer，修改只写顶层
- **命名空间（Namespace）**：PID / Net / Mount / User 等隔离
- **控制组（Cgroups）**：限制 CPU、内存、IO 等资源

## 核心流程

`Dockerfile` → `docker build` 生成 Image → `docker run` 启动 Container。

编排：单机用 `docker-compose`，集群用 `Kubernetes`（K8s）。
