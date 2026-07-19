---
title: Python 迭代器与生成器进阶
created: 2026-05-22
tags:
  - Python
  - 迭代器
  - 生成器
  - yield
  - 惰性求值
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 生成器与迭代器]]"
  - "[[Python 函数基础]]"
  - "[[Python 协程与异步编程]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---
# Python 迭代器与生成器进阶

> 进阶内容：迭代器协议、生成器进阶（多 yield、send、yield from）及其节省内存的应用。

## 迭代器与生成器进阶
### 迭代器

迭代器最大的作用就是统一了容器类型循环遍历的标准

```Python
for c in "你好":
    print(c)

# int类型不可以被迭代
for i in 123:   #报错：'int' object is not iterable
    print(i)

#如果有 __iter__ 那么这个类的对象就是一个可迭代对象
print(dir(str))   # 有__iter__
print(dir(list))  # 也有__iter__
print(dir(dict))  # 也有__iter__
print(dir(int))   # int没有__iter__
print("__iter__" in dir(bool))  # 结果：Flase 所以bool也没有__iter__
```

iterable：表示可迭代

#### 迭代器的使用

```Python
# iterable 可迭代的
# 所有的可迭代对象内部都含有一个__iter__的功能
lst = ["你好", "你不好", "你很好"]
it = lst.__iter__()  # iterator 迭代器
print(dir(it))
ret = it.__next__()  # 你好
print(ret)
ret = it.__next__()  # 你不好
print(ret)
ret = it.__next__()  # 你很好
print(ret)
# ret = it.__next__()   # 这里会报错  StopIteration
# print(ret)
"""
迭代器中的内容全部被拿出出来之后，里面没有数据了
如果再要拿数据就会报错 StopIteration
"""
```

迭代器使用步骤：

1. 通过__iter__拿到可迭代对象中的迭代器
2. 用迭代器执行__next__拿到元素.
3. 重复第二步. 反复执行. 直到最后出现了StopIteration结束

```Python
s = {"你好", "哒哒哒哒", "嘚吧嘚"}
it = s.__iter__()
print(it.__next__())    # 你好
print(it.__next__())    # 嘚吧嘚
print(it.__next__())    # 哒哒哒哒
```

```Python
##注意
s = {"你好", "哒哒哒哒", "嘚吧嘚"}
# 1.想让迭代器重头拿数据. 需要重新拿到迭代器
it = s.__iter__()
print(it.__next__())
print(it.__next__())

# 2. 这里不适合使用数学上的等价代换，下面全部都会输出：你好
print(s.__iter__().__next__())
print(s.__iter__().__next__())
print(s.__iter__().__next__())

# 3. 还可以使用iter() 来获取迭代器
lst = [11,22,33]
it = iter(lst)   # iter = __iter__
print(next(it))  # next = __next__
print(next(it))
print(next(it))

# 4. 可迭代对象不是迭代器
lst = []
it = lst.__iter__()
print(dir(lst))   # 列表（可迭代对象）不是迭代器.
print(dir(it))    # 迭代器本身是一个可迭代对象. 迭代器可以使用for循环
```

#### for循环的机制：

```Python
for item in [1,2,3]:
    print(item)
```

使用while循环+迭代器来模拟for循环（重点）

```Python
lst = ["张无忌", "谢广坤", "张乘乘"]
# for循环内部大致的工作机制
it = lst.__iter__()   # 拿到迭代器
while True:
    try:  # 尝试执行下面的代码
        obj = it.__next__()  # 拿到数据
        print(obj)
    except StopIteration:  # 如果上方代码出现了StopIteration这样的错误.这段代码就开始执行
        break   # 结束循环
```

list可以一次性把迭代器中的内容全部拿空，并装载在一个新列表中

```Python
s = "今天天气不错，出去玩不？".__iter__()
print(list(s))
#['今', '天', '天', '气', '不', '错', '，', '出', '去', '玩', '不', '？']
```

#### 总结：

lterable: 可迭代对象． 内部包含__iter__() 函数  
lterator: 迭代器． 内部包含__iter__()同时包含__next__() ．

迭代器的特点：

1. 节省内存
2. 惰性机制
3. 不能反复， 只能向下执行

### 生成器

生成器的本质是迭代器，在python中有两种方式来获得生成器

1. 通过生成器函数
2. 通过生成器表达式来实现生成

```Python
def func():
    print("123")
    return "你好"

ret = func()
print( ret)
"""
123
你好
"""
```

#### 生成器的使用

把函数中的`return`换成`yield`就是生成器

```Python
def func():   # 生成器函数
    print(123)
    yield "你好"   # 当函数中有yield, 该函数就是一个生成器函数, yield也有返回的意思

gen = func()   # 生成器函数在被执行的时候. 创建生成器
print(gen)   # <generator object func at 0x110bb1480>
```

