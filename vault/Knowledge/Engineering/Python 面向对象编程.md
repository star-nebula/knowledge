---
title: Python 面向对象编程
created: 2026-05-22
tags:
  - Python
  - 面向对象
  - OOP
  - 继承
  - 多态
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 类入门]]"
  - "[[Python 元类]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

## 面向对象基本概念

### 什么是面向对象？

> 面向对象编程（**OOP**，Object-Oriented Programming）是一种**以对象为基本单元**的编程范式，通过将数据（属性）与行为（方法）封装为“对象”，模拟现实世界实体及其交互关系。
>
> 核心目标：提高代码的<u>可重用性、可维护性和可扩展性</u>
>
> 编程思想：面向过程和面向对象
>
> - 面向过程：按“步骤”拆问题，先写流程再写函数，数据与动作分离。
> - 面向对象：按“对象”拆问题，先抽象类再封装，数据与动作合一。
>
> Python是同时支持面向过程和面向对象的编程语言。

思路：概述，特点，举例，总结

面向对象是一种编程思维，强调的是以对象为基础完成各种操作，它是基于面向过程的，是对面过程的再次封装处理，通过对象来模拟现实世界

三大特点：

1. 面向对象更符合人们的思考习惯
2. 把复制的事情简单化
3. 把程序员从执行者编程指挥者

总结：一切皆对象

### 面向对象的相关概述

- 属性：名词，用来描述事物的外在特征——变量
- 行为：动词，表示事物能够做什么——函数
- 类：属性和行为的集合，抽象的概念
- 对象：类的具体体现，具体的实体

## 类 和 对象

### 类 和 对象 的概念

所有拥有相同属性和功能的事物称为一个类，而拥有相同属性和功能的具体事物则成为这个类的实例对象。
![[file-20260403202324116.png]]

### 基本语法

```python
# 声明类（定义类）
class ClassName:
    类属性...
    方法...

class ClassName():
    类属性...
    方法...

class ClassName(object):
    类属性...
    方法...
    
# 实例化对象
obj = ClassName() # 开辟一块独立的属于实例空间，将空间地址作为返回值

# 调用对象的 类属性和方法
obj.类属性
obj.方法(实参)
```

- 和变量名一样，类名本质上就是一个标识符，命名遵循变量规范。如果由单词构成类名，建议每个单词的首字母大写，其它字母小写。
- 类属性和类方法，对于类来说不是必需的。Python 类中属性和方法所在的位置是任意的，即它们之间并没有固定的前后次序。

### 实例属性 和 实例方法

> 实例属性，实例变量，实例成员变量 都是指的存在 实例空间 的属性

- 实例属性：通过实例对象直接创建或在实例方法内通过`self`创建的专属属性
- 实例方法：首参为 `self` 的方法，只能通过实例对象(self)调用

- `self`

  - `self` 代表类的实例对象自身

  - `self` 必须作为第一个参数出现在类的方法定义中

```python
class ClassName:
	# self 代表类的实例对象自身
    def instance_method(self):  # 创建实例方法
		pass
	
obj = ClassName()  				
obj.instance_attr = "hello"  # 通过“实例对象”创建实例属性
```

```python
class ClassName:
    def instance_method(self, instance_attr):  # 实例方法
		self.instance_attr = instance_attr 	   # 设置实例属性
	def another_method(self):
		self.instance_method()   # 调用实例方法
        
obj = ClassName()  	
# 调用实例方法：def instance_method(obj, "hello")
obj.instance_method("hello")  # 通过“实例方法”设置实例属性的属性值
```

### 类对象&类属性

- 类对象：Python中创建类时生成的对象，它代表了该类的定义和行为，存储着公共的类属性和方法

- 类属性（类变量）：在所有实例化对象中是作为公用资源存在的

  > 对象属性：属于每个对象的属性, 即: A对象修改了他的属性值, 不会影响B对象的属性值.
  >
  > 类属性：该类的所有对象所共享的, 即: A对象修改了类属性, 则B对象用的是 修改后的属性值.
  >

```python
class ClassName: # 类对象
    class_attr = "attr_value"  # 类属性
    def __init__(self):
		obj_attr = "attr_value"  # 实例属性
		# self.class_attr  可能返回实例属性（若存在），而非类属性
		ClassName.class_attr = "new_value"  # 类对象.类属性【推荐】

obj = ClassName()
print(obj.class_attr) 		# 实例对象.类属性
print(ClassName.class_attr) # 类对象.类属性【推荐】
```

### 类方法&静态方法

类方法：使用装饰器 `@classmethod`

- 第一个参数必须是当前类对象，该参数名一般约定为 `cls`
- 通过它来传递类的属性和方法（不能传实例的属性和方法）
- 类方法能被该类下所有的对象共享
- 类对象 或 实例对象 都可以调用

