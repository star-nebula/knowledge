---
title: MySQL 事务
created: 2026-05-25
tags:
  - MySQL
  - 数据库
  - 事务
type: 概念解释
related:
  - "[[MySQL-MOC]]"
  - "[[MySQL 锁机制]]"
  - "[[Python 操作 MySQL]]"
reference:
category: ["🛠️ 工程工具", "MySQL"]
---
# MySQL 事务

> 数据库事务的ACID特性与实现

## 事务的特性

innodb引擎支持事务，myisam不支持。

```sql
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(32) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

例如：李杰 给 武沛齐 转账 100，那就会涉及2个步骤：

- 李杰账户 减100
- 武沛齐账户 加 100

这两个步骤必须同时完成才算完成，并且如果第一个完成、第二步失败，还是回滚到初始状态。

事务，就是来解决这种情况的。大白话：要成功都成功；要失败都失败。

## ACID 特性

事务的具有四大特性（ACID）：

- **原子性（Atomicity）**
  原子性是指事务包含的所有操作不可分割，要么全部成功，要么全部失败回滚

- **一致性（Consistency）**
  执行的前后数据的完整性保持一致

- **隔离性（Isolation）**
  一个事务执行的过程中,不应该受到其他事务的干扰

- **持久性（Durability）**
  事务一旦结束,数据就持久到数据库

## MySQL 客户端操作

```sql
mysql> select * from users;
+----+---------+---------+
| id | name    | amount  |
+----+---------+---------+
|  1 | wupeiqi |    5    |
|  2 |  alex   |    6    |
+----+---------+---------+
3 rows in set (0.00 sec)

mysql> begin;  -- 开启事务 start transaction;
Query OK, 0 rows affected (0.00 sec)

mysql> update users set amount=amount-2 where id=1; -- 执行操作
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> update users set amount=amount+2 where id=2; -- 执行操作
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> commit; -- 提交事务    rollback; -- 回滚
Query OK, 0 rows affected (0.00 sec)

mysql> select * from users;
+----+---------+---------+
| id | name    | amount  |
+----+---------+---------+
|  1 | wupeiqi |    3    |
|  2 |  ale x  |    8    |
+----+---------+---------+
3 rows in set (0.00 sec)

mysql> begin; -- 开启事务
Query OK, 0 rows affected (0.00 sec)

mysql> update users set amount=amount-2 where id=1; -- 执行操作（此时数据库中的值已修改）
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> rollback; -- 事务回滚（回到原来的状态）
Query OK, 0 rows affected (0.00 sec)

mysql> select * from users;
+----+---------+---------+
| id | name    | amount  |
+----+---------+---------+
|  1 | wupeiqi |    3    |
|  2 |  ale x  |    8    |
+----+---------+---------+
3 rows in set (0.00 sec)
```

## Python 代码实现

```python
import pymysql

conn = pymysql.connect(host='127.0.0.1', port=3306, user='root', passwd='root123', charset="utf8", db='userdb')
cursor = conn.cursor()

# 开启事务
conn.begin()

try:
    cursor.execute("update users set amount=1 where id=1")
    int('asdf')
    cursor.execute("update tran set amount=2 where id=2")
except Exception as e:
    # 回滚
    print("回滚")
    conn.rollback()
else:
    # 提交
    print("提交")
    conn.commit()

cursor.close()
conn.close()
```

## 相关笔记

- [[MySQL 锁机制]] - 表级锁与行级锁
- [[Python 操作 MySQL]] - pymysql基本用法
