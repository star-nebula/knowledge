---
title: Streamlit 入门
created: 2026-07-08
tags:
  - Streamlit
  - Python
  - 前端
type: 步骤操作
related:
  - "[[聊天机器人实现]]"
  - "[[Python-MOC]]"
reference:
category: ["🛠️ 工程工具", "模型部署"]
---

# Streamlit 入门

Streamlit 是一个 Python 框架，可在几分钟内将脚本转为可分享的 Web 应用。

官网：[https://streamlit.io/](https://streamlit.io/)

## 安装与测试

```shell
pip install streamlit==1.32.0
streamlit hello   # 运行示例
```

运行脚本：

```shell
streamlit run yourscript.py
```

## 基础组件

### 标题

```python
import streamlit as st
st.title('Streamlit 标题')
```

### 段落

```python
st.write('Hello')
```

### Markdown

```python
"# 1级标题"
"## 2级标题"
"### 3级标题"
```

### 图片

```python
st.image('./avatar.jpg', width=400)
```

### 表格

**静态表格**：

```python
st.table(data={
    'name': ['张三', '李四', '王五'],
    'age': [18, 20, 22],
    'gender': ['男', '女', '男']
})
```

**可交互表格**：

```python
import pandas as pd
df = pd.DataFrame({
    'name': ['张三', '李四', '王五'],
    'age': [18, 20, 22],
    'gender': ['男', '女', '男']
})
st.dataframe(df)
```

### 分割线

```python
st.divider()
```

### 输入框

**文本输入**：

```python
name = st.text_input('请输入你的名字：')
if name:
    st.write(f'你好，{name}')
```

**密码框**：

```python
pwd = st.text_input('密码是多少？', type='password')
```

**数字输入**：

```python
age = st.number_input('年龄：', value=20, min_value=0, max_value=200, step=1)
```

**多行文本框**：

```python
paragraph = st.text_area("多行内容：")
```

### 聊天组件（Streamlit 内置）

**聊天输入框**：

```python
prompt = st.chat_input("Say something")
if prompt:
    st.write(f"User has sent the following prompt: {prompt}")
```

**聊天消息容器**：

```python
with st.chat_message('user'):
    st.write('Hello ')
message = st.chat_message('assistant')
message.write('Hello Human')
```

## 相关笔记

- Streamlit 实战 → [[聊天机器人实现]]
- Python 基础 → [[Python-MOC]]