静态方法：使用装饰器 `@staticmethod`

- 参数随意，没有`self`和`cls`参数
- 静态方法能被该类下所有的对象共享
- 类对象 或 实例对象 都可以调用

```python
class ClassName:
    class_attr = "attr_value"  # 类属性
    @staticmethod
    def static_method():
        print(f"静态方法 访问类属性:{ClassName.class_attr}")
        # ClassName.class_method()  # 调用类方法：类名.类方法名()

    @classmethod
    def class_method(cls):  # cls: 代表类对象
        print(f"类方法 访问类属性:{cls.class_attr}")
        # ClassName.static_method()  # 调用静态方法：类对象.静态方法名()

obj = ClassName()
# 调用静态方法
obj.static_method()  		# 实例对象.静态方法
ClassName.static_method()   # 类对象.静态方法【推荐】
# 调用类方法
obj.class_method() 		 	# 实例对象.类方法
ClassName.class_method()  	# 类对象.类方法【推荐】
```

### 魔法方法

Python 的类提供的，两个下划线开始，两个下划线结束的方法，就是魔法方法，魔法方法在特定行为下就会被激活，自动执行。

##### 构造方法：`__init__`

- 作用：初始化实例对象，可以实现在创建对象时就给对象赋值属性。
- 触发时机：实例化对象时会自动触发，如 `obj = ClassName()`
- 基本语法：`__init__(self [, ...])`

```python
# 无参数的__init__()方法
class ClassName: 
    def __init__(self):
		self.attr1 = "v1"
		self.attr2 = "v2"

    def instance_method(self):
		return self.attr1, self.attr2  # 获取属性值
		  
obj = ClassName()
```

```python
# 有参数的__init__()方法
class ClassName: 
    def __init__(self, attr1, attr2):
		self.attr1 = attr1
		self.attr2 = attr2

    def instance_method(self):
		return self.attr1, self.attr2

obj = ClassName("attr1", "attr2")
```

##### `__str__`方法

- 作用：用于定义对象的返回结果，改变对象的字符串显示。一般用于打印对象的各个属性值
- 触发时机：`print(str(obj))` 或 `print(obj)` （间接触发）

```python
class Person(object):
    def __init__(self, name, age):
        print("__init__方法执行")
        self.name = name
        self.age = age

    def __str__(self):
        print("__str__执行...")
        return f"姓名：{self.name} 年龄：{self.age}"

obj = Person("name", 18)
# 触发__str__方法的两种方式:
print(str(obj)) # str(obj) 会直接调用 obj.__str__()
print(obj)		# print(obj) 内部会先调用 str(obj)
```

##### `__del__`方法

- 定义：用于在**对象被销毁前**执行清理操作
- 触发时机：当对象的**引用计数降为 0**（或在程序结束时被垃圾回收器回收）时自动调用
- 作用：释放资源（如关闭文件、网络连接、数据库连接等）

```python
class Temp:
    def __init__(self, name):
        self.name = name
        print(f"{self.name} 创建")

    def __del__(self):
        print(f"{self.name} 销毁")

a = Temp("A")
# __del__:
# 在某些情况下（如程序被强制终止、解释器崩溃、存在循环引用且未启用 gc 回收等），可能不会执行
# 故而不要依赖 __del__ 做关键资源释放
```

##### `__new__`方法

`__new__()` 方法是在 Python 中定义一个类的时候可以定义的一个特殊方法。它被用来创建一个类的新实例（对象）。

在 Python 中，创建一个新的实例一般是通过调用类的构造函数 `__init__()` 来完成的。然而，`类名()`创建对象时，在自动执行` __init__()`方法前，会先执行 `object.__new__`方法，在内存中开辟对象空间并返回该对象。然后，Python 才会调用 `__init__()` 方法来对这个新实例进行初始化。

```python
class Person(object):
    def __new__(cls, *args, **kwargs):
		# 其中，cls参数表示类本身，*args 和 **kwargs参数用于接收传递给构造函数的参数。
        # print("__new__执行")
        return object.__new__(cls)

    def __init__(self, name, age):
        # print("__init__方法执行")
        self.name = name
        self.age = age

yuan = Person("yuan", 23)
# print(yuan)
print(yuan.name, yuan.age)
```

> `_new__()` 方法的主要作用是创建实例对象，它可以被用来控制实例的创建过程。相比之下，`__init__()` 方法主要用于初始化实例对象。

`__new__()` 方法在设计模式中常常与单例模式结合使用，用于创建一个类的唯一实例。  
单例模式是一种创建型设计模式，它确保一个类只有一个实例，并提供一个全局访问点来获取该实例。

