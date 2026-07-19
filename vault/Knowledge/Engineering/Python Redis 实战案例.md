---
title: Python Redis 实战案例
created: 2026-05-25
tags:
  - Redis
  - Python
  - 实战
  - 缓存
  - 分布式锁
  - 消息队列
type: 步骤操作
related:
  - "[[Redis-MOC]]"
  - "[[Redis 核心概念]]"
  - "[[Redis 安装与配置]]"
  - "[[Python Redis 客户端]]"
reference:
category: ["🛠️ 工程工具", "Redis"]
---

# Python Redis 实战案例：缓存、锁、队列与发布订阅

## 案例1：KV 缓存

![[assets/srchttp3A2F2Ffilescdn.proginn.com2F85891f3fb0eba3d2abd96f2558d709012Fdf95fabf1eba4716abaedd0a1e683bb2.webpreferhttp3A2F2Ffilescdn.proginn-20250728214318-cc57xn5.png]]

用Redis来缓存用户信息、会话信息、商品信息等等。

```python
import redis

pool = redis.ConnectionPool(host='127.0.0.1', port=6379, db=6, decode_responses=True)
r = redis.Redis(connection_pool=pool)

def get_user(user_id):
    user = r.get(user_id)
    if not user:
        user = UserInfo.objects.get(pk=user_id)
        r.setex(user_id, 3600, user)

    return user

# 有user_id就返回，没的话就自动创建一个
```

**场景说明**：缓存高频读取、低频写入的"热点"数据，如用户信息、会话token等。先查缓存，缓存未命中再查数据库并回写缓存。

**注意事项**：需设置合理的过期时间，避免缓存雪崩和缓存穿透。

## 案例2：分布式锁

分布式锁：控制分布式系统不同进程共同访问共享资源的一种锁的实现。

如果不同的系统或同一个系统的不同主机之间共享了某个临界资源，往往需要互斥来防止彼此干扰，以保证一致性。

SETNX 是 SET IF NOT EXISTS 的简写。命令格式是 `SETNX key value`，如果 key 不存在，则 SETNX 成功返回1，如果这个 key 已经存在了，则返回0。

> 假设某电商网站的某商品做秒杀活动，key可以设置为key_resource_id，value设置任意值。

### 方案1：SETNX + EXPIRE（非原子）

```python
import redis

pool = redis.ConnectionPool(host='127.0.0.1')
r = redis.Redis(connection_pool=pool)
ret = r.setnx("key_resource_id", "ok")
if ret:
    r.expire("key_resource_id", 5)  # 设置过期时间
    print("抢购成功！")
    r.delete("key_resource_id")     # 释放资源
else:
    print("抢购失败！")
```

**问题**：`setnx`和`expire`两个命令分开了，「不是原子操作」。如果执行完`setnx`加锁，正要执行`expire`设置过期时间时，进程crash或者要重启维护了，那么这个锁就"长生不老"了，「别的线程永远获取不到锁」。

### 方案2：SETNX + value值是(系统时间+过期时间)

为了解决方案一「发生异常锁得不到释放的场景」，可以把过期时间放到`setnx`的`value`值里面。如果加锁失败，再拿出`value`值校验一下即可。

```python
import time

def foo():
    expiresTime = time.time() + 10
    ret = r.setnx("key_resource_id", expiresTime)
    if ret:
        print("当前锁不存在，加锁成功")
        return True

    oldExpiresTime = r.get("key_resource_id")
    if float(oldExpiresTime) < time.time():  # 如果获取到的过期时间，小于系统当前时间，表示已经过期
        # 锁已过期，获取上一个锁的过期时间，并设置现在锁的过期时间
        newExpiresTime = r.getset("key_resource_id", expiresTime)
        if oldExpiresTime == newExpiresTime:
            # 考虑多线程并发的情况，只有一个线程的设置值和当前值相同，它才可以加锁
            return True  # 加锁成功

    return False  # 其余情况加锁皆失败

foo()
```

### 方案3：SET NX EX（原子操作）

使用Python的`redis`模块中的`set`函数来保证原子性（包含`setnx`和`expire`两条指令）：

```python
r.set("key_resource_id", "1", nx=True, ex=10)
```

**场景说明**：秒杀、抢购等需要互斥访问共享资源的场景。

**注意事项**：推荐使用方案3的原子操作，避免死锁。锁必须设置过期时间，业务完成后主动释放。

## 案例3：定时任务

利用 Redis 实现订单30分钟自动取消。

用户下单之后，在规定时间内如果不完成付款，订单自动取消，并且释放库存。使用技术：Redis键空间通知（过期回调）。用户下单之后将订单id作为key，任意值作为值存入redis中，给这条数据设置过期时间，也就是订单超时的时间，启用键空间通知。

