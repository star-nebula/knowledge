---
title: Redis 核心概念
created: 2026-05-25
tags:
  - Redis
  - NoSQL
  - 数据库
  - 数据类型
type: 概念解释
related:
  - "[[Redis-MOC]]"
  - "[[Redis 安装与配置]]"
  - "[[Python Redis 客户端]]"
  - "[[Python Redis 实战案例]]"
  - "[[MySQL 数据库基础]]"
  - "[[数据库开发概览]]"
reference:
category: ["🛠️ 工程工具", "Redis"]
---

# Redis 核心概念：数据类型与基础操作

## RDBMS 与 NoSQL

### 关系型数据库（RDBMS）

- 数据库中表与表的数据之间存在某种关联的内在关系
- 典型：Mysql/MariaDB、postgreSQL、Oracle、SQLServer、DB2、Access、SQLlite3
- 特点：
  1. 全部使用SQL（结构化查询语言）进行数据库操作
  2. 都存在主外键关系，表，等等关系特征
  3. 大部分都支持各种关系型的数据库的特性：事务、存储过程、触发器、视图、临时表、模式、函数

### 非关系型数据库（NoSQL）

not only sql —— 不使用SQL语句进行数据操作的数据库。

- 典型：Redis、MongoDB、hbase、Hadoop、elasticsearch、图数据库(Neo4j、GraphDB、SequoiaDB)

## Redis 定义与特点

### 定义

- Redis（Remote Dictionary Server，远程字典服务）
- 一个使用ANSI C编写的开源、支持网络、基于内存、可选持久性的键值对存储数据库
- 是NoSQL数据库

### 特性

- 速度快
- 持久化：每次启动，先将文件中数据加载到内存
- 多种数据结构
- 支持多种编程语言
- 主从复制
- 高可用、分布式

### 应用场景

> 缓存系统（"热点"数据：高频读、低频写）：缓存用户信息，优惠券过期时间，验证码过期时间、session、token等
>
> 计数器：帖子的浏览数，视频播放次数，评论次数、点赞次数等
>
> 消息队列，秒杀系统
>
> 社交网络：粉丝、共同好友（可能认识的人），兴趣爱好（推荐商品）
>
> 排行榜（有序集合）
>
> 发布订阅：粉丝关注、消息通知

## Redis CLI 命令行操作

- redis是一款基于CS架构的数据库，所以redis有客户端redis-cli，也有服务端redis-server
- 客户端可以使用go、java、python等编程语言，也可以终端下使用命令行工具管理redis数据库，甚至可以安装一些别人开发的界面工具，例如：RDM

### 连接服务器

```bash
# redis-cli -h `redis服务器ip` -p `redis服务器port`
redis-cli -h 10.16.244.3 -p 6379
```

### 切换数据库

数据库默认有16个，数据名不能自定义，只能是0-15之间。

```powershell
select <数据库ID>
```

## Redis 数据类型

![[139239-20191126141006657-1969131669-20250728214318-05c3fdq.png]]

- redis可以理解成一个全局的大字典，key就是数据的唯一标识符
- 根据key对应的值不同，可以划分成5个基本数据类型

### 1. string（字符串类型）

Redis 中最为基础的数据存储类型，它在 Redis 中是二进制安全的，也就是byte类型。单个数据的最大容量是512M。

```powershell
key: 值
```

### 2. hash（哈希类型）

用于存储对象/字典，对象/字典的结构为键值对。key、域、值的类型都为string。域在同一个hash中是唯一的。

```powershell
key:{
    域（属性）: 值，
    域:值，
    域:值，
    域:值，
    ...
}
```

### 3. list（列表类型）

子成员类型为string。

```powershell
key: [值1，值2, 值3.....]
```

### 4. set（无序集合）

子成员类型为string类型，元素唯一不重复，没有修改操作。

```powershell
key: {值1, 值4, 值3, ...., 值5}
```

### 5. zset（有序集合，sorted set）

子成员值的类型为string类型，元素唯一不重复，没有修改操作。权重值(score,分数)从小到大排列。

```powershell
key: {
    值1 权重值1(数字);
    值2 权重值2;
    值3 权重值3;
    值4 权重值4;
}
```

> 【Tip】redis中的所有数据操作，如果设置的键不存在则为添加，如果设置的键已经存在则修改。

## key 操作命令

### 查找键

```bash
keys *          # 查找所有键
keys user:*     # 查找以 user: 开头的键
```

### 判断键是否存在

```bash
exists name     # 存在返回 1，不存在返回 0
```

### 查看键的数据类型

```bash
type name       # 返回 string/hash/list/set/zset
```

### 删除键

```bash
del name age    # 删除键以及键对应的值，返回删除成功的数量
```

### 查看键的有效期

```bash
ttl name        # -1 表示永不过期，-2 表示已过期或不存在
```

### 设置键的有效期

```bash
expire name 60  # 设置 key 的有效期为 60 秒
```

### 清空数据库

```bash
flushall        # 清空当前数据库中的所有 key，谨慎使用
```

### 重命名键

```bash
rename old_name new_name  # 如果 newkey 已存在则覆盖
```

## string（字符串）操作

### 设置键值

```bash
set key value                           # 设置的数据没有额外操作时，不会过期
mset key1 value1 key2 value2 ...        # 设置多个键值
setnx key value                         # 键不存在时才能设置成功，用于变量只能被设置一次
setex key time value                    # 设置键值的过期时间，以秒为单位
```

