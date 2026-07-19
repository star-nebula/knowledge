---
title: Redis 安装与配置
created: 2026-05-25
tags:
  - Redis
  - 安装配置
  - Windows
type: 步骤操作
related:
  - "[[Redis-MOC]]"
  - "[[Redis 核心概念]]"
  - "[[Python Redis 客户端]]"
  - "[[Python Redis 实战案例]]"
  - "[[MySQL 安装与配置]]"
reference:
category: ["🛠️ 工程工具", "Redis"]
---

# Redis 安装与配置：Windows 环境搭建

## 下载和安装

### Windows 下安装

下载地址：[https://github.com/tporadowski/redis/releases](https://github.com/tporadowski/redis/releases)（访问于 2026-05-25）

- 启动redis服务端：`redis-server`

  关闭redis服务端：关闭cmd窗口

- redis作为windows服务启动

  ```powershell
  安装：redis-server --service-install redis.windows.conf
  启动服务：redis-server --service-start
  停止服务：redis-server --service-stop
  ```

- 连接操作 redis：`redis-cli`

### Ubuntu 下安装

```bash
安装命令：sudo apt-get install -y redis-server
卸载命令：sudo apt-get purge --auto-remove redis-server
关闭命令：sudo service redis-server stop
开启命令：sudo service redis-server start
重启命令：sudo service redis-server restart
配置文件：/etc/redis/redis.conf
```

## Redis 的配置

### 配置文件位置

- Windows：在软件安装目录下
- Mac / Linux：`cat /etc/redis/redis.conf`

### 核心配置选项

#### 绑定ip

```powershell
bind 127.0.0.1
```

#### 端口（默认6379）

```powershell
port 6379
```

#### 是否以守护进程运行

- 如果以守护进程（yes）运行，则不会在命令阻塞，类似于服务
- 如果以非守护进程（no）运行，则当前终端被阻塞
- 推荐设置为yes

```powershell
daemonize yes
```

#### RDB持久化的备份策略（默认开启）

```powershell
# save 时间 读写次数
save 900 1     # 当redis在900内至少有1次读写操作，则触发一次数据库的备份操作
save 300 10    # 当redis在300内至少有10次读写操作，则触发一次数据库的备份操作
save 60 10000  # 当redis在60内至少有10000次读写操作，则触发一次数据库的备份操作
```

- RDB持久化的备份文件：`dbfilename dump.rdb`
- RDB持久化数据库数据文件的所在目录：`dir /var/lib/redis`

#### 日志文件

```powershell
loglevel notice
logfile /var/log/redis/redis-server.log
```

#### 进程ID文件

```powershell
pidfile /var/run/redis/redis-server.pid
```

#### 登录密码

redis在6.0版本以后新增了ACL访问控制机制，新增了用户管理，这个版本以后才有账号和密码，在此之前只有密码没有账号。

```bash
# requirepass foobared
```

注意：开启了以后，redis-cli终端下使用 `auth 密码`来认证登录。

![[assets/image-20211108102339592-20250728214318-m2nizds.png]]

#### AOF持久化（默认关闭）

```bash
appendonly no
```

- AOF持久化的备份文件：`appendfilename "appendonly.aof"`
- AOF的备份数据文件与RDB的备份数据文件保存在同一个目录下，由dir配置项指定
- AOF持久化备份策略：

  ```bash
  # appendfsync always
  appendfsync everysec    # 工作中最常用。每一秒备份一次
  # appendfsync no
  ```

#### 哨兵集群

一主二从三哨兵(3台服务器)。

## Windows 详细安装步骤

### 1. 下载

连接：[Release Redis for Windows 5.0.14.1 · tporadowski/redis · GitHub](https://github.com/tporadowski/redis/releases/tag/v5.0.14.1)（访问于 2026-05-25）

文件：[Redis-x64-5.0.14.1.zip](<assets/Redis-x64-5.0.14.1.zip>)

解压：路径中不能有中文（建议解压到安装开发软件的目录中）

### 2. 设置连接密码（可选）

- 在 Redis 的根目录下打开 `redis.windows.conf` 文件
- 查找 `requirepass` 关键字，设置密码后保存文件

### 3. 启动（命令行启动）

> 【Tip】直接双击 `redis-server.exe` 启动会忽略配置文件，导致密码设置失效。

- 在 Redis 的根目录下打开 cmd 窗口
- 输入 `redis-server.exe redis.windows.conf`
- 启动成功后，命令行窗口会显示 Redis logo 和端口信息
- 测试：
  - 根目录下双击 `redis-cli.exe` 文件
  - 输入密码（若无请忽略）
  - `set name Tom`
  - `get name` → 返回：'Tom'

### 4. 启动（批处理文件启动）

- 根目录下新建批处理文件 `redis-server.bat`
- 文件内容：`redis-server.exe redis.windows.conf`
- 双击 bat 文件启动 Redis

## 设置开机自启动

### 1. 将Redis进程注册为服务

- 根目录打开 cmd
- 输入：`redis-server.exe --service-install redis.windows.conf --loglevel verbose`

### 2. 设置开机自启

- 按下Win + R键，输入`services.msc` 回车，打开服务窗口
- 找到 redis 服务，右键点击 属性
- 启动类型：选择 `自动`
- 点击 `应用` 按钮后再点击 `确定` 按钮

### 3. 重启电脑测试

- 双击 `redis-cli.exe`
- 输入密码（若无请忽略）
- `set name Tom`
- `get name` → 返回：'Tom'

### 关闭 Redis 开机自启

- 原理：卸载 Redis 服务
- 根目录打开 cmd
- 输入：`redis-server --service-uninstall`

## 相关笔记

- [[Redis 核心概念]]：数据类型与基础操作
- [[Python Redis 客户端]]：redis-py 操作指南
- [[Python Redis 实战案例]]：缓存、锁、队列与发布订阅
- [[MySQL 安装与配置]]：同为数据库环境配置，可对比学习
