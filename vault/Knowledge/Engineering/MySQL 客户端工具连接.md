---
title: MySQL 客户端工具连接
created: 2026-05-25
tags:
  - MySQL
  - 数据库
  - 开发工具
type: 步骤操作
related:
  - "[[MySQL-MOC]]"
  - "[[MySQL 安装与配置]]"
  - "[[Redis 安装与配置]]"
reference:
category: ["🛠️ 工程工具", "MySQL"]
---

# MySQL 客户端工具连接

> DataGrip和VSCode连接MySQL数据库的配置指南

## DataGrip 连接 MySQL

- 安装DataGrip软件：[https://www.jetbrains.com/datagrip/download/other.html](https://www.jetbrains.com/datagrip/download/other.html)

### 配置步骤

1. 新建工程：`File -> New -> Project -> 输入project 的name`
2. 连接数据库：`点击 Database Explorer 中的【+】 -> 选择:Data Source -> 选择:MySQL`
3. 配置连接信息（位于Data Sources）：
   - name：连接名
   - host：主机名（IP）
   - user：用户名
   - password：密码
4. 修改驱动（可选）：点击 Drivers（Data Sources旁边）
   - 将Driver Files 中原本的驱动删除
   - `点击 + ，添加新的驱动:mysql-connector-java-8.0.25.jar（可选其它版本与自己的mysql对应）`
   - 【注】驱动的位置，在之后不要修改（将文件放在合理位置就不要动了）

## VSCode 连接 MySQL

> 前置条件：已安装 MySQL 和 VSCode

### 启动 MySQL 服务

```sh
# 管理员模式进入mysql安装目录
net start MySQL
sudo service mysql start
brew services start mysql
```

### 安装 VSCode 插件

- vscode -> 扩展 -> 搜索对应的插件安装
- 安装插件 **SQLTools**
- 安装插件 **SQLTools MySQL/MariaDB Driver**

### 配置 MySQL 连接

1. 点击左侧活动栏 SQLTools 图标
2. 点击 **Add New Connection** 选择 MySQL

| 配置项 | 值 |
|--------|-----|
| Connection name* | 自定义连接名 |
| Database* | 数据库名 |
| Username* | 用户名 |
| Password* | 密码（若有） |
| Connect using* | Server and Port |
| Server Address* | localhost |
| Port* | 3306 |

3. 输入完毕后点击 **SAVE CONNECTION**
4. 点击 **CONNECT NOW** 连接

## 相关笔记

- [[MySQL 安装与配置]] - MySQL安装与基础配置
- [[Redis 安装与配置]] - Redis环境搭建，同为数据库客户端工具链
