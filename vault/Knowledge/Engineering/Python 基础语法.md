---
title: Python 基础语法
created: 2026-05-22
tags:
  - Python
  - 基础语法
  - 变量
  - 数据类型
  - 流程控制
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 函数入门]]"
  - "[[Python 类入门]]"
  - "[[Python 数据结构]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Python 基础语法：变量、类型与流程控制

> **学习目标**：掌握 Python 变量命名、数据类型、编码转换、用户输入、条件/循环控制。

---

## 1 编写 Python 的方式

1. 系统命令行：输入 `python` → 编写 → `exit()` 退出
2. `.py` 文件：编写后 `python 文件路径` 运行
3. IDE：VSCode、PyCharm 等

## 2 变量与常量

**变量命名规则**：
1. 字母、数字、下划线组合，不能以数字开头
2. 不能是 Python 关键字
3. 区分大小写，名字要有意义

**Python 关键字**：

| | | | | | | | |
|---|---|---|---|---|---|---|---|
| False | None | True | and | or | not | is | in |
| if | elif | else | while | for | break | continue | pass |
| def | class | lambda | return | yield | async | await | import |
| from | as | global | nonlocal | del | raise | try | except |
| finally | assert | with | | | | | |

**常量**：约定全大写，如 `MAX_SIZE = 100`。

## 3 注释

```python
# 单行注释
""" 多行注释 """
```

## 4 bytes 类型与编码

内存中字符串默认用 `unicode`，存储/传输时需编码为 `utf-8` 或 `gbk`。

**字符编码**：
- `ascii`：8bit，英文/数字/特殊符号
- `gbk`：16bit，中文和亚洲字符，兼容 ascii
- `unicode`：16/32bit，全世界文字，缺点是浪费空间
- `utf-8`：可变长度 unicode（英文 8bit，中文 24bit），传输/存储常用

```python
# 编码
s = "中国"
s_utf = s.encode("utf-8")    # b'\xe4\xb8\xad\xe5\x9b\xbd'（6字节）
s_gbk = s.encode("gbk")      # b'\xd6\xd0\xb9\xfa'（4字节）

# 解码
bs = b'\xe4\xb8\xad\xe5\x9b\xbd'
s = bs.decode("utf-8")        # '中国'
```

## 5 基本数据类型

| 类型 | 关键字 | 示例 |
|------|--------|------|
| 整数 | `int` | `18` |
| 浮点数 | `float` | `3.14` |
| 布尔 | `bool` | `True` / `False` |
| 字符串 | `str` | `"hello"` |
| 空值 | `None` | `None` |

### None 的用法

```python
# 判断是否为 None，始终用 is
x = None
if x is None:
    print("x 是 None")

# 函数没有 return 时，默认返回 None
def greet():
    print("hi")
result = greet()  # result 是 None
```

### 真值与假值

以下值判定为 **False**：`None`、`0`、`0.0`、`""`、`[]`、`()`、`{}`、`set()`

其他值判定为 **True**。

### 类型转换

```python
int("123")       # → 123
float("3.14")    # → 3.14
str(123)         # → '123'
bool(0)          # → False
bool("hello")    # → True

# 容器类型转换
list("abc")      # → ['a', 'b', 'c']
tuple([1,2,3])   # → (1, 2, 3)
set([1,1,2])     # → {1, 2}

# 查看类型
type(123)        # <class 'int'>
type("hi")       # <class 'str'>
```

## 6 用户交互

```python
name = input("请输入姓名：")   # 返回字符串
age = int(input("请输入年龄："))
print(f"你好，{name}，你{age}岁了")
```

## 7 流程控制

### 7.1 条件语句

```python
if 条件1:
    代码块1
elif 条件2:
    代码块2
else:
    代码块3
```

```python
# 三元表达式
result = "及格" if score >= 60 else "不及格"
```

### 7.2 循环语句

**while 循环**：

```python
count = 0
while count < 5:
    print(count)
    count += 1
else:
    print("循环正常结束")  # 未执行 break 时触发
```

**for 循环**：

```python
# 遍历可迭代对象
for item in [1, 2, 3]:
    print(item)

# 配合 range
for i in range(5):        # 0,1,2,3,4
    print(i)
for i in range(0, 10, 2): # 0,2,4,6,8
    print(i)

# 配合 enumerate（同时获取索引和值）
for i, val in enumerate(['a', 'b', 'c']):
    print(i, val)
```

**循环控制**：

```python
break      # 跳出整个循环
continue   # 跳过本次循环
pass       # 占位，什么都不做
```

### 7.3 嵌套循环

```python
# 九九乘法表
for i in range(1, 10):
    for j in range(1, i + 1):
        print(f"{j}x{i}={i*j}", end="\t")
    print()
```

## 8 运算符

### 算术运算符

| 运算符 | 说明 | 示例 |
|--------|------|------|
| `+` | 加 | `1 + 2 = 3` |
| `-` | 减 | `5 - 3 = 2` |
| `*` | 乘 | `2 * 3 = 6` |
| `/` | 除（返回浮点） | `7 / 2 = 3.5` |
| `//` | 整除 | `7 // 2 = 3` |
| `%` | 取余 | `7 % 2 = 1` |
| `**` | 幂 | `2 ** 3 = 8` |

### 比较运算符

`==` `!=` `>` `<` `>=` `<=`

### 逻辑运算符

| 运算符 | 说明 | 特性 |
|--------|------|------|
| `and` | 与 | 短路：第一个为假则返回第一个值 |
| `or` | 或 | 短路：第一个为真则返回第一个值 |
| `not` | 非 | 返回 True/False |

```python
# 短路特性
print(0 and 3)      # 0（第一个为假）
print(1 or 3)       # 1（第一个为真）
```

### 赋值运算符

`=` `+=` `-=` `*=` `/=` `//=` `%=` `**=` `:=`（海象运算符）

```python
# 海象运算符（Python 3.8+）
if (n := len("hello")) > 3:
    print(f"长度为{n}")
```

### 成员运算符

```python
"a" in "abc"         # True
"x" not in "abc"     # True
```

### 身份运算符

```python
a = [1, 2]
b = [1, 2]
a == b    # True（值相等）
a is b    # False（不是同一对象）
```

## 相关链接

- [[Python 函数入门]] — 函数入门：定义、参数、作用域、闭包
- [[Python 类入门]] — 类与 OOP 入门
- [[Python 数据结构]] — 字符串/列表/元组/字典/集合
