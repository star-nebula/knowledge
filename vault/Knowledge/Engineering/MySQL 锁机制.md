---
title: MySQL 锁机制
created: 2026-05-25
tags:
  - MySQL
  - 数据库
  - 锁机制
type: 概念解释
related:
  - "[[MySQL-MOC]]"
  - "[[MySQL 事务]]"
  - "[[MySQL 数据库基础]]"
  - "[[MySQL 电商案例]]"
reference:
category: ["🛠️ 工程工具", "MySQL"]
---

# MySQL 锁机制

> MySQL的锁机制——表级锁、行级锁与排它锁

在用MySQL时，同时有很多做更新、插入、删除动作，MySQL通过锁机制来保证数据不出错。

## 锁的分类

从锁的范围来讲：

- **表级锁**：A操作表时，其他人对整个表都不能操作，等待A操作完之后才能继续。
- **行级锁**：A操作表时，其他人对指定的行数据不能操作，其他行可以操作，等待A操作完之后才能继续。

## 存储引擎差异

| 引擎 | 表锁 | 行锁 |
|------|------|------|
| `MYISAM` | 支持 | 不支持 |
| `InnoDB` | 支持 | 支持 |

> - `MYISAM` 支持表锁，不支持行锁——在 MYISAM 下如果要加锁，无论怎么加都会是表锁
> - `InnoDB` 支持行锁和表锁——如果是**基于索引查询**的数据则是**行级锁**，否则是表锁

所以，一般情况下会选择使用 InnoDB 引擎，并且在搜索时也会使用索引（命中索引）。

## 示例建表

```sql
CREATE TABLE `L1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
```

|表：L1|||
| --------| --------| -------|
|id|name|count|
|1|武沛齐|1000|
|2|于超|2000|
|3|alex|100|

## 排它锁

在 `innodb引擎` 中，update、insert、delete 的行为内部都会先申请锁（排它锁），申请到之后才执行相关操作，最后再释放锁。

所以，当多个人同时向数据库执行：insert、update、delete等操作时，内部加锁后会排队逐一执行。

```sql
select * from xxx; -- select 默认不会申请锁
```

申请锁：

```sql
begin; 
	select * from xxx for update; -- 加锁（排他锁）其他不可以读写
commit;
```

## 相关笔记

- [[MySQL 事务]] - ACID特性与事务操作
- [[MySQL 数据库基础]] - DDL/DML/DQL基础语法
- [[MySQL 电商案例]] - 高并发场景下的数据一致性
