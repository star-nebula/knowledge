---
title: LangChain Memory 组件
tags: [langchain, memory, chat-history, framework]
type: 概念解释
created: 2026-07-08
related:
  - "[[LangChain-MOC]]"
  - "[[LangChain Agents 组件]]"
  - "[[LangChain Chains 组件]]"
category: ["🧩 AI框架与Agent", "框架与中间件"]
---

# LangChain Memory 组件

Memory 组件解决大模型无状态问题，通过存储历史消息实现上下文对话。分为**短期记忆**（单一会话）和**长期记忆**（跨会话）。

## 会话记录存储

```python
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.chat_history import InMemoryChatMessageHistory

# 内存历史
history = InMemoryChatMessageHistory()
# 添加消息
history.add_message(HumanMessage(content="在吗？"))
history.add_message(AIMessage(content="我在，请问有什么可以帮您？"))
print("完整对话记录:", history.messages)
```

## 带记忆的对话链

通过 `RunnableWithMessageHistory` 将历史消息自动注入提示，实现连续对话。

```python
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory

llm = ChatOllama(model="qwen2.5:7b", temperature=0.1)

prompt = ChatPromptTemplate.from_messages([
    ("system", "以下是人类与AI的友好对话。AI健谈且会严格结合上下文回答。"),
    MessagesPlaceholder("chat_history"),  # 历史消息自动插入此处
    ("human", "{input}")
])

history = InMemoryChatMessageHistory()
conversation = RunnableWithMessageHistory(
    prompt | llm,
    get_session_history=lambda sid: history,  # 指向同一内存对象实现连续对话
    input_messages_key="input",
    history_messages_key="chat_history"
)

config = {"configurable": {"session_id": "conv_1"}}

print(conversation.invoke({"input": "小明有1只猫"}, config).content)
print(conversation.invoke({"input": "小刚有2只狗"}, config).content)
print(conversation.invoke({"input": "小明和小刚一共有几只宠物?"}, config).content)
```

### 记忆闭环流程

```
用户输入 {"input": "xxx"}
   ↓
[RunnableWithMessageHistory] 拦截
   ├─ 读取 history 中的旧消息
   ├─ 拼接为 [Human, AI, Human, AI, ...] 完整列表
   └─ 调模型 → 拿到新回复
   ↓
拦截器将新回复追加到 history（完成"记忆"闭环）
   ↓
返回 AI 答案
```

## 长期存储与恢复

将内存历史序列化落盘，进程重启后可恢复。

```python
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.messages import messages_to_dict, messages_from_dict
import json

# 1️⃣ 运行时交互（内存容器）
history = InMemoryChatMessageHistory()
history.add_message(HumanMessage(content="在吗？"))
history.add_message(AIMessage(content="我在。"))

# 2️⃣ 长期保存（序列化 + 落盘）
with open("chat_history.json", "w", encoding="utf-8") as f:
    json.dump(messages_to_dict(history.messages), f, ensure_ascii=False)

# --- 假设此时 Python 进程结束，或电脑重启 ---

# 3️⃣ 恢复历史（读取 + 反序列化）
with open("chat_history.json", "r", encoding="utf-8") as f:
    saved_msgs = messages_from_dict(json.load(f))

# 4️⃣ 重新装入内存容器，继续对话
history = InMemoryChatMessageHistory(messages=saved_msgs)

print(history.messages[0].content)  # 在吗？
print(history.messages[1].content)  # 我在。
```
