---
title: Python Socket 编程
created: 2026-05-22
tags:
  - Python
  - Socket
  - TCP
  - UDP
  - 网络编程
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 异常处理]]"
  - "[[Python 标准库]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Python Socket 编程：TCP/UDP 通信与粘包处理

> **学习目标**：理解 TCP/UDP 协议原理，掌握 Socket 服务端/客户端编程，解决粘包问题。

---

## 1 网络基础

### 1.1 软件架构

| 架构 | 说明 | 示例 |
|------|------|------|
| **CS（Client/Server）** | 客户端 + 服务器，需安装专用软件 | QQ、钉钉、百度网盘 |
| **BS（Browser/Server）** | 浏览器 + 服务器，无需安装 | 淘宝、京东、所有网站 |

BS 是特殊的 CS——客户端固定为浏览器，通过 HTTP 协议通信。

### 1.2 网络三要素

| 要素 | 说明 |
|------|------|
| **地址（IP）** | 唯一标识网络中的设备。IPv4：4 字节十进制（如 `192.168.1.1`），IPv6：16 字节十六进制 |
| **端口（Port）** | 标识设备上的应用程序。16 位数字，范围 0~65535。0~1023 为知名端口（HTTP=80，HTTPS=443） |
| **协议（Protocol）** | 数据传输的规则约定。常见：TCP、UDP、HTTP、IP |

特殊 IP：`127.0.0.1`（本机）、`255.255.255.255`（广播地址）

---

## 2 TCP 与 UDP 协议

| 特性 | TCP | UDP |
|------|-----|-----|
| 连接方式 | 面向连接（三次握手） | 无连接 |
| 传输方式 | 字节流（IO 流），理论无大小限制 | 数据报包，每包 ≤ 64KB |
| 可靠性 | 可靠（有确认机制） | 不可靠（无确认） |
| 效率 | 相对较低 | 相对较高 |
| 角色 | 区分客户端/服务端 | 区分发送端/接收端 |
| 类比 | 打电话 | 群聊 |
| 适用场景 | 文件传输、网页请求 | 视频通话、语音聊天 |

### 2.1 TCP 三次握手（建立连接）

```
客户端                          服务端
  |--- SYN (Seq=1000) --------->|   [1] 客户端发起连接请求
  |<-- SYN+ACK (Seq=2000,       |   [2] 服务端确认并回复
  |    Ack=1001) ----------------|
  |--- ACK (Ack=2001) --------->|   [3] 客户端确认，连接建立
  |          ESTABLISHED         |      ESTABLISHED
```

**关键**：通过"确认号 Ack = Seq + 1"验证对方收到了数据包。

### 2.2 TCP 四次挥手（断开连接）

```
客户端                          服务端
  |--- FIN --------------------->|   [1] 客户端请求断开
  |<-- ACK ----------------------|   [2] 服务端确认（此方向关闭）
  |<-- FIN ----------------------|   [3] 服务端请求断开
  |--- ACK --------------------->|   [4] 客户端确认，连接关闭
```

---

## 3 Socket 编程

Socket（套接字）是应用层与传输层之间的**抽象层**，将 TCP/IP 复杂操作抽象为简单接口。

### 3.1 套接字类型

| 类型 | 常量 | 协议 | 特点 |
|------|------|------|------|
| 流格式套接字 | `SOCK_STREAM` | TCP | 可靠、有序、无消息边界 |
| 数据报套接字 | `SOCK_DGRAM` | UDP | 不可靠、保留消息边界、速度快 |

### 3.2 socket.socket() 参数

```python
socket.socket(family=AF_INET, type=SOCK_STREAM, proto=0, fileno=None)
```

| 参数 | 说明 |
|------|------|
| `family` | 地址族：`AF_INET`（IPv4）、`AF_INET6`（IPv6）、`AF_UNIX`（本地通信） |
| `type` | 套接字类型：`SOCK_STREAM`（TCP）、`SOCK_DGRAM`（UDP）、`SOCK_RAW`（原始） |
| `proto` | 协议号，通常为 0（默认） |
| `fileno` | 文件描述符，一般不使用 |

---

## 4 TCP 编程实战

### 4.1 基本服务端

```python
import socket

# (1) 创建 TCP 服务端套接字
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# (2) 绑定地址和端口
sock.bind(("127.0.0.1", 8899))
# (3) 监听，最大排队数 5
sock.listen(5)
print("服务器启动，等待连接...")

while True:
    # (4) 阻塞等待客户端连接
    conn, addr = sock.accept()
    print(f"客户端 {addr} 已连接")

    while True:
        # (5) 接收数据（阻塞，最多 1024 字节）
        data_bytes = conn.recv(1024)
        if not data_bytes or data_bytes == b"quit":
            print(f"客户端 {addr} 断开")
            break
        # (6) 处理并回复
        response = data_bytes.decode().upper()
        conn.send(response.encode())
```

### 4.2 基本客户端

```python
import socket

# (1) 创建客户端套接字
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# (2) 连接服务器
sock.connect(("127.0.0.1", 8899))

while True:
    msg = input("请输入（quit 退出）: ")
    sock.send(msg.encode())
    if msg == "quit":
        break
    # (3) 接收响应
    response = sock.recv(1024)
    print("服务器回复:", response.decode())
```

---

## 5 粘包问题

### 5.1 什么是粘包

