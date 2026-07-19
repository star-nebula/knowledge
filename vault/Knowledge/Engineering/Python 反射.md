---
title: Python 反射
created: 2026-05-22
tags:
  - Python
  - 反射
  - 元编程
  - hasattr
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 面向对象编程]]"
  - "[[Python 元类]]"
  - "[[Python 标准库]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---
# 反射：运行时检测与操作对象属性
#### . 反射

反射这个术语在很多语言中都存在，并且存在大量的运用，今天我们说说什么是反射，  
反射主要是指程序可以访问、检测和修改它本身状态或行为的一种能力。

在Python中，反射是指在运行时通过名称字符串来访问、检查和操作对象的属性和方法的能力。  
Python提供了一些内置函数和特殊方法，使得可以动态地获取对象的信息并执行相关操作。

Python中的反射主要有下面几个方法：

```python
# 1. 判断对象中有没有一个name字符串对应的方法或属性
hasattr(object,name)
# 2. 获取 对象name字符串 属性的值，如果不存在返回default的值
getattr(object, name, default=None)
# 3. 设置对象的key属性为value值，等同于object.key = value
setattr(object, key, value)
# 4. 删除对象的name字符串属性
delattr(object, name)
```

应用1：

```python
class Person:
    def __init__(self, name, age, gender):
        self.name = name
        self.age = age
        self.gender = gender

user = Person("yuyu", 20, "female")
while 1:
    attr = input("请输入您想查询的user的某个属性:")
    # 方案1
    # if attr == "name":
    #     print(user.name)
    # elif attr == "age":
    #     print(user.age)

    # 方案2:反射
    if hasattr(user, attr): # 判断对象是否具有该属性
        val = getattr(user, attr) # 获取属性值
        print(f"user的{attr}的属性值：{val}")
    else:
        print(f"user没有{attr}属性")
        choice = input("是否给该user加入该属性【Y/N】")
        if choice.lower() == "y":
            value = input(f"请输入yuan对象{attr}一个确定值：")
            setattr(user, attr, value) # 给对象添加属性
```

应用2：

```python
class CustomerManager:
    def __init__(self):
        self.customers = []
    def add_customer(self):
        print("添加客户")
    def del_customer(self):
        print("删除客户")
    def update_customer(self):
        print("修改客户")
    def query_one_customer(self):
        print("查询一个客户")
    def show_all_customers(self):
        print("查询所有客户")

class CustomerSystem:
    def __init__(self):
        self.cm = CustomerManager()

    def run(self):
        print("""
           1. 添加客户
           2. 删除客户
           3. 修改客户
           4. 查询一个客户
           5. 查询所有客户
           6. 保存
           7. 退出
        """)

        while True:
            choice = input("请输入您的选择:")

            if choice == "6":
                self.save()
                continue
            elif choice == "7":
                print("程序退出！")
                break

            try:
                method_name = "action_" + choice
                method = getattr(self, method_name)
                method()
            except AttributeError:
                print("无效的选择")

    def save(self):
        print("保存数据")
    def action_1(self):
        self.cm.add_customer()
    def action_2(self):
        self.cm.del_customer()
    def action_3(self):
        self.cm.update_customer()
    def action_4(self):
        self.cm.query_one_customer()
    def action_5(self):
        self.cm.show_all_customers()

cs = CustomerSystem()
cs.run()
```

## 相关链接

- [[Python 元类]] — 元类与 type
- [[Python 面向对象编程]] — OOP 基础
