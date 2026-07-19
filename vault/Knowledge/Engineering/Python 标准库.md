---
title: Python 标准库
created: 2026-05-22
tags:
  - Python
  - 标准库
  - 内置函数
type: 极简速记
related:
  - "[[Python-MOC]]"
  - "[[Python 异常处理]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Python 标准库：内置函数与常用模块

> **学习目标**：掌握 Python 内置函数分类速查，以及 datetime/json/hashlib/sys 等常用模块的用法。

## 内置函数速查

### 数据类型转换

| 函数 | 功能 |
|------|------|
| `int()` / `float()` / `str()` / `bool()` | 基本类型转换 |
| `list()` / `tuple()` / `dict()` / `set()` | 容器类型转换 |
| `bytes()` / `bytearray()` | 字节序列 |
| `complex()` / `memoryview()` / `object()` | 其他类型 |

### 数值运算

| 函数 | 功能 |
|------|------|
| `abs(x)` | 绝对值 |
| `divmod(a, b)` | 返回 `(a//b, a%b)` |
| `pow(base, exp)` | 幂运算 |
| `round(float)` | 四舍五入 |
| `sum(iterable)` | 求和 |
| `min()` / `max()` | 最小/最大值 |

### 序列与迭代器

| 函数 | 功能 |
|------|------|
| `len(obj)` | 对象长度 |
| `range()` | 生成整数序列 |
| `enumerate(iterable, start=0)` | 为序列添加索引 |
| `zip(*iterables)` | 打包多个可迭代对象 |
| `map(func, iterable)` | 批量执行函数 |
| `filter(func, iterable)` | 过滤元素 |
| `sorted(iterable, key=, reverse=)` | 排序 |
| `reversed(iterable)` | 反向迭代器 |
| `iter()` / `next()` | 迭代器操作 |
| `slice(start, stop, step)` | 切片对象 |

### 字符串与编码

| 函数 | 功能 |
|------|------|
| `chr(int)` | ASCII 码 → 字符 |
| `ord(c)` | 字符 → Unicode 编码 |
| `bin()` / `oct()` / `hex()` | 进制转换 |
| `format(value)` | 格式化字符串 |
| `repr(obj)` | 对象的官方字符串表示 |
| `ascii(obj)` | ASCII 可打印表示 |

### 逻辑判断与对象属性

| 函数 | 功能 |
|------|------|
| `all(iterable)` | 所有元素为 True |
| `any(iterable)` | 任一元素为 True |
| `callable(obj)` | 是否可调用 |
| `isinstance(obj, cls)` | 类型判断 |
| `issubclass(cls, cls)` | 子类判断 |
| `hasattr()` / `getattr()` / `setattr()` / `delattr()` | 属性操作 |
| `hash(obj)` | 哈希值 |

### 作用域与反射

| 函数 | 功能 |
|------|------|
| `globals()` / `locals()` | 全局/局部作用域字典 |
| `vars(obj)` | 对象属性字典 |
| `dir(obj)` | 属性和方法列表 |
| `type(obj)` | 获取对象类型 |
| `id(obj)` | 内存地址 |

### 代码动态执行

```python
# eval：执行表达式
result = eval("1 + 2 * 3")  # 7

# exec：执行语句
exec("for i in range(3): print(i)")

# compile：编译代码
code = compile("for i in range(10): print(i)", "", "exec")
exec(code)
```

### I/O 与工具

| 函数 | 功能 |
|------|------|
| `print(*objects, sep=' ', end='\n')` | 输出 |
| `input(prompt='')` | 读取输入 |
| `open(file, mode, encoding)` | 打开文件 |
| `help(obj)` | 查看帮助 |

## 常用内置模块

### datetime 日期时间

