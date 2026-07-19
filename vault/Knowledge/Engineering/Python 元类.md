---
title: Python 元类
created: 2026-05-22
tags:
  - Python
  - 元类
  - metaclass
  - type
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 面向对象编程]]"
  - "[[Python 反射]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Python 元类：type 与 metaclass 机制

> **学习目标**：理解 Python 中类也是对象、type 创建类的原理，掌握 metaclass 自定义类创建过程。

## 1 基本概念

### 1.1 创建类

```python
class Foo(object):
    def __init__(self, name):
        self.name = name

    def __new__(cls, *args, **kwargs):
        return object.__new__(cls)  # 根据类创建对象

# 执行顺序：
# 1. __new__ 创建空对象（构造方法）
# 2. __init__ 初始化对象（初始化方法）
obj = Foo("luffy")
```

**核心问题**：对象由类创建，那类由谁创建？—— 默认由 `type` 创建。

### 1.2 非传统方式创建类

```python
# 传统方式
class Foo(object):
    v1 = 123
    def func(self):
        return 666

# 非传统方式：type(类名, 继承类, 成员字典)
Foo = type("Foo", (object,), {"v1": 123, "func": lambda self: 666})

obj = Foo()
print(obj.v1)    # 123
print(obj.func()) # 666
```

## 2 元类的使用

元类指定**类由谁来创建**：

```python
# 默认：type 创建类
class Foo(object):
    pass

# 自定义：指定元类创建类
class MyType(type):
    pass

class Foo(object, metaclass=MyType):
    pass
# Foo 类由 MyType 创建
```

### 元类的完整生命周期

```python
class MyType(type):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __new__(cls, *args, **kwargs):
        new_cls = super().__new__(cls, *args, **kwargs)
        return new_cls

    def __call__(self, *args, **kwargs):
        # 调用类的 __new__ 方法创建对象
        empty_object = self.__new__(self)
        # 调用 __init__ 方法初始化对象
        self.__init__(empty_object, *args, **kwargs)
        return empty_object

class Foo(object, metaclass=MyType):
    def __init__(self, name):
        self.name = name

# Foo() 实际调用 MyType.__call__
v1 = Foo("alex")
print(v1.name)  # alex
```

> `Foo` 是 `MyType` 的一个对象，`Foo()` 触发 `MyType.__call__`。

## 3 应用场景

元类可用于：
- **类创建时**：自定义功能（如注册、校验）
- **对象创建前后**：自定义功能（如单例、缓存）

## 4 单例模式（元类实现）

```python
class MyType(type):
    def __init__(self, name, bases, attrs):
        super().__init__(name, bases, attrs)
        self.instance = None

    def __call__(self, *args, **kwargs):
        if not self.instance:
            self.instance = self.__new__(self)
            self.__init__(self.instance, *args, **kwargs)
        return self.instance

class Singleton(object, metaclass=MyType):
    pass

class Foo1(Singleton):
    pass

v1 = Foo1()
v2 = Foo1()
print(v1 is v2)  # True — 同一个对象
```

## 相关链接

- [[Python 面向对象编程]] — OOP 基础
