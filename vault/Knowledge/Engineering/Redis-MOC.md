---
title: Redis-MOC
created: 2026-07-04
tags:
  - MOC
  - Redis
  - NoSQL
  - 缓存
  - 工程技术
type: 专题聚合页
abstract: NoSQL 缓存数据库 Redis 导航——核心概念、Windows 部署、Python 客户端与分布式锁实战。
---

# Redis 知识地图

> NoSQL 缓存数据库：从核心概念（5 种数据类型与 key 操作）、Windows 环境搭建、redis-py 客户端到分布式锁/延迟队列/发布订阅等实战模式。

## 导航

| #   | 笔记                    | 一句话                                                 |
| --- | --------------------- | --------------------------------------------------- |
| 1   | [[Redis 核心概念]]        | RDBMS vs NoSQL、Redis 定义与特点、CLI 操作、5 种数据类型与 key 操作命令 |
| 2   | [[Redis 安装与配置]]       | Windows 环境下载安装、配置项、注册服务与开机自启                        |
| 3   | [[Python Redis 客户端]]  | redis-py 连接、连接池、5 种数据类型 Python API、键操作              |
| 4   | [[Python Redis 实战案例]] | KV 缓存、分布式锁、定时任务、延迟队列、发布订阅 5 案例                      |

## 学习路径

```
概念：Redis 核心概念 → 数据类型与 key 操作
环境：Redis 安装与配置
编程：Python Redis 客户端 → 5 种类型 API
实战：Python Redis 实战案例（缓存/锁/队列/发布订阅）
```

## 与 AI 的关联

| 模块 | AI 应用场景 |
|------|------------|
| Redis KV | 推理结果缓存、Embedding 缓存、会话状态 |
| 分布式锁 | Agent 编排任务幂等、限流 |
| 延迟队列 | 异步任务调度、回调通知 |
| 发布订阅 | 多 Agent 事件广播 |

## 关联

- [[「Engineering」MOC]]
- [[MySQL-MOC]] — 持久层与缓存层互补
- [[数据库开发概览]] — NoSQL 与关系型对比的入口
- [[Python-MOC]] — redis-py 依赖 Python 语言基础