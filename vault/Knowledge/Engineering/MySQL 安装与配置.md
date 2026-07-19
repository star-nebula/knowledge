---
title: MySQL 安装与配置
created: 2026-05-25
tags:
  - MySQL
  - 数据库
  - 环境配置
type: 步骤操作
related:
  - "[[MySQL-MOC]]"
  - "[[MySQL 数据库基础]]"
  - "[[MySQL 客户端工具连接]]"
  - "[[Redis 安装与配置]]"
reference:
category: ["🛠️ 工程工具", "MySQL"]
---

# MySQL 安装与配置

> MySQL在Windows环境下的完整安装与配置指南

## MySQL简介

MySQL：开源的关系型数据库管理系统（RDBMS）

社区版本下载：[MySQL Community Server](https://www.mysql.com/downloads/)

## Windows 安装步骤

### 1. 下载与解压

- 社区版本：[MySQL Community Server](https://www.mysql.com/downloads/)
- 将文件解压到软件保存的路径

### 2. 配置环境变量

- 【此电脑】- 【右键】-【属性】-【高级系统设置】-【环境变量】
- 【系统变量】-【Path】-【选中】-【编辑】- 【新建】
- 【将刚刚mysql压缩包点进去bin目录路径复制并粘贴进来】-【确定】

### 3. 创建 data 目录和 my.ini 配置文件

- **data 目录**：存放数据库以及数据（手动创建）
- **my.ini 配置文件**：在Windows下默认没有，手动创建

```ini
[mysqld]
; 设置3306端口
port=3306
; 设置mysql的安装目录
basedir="C:\tools\mysql-8.4.0-winx64"
; 设置mysql数据库的数据的存放目录，就是前面手动创建的data目录
datadir="C:\tools\mysql-8.4.0-winx64\data"
; 允许最大连接数
max_connections=200
; 允许连接失败的次数。
max_connect_errors=10
; 服务端使用的字符集默认为utf8mb4
character-set-server=utf8mb4
; 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
; 默认使用"mysql_native_password"插件认证, mysql_native_password
default_authentication_plugin=mysql_native_password
[mysql]
; 设置mysql网络通信的默认字符集
default-character-set=utf8mb4
[client]
; 设置mysql客户端连接服务端时默认使用的端口
port=3306
; 设置mysql客户端的默认字符集
default-character-set=utf8mb4
```

> 【Tip】`basedir` 和 `datadir` 根据实际路径填写

### 4. 初始化数据库

重新打开一个 `cmd` 黑窗口，输入以下命令，让数据库完成初始化操作：

```bash
mysqld --initialize --console
```

记住初始化密码：在 `root@localhost` 之后显示的随机密码。

### 5. 启动 MySQL 服务

**方式1：直接启动服务进程**

```bash
mysqld    # 启动mysql服务
```

检查是否安装成功：打开任务管理器，查看是否显示 `mysqld.exe`

**方式2：注册系统服务并启动（推荐）**

安装名为"mysql80"的MySQL服务（以管理员身份运行"命令提示符"）：

```bash
mysqld --install mysql80
# 注销服务，用于卸载的
# mysqld --remove mysql80
```

> mysql80 是自定义的服务名（服务器是唯一的），需要符合变量命名规则

Windows下安装的mysql默认是没有启动服务的：

```bash
# 启动和重启mysql的命令：
net start mysql80
# 关闭mysql的命令:
net stop mysql80
```

### 6. 登录交互终端

```bash
mysql -uroot -p xxx  # 输入初始化的密码
# 退出终端
# exit
```

### 7. 修改 root 登录密码

```sql
alter user 'root'@'localhost' identified by '1234';
-- 'root' 就是要修改密码的用户名
-- 'localhost' 表示允许用户在什么地址下可以使用密码登陆到数据库服务器，localhost表示本地登陆
-- '1234'  新密码
```

### 8. （一键）登录与修改密码
```shell
mysql -u root -proot -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';"
```

## MySQL 登录和登出

### 登录

```shell
# 方式一：暗文登陆
mysql -u用户名 -p
输入密码
# 方式二：明文登陆
mysql -u用户名 -p密码
# 方式三：远程访问
mysql --host=主机名 --user=数据库用户名 --password=密码
```

### 登出

```shell
# 方式一：
exit
# 方式二：
quit
# 方式三：
ctrl + d
```

## 相关笔记

- [[MySQL 数据库基础]] - MySQL基础概念与SQL语法
- [[MySQL 客户端工具连接]] - DataGrip与VSCode连接MySQL
- [[Redis 安装与配置]] - 同为数据库环境配置，可对比学习