开启过期key监听：

```python
from redis import StrictRedis

redis = StrictRedis(host='localhost', port=6379)

# 监听所有事件
# pubsub = redis.pubsub()
# pubsub.psubscribe('__keyspace@0__:*')
#
# print('Starting message loop')
# while True:
#     message = pubsub.get_message()
#     if message:
#         print(message)

# 监听过期key
def event_handler(msg):
    print("sss", msg)
    thread.stop()

pubsub = redis.pubsub()
pubsub.psubscribe(**{'__keyevent@0__:expired': event_handler})
thread = pubsub.run_in_thread(sleep_time=0.01)
```

**场景说明**：订单超时自动取消、优惠券过期处理、验证码过期清理等。

**注意事项**：需要开启 Redis 的 `notify-keyspace-events` 配置（默认关闭），建议设置为 `Ex`。

## 案例4：延迟队列

可以通过Redis的`zset`(有序列表)来实现。

将消息序列化为一个字符串作为`zset`的值。这个消息的到期时间处理时间作为`score`，然后用多个线程轮询`zset`获取到期的任务进行处理，多线程时为了保障可用性，万一挂了一个线程还有其他线程可以继续处理。因为有多个线程，所以需要考虑并发争抢任务，确保任务不能被多次执行。

![[assets/20200513191721238606-16509537356372-20250728214318-bmbkk2n.png]]

```python
import redis
import uuid
import time
import threading

pool = redis.ConnectionPool(host='127.0.0.1', port=6379, db=3, decode_responses=True)
r = redis.Redis(connection_pool=pool)

def delayTask(name, delayTime):
    """ 延迟任务 """
    task_id = str(uuid.uuid4())  # uuid 生成任务id
    processTime = time.time() + delayTime  # 延迟时间
    r.zadd("delay-queue", {name + task_id: processTime})

def loop():
    """ 循环处理任务 """
    while 1:
        task_list = r.zrangebyscore("delay-queue", 0, time.time(), 0, 1)  # 获取当前时间之前的任务
        if not task_list:
            print(f"cost 1 秒")
            time.sleep(1)
            continue
        task_id = task_list[0]
        success = r.zrem("delay-queue", task_id)
        if success:
            handleTask(task_id)

def handleTask(task_id):
    """消息处理逻辑"""
    print(f"任务{task_id}执行完毕！")

t = threading.Thread(target=loop)  # 创建线程
t.start()

delayTask("任务一", 5)
delayTask("任务二", 2)
delayTask("任务三", 4)
delayTask("任务四", 10)
```

**场景说明**：定时推送通知、延迟重试、定时任务调度等。

**注意事项**：多线程轮询时通过 `zrem` 的返回值判断是否成功获取任务，避免重复执行。生产环境建议使用 Redisson 或专业消息队列。

## 案例5：发布订阅

```bash
# redis 操作
subscribe channel      # 订阅
publish channel mes    # 发布消息
```

### 生产者

```python
import redis

r = redis.Redis(host='127.0.0.1')
r.publish("room_101", "hello rain")
```

### 消费者（基础版）

```python
import redis

r = redis.Redis(host='127.0.0.1')
pub = r.pubsub()            # pubsub 订阅者
pub.subscribe("room_101")   # 订阅频道，监听指定键
pub.parse_response()        # 将返回订阅确认消息
while 1:
    print("waiting...")
    res_msg = pub.parse_response()
    print("msg", res_msg)
```

> `pub.subscribe("room_101")` Redis 会立即向客户端返回一条订阅确认消息。在循环前手动调用一次，丢掉这条系统消息。后续循环里拿到的才真正是频道内发布的消息。

### 消费者（多线程版）

```python
import threading
import redis

def recv_msg():
    pub = r.pubsub()
    pub.subscribe("room_101")
    pub.parse_response()
    while 1:
        msg = pub.parse_response()
        print(msg)
        print(">>>")

def send_msg():
    msg = input(">>>")
    r.publish("room_101", msg)

r = redis.Redis(host='127.0.0.1')
t = threading.Thread(target=send_msg)
t.start()
recv_msg()
```

**场景说明**：实时消息推送、聊天室、粉丝关注通知、系统广播等。

**注意事项**：Redis 发布订阅是"即发即忘"模式，消息不会持久化，订阅者离线期间的消息会丢失。对可靠性要求高的场景建议使用 Kafka 或 RabbitMQ。

## 相关笔记

- [[Redis 核心概念]]：数据类型与基础操作
- [[Redis 安装与配置]]：Windows 环境搭建
- [[Python Redis 客户端]]：redis-py 操作指南