```python
class Config(object):
    instance = None
    def __new__(cls, *args, **kwargs):
        if not cls.instance:
            cls.instance = object.__new__(cls)
        return cls.instance # 如果有的话，返回原本的对象

    def __init__(self):
        print("__init__执行了")

obj1 = Config()
obj2 = Config()
print(obj1 is obj2) # True
```

##### `__eq__` 方法

```python
class Person(object):
    def __init__(self, name, age):
        self.name = name
        self.age = age

yuan = Person("yuan", 23)
alvin = Person("alvin", 23)
print(yuan == alvin) # False
```

```python
class Person(object):
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __eq__(self, obj):
        return self.age == obj.age

yuan = Person("yuan", 23)
alvin = Person("alvin", 23)
print(yuan == alvin) # True
```

> 1. `__eq__(self, other)`: 判断对象是否相等，通过 `==` 运算符调用。
> 2. `__lt__(self, other)`: 判断对象是否小于另一个对象，通过 `<` 运算符调用。
> 3. `__gt__(self, other)`: 判断对象是否大于另一个对象，通过 `>` 运算符调用。
> 4. `__add__(self, other)`: 对象的加法操作，通过 `+` 运算符调用

```python
class Dog(object):
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def __eq__(self, other):
        print("Dog __eq__")
        return self.age == other.age

class Person(object):
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def __eq__(self, other):
        print("Person __eq__")
        return self.name == other.name and self.age == other.age

yuan = Person("yuan", 23)
alex = Dog("alex", 23)
print(alex == yuan)
print(yuan == alex)

结果：
Dog __eq__
True
Person __eq__
False
```

##### `__len__`方法

当定义一个自定义的容器类时，可以使用 `__len__()` 方法来返回容器对象中元素的数量。  
下面是一个示例，演示了如何在自定义列表类中实现 `__len__()` 方法：

```python
class Cache01:
    def __init__(self):
        self.data = []
    def __len__(self):
        return len(self.data)
    def add(self, item):
        self.data.append(item)
    def remove(self, item):
        self.data.remove(item)

cache = Cache01()
print(len(cache)) # 获取列表的长度

class Cache02:
    def __init__(self):
        self.data = {}
    def __len__(self):
        return len(self.data)
    def add(self, key, value):
        self.data[key] = value
    def remove(self, key):
        del self.data[key]
```

一定会有同学问，Yuan老师，为什么要封装这个类，直接使用`self.data = {}`不就完了吗？

当我们封装一个类时，我们将相关的数据和操作放在一个包裹（类）中，就像把一些东西放进一个盒子里一样。这个盒子提供了一种保护和管理数据的方式，同时也定义了外部与内部之间的交互方式。

为什么要这样做呢？想象一下，如果我们直接将数据存储在类之外的变量中，其他代码可以直接访问和修改它。这可能导致数据被误用或篡改，造成不可预测的结果。而通过封装，我们可以将数据放在类的内部，并提供一些方法（接口）来访问和修改数据。这就像将数据放进盒子里，并用盒子上的门来控制对数据的访问。

这种封装的好处是什么呢？首先，它提供了一种信息隐藏的机制。外部代码只能通过类提供的方法来访问数据，无法直接触及数据本身。这样可以保护数据的完整性和一致性，防止不恰当的访问和修改。其次，封装使得代码更加模块化和可重用。我们可以将相关的数据和操作组织在一个类中，成为一个功能完整的单元，方便调用和扩展。

总而言之，封装就像把数据放进一个盒子里，通过提供方法来控制对数据的访问。这样做可以保护数据，提高代码的可读性和可维护性，并促进代码的模块化和重用。

##### `__item__`系列

```python
class Cache:
    def __init__(self):
        self.data = {}

    def __getitem__(self, key):
        return self.data[key]

    def __setitem__(self, key, value):
        self.data[key] = value

    def __delitem__(self, key):
        del self.data[key]

    def __contains__(self, key):
        return key in self.data
```

在上述例子中，我们创建了一个名为 `Cache` 的自定义类，并实现了 `__getitem__`、`__setitem__`、`__delitem__` 和 `__contains__` 这些特殊方法。

使用这个自定义的缓存类，我们可以像操作字典一样操作缓存数据，例如：

```python
from loguru import logger
class Cache:
    def __init__(self):
        self.__data = {}

    def __getitem__(self, key):
        # 有效控制，判断，监控，日志
        # return self.data[key]
        val = self.__data.get(key)
        if val:
            return val
        else:
            raise KeyError(f"{key}键不存在")

    def __setitem__(self, key, value):
        self.__data[key] = value
        logger.info(f"已经向self.__data添加了{key}和{value}")

    def __delitem__(self, key):
        logger.info(f"已经从self.__data删除了{key}")
        del self.__data[key]

    def __contains__(self, key):
        return key in self.__data

cache = Cache()
# 存储数据
cache['key1'] = 'value1'
cache['key2'] = 'value2'
# 获取数据
print(cache['key1'], cache['key2'])  # value1 value2
print('key1' in cache)  # 检查键是否存在, 输出: True
del cache['key1'] # 删除数据
print(cache['key1']) # 输出: KeyError: 'key1'
print('key1' in cache)  # 检查键是否存在, 输出: False
```

