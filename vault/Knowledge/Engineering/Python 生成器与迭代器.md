---
title: Python 生成器与迭代器
created: 2026-05-22
tags:
  - Python
  - 生成器
  - 迭代器
  - yield
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 函数基础]]"
  - "[[Python 数据结构]]"
  - "[[Python 迭代器与生成器进阶]]"
  - "[[Python 协程与异步编程]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Python 生成器与迭代器：yield、迭代器协议与惰性求值

> **学习目标**：理解生成器的惰性求值机制，掌握 yield 用法、迭代器协议、自定义迭代器。

> 进阶内容（生成器与协程、迭代器协议详解）详见 [[Python 迭代器与生成器进阶]] 与 [[Python 协程与异步编程]]。

---

## 1 生成器

生成器（Generator）按需生成数据，不是一次性全部生成，而是使用一个再生成一个，节约大量内存。

创建方式：**生成器推导式**、**yield 关键字**。

### 1.1 生成器推导式

```python
# 列表推导式 → 一次性生成所有数据
my_list = [i for i in range(1, 6)]
print(type(my_list))   # <class 'list'>

# 生成器推导式 → 按需生成数据
my_gen = (i for i in range(1, 6))
print(type(my_gen))    # <class 'generator'>
```

### 1.2 yield 关键字

当函数中存在 `yield`，该函数就不再是普通函数，而是一个生成器函数。调用时返回生成器对象，而非执行函数体。

```python
def get_generator():
    for i in range(1, 6):
        yield i  # 每次 yield 一个值，暂停执行

my_gen = get_generator()
print(type(my_gen))  # <class 'generator'>
```

**yield vs return**：
- `return` 返回一次，函数结束
- `yield` 可以多次，每次暂停，下次从暂停处继续

### 1.3 获取生成器数据

```python
my_gen = (i for i in range(1, 6))

# 方式一：next() 逐个获取
print(next(my_gen))  # 1
print(next(my_gen))  # 2

# 方式二：for 循环遍历（推荐）
for i in my_gen:
    print(i)
```

> `next()` 取完数据后再取会抛 `StopIteration` 异常。

### 1.4 典型应用

**斐波那契数列**：

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
for _ in range(10):
    print(next(fib), end=" ")  # 0 1 1 2 3 5 8 13 21 34
```

**大文件逐行读取**（不占大量内存）：

```python
def read_large_file(file_path):
    with open(file_path, 'r') as f:
        for line in f:
            yield line.strip()

for line in read_large_file("big_data.txt"):
    process(line)
```

---

## 2 迭代器

迭代器（Iterator）是实现了 `__iter__()` 和 `__next__()` 方法的对象，用于统一容器类型的遍历标准。

### 2.1 可迭代对象 vs 迭代器

```python
# 可迭代对象（有 __iter__）：list, str, dict, tuple, set, generator
print("__iter__" in dir(list))   # True
print("__iter__" in dir(int))    # False

# 迭代器（同时有 __iter__ 和 __next__）
lst = [1, 2, 3]
it = lst.__iter__()
print(it.__next__())   # 1
print(it.__next__())   # 2
```

### 2.2 for 循环的本质

```python
# for 循环内部实现
lst = [1, 2, 3]
it = iter(lst)       # 等价于 lst.__iter__()
while True:
    try:
        val = next(it)  # 等价于 it.__next__()
        print(val)
    except StopIteration:
        break
```

### 2.3 自定义迭代器

```python
class CountDown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

for num in CountDown(5):
    print(num, end=" ")  # 5 4 3 2 1
```

---

## 3 推导式对比

```python
my_list = [i for i in range(1, 6)]   # list
my_set  = {i for i in range(1, 6)}   # set
my_gen  = (i for i in range(1, 6))   # generator（惰性）
```

---

## 相关链接

- [[Python 函数基础]] — 函数定义、闭包、lambda
- [[Python 数据结构]] — 推导式详解
- [[Python 迭代器与生成器进阶]] — 迭代器/生成器进阶
- [[Python 协程与异步编程]] — 协程与异步
