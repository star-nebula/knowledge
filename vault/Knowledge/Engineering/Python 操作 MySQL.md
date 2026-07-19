---
title: Python 操作 MySQL
created: 2026-05-25
tags:
  - MySQL
  - Python
  - pymysql
  - SQL注入
type: 步骤操作
related:
  - "[[MySQL-MOC]]"
  - "[[MySQL 事务]]"
  - "[[MySQL 数据库基础]]"
  - "[[MySQL 安装与配置]]"
  - "[[MySQL 电商案例]]"
reference:
category: ["🛠️ 工程工具", "MySQL"]
---

# Python 操作 MySQL

> Python 通过 pymysql 模块操作 MySQL 数据库，含 SQL 注入原理与参数化查询防范

## pymysql 模块

安装：

```bash
pip install pymysql
```

### 基本语法

```python
import pymysql

# 连接到MySQL数据库
conn = pymysql.connect(
    host='localhost',           # 主机名 
    user='your_username',       # 用户名
    password='your_password',   # 密码
    database='your_database'    # 数据库名称
)

cursor = conn.cursor()  # 创建游标对象
                        # 游标用于执行SQL查询并获取结果
# 执行SQL查询
query = "SELECT * FROM your_table"
cursor.execute(query)   # execute() 传递SQL查询语句

# 获取查询结果
result = cursor.fetchall() # fetchall() 获取查询结果
for row in result:
    print(row)

cursor.close() # 关闭游标
conn.close()   # 关闭数据库连接
```

## SQL 注入

SQL注入是一种常见的安全漏洞，它发生在应用程序未正确验证和处理用户输入数据时。
攻击者可以通过在输入中插入恶意的SQL代码，利用这个漏洞来执行未经授权的数据库操作。

### 示例

```python
import pymysql

def login(username, password):
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='yuan0316',
        database='db_day02'
    )

    cursor = conn.cursor()
    # 构造SQL查询语句
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    params = (username,password)
    print("query:",query)
    cursor.execute(query,params) # 执行SQL查询
    result = cursor.fetchall() # 获取查询结果
    cursor.close()
    conn.close()

    if len(result) > 0:
        print("登录成功")
    else:
        print("登录失败")

# 用户输入作为参数传递给登录函数
username = input("请输入用户名：")
password = input("请输入密码：")
login(username, password)
```

如果用户输入恶意的数据，例如在用户名输入框中输入 `' or 1=1;-- `，那么构造的查询语句将变为：

```python
SELECT * FROM users WHERE username = '' or 1=1;-- ' AND password = '111'
```

这将导致查询条件始终为真，绕过了实际的身份验证过程，从而允许攻击者以任意用户登录。

### 防范：参数化查询

使用参数化查询来过滤和转义用户输入数据：

```python
# 使用参数化查询构造SQL语句
query = "SELECT * FROM users WHERE username = %s AND password = %s"
params = (username, password)
# 执行SQL查询
cursor.execute(query, params)
```

将用户输入作为参数传递给 `execute()` 方法，而不是直接将它们插入到SQL查询语句中。

## 相关笔记

- [[MySQL 事务]] - 事务的Python代码实现
- [[MySQL 数据库基础]] - DDL/DML/DQL基础语法
- [[MySQL 安装与配置]] - MySQL环境搭建
- [[MySQL 电商案例]] - 多表查询与事务综合实战