通过实现特殊方法，我们可以使用类似于字典的语法来访问和操作缓存对象。  
这样，我们可以更方便地存储、获取和删除缓存数据，同时也可以使用其他字典操作，如检查键是否存在。

##### `__attr__`系列

```python
class Cache:
    def __init__(self):
        self.__data = {}

    def __setattr__(self, name, value):
        self.__data[name] = value

    def __getattr__(self, name):
        if name in self.__data:
            return self.__data[name]
        else:
            raise AttributeError(f"'Cache' object has no attribute '{name}'")

    def __delattr__(self, name):
        if name in self.__data:
            del self.__data[name]
        else:
            raise AttributeError(f"'Cache' object has no attribute '{name}'")

    def __contains__(self, name):
        return name in self.__data
```

在这个示例中，我们使用 `__setattr__` 方法来设置属性，将属性存储在私有属性 `__data` 中。当我们尝试设置属性时，`__setattr__` 方法会被自动调用，并将属性存储到私有字典中。

而在 `__getattr__` 方法中，我们实现了对属性的访问。如果属性存在于私有字典 `__data` 中，它将返回属性的值。如果属性不存在，则会引发 `AttributeError` 异常。

类似地，我们还实现了 `__delattr__` 方法来删除属性。如果属性存在于私有字典 `__data` 中，它将被删除。如果属性不存在，则会引发 `AttributeError` 异常。

最后，我们还重写了 `__contains__` 方法，以实现在缓存中检查属性是否存在的功能。

使用这个经过修改的缓存类，我们可以使用类似于属性操作的语法：对象.属性来访问和操作缓存对象。

```python
class Cache(object):

    def __init__(self):
        # self.data = {}
        self.__dict__["data"] = {}

    def __setattr__(self, key, value):
        print("__setattr__:::", key, value)
        self.__dict__["data"][key] = value

    def __getattr__(self, key):
        return self.__dict__["data"].get(key)

    def __delattr__(self, key):
        self.__dict__["data"].pop(key)

    def __str__(self):
        return str(self.__dict__["data"])

    def __contains__(self, key):
        return key in self.__dict__["data"]

cache = Cache()
cache.name = "yuan"
cache.age = 18
print(cache.__dict__) # test测试,{'data': {'name': 'yuan', 'age': 18}}
print(cache.name) # yuan
del cache.name
print(cache) # {'age': 18}
print("name" in cache) # False
```

## 三大特性：继承、封装、多态

> 程序设计原则： 高内聚，低耦合
>
> - 高内聚：`类内部数据操作自主完成，外部无需干涉  `
>
> - 低耦合：`仅暴露必要接口，减少模块依赖 `

1. 继承（Inheritance）：

    - 核心思想：**提取共性，建立层次关系**，即：消除重复代码，实现代码复用
    - 本质与实现：

      - 子类**自动获得**父类所有非私有属性和方法
      - 通过**扩展/重写**实现功能增量
    - 好处和弊端：提高代码的复用性和可维护性，但是耦合性增强（子类强依赖父类实现）
2. 封装（Encapsulation）：

    - 核心思想：**隐藏内部复杂性，暴露简单接口**，即：把该隐藏的隐藏起来，该暴露的暴露岀来
    - 本质与实现：

      - 将数据（属性）与操作数据的行为（方法）**绑定为有机整体（类）**
      - 通过访问控制**限制外部直接访问**内部状态
      - 仅通过**公共接口（方法）**  与外界交互
    - 作用：降低耦合、提高安全性与可维护性。
3. 多态（Polymorphism）：

    > Python中的多态并不是真正意义上的多态
    >

    - 核心思想：**同一接口，多种实现**，即：运行时动态绑定行为，解耦接口与实现
    - 本质：引用变量的具体类型与方法调用在**编译时不确定，运行时才确定**
    - 必要条件：继承、方法重写、父类引用指向子类对象
    - 作用：降低模块耦合度，支持"插拔式"扩展

|特性|作用层次|核心目标|依赖关系|
| ---------------------| -----------------| -------------------------| -------------------------|
|继承|**类间关系**|代码复用|依赖封装|
|封装|**单个类内部**|保护数据完整性|基础特性|
|多态|**系统架构**|降低模块耦合度|依赖继承+封装|

### 继承

