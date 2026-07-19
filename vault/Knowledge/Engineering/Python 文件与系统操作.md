---
title: Python 文件与系统操作
created: 2026-05-22
tags:
  - Python
  - 文件操作
  - os模块
  - IO
type: 步骤操作
related:
  - "[[Python-MOC]]"
  - "[[Python 异常处理]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Python 文件与系统操作：读写、os 模块与目录遍历

> **学习目标**：掌握文件读写、路径处理、os 模块的文件系统操作。

## 文件操作

### 基础操作

```python
f = open(file_path, mode='r', encoding=None)  # 打开文件
# 操作文件
f.close()  # 关闭文件
```

### 文件打开模式

| 模式 | 描述         | 文件存在   | 文件不存在   |
| ---- | ------------ | ---------- | ------------ |
| `r`  | 只读         | 正常打开   | 报错         |
| `w`  | 只写         | 清空内容   | 创建新文件   |
| `a`  | 追加         | 末尾追加   | 创建新文件   |
| `rb` | 二进制只读   | 正常打开   | 报错         |
| `wb` | 二进制只写   | 清空内容   | 创建新文件   |
| `ab` | 二进制追加   | 末尾追加   | 创建新文件   |

**读写组合模式**：`r+`（读写，文件须存在）、`w+`（写读，清空或创建）、`a+`（追加读写）

### 路径处理

```python
# 绝对路径
f = open('C:/Users/name/data/file.txt', 'r')

# 相对路径
f = open('./data/file.txt', 'r')      # 当前目录
f = open('../data/file.txt', 'r')     # 上级目录

# 转义处理
f = open(r'data\file.txt', 'r')       # 原始字符串
```

### with-open 上下文管理

自动释放资源，无需手动 `close()`：

```python
# 单文件操作
with open('file.txt', 'r') as f:
    content = f.read()

# 多文件操作
with open('input.txt', 'r') as src, \
     open('output.txt', 'w') as dst:
    dst.write(src.read())
```

## 文件读写操作

### 读取操作

```python
read()          # 一次读取所有字节
read(n)         # 一次读取 n 个字节
readline()      # 一次读取一行
readlines()     # 一次读取所有行，封装到 list
```

```python
# 示例：逐行读取（推荐）
with open('a.txt', 'r', encoding='utf-8') as f:
    for line in f:
        print(line.strip())

# 示例：分块读取（适合大文件）
with open('a.txt', 'r', encoding='utf-8') as f:
    while True:
        chunk = f.read(8192)
        if not chunk:
            break
        # 处理 chunk
```

### 写入操作

```python
# 文本写入
with open('output.txt', 'w', encoding='utf-8') as f:
    f.write('这是第一行\n')
    f.write('这是第二行\n')

# 写入列表
lines = ['Line 1\n', 'Line 2\n']
f.writelines(lines)
```

### 追加写操作

```python
with open('output.txt', 'a', encoding='utf-8') as f:
    f.write('补充内容\n')
```

## os 模块

### 文件操作

```python
import os

os.remove('filename')              # 删除文件
os.rename('oldname', 'newname')    # 重命名文件/目录
```

### 目录操作

```python
os.mkdir('dirname')                # 创建单级目录
os.rmdir('dirname')                # 删除单级空目录
os.makedirs('dir1/dir2')           # 创建多层递归目录
os.removedirs('dir1')              # 递归删除空目录
os.getcwd()                        # 获取当前工作目录
os.chdir('dirname')                # 改变当前工作目录
os.listdir('dirname')              # 列出目录下所有文件和子目录
```

### os.path 路径处理

```python
os.path.abspath(path)              # 返回绝对路径
os.path.split(path)                # 分割为 (目录, 文件名)
os.path.dirname(path)              # 返回目录部分
os.path.basename(path)             # 返回文件名部分
os.path.exists(path)               # 路径是否存在
os.path.isfile(path)               # 是否是文件
os.path.isdir(path)                # 是否是目录
os.path.join(path1, path2, ...)    # 拼接路径
os.path.getsize(path)              # 文件大小（字节）
```

### 系统属性

```python
os.sep       # 路径分隔符（win: "\\"，Linux: "/"）
os.linesep   # 行终止符（win: "\r\n"，Linux: "\n")
os.name      # 平台名称（win: 'nt'，Linux: 'posix'）
```

### 遍历文件夹

```python
# os.walk 遍历
def walk_directory(root_path):
    for root, dirs, files in os.walk(root_path):
        print(f"目录: {root}")
        for dir_name in dirs:
            print(f"  子目录: {os.path.join(root, dir_name)}")
        for file_name in files:
            file_path = os.path.join(root, file_name)
            print(f"  文件: {file_name} ({os.path.getsize(file_path)} 字节)")

# 删除非空目录
import shutil
shutil.rmtree('dirname')
```

## 实战案例

### 拷贝文件

```python
# 文本文件拷贝
def copy_text_file(src_path, dst_path):
    with open(src_path, 'r', encoding='utf-8') as src:
        with open(dst_path, 'w', encoding='utf-8') as dst:
            for line in src:
                dst.write(line)

# 二进制文件拷贝（适合大文件）
def copy_binary_file(src_path, dst_path, buffer_size=8192):
    with open(src_path, 'rb') as src:
        with open(dst_path, 'wb') as dst:
            while True:
                data = src.read(buffer_size)
                if not data:
                    break
                dst.write(data)
```

### 统计单词出现次数

```python
def count_word_occurrences(input_file, output_file):
    try:
        with open(input_file, 'r') as f:
            text = f.read()
        word_counts = {}
        for word in text.split():
            word_counts[word] = word_counts.get(word, 0) + 1
        with open(output_file, 'w') as f:
            for word, count in word_counts.items():
                f.write(f"{word}: {count}\n")
    except FileNotFoundError:
        print("文件未找到！")
```

## 相关链接

- [[Python 异常处理]] — 文件操作中的异常处理
