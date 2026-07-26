---
type: summary
tags:
  - MySQL
  - 数据库
  - SQL
domain: 数据处理
description: MySQL 知识体系索引页，涵盖安装配置、SQL语法、高级特性与Python操作
created: 2026-05-22
updated: 2026-05-25
status: raw
---

# MySQL 知识体系

> MySQL 完整学习路径索引，覆盖从安装配置、SQL 语法基础到高级特性（事务、锁、开窗函数）的完整知识体系，以及 Python 操作 MySQL 的实战内容。

## 知识点

### 基础入门
- [[MySQL 安装与配置]]：Windows 下载安装、环境变量、my.ini 配置、初始化数据库、注册系统服务、登录登出、修改 root 密码
- [[MySQL 客户端工具连接]]：DataGrip 连接 MySQL、VSCode（SQLTools 插件）连接 MySQL

### SQL 核心语法
- [[MySQL 数据库基础]]：SQL 概述与分类、DDL/DML/DQL、约束（主键/外键/非空/唯一/默认）、表关联关系、多表查询（内连接/外连接/子查询/自查询）
- [[MySQL 内置函数]]：字符串函数、数值函数、日期时间函数、聚合函数的速查表

### 高级特性
- [[MySQL 开窗函数]]：row_number/rank/dense_rank/ntile、聚合函数+over、lag/lead、case when
- [[MySQL 事务]]：ACID 特性、begin/commit/rollback、Python 代码事务示例
- [[MySQL 锁机制]]：表级锁 vs 行级锁、InnoDB vs MyISAM、排它锁、select for update

### 实战与开发
- [[MySQL 电商案例]]：用户表/商品表/订单表/订单详情表建表、数据插入、12 道多表查询练习
- [[Python 操作 MySQL]]：pymysql 基本用法、SQL 注入原理与参数化查询防范

## 学习路径

1. [[MySQL 安装与配置]] → 搭建本地 MySQL 环境
2. [[MySQL 客户端工具连接]] → 选择顺手的客户端
3. [[MySQL 数据库基础]] → 掌握 SQL 核心语法
4. [[MySQL 内置函数]] → 熟悉常用函数（随时查阅）
5. [[MySQL 开窗函数]] → 学习高级查询技巧
6. [[MySQL 电商案例]] → 多表查询综合练习
7. [[Python 操作 MySQL]] → 在 Python 中操作数据库
8. [[MySQL 事务]] → 理解事务与数据一致性
9. [[MySQL 锁机制]] → 理解并发控制机制

## 关联领域

- **[[Python Redis|Redis 学习索引]]** - 同为数据库技术，NoSQL 缓存数据库
- **[[数据库开发概览]]** - 关系型与 NoSQL 数据库全景