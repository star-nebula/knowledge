---
title: Python 装饰器
created: 2026-05-22
tags:
  - Python
  - 装饰器
  - 闭包
  - 语法糖
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 函数基础]]"
  - "[[Python 面向对象编程]]"
  - "[[Python 注册表模式]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Python 装饰器：闭包、语法糖与高级用法

> **学习目标**：理解装饰器的闭包本质，掌握四种被装饰场景、多装饰器叠加、带参数装饰器。

---

## 1 装饰器基础

**作用**：在不修改原有函数代码的基础上，给函数增加新功能。

**本质**：闭包函数。

**四个前提条件**：
1. 有嵌套：函数里再定义函数
2. 有引用：内部函数使用外部函数的变量
3. 有返回：外部函数返回内部函数名
4. 有额外功能

```python
# 装饰器模板
def 装饰器函数名(被装饰函数名):
    def 内部函数(*args, **kwargs):
        # 前置额外功能
        result = 被装饰函数名(*args, **kwargs)
        # 后置额外功能
        return result
    return 内部函数

# 使用方式一：传统写法
原有函数名 = 装饰器名(原有函数名)

# 使用方式二：语法糖（推荐）
@装饰器名
def 原函数():
    pass
```

---

## 2 四种被装饰场景

### 2.1 无参无返回

```python
def wrapper(fn):
    def inner():
        print("被装饰函数之前的代码")
        fn()
        print("被装饰函数之后的代码")
    return inner

@wrapper
def add():
    print("新增函数")

add()
```

### 2.2 有参无返回

```python
def wrapper(fn):
    def inner(a, b):
        print("被装饰函数之前的代码")
        fn(a, b)
        print("被装饰函数之后的代码")
    return inner

@wrapper
def add(a, b):
    print(f"求和结果为{a + b}")

add(10, 1)
```

### 2.3 无参有返回

```python
def wrapper(fn):
    def inner():
        print("被装饰函数之前的代码")
        num = fn()
        return num
    return inner

@wrapper
def add():
    return 10

print(add())  # 10
```

### 2.4 有参有返回

```python
def wrapper(fn):
    def inner(num):
        print("被装饰函数之前的代码")
        result = fn(num)
        return result
    return inner

@wrapper
def add(num):
    return num

print(add(10))  # 10
```

---

## 3 通用装饰器（可变参数）

用 `*args, **kwargs` 适配任意函数签名：

```python
def wrapper(fn):
    def inner(*args, **kwargs):
        print("被装饰函数之前的代码")
        result = fn(*args, **kwargs)
        return result
    return inner

@wrapper
def add(*args, **kwargs):
    total = 0
    for i in args:
        total += i
    for i in kwargs.values():
        total += i
    return total

print(add(1, 2, 3, a=4, b=5, c=6))  # 21
```

---

## 4 多个装饰器叠加

**装饰过程**：由内到外（离函数最近的先装饰）

**执行过程**：由上往下

```python
def wrapper1(fn):
    def inner(*args, **kwargs):
        print("wrapper1-before")
        fn(*args, **kwargs)
        print("wrapper1-after")
    return inner

def wrapper2(fn):
    def inner(*args, **kwargs):
        print("wrapper2-before")
        fn(*args, **kwargs)
        print("wrapper2-after")
    return inner

def wrapper3(fn):
    def inner(*args, **kwargs):
        print("wrapper3-before")
        fn(*args, **kwargs)
        print("wrapper3-after")
    return inner

@wrapper3
@wrapper2
@wrapper1  # 就近原则：wrapper1 先装饰
def target():
    print("target函数")

target()
# 等价于：target = wrapper3(wrapper2(wrapper1(target)))
```

输出：
```
wrapper3-before
wrapper2-before
wrapper1-before
target函数
wrapper1-after
wrapper2-after
wrapper3-after
```

---

## 5 带参数的装饰器

一个装饰器只能接收一个参数（被装饰函数）。要传额外参数？在外层再包一个函数：

```python
def outside(flag):    # 外部函数接收参数
    def wrapper(fn):  # 装饰器
        def inner(a, b):
            if flag == '+':
                print('正在计算加法...')
            elif flag == '-':
                print('正在计算减法...')
            fn(a, b)
        return inner
    return wrapper    # 返回装饰器

@outside('+')
def addition(a, b):
    print(a + b)

@outside('-')
def subtraction(a, b):
    print(a - b)

addition(11, 33)      # 正在计算加法... 44
subtraction(100, 20)  # 正在计算减法... 80
```

---

## 相关链接

- [[Python 函数基础]] — 函数定义、参数、作用域、闭包
- [[Python 面向对象编程]] — OOP 进阶
- [[Python 注册表模式]] — 装饰器工厂的实际应用
