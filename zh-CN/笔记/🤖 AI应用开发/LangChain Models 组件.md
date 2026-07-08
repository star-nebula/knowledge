---
title: LangChain Models 组件
tags: [langchain, models, llm, embeddings, framework]
type: 概念解释
created: 2026-07-08
related:
  - "[[LangChain-MOC]]"
  - "[[LangChain Prompts 组件]]"
  - "[[LangChain Chains 组件]]"
---

# LangChain Models 组件

LangChain 支持三种模型类型，分别服务于不同的输入输出形态。

## 1. LLMs（大语言模型）

- 输入文本字符，返回文本字符
- 常用模型下载：[huggingface.co/models](https://huggingface.co/models)

```python
from langchain_community.llms import Ollama
model = Ollama(model="qwen2.5:7b")
```

## 2. Chat Models（聊天模型）

- 基于 LLMs，但输入和输出都是聊天消息（结构化格式）
- 消息类型：
  - **HumanMessage**：用户发送的提示信息
  - **AIMessage**：模型的响应，用于回传历史
  - **SystemMessage**：设定模型行为和目标（如"返回 JSON 格式"）
  - **ChatMessage**：任意形式的消息（推荐尽量使用前三种）

## 3. Embeddings Models（嵌入模型）

- 将文本转换为浮点数向量列表
- 作用：文本向量化，用于语义搜索等

```python
from langchain_community.embeddings import OllamaEmbeddings
model = OllamaEmbeddings(model="mxbai-embed-large", temperature=0)

# 单个查询向量
res1 = model.embed_query('这是第一个测试文档')
print(len(res1))  # 1024

# 多个文档向量
res2 = model.embed_documents(['这是第一个测试文档', '这是第二个测试文档'])
```

## 小结

| 类型 | 输入 | 输出 | 典型用途 |
|------|------|------|----------|
| LLMs | 文本 | 文本 | 简单补全 |
| Chat Models | 消息列表 | 消息 | 对话、Agent |
| Embeddings | 文本 | 向量 | 语义检索、RAG |