继承是使用已存在的类的定义作为基础建立新类的技术，新类的定义可以增加新的数据或新的功能，也可以用父类的功能，但不能选择性地继承父类。

> 继承：一个类从另一个已有的类获得其的相关特性（子类角度）
>
> 派生：从一个已有的类产生新的类（父类角度）

- 子类（派生类、扩展类）：通过继承创建的新类

- 父类（基类、超类）：被继承的类

> 1、子类拥有父类非私有化的属性和方法。
>
> 2、子类可以拥有自己属性和方法，即子类可以对父类进行扩展。
>
> 3、子类可以用自己的方式实现父类的方法。

##### 单继承

```python
class 子类名(父类名):
    ...
```

##### 多继承

```python
class 子类名(父类1 [, 父类2])
    ...
# 多个父类有同名的 属性和行为, 优先继承 第1个父类
```

##### MRO 方法解析顺序

MRO（Method Resolution Order）它规定了继承关系中, 属性和行为的 查找顺序

`子类 -> 第一个父类 -> 其它父类 -> object`

```python
方式一：类名.__mro__          通过属性的方式调用
方式二：类名.mro()            通过行为(函数)的方式调用
```

##### 重写父类

```python
class FatherClass:
    def __init__(self):
        self.attr = 'value'
    def make_cake(self):
        print(f"Father:{self.attr}")

class SonClass(FatherClass):
	# 重写父类属性和方法
    def __init__(self):
        self.attr = 'new_value'
    def make_cake(self):
		print(f"Son:{self.attr}")
```

##### 调用父类

```python
方式一：父类名.父类方法名(self)
方式二：super()父类方法名()  # 只能初始化第一个父类成员，多用于单继承
```

```python
class FatherClass:
    def __init__(self):
        self.attr = 'value1'
    def make_cake(self):
        print(f"Father: {self.attr}")

class MotherClass:
    def __init__(self):
        self.attr = 'value1'
    def make_cake(self):
        print(f"Mother: {self.attr}")

class SonClass(FatherClass, MotherClass):
	# 调用父类属性和方法
	def call_mother_cake(self):
		# 方式一：父类名.父类方法名(self)
		FatherClass.__init__(self)
        FatherClass.make_cake(self)
	def call_father_cake(self):
		# 方式二：super()父类方法名()
		super().__init__()
        super().make_cake()

if __name__ == '__main__':
    p = SonClass()
    p.make_cake()  # 调用自己的方法
    p.call_father_cake()  # 调用从FatherClass继承的方法
	p.call_mother_cake()  # 调用从MotherClass继承的方法
```

##### 多层继承

- 多继承：1个类有多个父类
- 多层继承：继承的传递性，`a -> b -> c`

```python
class FatherClass:
    pass

class MotherClass:
    pass

class SonClass(FatherClass, MotherClass):
	pass

class grandson(SonClass)
```

### 封装

定义：隐藏对象的属性和实现细节，仅对外提供访问接口

编程中的封装：把属性和方法写到类里面的

私有化：类中的私有化成员，子类无法继承，且只能在本类使用。子类只能通过提供的接口进行访问。

### 私有属性&私有方法

私有属性是指只能在类的内部 访问和调用的属性，无法在类的外部直接访问或调用。

私有方法是指只能在类的内部 访问和调用的方法，无法在类的外部直接访问或调用。

```properties
self.__属性名   			# 设置私有属性
def __方法名(self):		# 设置私有方法
     ...
```

```python
class Student(object):
    def __init__(self):
        self.__name = "value"  # 设置私有属性

    def get_name(self):  # getter 接口
        return self.__name

    def set_name(self,name):  # setter 接口
        self.__name = name

	def __method(self):  # 设置私有方法
        print('__method')

	def get_method(self):  # 公共接口，内部调用私有方法
        self.__method()

s = Student()
s.set_name("new1")  # 修改私有属性
print(s.get_name()) # 获取私有属性
s.get_method()		# 通过公共方法间接调用私有方法

# 【注】以下方式都不应出现在生产代码中
# _类名__方法: 外部直接访问
s._Student__method()

# _类名__属性: 外部直接访问
s._Student__name = "new2"  # 修改私有属性
print(s._Student__name)    # 获取私有属性
```

【注】这种机制并没有真正意义上限制我们从外部直接访问属性，知道了类名和属性名或方法名：`_类名__属性`、 `_类名__方法`，然后就可以访问了

在继承中，父类如果不想让子类覆盖自己的方法，可以将方法定义为私有的:

```python
class Base:
    def __foo(self): 
        print("Base")

class Son(Base):
    def __foo(self):
        print("Son")

s = Son()
s.test() # Base
```

### Python 的下划线命名

单下划线、双下划线、头尾双下划线说明：

