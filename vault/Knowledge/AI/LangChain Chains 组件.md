---
title: LangChain Chains 组件
tags: [langchain, chains, lcel, framework]
type: 概念解释
created: 2026-07-08
related:
  - "[[LangChain-MOC]]"
  - "[[LangChain Prompts 组件]]"
  - "[[LangChain Models 组件]]"
category: ["🧩 AI框架与Agent", "框架与中间件"]
---

# LangChain Chains 组件

Chains 组件将 LLM 与其他组件（如提示模板）组合成链，完成一个应用流程。LangChain 表达式语言（LCEL）使用 `|` 管道符串联组件。

## 单一 Chains

```python
from langchain_core.prompts import PromptTemplate
from langchain_community.llms import Ollama

template = "请将以下英文翻译成中文：{text}"
prompt = PromptTemplate(template=template, input_variables=["text"])
model = Ollama(model="qwen2.5:7b")
chain = prompt | model
res = chain.invoke("What is LangChain?")
print(res)
```

## 复合 Chains

将多条链组合成一条链，前一条链的输出作为后一条链的输入。

```python
from langchain_core.prompts import PromptTemplate
from langchain_community.llms import Ollama

model = Ollama(model="qwen2.5:7b")
template = "我的邻居姓{last_name}，他给他儿子起了个名字"
# 第一条链
first_prompt = PromptTemplate(template=template,
                              input_variables=["last_name"])
first_chain = first_prompt | model
# 第二条链
second_prompt = PromptTemplate(template="他的儿子叫{child_name}, 领居给他儿子起了个小名",
                               input_variables=["child_name"],
                               verbose=True  # 打印链的执行过程(推导过程)
                               )
second_chain = second_prompt | model
# 将两个链组合成一个链
full_chain = first_chain | second_chain
res = full_chain.invoke({"last_name": "王"})
print(res)
```

## 说明

- `verbose=True` 可打印链的执行过程（推导过程），便于调试
- 复合链通过 `|` 串联，数据自动在链间流动