```python
from datetime import date, time, datetime, timedelta, timezone

datetime.now()                    # 当前本地时间
datetime.now().date()             # 当前年月日
datetime.now().time()             # 当前时分秒
datetime.now(timezone.utc)        # 当前 UTC 时间

# 构建 datetime
dt = datetime(2025, 12, 27, 18, 30, 45)

# datetime → str
dt.isoformat(sep=' ', timespec='seconds')

# str → datetime
datetime.strptime('2025-12-27 18:30:45', '%Y-%m-%d %H:%M:%S')

# 时间运算
tomorrow = datetime.now() + timedelta(days=1)
```

### random 随机数

```python
import random

random.random()              # (0, 1) 随机小数
random.uniform(1, 9)         # 指定范围随机小数
random.randint(1, 9)         # 随机整数（含边界）
random.choice(iterable)      # 从可迭代对象中随机选一个
random.sample(iterable, 2)   # 随机选 2 个
```

### json 序列化

```python
import json

# Python 对象 → JSON 字符串
dic = {"id": 1, "name": "测试"}
s = json.dumps(dic, ensure_ascii=False)

# JSON 字符串 → Python 对象
d = json.loads(s)

# 写入文件
json.dump(dic, open("data.json", "w", encoding="utf-8"), ensure_ascii=False)

# 从文件读取
d = json.load(open("data.json", "r", encoding="utf-8"))
```

**Python 与前端类型映射**：`True→true`、`False→false`、`None→null`

### pickle 序列化

```python
import pickle

# 对象 → 字节
bs = pickle.dumps(lst)

# 字节 → 对象
lst = pickle.loads(bs)

# 写入文件
pickle.dump(dic, open("data.pkl", "wb"))

# 从文件读取
dic = pickle.load(open("data.pkl", "rb"))
```

### hashlib 加密

```python
import hashlib

# MD5 加密
obj = hashlib.md5()
obj.update("666666".encode("utf-8"))
print(obj.hexdigest())  # f379eaf3c831b04de153469d1bec345e

# 加盐（防撞库）
obj = hashlib.md5(b'salt_value')
obj.update("666666".encode("utf-8"))
print(obj.hexdigest())
```

### logging 日志

```python
import logging

# 基础配置
logging.basicConfig(
    filename='app.log',
    format='%(asctime)s - %(name)s - %(levelname)s - %(module)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    level=logging.WARNING
)

# 日志级别
logging.critical("系统崩溃")    # 50
logging.error("程序错误")       # 40
logging.warning("警告信息")     # 30
logging.info("普通消息")        # 20
logging.debug("调试信息")       # 10
```

### sys 解释器相关

```python
import sys

sys.argv       # 命令行参数列表，第一个元素是程序路径
sys.exit(n)    # 退出程序（0 正常，1 错误）
sys.version    # Python 版本信息
sys.path       # 模块搜索路径
sys.platform   # 操作系统平台名称
```

### shutil 文件操作

```python
import shutil

shutil.copyfile("src.txt", "dst.txt")   # 复制文件内容
shutil.copy("src.txt", "dst.txt")       # 复制内容 + 权限
shutil.copy2("src.txt", "dst.txt")      # 复制内容 + 权限 + 修改时间
shutil.copytree("dir1", "dir3")         # 复制文件夹
shutil.rmtree("dir2")                   # 删除文件夹
shutil.move("dir1/a.txt", "dir2")       # 移动文件
```

### zipfile 压缩

```python
import zipfile

# 创建压缩包
with zipfile.ZipFile("abc.zip", "w") as f:
    f.write("x1.txt")
    f.write("x2.txt")

# 解压缩
with zipfile.ZipFile("abc.zip", "r") as f:
    f.extractall("output_dir")
```

### traceback 异常追踪

```python
import traceback

try:
    1 / 0
except:
    print(traceback.format_exc())  # 打印完整异常堆栈
```

## 第三方模块安装

```bash
pip install 模块 -i 国内源
pip install -U pip          # 更新 pip
pip uninstall 模块           # 卸载
pip show 模块                # 显示模块信息
pip list                     # 已安装模块列表
```

## 相关链接

- [[Python 异常处理]] — logging 与异常结合