> - `__foo__`：定义的是特殊方法，一般是系统定义名字 ，类似 `__init__()` 之类的。
> - `__foo`：双下划线的表示的是私有类型(private)的变量, 只能是允许这个类本身进行访问了。
> - `_foo`：以单下划线开头的表示的是 protected 类型的变量，即保护类型只能允许其本身与子类进行访问。（约定成俗，不限语法）

### `property`属性操作

##### property 属性装饰器

使用接口函数获取修改数据 和 使用点方法设置数据相比， 点方法使用更方便  
有什么方法达到 既能使用点方法，同时又能让点方法直接调用到我们的接口了，答案就是`property`属性装饰器：

```python
from loguru import logger
class Student(object):
    def __init__(self, name, score):
        self.__name = name # 私有化
        self.__score = score 

    def get_score(self):
        return self.__score

    def set_score(self, score):
        if isinstance(score, int) and 0 < score < 100:
            self.__score = score
        else:
            raise ValueError("数据错误")

yuan = Student("yuan", 88)
print(yuan.get_score())
yuan.set_score(99)
print(yuan.get_score())
```

```python
from loguru import logger
class Student(object):
    def __init__(self, name, score):
        self.__name = name # 私有化
        self.__score = score

    @property
    def score(self):
        logger.info(f"{self.__name}查询了成绩:{self.__score}")
        return self.__score

    @score.setter
    def score(self, score):
        if isinstance(score, int) and 0 < score <= 100:
            self.__score = score
        else:
            raise ValueError("数据错误")

yuan = Student("yuan", 88)
print(yuan.score)
yuan.score = 100
print(yuan.score)
```

##### property 属性函数

Python提供了更加人性化的操作，可以通过限制方式完成只读、只写、读写、删除等各种操作

```python
# (2) property属性函数
class Student(object):

    def __init__(self, name, score):
        self.__name = name
        self.__score = score

    def __get_score(self):
        return self.__score

    def __set_score(self, score):
        if isinstance(score, int) and 0 < score < 100:
            self.__score = score
        else:
            raise ValueError("数据错误")
    score = property(__get_score, __set_score) # property 属性函数

yuyu = Student("yuyu", 88)
print(yuyu.score)
yuyu.score = 100
print(yuyu.score)
```

`@property`广泛应用在类的定义中，可以让调用者写出简短的代码，同时保证对参数进行必要的检查，这样，程序运行时就减少了出错的可能性。

### 多态

多态，即多种状态。同样一个事物在不同的场景下表现出不同的状态（或形态）

好处：提高代码的可维护性，实现“1个函数，多种效果”

应用场景：父类充当函数形参的类型，这样可以接收其任意的值类对象，实现：传入什么（子类）对象，就调用其对应的功能。

##### 多态调用

多态存在的三个前提条件：

> - 继承（定义父类、定义子类，子类继承父类）
> - 重写（子类重写父类属性和方法）
> - 父类引用指向子类对象（子类对象传给父类对象调用者）

```python
# Python中的多态指的是，同一个函数，传入不同的对象，会得到不同的状态
class Animal:
    def make_sound(self):
        print("Animal makes a sound")

class Dog(Animal):
    def make_sound(self):
        print("Dog barks")

class Cat(Animal):
    def make_sound(self):
        print("Cat meows")

class Phone:
    def make_sound(self):
        print('phone')

def animal_sounds(animal: Animal):  # 参数类型提示为 Animal
    animal.make_sound()  # 实际调用哪个方法取决于传入对象（animal）的实际类型

# 多态调用
animals = [Dog(), Cat()]
for animal in animals:
    animal_sounds(animal)  # 多态: 同样的调用，不同的行为

# 父类引用指向子类对象:
# - 用父类类型的变量，保存子类对象
# - 调用方法时，执行的是子类方法，不是父类方法
# - 这样就能实现同一个调用，有不同的行为
animal_ref = Dog()      # animal_ref 变量持有 Dog 对象，但可视为 Animal 类型
animal_ref.make_sound()  # 输出: Dog barks - 运行时表现出多态

# Python 伪多态
p = Phone()
animal_sounds(p) # 输出: phone
```

##### 抽象类（接口）

抽象类：含有抽象方法的类（一般充当父类）

抽象方法：方法体是空实现的 `pass`

> 设计意义：
>
> - 父类用来确定有哪些方法（父类制定接口标准）
> - 具体的方法实现由子类来实现（子类实现接口标准）

```python
class Animal: # 抽象类
    def make_sound(self):  # 空实现的抽象方法
        pass

class Dog(Animal):
    def make_sound(self):
        print("汪汪汪")

class Cat(Animal):
    def make_sound(self):
        print("喵喵喵")
```

##### 鸭子类型

