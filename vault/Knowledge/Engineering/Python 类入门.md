---
title: Python 类入门
created: 2026-05-22
tags:
  - Python
  - 类
  - OOP
  - 面向对象
  - 继承
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 基础语法]]"
  - "[[Python 函数入门]]"
  - "[[Python 面向对象编程]]"
  - "[[Python 数据结构]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---
# Python 类入门：定义、继承、封装与多态

> **学习目标**：掌握类的定义、继承、封装、多态与魔术方法。

## 类与面向对象基础
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

- [[Python 面向对象编程]] — OOP 进阶：property、综合案例
- [[Python 函数入门]] — 函数定义与参数
