---
title: Python 函数入门
created: 2026-05-22
tags:
  - Python
  - 函数
  - 参数
  - 作用域
  - 闭包
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 基础语法]]"
  - "[[Python 数据结构]]"
  - "[[Python 函数基础]]"
  - "[[Python 类入门]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---
# Python 函数入门：定义、参数、作用域与闭包

> **学习目标**：掌握函数定义与参数类型、作用域规则、闭包。

## 函数
### 1.1 函数定义

```python
def 函数名(参数):
    """文档字符串（可选）"""
    函数体
    return 返回值
```

```python
def greet(name):
    """向指定用户打招呼"""
    return f"Hello, {name}!"
```

### 1.2 参数类型

```python
# 位置参数
def func(a, b):
    pass

# 关键字参数
func(a=1, b=2)

# 默认参数
def func(a, b=10):
    pass

# *args：接收任意数量的位置参数，打包为元组
def func(*args):
    for arg in args:
        print(arg)
func(1, 2, 3, "hello")

# **kwargs：接收任意数量的关键字参数，打包为字典
def func(**kwargs):
    for k, v in kwargs.items():
        print(f"{k}: {v}")
func(name="Alice", age=25, city="Beijing")

# 混合使用（顺序：普通参数, *args, 默认参数, **kwargs）
def func(a, *args, b=20, **kwargs):
    pass
func(1, 2, 3, b=20, x=99)
```

### 1.3 返回值

```python
# 返回单个值
def add(a, b):
    return a + b

# 返回多个值（实际返回元组）
def calc(a, b):
    return a + b, a - b, a * b

# 没有 return 的函数，默认返回 None
def greet():
    print("hi")
```

### 1.4 文档字符串

```python
def func():
    """这是文档字符串"""
    pass

# 通过 __doc__ 查看
print(func.__doc__)

# 通过 help() 查看
help(func)
```

### 1.5 作用域

```python
# 全局变量
x = 10

def func():
    y = 20       # 局部变量，函数外不可见
    print(x)     # 可以读取全局变量

# 如果需要在函数内修改全局变量，用 global
def func():
    global x
    x = 100
```

### 1.6 闭包

```python
def outer():
    name = "alice"
    def inner():
        print(name)  # 引用外部函数的变量
    return inner

fn = outer()
fn()  # 输出: alice
```

### 1.7 嵌套函数的可变参数陷阱

```python
# ❌ 错误：默认参数是可变对象，会被所有调用共享
def append_to(element, to=[]):
    to.append(element)
    return to

append_to(1)  # [1]
append_to(2)  # [1, 2]（意外！）

# ✅ 正确：用 None 作为默认值
def append_to(element, to=None):
    if to is None:
        to = []
    to.append(element)
    return to
```

### 1.8 匿名函数 lambda

```python
# lambda 参数: 表达式
square = lambda x: x ** 2
print(square(5))  # 25

# 常用于排序的 key 参数
students = [("Alice", 85), ("Bob", 92), ("Charlie", 78)]
students.sort(key=lambda s: s[1], reverse=True)
```

---


## 相关链接

- [[Python 函数基础]] — 函数式编程进阶：高阶函数、lambda、递归
- [[Python 类入门]] — 类与 OOP 入门
- [[Python 装饰器]] — 闭包的高级应用
