---
title: Python Redis 客户端
created: 2026-05-25
tags:
  - Redis
  - Python
  - redis-py
  - 客户端
type: 步骤操作
related:
  - "[[Redis-MOC]]"
  - "[[Redis 核心概念]]"
  - "[[Redis 安装与配置]]"
  - "[[Python Redis 实战案例]]"
reference:
category: ["🛠️ 工程工具", "Redis"]
---

# Python Redis 客户端：redis-py 操作指南

## 安装

```powershell
# conda 方式
conda install redis-py
# 或 pip 方式
pip install redis
```

## 连接 Redis

```python
import redis

# 方式1：直接连接
r = redis.Redis(host='127.0.0.1', port=6379)

# 方式2：连接池
pool = redis.ConnectionPool(host='127.0.0.1', port=6379)
r = redis.Redis(connection_pool=pool)

# 设置键值对
r.set('bar', 'Foo')
print(r.get('bar'))
```

通常情况下，当需要做redis操作时，会创建一个连接，并基于这个连接进行redis操作，操作完成后释放连接。一般情况下这是没问题的，但当并发量比较高的时候，频繁的连接创建和释放对性能会有较高的影响。于是，连接池就发挥作用了。

连接池的原理是，通过预先创建多个连接，当进行redis操作时，直接获取已经创建的连接进行操作，而且操作完成后不会释放，用于后续的其他redis操作。这样就达到了避免频繁的redis连接创建和释放的目的，从而提高性能。

## 数据类型操作

```python
import redis

pool = redis.ConnectionPool(host='127.0.0.1', port=6379, db=0, decode_responses=True)
r = redis.Redis(connection_pool=pool)
```

### string（字符串）操作

```python
# 不允许对已经存在的键设置值
r.set('name', 'yy')
ret = r.setnx("name", "yuan")
print(ret)  # False

# 设置键有效期
r.setex("good_1001", 5, "2")
print(r.get("good_1001"))  # 2
time.sleep(5)
print(r.get("good_1001"))  # None

# 自增自减
r.set("age", 20)
r.incrby("age", 2)
print(r.get("age"))  # b'22'
```

### hash（哈希）操作

```python
# 设置单个属性
r.hset("info", "name", "rain")
print(r.hget("info", "name"))

# 设置多个属性
r.hset("info", mapping={"gedner": "male", "age": 22})
print(r.hgetall("info"))  # {b'name': b'rain', b'gedner': b'male', b'age': b'22'}
```

### list（列表）操作

```python
# 设置list
r.rpush("scores", "100", "90", "80")
r.rpush("scores", "70")   # 在右侧添加数据
r.lpush("scores", "120")  # 在左侧添加数据
print(r.lrange("scores", 0, -1))  # ['120', '100', '90', '80', '70']

r.linsert("scores", "AFTER", "100", 95)
print(r.lrange("scores", 0, -1))  # ['120', '100', '95', '90', '80', '70']

print(r.lpop("scores"))   # 120, 第一个元素弹出
print(r.rpop("scores"))   # 70, 最后一个元素弹出
print(r.lindex("scores", 1))  # '95', 基于索引获取元素
```

### set（集合）操作

```python
# key对应的集合中添加元素
r.sadd("name_set", "zhangsan", "lisi", "wangwu")

# 获取key对应的集合的所有成员
print(r.smembers("name_set"))  # {'lisi', 'zhangsan', 'wangwu'}

# 从key对应的集合中随机获取 numbers 个元素
print(r.srandmember("name_set", 2))

r.srem("name_set", "lisi")  # 删除key对应的集合中的元素
print(r.smembers("name_set"))  # {'wangwu', 'zhangsan'}
```

### zset（有序集合）操作

```python
# 在key对应的有序集合中添加元素
r.zadd("jifenbang", {"yuan": 78, "rain": 20, "alvin": 89, "eric": 45})

# 按照索引范围获取key对应的有序集合的元素
# zrange( name, start, end, desc=False, withscores=False, score_cast_func=float)
print(r.zrange("jifenbang", 0, -1))  # ['rain', 'eric', 'yuan', 'alvin']
print(r.zrange("jifenbang", 0, -1, withscores=True))
# [(b'rain', 20.0), (b'eric', 45.0), (b'yuan', 78.0), (b'alvin', 89.0)]

print(r.zrevrange("jifenbang", 0, -1, withscores=True))
# [(b'alvin', 89.0), (b'yuan', 78.0), (b'eric', 45.0), (b'rain', 20.0)]

print(r.zrangebyscore("jifenbang", 0, 100))
# [b'rain', b'eric', b'yuan', b'alvin']

print(r.zrangebyscore("jifenbang", 0, 100, start=0, num=1))
# [b'rain']

# 删除key对应的有序集合中值是values的成员
print(r.zrem("jifenbang", "yuan"))  # 删除成功返回1
print(r.zrange("jifenbang", 0, -1))  # ['rain', 'eric', 'alvin']
```

## 键操作 Python API

```python
r.delete("scores")              # 删除键
print(r.exists("scores"))       # 不存在 0，存在 1
print(r.keys("*"))              # 查找所有键
print(r.type("name"))           # 查看键的数据类型
print(r.ttl("name"))            # 查看键的有效期，-1永不过期，-2已过期
r.expire("name", 10)            # 设置键的过期时间
r.rename("name", "new_name")    # 重命名键
# r.flushall()                  # 清空所有key，谨慎使用
```

## 相关笔记

- [[Redis 核心概念]]：数据类型与基础操作
- [[Redis 安装与配置]]：Windows 环境搭建
- [[Python Redis 实战案例]]：缓存、锁、队列与发布订阅