### 字符串拼接

```powershell
append key value
```

### 获取键值

```bash
get key                     # 获取键的值
mget key1 key2 ...          # 多个键获取多个值
getset key value            # 设置新值返回旧值，没有旧值返回 nil
```

### 自增自减

```powershell
set key1 value
incr key1       # 相当于 key1 + 1
decr key1       # 相当于 key1 - 1
set key2 value
incrby key2     # 自增自减大于1的值时用 incrby
```

### 获取字符串长度

```powershell
strlen key
```

### 比特流操作

```powershell
SETBIT     # SETBIT key offset value 按从左到右的偏移量设置一个bit数据的值
GETBIT     # 获取一个bit数据的值
BITCOUNT   # 统计字符串被设置为1的bit数
BITPOS     # 返回字符串里面第一个被设置为1或者0的bit位
```

## list（列表）操作

队列，列表的子成员类型为string。

### 添加子成员

```bash
# 在左侧(前)添加一条或多条数据
lpush key value1 value2 ...
# 在右侧(后)添加一条或多条数据
rpush key value1 value2 ...

# 在指定元素的左边(前)/右边（后）插入一个或多个数据
linsert key before 指定元素 value1 value2 ....
linsert key after 指定元素 value1 value2 ....
```

> 【Tip】当列表如果存在多个成员值一致的情况下，默认识别第一个。

### 基于索引获取列表成员

```bash
lindex key index
```

> 【Tip】从左往右，从0开始；从右往左，-1 开始。

### 按索引设置值

```bash
lset key index value
```

### 获取列表的切片

```bash
lrange key start stop
```

### 获取列表的长度

```bash
llen key
```

### 删除指定成员

移除并获取列表的第一个成员或最后一个成员：

```bash
lpop key  # 第一个成员出列
rpop key  # 最后一个成员出列
```

## hash（哈希）操作

专门用于结构化的数据信息，对应 map/结构体。

结构：

```text
键key:{
    域field: 值value,
    域field: 值value,
    域field: 值value,
}
```

### 设置指定键的属性/域

```bash
hset key field value                        # 设置指定键的单个属性
hset key field1 value1 field2 value2 ...    # 设置指定键的多个属性
```

### 获取指定键的域/属性的值

```bash
hkeys key                   # 获取指定键所有的域/属性
hget key field              # 获取指定键的单个域/属性的值
hmget key field1 field2 ... # 获取指定键的多个域/属性的值
hvals key                   # 获取指定键的所有值
```

### 获取hash的所有域值对

```powershell
hgetall key
```

### 删除指定键的域/属性

```bash
hdel key field1 field2 ...
```

### 判断指定属性/域是否存在

```bash
hexists key field
```

### 属性值自增自减

```bash
hincrby key field number    # 按指定数值 number 自增或自减
```

## set（无序集合）操作

重点：去重和无序。

### 添加元素

```bash
sadd key member1 member2 ...
```

### 获取集合的所有的成员

```bash
smembers key
```

### 获取集合的长度

```bash
scard keys
```

### 随机抽取一个或多个元素

抽取出来的成员被删除掉。

```bash
spop key [count=1]
```

> 【Tip】`count`为抽取元素个数，默认为1。被提取成员会从集合中被删除掉。

### 删除指定元素

```bash
srem key value
```

### 交集、差集和并集

```bash
sinter  key1 key2 key3 ....    # 交集，比较多个集合中共同存在的成员
sdiff   key1 key2 key3 ....    # 差集，比较多个集合中不同的成员
sunion  key1 key2 key3 ....    # 并集，合并所有集合的成员，并去重
```

## zset（有序集合）操作

有序集合（score/value），去重并且根据score权重值来进行排序的。score从小到大排列。

### 添加成员

```bash
zadd key score1 member1 score2 member2 score3 member3 ....
```

### 获取score在指定区间的所有成员

```python
zrangebyscore key min max     # 按score进行 从低往高 排序获取 指定score区间
zrevrangebyscore key min max  # 按score进行 从高往低 排序获取 指定score区间
zrange key start stop         # 按score进行 从低往高 排序获取 指定索引区间
zrevrange key start stop      # 按score进行 从高往低 排序获取 指定索引区间
```

### 获取集合长度

```bash
zcard key
```

### 获取指定成员的权重值

```bash
zscore key member
```

### 获取指定成员在集合中的排名

排名从0开始计算。

```bash
zrank key member      # score从小到大的排名
zrevrank key member   # score从大到小的排名
```

### 获取score在指定区间的所有成员数量

```bash
zcount key min max
```

### 给指定成员增加权重值

```bash
zincrby key score member
```

### 删除成员

```bash
zrem key member1 member2 member3 ....
```

### 删除指定数量的成员

```bash
# 删除指定数量的成员，从最低score开始删除
zpopmin key [count]
# 删除指定数量的成员，从最高score开始删除
zpopmax key [count]
```

## 相关笔记

- [[Redis 安装与配置]]：Windows 环境搭建与开机自启
- [[Python Redis 客户端]]：redis-py 操作指南
- [[Python Redis 实战案例]]：缓存、锁、队列与发布订阅
- [[MySQL 数据库基础]]：关系型数据库基础，RDBMS vs NoSQL 对比
- [[数据库开发概览]]：数据库技术全景
