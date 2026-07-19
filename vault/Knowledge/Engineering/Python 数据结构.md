---
title: Python 数据结构
created: 2026-05-22
tags:
  - Python
  - 数据结构
  - 字符串
  - 列表
  - 字典
  - 集合
  - 推导式
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 基础语法]]"
  - "[[Python 函数入门]]"
  - "[[Python 类入门]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---
# Python 数据结构：字符串、列表、元组、字典、集合

> **学习目标**：掌握 Python 六大内置数据结构的操作方法、深浅拷贝、推导式、循环中删除元素的正确做法。

---

## 1 常见内置函数与解包

### 通用内置函数

```python
len([1,2,3])          # 3 — 长度
max(1, 2, 3)          # 3 — 最大值
min(1, 2, 3)          # 1 — 最小值
sum([1, 2, 3])        # 6 — 求和
sorted([3,1,2])       # [1,2,3] — 排序（返回新列表）
reversed([1,2,3])     # 反转迭代器

# 枚举（同时获取索引和值）
for i, v in enumerate(['a', 'b', 'c']):
    print(i, v)

# 并行遍历
names = ["Alice", "Bob"]
ages = [25, 30]
for name, age in zip(names, ages):
    print(f"{name} is {age}")

# range（生成整数序列）
list(range(5))        # [0, 1, 2, 3, 4]
list(range(0, 10, 2)) # [0, 2, 4, 6, 8]
```

### sorted 高级用法

```python
# 按字符串长度排序
words = ["banana", "apple", "cherry"]
sorted(words, key=len)

# 按字典的某个键排序
students = [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 20}]
sorted(students, key=lambda s: s["age"])

# 忽略大小写排序
sorted(["Banana", "apple", "Cherry"], key=str.lower)
```

### 解包

```python
# 元组/列表解包
a, b, c = (1, 2, 3)

# 交换变量
a, b = b, a

# 星号解包（收集剩余元素）
first, *rest = [1, 2, 3, 4]  # first=1, rest=[2,3,4]

# 函数参数解包
def add(a, b):
    return a + b
args = [1, 2]
add(*args)  # 3

# 字典解包
def greet(name, age):
    print(f"{name} is {age}")
d = {"name": "Alice", "age": 25}
greet(**d)
```

---

## 2 字符串

### 基本操作

```python
s = "Hello, World!"
len(s)            # 13
s[0]              # 'H'
s[-1]             # '!'
s[0:5]            # 'Hello'
s.lower()         # 'hello, world!'
s.upper()         # 'HELLO, WORLD!'
s.strip()         # 去除首尾空白
s.split(", ")     # ['Hello', 'World!']
", ".join(["a","b"]) # 'a, b'
s.replace("Hello", "Hi")  # 'Hi, World!'
s.find("World")   # 7（不存在返回 -1）
s.count("l")      # 3
s.startswith("Hello")  # True
s.endswith("!")        # True
```

### 格式化

```python
name, age = "Alice", 25

# 1. f-string（推荐）
f"{name} is {age} years old"

# 2. format() 方法
"{} is {} years old".format(name, age)

# 3. % 格式化（旧式）
"%s is %d years old" % (name, age)

# 格式化数字
f"{3.14159:.2f}"    # '3.14'
f"{1000000:,}"      # '1,000,000'
f"{0.85:.1%}"       # '85.0%'
```

### 正则表达式

```python
import re

# 基础匹配
re.findall(r"\d+", "今年18岁，有100万")  # ['18', '100']

# 查找全部
for m in re.finditer(r"\d+", "21级1班"):
    print(m.group())

# 替换
re.sub(r"\d+", "*", "abc123def456")  # 'abc*def*'

# 分割
re.split(r"[,;]", "a,b;c")  # ['a', 'b', 'c']

# 贪婪 vs 惰性
re.findall(r"<.*>", "<a><b>")    # ['<a><b>']（贪婪）
re.findall(r"<.*?>", "<a><b>")   # ['<a>', '<b>']（惰性）
```

---

## 3 列表 List

```python
# 创建
lst = [1, 2, 3]

# 增
lst.append(4)          # 末尾追加
lst.insert(0, 0)       # 指定位置插入
lst.extend([5, 6])     # 批量追加

# 删
lst.remove(3)          # 删除第一个匹配值
lst.pop()              # 删除并返回末尾元素
lst.pop(0)             # 删除并返回指定索引
lst.clear()            # 清空

# 查
lst.index(2)           # 查找索引
lst.count(2)           # 计数
2 in lst               # 成员判断

# 排序
lst.sort()             # 原地排序
lst.sort(reverse=True) # 降序
lst.reverse()          # 原地反转

# sort() vs sorted()
# sort()：原地排序，修改原列表，返回 None
# sorted()：返回新列表，不修改原对象
sorted(lst, key=len)   # 按长度排序

# 二维列表
matrix = [[1,2,3], [4,5,6], [7,8,9]]
for row in matrix:
    for item in row:
        print(item, end=" ")
    print()
```

---

