---
title: LangChain Indexes 组件
tags: [langchain, indexes, rag, vectorstore, retrieval, framework]
type: 概念解释
created: 2026-07-08
related:
  - "[[LangChain-MOC]]"
  - "[[LangChain Models 组件]]"
  - "[[LangChain Memory 组件]]"
category: ["🧩 AI框架与Agent", "框架与中间件"]
---

# LangChain Indexes 组件

Indexes 组件用来结构化文档，以便和模型交互。典型链路：文档加载 → 文本分割 → 向量化存储 → 检索（RAG 基础）。

## 文档加载器（Document Loaders）

- 基于 `Unstructured` 包，可将多种文件转为文本（`pip install unstructured`）
- 支持文件类型：CSV、JSON、Jupyter Notebook、Markdown、PowerPoint、PDF、图片、HTML、文件目录等

```python
from langchain_community.document_loaders import UnstructuredFileLoader
loader = UnstructuredFileLoader('../data/衣服属性.txt', encoding='utf8')
docs = loader.load()
print(docs[0].page_content[10:100])
```

- 指定文件类型

```python
from langchain_community.document_loaders import TextLoader
loader = TextLoader('../data/衣服属性.txt', encoding='utf8')
docs = loader.load()
print(docs[0].page_content[200:300])
```

## 文档分割器（Text Splitters）

- 因模型输入长度限制，需将长文本分割为语义相关的片段
- 基本分割器 `CharacterTextSplitter`：

```python
from langchain_text_splitters import CharacterTextSplitter

text_splitter = CharacterTextSplitter(
    separator=" ",   # 分隔符
    chunk_size=5,    # 切分后每个块的最大长度
    chunk_overlap=0  # 相邻两个块之间的重叠长度
)
# 1. 切分纯文本（返回字符串列表）
chunks = text_splitter.split_text("a b c d e f")
print(chunks)  # ['a b c', 'd e f']
# 2. 切分并包装为文档对象（返回 Document 列表）
docs = text_splitter.create_documents(["a b c d e f", "e f g h"])
print(docs[0].page_content)  # a b c
```

- 其他分割器：`LatexTextSplitter`、`MarkdownTextSplitter`、`TokenTextSplitter`、`PythonCodeTextSplitter` 等

## 向量数据库（VectorStores）

- 存储嵌入向量并提供相似性查询
- 例：使用 Chroma（`pip install chromadb`）

```python
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import Chroma

with open('..\data\pku.txt') as f:
    text = f.read()
# 文档切分
text_splitter = CharacterTextSplitter(chunk_size=100, chunk_overlap=0)
texts = text_splitter.split_text(text)
# 文档向量化
embeddings = OllamaEmbeddings(model="qwen3-embedding:4b")
docsearch = Chroma.from_texts(texts, embeddings)  # 构建向量数据库
# 语义检索
docs = docsearch.similarity_search("1937年北京大学发生了什么？", k=6)
print(docs[0].page_content)
print(len(docs))  # 6
```

- 支持的向量数据库：Chroma、ElasticSearch、Milvus、Redis、FAISS、Pinecone 等

## 检索器（Retrievers）

- 约定至少实现 `get_relevant_texts(query)` 方法，返回相关文档
- 使用 FAISS（`pip install faiss-cpu` / `conda install -c pytorch -c conda-forge faiss-gpu`）

```python
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import OllamaEmbeddings

loader = TextLoader('./pku.txt')
documents = loader.load()
texts = CharacterTextSplitter(chunk_size=100, chunk_overlap=0).split_documents(documents)
embeddings = OllamaEmbeddings(model="mxbai-embed-large")
db = FAISS.from_documents(texts, embeddings)
retriever = db.as_retriever(search_kwargs={'k': 1})
docs = retriever.get_relevant_documents("北京大学什么时候成立的")
```

- 支持的检索器：Azure Cognitive Search、ChatGPT Plugin、ElasticSearch BM25、Pinecone、TF-IDF、Wikipedia 等
