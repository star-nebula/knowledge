---
title: Python 模块与包
created: 2026-05-22
tags:
  - Python
  - 模块
  - 包管理
  - import
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 标准库]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Python 模块与包：导入机制与自定义模块

> **学习目标**：理解模块导入过程，掌握自定义模块、包结构、相对/绝对导入的用法。

## 模块基础

Python 模块（Module）是一个 `.py` 文件，包含 Python 对象定义和语句。模块分为**内置模块**和**自定义模块**。

```python
import os       # => os.py
import time     # => time.py
import random   # => random.py
```

## 模块的导入和使用

### import 导入

```python
import 模块名称
import 模块名称1, 模块名称2
import 模块名称 as 自定义别名

# 调用
模块名称.功能名()
```

### from-import 导入

```python
from 模块名称 import 功能名
from 模块名称 import 功能名 as 别名
from 模块名称 import 功能名1, 功能名2
from 模块名称 import *  # 导入所有功能（不推荐）

# 调用
功能名()
```

## 模块导入过程

导入模块时，Python 解释器会：

1. 通过 `sys.modules` 检查是否已导入（已导入则不再重复导入）
2. 为模块创建新的**名称空间**（独立内存）
3. 在新名称空间中执行模块代码
4. 创建模块名称作为当前模块中的引用

**导入顺序**：内置模块 → 第三方模块 → 自定义模块

```python
import sys
print(sys.path)  # 模块搜索路径
```

## 自定义模块

### 基本用法

```python
# master.py
def func():
    print('我是master')

name = "大佬"
```

```python
# main.py
import master
master.func()       # 输出：我是master
print(master.name)  # 输出：大佬
```

> 导入模块时会先执行被导入模块的代码，再执行当前模块的代码。

### 程序入口：`__name__`

每个 `.py` 文件都有内置变量 `__name__`：
- 直接运行时值为 `"__main__"`
- 作为模块被导入时值为模块名

```python
# master.py
def func():
    print('我是master')

if __name__ == '__main__':  # 仅直接运行时执行
    func()
    print("测试代码")
```

```python
# main.py
import master  # 不会执行 func() 和 print
```

## 包（Package）

包是多个 `.py` 文件放在一个文件夹中的组织方式。

### 包结构示例

```
glance/
├── __init__.py
├── api/
│   ├── __init__.py
│   ├── policy.py
│   └── versions.py
├── cmd/
│   ├── __init__.py
│   └── manage.py
└── db/
    ├── __init__.py
    └── models.py
```

### 导入方式

```python
# 方式 1：导入整个包（执行 __init__.py）
import glance

# 方式 2：导入具体模块
import glance.api.policy
glance.api.policy.get()

# 方式 3：推荐写法
from glance.api import policy
policy.get()

# 方式 4：导入标准库的写法
from urllib.request import Request
```

### 绝对导入 vs 相对导入

```python
# 绝对导入（推荐）：绝对于整个包的位置
from glance.cmd import manage

# 相对导入：相对于当前文件位置
from . import module       # 当前包
from ..cmd import manage   # 上一层包
```

**最佳实践**：
1. 优先使用绝对导入
2. 尽量在包外面启动程序

## 相关链接

- [[Python 标准库]] — 内置模块参考