鸭子模型（Duck typing）是一种动态类型系统中的编程风格或理念，它强调对象的行为比其具体类型更重要。“如果它看起来像鸭子，叫起来像鸭子，那么它就是鸭子。”

**核心思想：**  不关心对象是什么类型，只要它有需要的方法就行。

```python
class Duck:
    def walk(self):
        print("鸭子走路")
    def swim(self):
        print("鸭子游泳")

class Dog:
    def walk(self):
        print("狗狗走路") 
    def swim(self):
        print("狗狗游泳")

# 只要对象有walk和swim方法，就可以传入这个函数
def move(animal):
    animal.walk()
    animal.swim()

# 鸭子类型：看起来像鸭子，游起来像鸭子，那就是鸭子
move(Duck())  # 鸭子走路 + 鸭子游泳
move(Dog())   # 狗狗走路 + 狗狗游泳
```

## 对象内省与特殊方法

### 类型检查：`type` 和 `isinstance`方法

```python
class Animal:
    def eat(self):
        print("eating...")
    def sleep(self):
        print("sleep...")

class Dog(Animal):
    def swim(self):
        print("swimming...")

alex = Dog()
print(isinstance(alex,Dog))
print(isinstance(alex,Animal))
print(type(alex))
```

### 属性探查：`dir()`方法 和 `__dict__`属性

`dir(obj)`可以获得对象的所有属性（包含方法）列表, 而`obj.__dict__`对象的自定义属性字典

【Tip】

1. `dir(obj)`获取的属性列表中，方法也认为属性的一种。返回的是`list`
2. `obj.__dict__`只能获取自己自定义的属性，系统内置属性无法获取。返回是`dict`

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def test(self):
        pass

yuyu = Student("yuyu", 100)
print("获取 所有的 属性列表")
print(dir(yuyu))
print("获取 自定义 属性字段")
print(yuyu.__dict__)
```

其中，类似`__xx__`的属性和方法都是有特殊用途的。

### 特殊方法：`len()` 和 `__len__()`方法

如果调用`len()`函数试图获取一个对象的长度，其实在`len()`函数内部会自动去调用该对象的`__len__()`方法

【Tip】

1. `len(obj)`实际上是调用`obj.__len__()`方法
2. `len()`函数是`__len__()`方法的便捷调用方式
3. 自定义类如果想支持`len()`函数，必须实现`__len__()`方法

```python
class MyList:
    def __init__(self, items):
        self.items = items
    
    def __len__(self):
        return len(self.items)

my_list = MyList([1, 2, 3, 4])
print(len(my_list))        # 输出: 4 (调用 my_list.__len__())
print(my_list.__len__())   # 输出: 4 (直接调用特殊方法)
```

其中，类似`__xx__`的属性和方法都是有特殊用途的。

---

## 综合案例

### 基础 OOP 案例

#### 减肥案例

```python
"""
需求: 小明体重100KG, 跑步一次减0.5KG, 大吃大喝一次加2KG
类: Student, 属性: current_weight, 行为: run(), eat()
"""
class Student():
    def __init__(self, weight=100):
        self.current_weight = weight
    def run(self):
        self.current_weight -= 0.5
        print(f'当前体重: {self.current_weight} Kg!')
    def eat(self):
        self.current_weight += 2
        print(f'当前体重: {self.current_weight} Kg!')
    def __str__(self):
        return f'当前体重: {self.current_weight} Kg!'

xm = Student()
xm.run(); xm.run(); xm.eat()
print(xm)
```

#### 人狗大战

```python
class Person(object):
    def __init__(self, name, healthy=100):
        self.name = name; self.healthy = healthy
    def kick_dog(self, dog):
        dog.decrease_health(10)
        print(f"{self.name}踢了{dog.name}，{dog.name}生命值剩{dog.healthy}")
    def decrease_health(self, amount):
        self.healthy -= amount

class Dog(object):
    def __init__(self, name, healthy=100):
        self.name = name; self.healthy = healthy
    def bite(self, person):
        person.decrease_health(20)
        print(f"{self.name}咬了{person.name}，{person.name}生命值剩{person.healthy}")
    def decrease_health(self, amount):
        self.healthy -= amount

alex = Dog("小狗"); yuan = Person("小人")
alex.bite(yuan); yuan.kick_dog(alex)
```

#### 银行帐户

```python
class BankAccount(object):
    def __init__(self, account_num, balance=0):
        self.account = account_num; self.balance = balance
    def deposit(self, amount):
        self.balance += amount
        print(f"存款{amount}元，余额：{self.balance}")
    def withdraw(self, amount):
        if self.balance >= amount:
            self.balance -= amount
            print(f"取款{amount}元，余额：{self.balance}")
        else:
            print("余额不足！")
    def get_balance(self):
        return self.balance