## 4 元组 Tuple

```python
# 创建（不可变）
t = (1, 2, 3)
t = tuple([1, 2, 3])

# 操作
t[0]          # 1
t[-1]         # 3
len(t)        # 3
t.count(2)    # 1
t.index(3)    # 2

# 不可修改
# t[0] = 10   # ❌ TypeError

# 解包
a, b, c = t
first, *rest = (1, 2, 3, 4)

# enumerate
for i, v in enumerate(t):
    print(i, v)
```

---

## 5 字典 Dict

```python
# 创建
d = {"name": "Alice", "age": 25}
d = dict(name="Alice", age=25)

# 增/改
d["email"] = "alice@example.com"  # 新增
d["age"] = 26                     # 修改
d.setdefault("name", "Bob")       # key 不存在时才添加

# 删
del d["email"]
d.pop("age")         # 删除并返回值
d.pop("x", None)     # key 不存在返回默认值
d.clear()

# 查
d["name"]            # key 不存在会报错
d.get("name")        # key 不存在返回 None
d.get("x", "默认值") # 指定默认值

# 遍历
for key in d:                    # 遍历 key
    print(key, d[key])
for key, value in d.items():     # 遍历键值对（推荐）
    print(key, value)
for value in d.values():         # 遍历 value
    print(value)

# 嵌套字典
users = {
    "u001": {"name": "Alice", "age": 25},
    "u002": {"name": "Bob", "age": 30}
}
users["u001"]["name"]  # Alice
```

---

## 6 集合 Set

```python
# 创建（自动去重）
s = {1, 2, 3}
s = set([1, 1, 2, 3])  # {1, 2, 3}

# 运算
a = {1, 2, 3}
b = {2, 3, 4}
a & b       # {2, 3}       交集
a | b       # {1,2,3,4}    并集
a - b       # {1}          差集
a ^ b       # {1, 4}       对称差集

# 方法
s.add(4)        # 增加
s.remove(1)     # 删除（不存在报错）
s.discard(1)    # 删除（不存在不报错）
1 in s          # 查询

# 不可变集合
fs = frozenset([1, 2, 3])
```

---

## 7 深浅拷贝

```python
import copy

# 浅拷贝：只复制第一层
a = [1, [2, 3]]
b = a.copy()        # 等价：b = a[:] 或 b = list(a)
b[1][0] = 99
print(a)            # [1, [99, 3]]（内层被影响！）

# 深拷贝：完全独立的副本
a = [1, [2, 3]]
b = copy.deepcopy(a)
b[1][0] = 99
print(a)            # [1, [2, 3]]（不受影响）
```

---

## 8 推导式

### 列表推导式

```python
# 基本语法
[x**2 for x in range(5)]           # [0, 1, 4, 9, 16]

# 带条件
[x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]

# 示例
words = ["hello", "world"]
[w.upper() for w in words]         # ['HELLO', 'WORLD']
```

### 字典推导式

```python
# 示例
words = ["apple", "banana", "cherry"]
d = {w: len(w) for w in words}     # {'apple': 5, 'banana': 6, 'cherry': 6}

# 翻转字典
d = {"a": 1, "b": 2, "c": 3}
{v: k for k, v in d.items()}       # {1: 'a', 2: 'b', 3: 'c'}
```

### 生成器表达式

```python
# 用圆括号，返回生成器（惰性求值，节省内存）
g = (x**2 for x in range(10))

# 常用于 sum/max/min 等函数
sum(x**2 for x in range(10))       # 285
```

---

## 9 循环删除陷阱

### ❌ 错误：遍历中删除列表元素

```python
lst = [1, 2, 3, 4, 5]
for item in lst:
    if item % 2 == 0:
        lst.remove(item)
print(lst)  # [1, 3, 5] 看似正确，但删除时索引偏移会跳过元素
```

### ✅ 正确做法

```python
# 方法一：先收集要删除的元素，再循环删除
to_remove = [item for item in lst if item % 2 == 0]
for item in to_remove:
    lst.remove(item)

# 方法二：遍历列表的副本（推荐）
for item in lst[:]:  # lst[:] 是浅拷贝
    if item % 2 == 0:
        lst.remove(item)

# 方法三：用列表推导式（最 Pythonic）
lst = [item for item in lst if item % 2 != 0]
```

### ❌ 错误：遍历中删除字典元素

```python
d = {"a": 1, "b": 2, "c": 3}
for k, v in d.items():
    if v % 2 == 0:
        del d[k]  # RuntimeError: dictionary changed size during iteration
```

### ✅ 正确做法

```python
# 先获取所有 key，再循环删除
for k in list(d.keys()):
    if d[k] % 2 == 0:
        del d[k]

# 或用字典推导式筛选
d = {k: v for k, v in d.items() if v % 2 != 0}
```

## 相关链接

- [[Python 基础语法]] — 变量、类型、流程控制
- [[Python 函数入门]] — 函数入门：定义、参数、作用域、闭包
- [[Python 类入门]] — 类与 OOP 入门
