---
title: Python 函数基础
created: 2026-05-22
tags:
  - Python
  - 函数式编程
  - lambda
  - 闭包
  - 递归
  - 高阶函数
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 装饰器]]"
  - "[[Python 函数入门]]"
  - "[[Python 数据结构]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Python 函数式编程：函数机制、闭包、lambda 与高阶函数

> **学习目标**：掌握函数的核心机制、作用域与闭包、lambda 匿名函数、递归算法、map/filter/reduce 高阶函数。

---

## 1 函数核心机制

### 1.1 函数定义与调用

```python
def 函数名(参数):
    函数体
    return 返回值

函数名(参数)  # 调用
```

### 1.2 参数详解

```python
# 位置参数
def func(a, b): pass

# 关键字参数
func(a=1, b=2)

# 默认参数
def func(a, b=10): pass

# 可变位置参数（打包为元组）
def func(*args):
    for arg in args:
        print(arg)
func(1, 2, 3)

# 可变关键字参数（打包为字典）
def func(**kwargs):
    for k, v in kwargs.items():
        print(f"{k}: {v}")
func(name="Alice", age=25)

# 混合使用（顺序：普通, *args, 默认, **kwargs）
def func(a, *args, b=20, **kwargs): pass
```

### 1.3 返回值

```python
def calc(a, b):
    return a + b, a - b  # 返回元组

result = calc(10, 3)  # (13, 7)
x, y = calc(10, 3)    # 解包
```

### 1.4 函数文档

```python
def func():
    """这是文档字符串"""
    pass

func.__doc__   # 查看文档
help(func)     # 查看帮助
```

---

## 2 作用域

```python
# 全局变量
x = 10

def func():
    y = 20       # 局部变量
    print(x)     # 可读取全局变量

# 修改全局变量需要 global 声明
def func():
    global x
    x = 100

# 闭包中修改外层变量需要 nonlocal 声明
def outer():
    a = 10
    def inner():
        nonlocal a
        a += 1
        print(a)
    return inner
```

---

## 3 高阶函数

### 3.1 递归

递归的本质：函数自己调用自己。必须有终止条件。

```python
# 阶乘
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
```

**递归遍历文件夹**：

```python
import os

def read(path, level):
    lst = os.listdir(path)
    for name in lst:
        real_path = os.path.join(path, name)
        if os.path.isdir(real_path):
            print("----" * level, name)
            read(real_path, level + 1)
        else:
            print("----" * level, name)
```

**二分查找（递归版）**：

```python
def binary_search(lst, target, left, right):
    if left > right:
        return -1
    mid = (left + right) // 2
    if target > lst[mid]:
        return binary_search(lst, target, mid + 1, right)
    elif target < lst[mid]:
        return binary_search(lst, target, left, mid - 1)
    return mid

lst = [11, 25, 46, 78, 99, 265]
print(binary_search(lst, 78, 0, len(lst) - 1))  # 3
```

**汉诺塔**：

```python
def hanoi(n, a, b, c):
    if n > 0:
        hanoi(n - 1, a, c, b)
        print(f"{a} → {c}")
        hanoi(n - 1, b, a, c)

hanoi(3, "A", "B", "C")
```

### 3.2 lambda 匿名函数

```python
# 基本语法：lambda 参数: 表达式
square = lambda x: x ** 2
print(square(5))  # 25

# 带默认参数
fn = lambda a, b, c=100: a + b + c
print(fn(10, 20))  # 130

# 带条件（三元表达式）
fn = lambda a, b: a if a > b else b
print(fn(10, 20))  # 20

# 排序场景
students = [{"name": "Tom", "age": 20}, {"name": "Rose", "age": 19}]
students.sort(key=lambda x: x["age"])
```

### 3.3 map / filter / reduce

```python
# map(函数, 可迭代对象)：对每个元素应用函数
nums = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x ** 2, nums))  # [1, 4, 9, 16, 25]

# filter(函数, 可迭代对象)：过滤，返回 True 的保留
evens = list(filter(lambda x: x % 2 == 0, nums))  # [2, 4]

# reduce(函数, 可迭代对象)：累积计算，归约为单个值
from functools import reduce
total = reduce(lambda a, b: a + b, nums)  # 15
max_val = reduce(lambda a, b: a if a > b else b, nums)  # 5
```

**vs 推导式**：功能等价，推导式通常更 Pythonic。

---

## 4 函数是一等对象

函数名是变量，存放函数的内存地址。

```python
# 函数可以赋值
a = func

# 函数可以作为参数传递
def handle(fn):
    fn()

# 函数可以作为返回值
def outer():
    def inner():
        print("inner")
    return inner

# 函数可以存储在容器中
funcs = [func1, func2, func3]
```

---

## 5 闭包

**条件**：嵌套 + 引用外层变量 + 返回内层函数名。

**作用**：保存外部变量（外界只能访问不能直接修改），让变量常驻内存。

```python
def func(a):
    def inner(b):
        return a + b
    return inner

fn = func(10)
print(fn(1))   # 11
print(fn(5))   # 15
```

---

## 相关链接

- [[Python 装饰器]] — 闭包的高级应用
- [[Python 函数入门]] — 函数入门速查
- [[Python 数据结构]] — 推导式 vs map/filter