acc = BankAccount("123456", 10000)
acc.deposit(20000); acc.withdraw(50000); acc.withdraw(5000)
```

#### 书籍管理（类方法应用）

```python
class Book(object):
    book_list = []
    book_count = 0
    def __init__(self, title, author, year):
        self.title = title; self.author = author; self.year = year
        Book.book_list.append(self); Book.book_count += 1
    @classmethod
    def show_books(cls):
        for b in cls.book_list:
            print(f"书名:{b.title}, 作者:{b.author}, 年份:{b.year}")

Book("西游记", "吴承恩", 1592)
Book("水浒传", "施耐庵", 1589)
Book.show_books()
print("总数：", Book.book_count)
```

### 继承案例

```python
# 单继承
class Master(object):
    def __init__(self): self.kongfu = '古法煎饼果子'
    def make_cake(self): print(f'采用{self.kongfu}制作')

class Prentice(Master): pass
Prentice().make_cake()  # 采用古法煎饼果子制作
```

```python
# 多继承 + MRO
class School(object):
    def __init__(self): self.kongfu = '高科技煎饼果子'
    def make_cake(self): print(f'采用{self.kongfu}制作')

class Prentice(School, Master): pass
print(Prentice.__mro__)  # 查看方法解析顺序
Prentice().make_cake()   # 采用高科技煎饼果子制作（优先第一个父类）
```

```python
# 重写 + 调用父类
class Prentice(School, Master):
    def __init__(self): self.kongfu = '自研煎饼果子'
    def make_cake(self): print(f'采用{self.kongfu}制作')
    def make_master_cake(self):
        Master.__init__(self); Master.make_cake(self)
    def make_school_cake(self):
        super().__init__(); super().make_cake()

p = Prentice()
p.make_cake()         # 自研
p.make_master_cake()  # 古法
p.make_school_cake()  # 高科技
```

### 封装案例

```python
class Prentice(object):
    def __init__(self):
        self.kongfu = '[自研技术]'
        self.__money = 500  # 私有属性
    def get_money(self): return self.__money
    def set_money(self, money): self.__money = money

class TuSun(Prentice): pass

ts = TuSun()
print(ts.get_money())  # 500
ts.set_money(66666)
print(ts.get_money())  # 66666
# ts.__money  # 报错！无法直接访问私有属性
```

### 多态案例

```python
# 鸭子类型：不关心类型，只关心行为
class Duck:
    def walk(self): print("鸭子走路")
    def swim(self): print("鸭子游泳")
class Dog:
    def walk(self): print("狗狗走路")
    def swim(self): print("狗狗游泳")

def move(animal):
    animal.walk(); animal.swim()

move(Duck())  # 鸭子走路 + 鸭子游泳
move(Dog())   # 狗狗走路 + 狗狗游泳
```

```python
# 多态：同一函数，不同对象，不同行为
class HeroFighter:
    def power(self): return 60
class AdvHeroFighter(HeroFighter):
    def power(self): return 80
class EnemyFighter:
    def power(self): return 70

def battle(hr, en):
    print("Hero win" if hr.power() > en.power() else "Enemy win")

battle(HeroFighter(), EnemyFighter())      # Enemy win
battle(AdvHeroFighter(), EnemyFighter())   # Hero win
```

### 电商项目（综合 OOP）

```python
class Product:
    def __init__(self, name, price, stock):
        self.name = name; self.price = price; self.stock = stock

class RegularProduct(Product): pass

class DiscountProduct(Product):
    def __init__(self, name, price, stock, discount):
        super().__init__(name, price, stock)
        self.discount = discount

class Cart:
    def __init__(self): self.items = {}
    def add_item(self, product, qty):
        self.items[product] = self.items.get(product, 0) + qty
    def remove_item(self, product, qty):
        if product in self.items:
            if self.items[product] <= qty: del self.items[product]
            else: self.items[product] -= qty
    def view_items(self):
        for p, q in self.items.items(): print(f"{p.name} x{q}")
    def clear(self): self.items = {}

class Order:
    def __init__(self, cart):
        self.total = sum(
            p.price * q * (p.discount if isinstance(p, DiscountProduct) else 1)
            for p, q in cart.items.items()
        )
    def pay(self): print(f"支付成功！金额：{self.total}")

class User:
    def __init__(self, name): self.name = name; self.cart = Cart()
    def add_to_cart(self, product, qty): self.cart.add_item(product, qty)
    def view_cart(self): self.cart.view_items()
    def checkout(self):
        Order(self.cart).pay(); self.cart.clear()

user = User("John")
user.add_to_cart(RegularProduct("iPhone", 6999, 100), 2)
user.add_to_cart(DiscountProduct("Watch", 1999, 50, 0.8), 3)
user.view_cart(); user.checkout()
```
