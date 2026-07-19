---
title: MySQL-MOC
created: 2026-07-04
tags:
  - MOC
  - MySQL
  - 数据库
  - SQL
  - 工程技术
type: 专题聚合页
abstract: 关系型数据库 MySQL 全景——SQL 语法、事务/锁机制、Python 集成与电商实战案例。
---

# MySQL 与关系型数据库知识地图

> 关系型数据库全景：从概念入门、SQL 语法、安装环境、客户端工具到高级特性（开窗/事务/锁）与实战案例，并衔接 Python 集成。

## 导航

| # | 笔记 | 一句话 |
|---|------|--------|
| 1 | [[数据库开发概览]] | 关系型/NoSQL 数据库概念、Python 操作数据库入口 |
| 2 | [[MySQL 数据库基础]] | SQL 分类、DDL/DML/DQL 语法、约束、表关联关系、多表查询与子查询 |
| 3 | [[MySQL 内置函数]] | 字符串/数值/日期/聚合函数速查表 |
| 4 | [[MySQL 开窗函数]] | row_number/rank/dense_rank/ntile、聚合+over、lag/lead、CASE WHEN |
| 5 | [[MySQL 安装与配置]] | Windows 环境安装、配置、服务注册与启停 |
| 6 | [[MySQL 客户端工具连接]] | DataGrip 与 VSCode 连接 MySQL 配置步骤 |
| 7 | [[MySQL 事务]] | ACID 特性、客户端操作与 Python 代码实现 |
| 8 | [[MySQL 锁机制]] | 表级锁与行级锁、InnoDB 与 MyISAM 差异、排它锁使用 |
| 9 | [[MySQL 电商案例]] | 电商系统建表、数据插入与 12 道多表查询练习题 |
| 10 | [[Python 操作 MySQL]] | pymysql 模块编程 MySQL、SQL 注入原理与防范 |

## 学习路径

```
入门：数据库开发概览 → MySQL 数据库基础 → MySQL 内置函数 → MySQL 开窗函数
环境：MySQL 安装与配置 → MySQL 客户端工具连接
进阶：MySQL 事务 → MySQL 锁机制
实战：MySQL 电商案例 → Python 操作 MySQL
```

## 与 AI 的关联

| 模块 | AI 应用场景 |
|------|------------|
| MySQL | 结构化数据存储、特征存储、用户行为日志 |
| 事务/锁 | 高并发特征写入、训练样本原子化下发 |
| Python 操作 MySQL | ETL 取数、特征从数据库回流到 Pandas/NumPy |

## 关联

- [[「Engineering」MOC]]
- [[DataAnalysis-MOC]] — 取数后衔接 Pandas/NumPy 数据处理
- [[Redis-MOC]] — 缓存层与持久层互补
- [[Python-MOC]] — pymysql 依赖 Python 语言基础