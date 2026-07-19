---
title: Function Call 实战
created: 2026-07-09
tags:
  - AI
  - Function Call
  - MiMo
type: 步骤操作
related:
  - "[[AI 应用核心范式-MOC]]"
  - "[[Function Call 概述]]"
reference: ""
category: ["🧩 AI框架与Agent", "AI 应用核心范式"]
---



# Function Call 实战

## 共享机制

所有案例共用同一套请求封装。环境基于小米 MiMo API，`chat_completion_request` 是将 tools 注入 LLM 的核心函数：

```python
import os
import json
from dotenv import load_dotenv, find_dotenv
from openai import OpenAI

_ = load_dotenv(find_dotenv())
client = OpenAI(
    api_key=os.environ['MIMO_API_KEY'],
    base_url="https://token-plan-cn.xiaomimimo.com/v1"
)
LLM = "mimo-v2.5"

def chat_completion_request(messages, tools=None, tool_choice=None, model=LLM):
    """封装模型请求，支持 tools 注入"""
    return client.chat.completions.create(
        model=model,
        messages=messages,
        tools=tools,
        tool_choice=tool_choice or "auto"
    )
```

---

## 案例一：天气查询（单一函数）

**目标**：让模型根据城市名自动调用天气 API 获取实时数据。

### 定义函数

```python
def get_current_weather(location):
    """获取给定地点的当前天气"""
    # 查城市编码 → 调天气 API → 解析 forecast
    # 返回 JSON: {"location", "high_temperature", "low_temperature", "week", "type"}
```

### 函数描述（tools）

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_current_weather",
            "description": "获取给定地点的当前天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "城市或区，例如北京、海淀"
                    }
                },
                "required": ["location"]
            }
        }
    }
]
```

### 解析与执行

```python
def parse_response(response):
    response_message = response.choices[0].message
    if response_message.tool_calls:
        available_functions = {"get_current_weather": get_current_weather}
        function_name = response_message.tool_calls[0].function.name
        function_args = json.loads(response_message.tool_calls[0].function.arguments)
        return available_functions[function_name](**function_args)
```

### 主流程

```python
def main():
    messages = [
        {"role": "system", "content": "你是天气播报助手，不确定时提示用户明确输入"},
        {"role": "user", "content": "今天北京的天气如何"}
    ]

    # 第一轮：模型返回函数调用
    response1 = chat_completion_request(messages, tools=tools)
    messages.append(response1.choices[0].message.model_dump())

    # 执行函数，结果注入对话
    function_result = parse_response(response1)
    tool_call = response1.choices[0].message.tool_calls[0]
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "name": tool_call.function.name,
        "content": function_result
    })

    # 第二轮：模型生成自然语言回答
    response2 = chat_completion_request(messages, tools=tools)
    print(response2.choices[0].message.content)
```

---

## 案例二：航班查询（多函数 + 多轮调用）

**目标**：查询"郑州到北京 2024-04-02 航班票价"，需先查航班号再查票价，模型自动判断调用顺序。

### 定义两个函数

```python
def get_plane_number(date, start, end):
    """查航班号，返回 {date, number}"""
    plane_number = {
        "北京": {"深圳": "126", "广州": "356"},
        "郑州": {"北京": "1123", "天津": "3661"}
    }
    return {"date": date, "number": plane_number[start][end]}

def get_ticket_price(date, number):
    """查票价，返回 {ticket_price}"""
    return {"ticket_price": "1000"}
```

### 函数描述（tools）

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_plane_number",
            "description": "根据始发地、目的地和日期，查询对应日期的航班号",
            "parameters": {
                "type": "object",
                "properties": {
                    "start": {"type": "string", "description": "出发地"},
                    "end": {"type": "string", "description": "目的地"},
                    "date": {"type": "string", "description": "日期"}
                },
                "required": ["start", "end", "date"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_ticket_price",
            "description": "查询某航班在某日的价格",
            "parameters": {
                "type": "object",
                "properties": {
                    "number": {"type": "string", "description": "航班号"},
                    "date": {"type": "string", "description": "日期"}
                },
                "required": ["number", "date"]
            }
        }
    }
]
```

### 解析函数调用

```python
def parse_function_call(model_response):
    """根据函数名分发执行"""
    if model_response.choices[0].message.tool_calls:
        tool_call = model_response.choices[0].message.tool_calls[0]
        args = json.loads(tool_call.function.arguments)
        if tool_call.function.name == "get_plane_number":
            return get_plane_number(**args)
        if tool_call.function.name == "get_ticket_price":
            return get_ticket_price(**args)
    return ''
```

### 主流程（三轮调用）

```python
def main():
    messages = [
        {"role": "system", "content": "你是航班查询助手，不要假设或猜测参数值"},
        {"role": "user", "content": "帮我查询2024年4月2日，郑州到北京的航班的票价"}
    ]

    # 第一轮：模型调用 get_plane_number
    response1 = chat_completion_request(messages, tools=tools)
    messages.append(response1.choices[0].message.model_dump())
    r1 = parse_function_call(response1)
    messages.append({
        "role": "tool",
        "tool_call_id": response1.choices[0].message.tool_calls[0].id,
        "content": json.dumps(r1)
    })

    # 第二轮：模型调用 get_ticket_price
    response2 = chat_completion_request(messages, tools=tools)
    messages.append(response2.choices[0].message.model_dump())
    r2 = parse_function_call(response2)
    messages.append({
        "role": "tool",
        "tool_call_id": response2.choices[0].message.tool_calls[0].id,
        "content": json.dumps(r2)
    })

    # 第三轮：模型生成最终回答
    response3 = chat_completion_request(messages, tools=tools)
    print(response3.choices[0].message.content)
    # → 航班号 1123，票价 1000 元
```

---

## 案例三：数据库查询（SQL 自动生成）

**目标**：让模型根据自然语言问题自动生成 SQL 并执行，返回结构化结果。

### 关键差异：在 tools 中嵌入数据库模式

```python
database_schema_string = """
CREATE TABLE emp (empno INT, ename VARCHAR(50), job VARCHAR(50), ...);
CREATE TABLE dept (DEPTNO INT, DNAME VARCHAR(14), LOC VARCHAR(13), ...);
"""

tools = [
    {
        "type": "function",
        "function": {
            "name": "ask_database",
            "description": "使用此函数回答业务问题，输出为 SQL 查询语句",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": f"SQL 查询。数据库模式：{database_schema_string}。只含 MySQL 语法。"
                    }
                },
                "required": ["query"]
            }
        }
    }
]
```

### 数据库查询函数

```python
import pymysql

def ask_database(query):
    conn = pymysql.connect(host='localhost', port=3306, user='root', password='<PWD>', database='llm_db')
    cursor = conn.cursor()
    cursor.execute(query)
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result
```

### 执行效果

输入 "查询一下最高工资的员工姓名及对应的工资" → 模型自动生成 `SELECT ename, sal FROM emp ORDER BY sal DESC LIMIT 1` → 返回结构化结果 → 模型解析为自然语言。

## 三个案例的递进关系

| 案例 | 核心学习点 |
|------|----------|
| 天气查询 | 单一函数调用的完整流程：定义→描述→解析→执行→返回 |
| 航班查询 | 多函数自动编排 + 多轮调用链 |
| 数据库查询 | 动态 SQL 生成，将领域知识（表结构）嵌入 tools 描述 |
*（内容由AI生成，仅供参考）*