前面说了生成器的本质就是迭代器，所以我们可以加上这一段代码

```Python
ret = gen.__next__()   # 可以让生成器函数执行到下一个yield
print(ret) # yield也有返回的意思,所以这里的结果是：你好
"""
<generator object func at 0x000001AD9B7C0580>
123
你好
"""
```

#### 多个`yield`放在一个生成器中

```Python
# 在一个生成器函数中可以有多个yield
def func():
    print(11)
    yield "你好"
    print(22)
    yield "你不好"
    print(33)
    yield "你很好"
    print("\n最后了. 没有了 ")

gen = func()
r = gen.__next__()
print("接收到的数据", r)

r2 = gen.__next__()
print("接收到的r2", r2)

r3 = gen.__next__()
print("接收到的r3", r3)

r4 = gen.__next__()  # 当程序后面没有yield之后. 此时会报错, StopIteration.
print("接收到的r4", r4)
```

运行上面代码我们可以知道

生成器函数:

1. 里面有yield
2. 生成器函数在执行的时候, 实际上是创建一个生成器出来
3. 必须使用__next__()来执行一段代码. 会自动的执行到下一个yield结束
4. yield也是返回的意思，可以让一个函数分段执行
5. 当后面没有yield之后.，再次__next__会报错：StopIteration

#### 生成器的应用

生成器最大的作用就是节省内存

如果现在我们需要买1000件衣服，那么正常写法是这样的

```Python
def order():
    lst = []
    for i in range(10000):  # 会比较消耗资源
        lst.append(f"衣服{i}")
    return lst  # 列表占内存

lst = order()
print(lst)
```

但是这样写的问题是，一下子全部衣服都要拿，可能会拿不动

那么使用生成器后，我们就可以一次拿一件衣服

```Python
def order():
    for i in range(10000):
        yield f"衣服{i}"

g = order()
print(g.__next__())
print(g.__next__())
```

那如果想要一次拿走50件衣服呢？

```Python
def order():
    lst = []
    for i in range(10000):
        lst.append(f"衣服{i}")
        if len(lst) == 50:
            yield lst
            lst = []

g = order()

lst1 = g.__next__()
print(lst1)
lst1 = g.__next__()
print(lst1)
```

所以，由此可看出生成器可以节省内存，内存不需要一下子把全部都数据装进去。

#### 生成器send()方法

send()和__next__()一样都可以让生成器执行到下一个yield

```Python
def func():
    print("111")
    a = yield "酥饼"
    print("222", a)
    b = yield "韭菜盒子"
    print("333", b)
    yield "红酒"

g = func()
r1 = g.__next__()  # 第一次执行必须用next. 不能用send
print(r1)
r2 = g.send("哈哈")  # send给上一个yield位置传递"哈哈"
print(r2)
r3 = g.send("呵呵")
print("r3 = ", r3)
```

send和__next__()的区别：

1. 都是让生成器向下走一次，执行到下一个`yield`
2. send()可以给上一个`yield`的位置传递值，不过不能给最后一个`yield`发送值。在第一次执行生成器代码时，不能使用send()

### 生成器表达式

```Python
g = (i for i in range(5))
print(g)

print(g.__next__())  # 0
print(g.__next__())  # 1
print(g.__next__())  # 2
```

上面代码，生成器中的数据只能一个一个的提取，那么怎么样才能一次性把全部数据提取出来。下面有两个办法：

#### 通过for循环提取数据

```Python
g = (i for i in range(6))
# 生成器 -> 迭代器 -> 可迭代对象 -> for循环
for item in g:
    print(item)
```

#### 使用list，tuple，set提取数据

```Python
g = (i for i in range(6))
print(list(g))
print(tuple(g))
print(set(g))
# 使用了其中一个之后就会把全部数据提取出来，在提取就是空的
```

#### 生成器函数

```Python
def func():  # 生成器函数
    print(111)
    yield 222   # 买票的

g = func()   # 创建生成器   黄牛1
g1 = (i for i in g)   # g1也是一个生成器  黄牛2
g2 = (i for i in g1)    # g2也是生成器  黄牛3

print(list(g))    # 这里直接把g拿空, 此时g1、g2没数据了
print(list(g1))
print(list(g2))
```

#### yield from

```Python
def func():
    lst1 = ["麻花1", "沈腾1", "马丽1"]
    lst2 = ["麻花2", "沈腾2", "马丽2"]
    # for item in lst1:
    #     yield item
    #
    # for item in lst2:
    #     yield item

    yield from lst1   # 把一个可迭代对象中的每一项分别返回
    yield from lst2

g = func()
print(list(g))
```


## 相关链接

- [[Python 生成器与迭代器]] — 基础：yield、迭代器协议
- [[Python 协程与异步编程]] — 协程与 asyncio