TCP 是**字节流**协议，不保留消息边界。当发送端连续快速发送多个数据包时，TCP 可能将它们合并成一个大数据块传输，接收端无法区分原始消息边界。

**场景**：客户端连续 `send` 3 次 `"hello"`，服务端一次 `recv(1024)` 可能收到 `"hellohellohello"`。

### 5.2 解决方案：struct 打包长度头

发送前先发 4 字节的**长度头**（用 `struct.pack`），接收端先读 4 字节获取长度，再按长度精确读取。

**服务端**：

```python
import socket
import subprocess
import struct

sock = socket.socket()
sock.bind(("127.0.0.1", 6666))
sock.listen(5)

while True:
    conn, addr = sock.accept()
    while True:
        cmd = conn.recv(1024)
        if not cmd:
            break
        # 执行命令并获取结果
        result = subprocess.getoutput(cmd.decode("utf-8")).encode("utf-8")
        # 先发 4 字节长度头，再发数据
        conn.sendall(struct.pack("i", len(result)))
        conn.sendall(result)
```

**客户端**：

```python
import socket
import struct

sock = socket.socket()
sock.connect(("127.0.0.1", 6666))

while True:
    cmd = input("输入命令（quit 退出）: ")
    sock.send(cmd.encode())
    if cmd == "quit":
        break
    # 先读 4 字节长度头
    length_bytes = sock.recv(4)
    length = struct.unpack("i", length_bytes)[0]
    # 按长度精确读取
    received = 0
    data = b""
    while received < length:
        chunk = sock.recv(1024)
        data += chunk
        received += len(chunk)
    print(data.decode("utf-8"))
```

---

## 6 文件传输案例

### 6.1 客户端上传文件

```python
import json
import os
import socket
import struct

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect(("127.0.0.1", 8899))

while True:
    local_path = input("输入文件路径（quit 退出）: ")
    if local_path == "quit":
        break
    # (1) 发送文件元信息（JSON）
    params = {
        "file_name": os.path.basename(local_path),
        "file_size": os.path.getsize(local_path)
    }
    data = json.dumps(params).encode()
    sock.send(struct.pack("i", len(data)))
    sock.send(data)
    # (2) 发送文件数据
    with open(local_path, "rb") as f:
        for chunk in f:
            sock.send(chunk)
    print("上传成功！")
```

### 6.2 服务端接收文件

```python
import json
import socket
import struct

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.bind(("127.0.0.1", 8899))
sock.listen(5)

while True:
    conn, addr = sock.accept()
    # (1) 接收元信息长度
    header = conn.recv(4)
    header_len = struct.unpack("i", header)[0]
    # (2) 接收元信息
    params = json.loads(conn.recv(header_len).decode())
    file_name = params["file_name"]
    file_size = params["file_size"]
    # (3) 循环接收文件数据
    with open(f"./uploads/{file_name}", "wb") as f:
        received = 0
        while received < file_size:
            chunk = conn.recv(1024)
            f.write(chunk)
            received += len(chunk)
    print(f"文件 {file_name} 接收完成！")
```

---

## 7 FTP 扩展：OOP + 进度条 + MD5 校验

```python
# 服务端核心（面向对象 + 多线程 + MD5 校验）
import json, socket, struct, threading, os
from hashlib import md5
from loguru import logger

class FTPServer:
    def __init__(self, host="127.0.0.1", port=8888):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.bind((host, port))
        self.sock.listen(5)

    def run(self):
        logger.info("FTP 服务器启动")
        while True:
            conn, addr = self.sock.accept()
            logger.info(f"客户端 {addr} 已连接")
            threading.Thread(target=self._handle, args=(conn,)).start()

    def _handle(self, conn):
        while True:
            header = conn.recv(4)
            if not header:
                break
            header_len = struct.unpack("i", header)[0]
            params = json.loads(conn.recv(header_len).decode())
            cmd = params.get("cmd")
            if hasattr(self, cmd):
                getattr(self, cmd)(conn, params)

    def put(self, conn, params):
        """接收文件上传，含 MD5 校验"""
        file_name = params["file_name"]
        file_size = params["file_size"]
        md5_obj = md5()
        os.makedirs("./uploads", exist_ok=True)
        with open(f"./uploads/{file_name}", "wb") as f:
            received = 0
            while received < file_size:
                chunk = conn.recv(1024)
                f.write(chunk)
                md5_obj.update(chunk)
                received += len(chunk)
        # 校验 MD5
        client_md5 = conn.recv(1024).decode()
        if client_md5 == md5_obj.hexdigest():
            logger.info(f"文件 {file_name} 上传成功，MD5 校验通过")
        else:
            logger.warning(f"文件 {file_name} MD5 校验失败")

    def get(self, conn, params):
        """发送文件下载"""
        file_name = params["file_name"]
        local_path = f"./uploads/{file_name}"
        if not os.path.isfile(local_path):
            data = json.dumps({"is_file": False}).encode()
            conn.send(struct.pack("i", len(data)) + data)
            return
        file_size = os.path.getsize(local_path)
        data = json.dumps({"is_file": True, "file_name": file_name, "file_size": file_size}).encode()
        conn.send(struct.pack("i", len(data)) + data)
        with open(local_path, "rb") as f:
            for chunk in f:
                conn.send(chunk)

if __name__ == "__main__":
    FTPServer().run()
```

---

## 相关链接

- [[Python 异常处理]] — 网络异常处理
- [[Python 标准库]] — struct/json/hashlib 模块
