---
type: topic
tags:
  - Python
  - 函数
  - 类
  - OOP
  - 面向对象
domain: Python工程
description: Python 函数与类入门：函数定义、参数类型、作用域、闭包、类的定义、继承、封装、多态
created: 2025-03-10
updated: 2026-05-22
status: raw
---

# Python 函数与类：定义、参数、作用域与 OOP 入门

> **学习目标**：掌握函数定义与参数类型、作用域规则、闭包、类的定义与继承。

---

## 1 函数

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

## 2 类与面向对象基础

### 2.1 类的定义

```python
class Person:
    species = "Human"  # 类属性（所有实例共享）

    def __init__(self, name, age):  # 初始化方法
        self.name = name            # 实例属性
        self.age = age

    def greet(self):                # 实例方法
        return f"Hi, I'm {self.name}"

# 创建实例
p = Person("Alice", 25)
print(p.name)         # Alice
print(p.greet())      # Hi, I'm Alice
print(p.species)      # Human
```

### 2.2 继承

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError

class Dog(Animal):
    def speak(self):
        return f"{self.name}: Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name}: Meow!"

dog = Dog("Buddy")
print(dog.speak())  # Buddy: Woof!
```

### 2.3 方法重写与 super()

```python
class CocaCola:
    price = 3.5
    ingredients = ["caffeine", "sugar", "water", "soda"]

    def __init__(self, name):
        self.name = name

class CaffeineFree(CocaCola):
    """无咖啡因可乐，重写 ingredients"""
    ingredients = ["sugar", "water", "soda"]  # 重写类属性

    def __init__(self, name, ml):
        super().__init__(name)  # 调用父类初始化
        self.ml = ml
```

### 2.4 封装

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # 私有属性（双下划线开头）

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

    def get_balance(self):
        return self.__balance
```

### 2.5 多态

```python
def animal_speak(animal):
    print(animal.speak())

animal_speak(Dog("Buddy"))   # Buddy: Woof!
animal_speak(Cat("Kitty"))   # Kitty: Meow!
```

### 2.6 魔术方法

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):        # print() 时调用
        return f"Point({self.x}, {self.y})"

    def __repr__(self):       # 交互式环境中显示
        return f"Point({self.x}, {self.y})"

    def __eq__(self, other):  # == 比较
        return self.x == other.x and self.y == other.y

    def __add__(self, other): # + 运算
        return Point(self.x + other.x, self.y + other.y)
```

## 相关链接

- [[Python 基础语法]] — 变量、类型、流程控制
- [[Python 数据结构]] — 字符串/列表/元组/字典/集合
- [[Python 面向对象编程]] — OOP 进阶
