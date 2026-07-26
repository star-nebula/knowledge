# 什么是 LangChain
- **创建**：Harrison Chase 于 2022年10月创建  
- **定位**：围绕大语言模型（LLMs）的框架，自身不开发LLMs  
- **核心思想**：<mark style="background: #ADCCFFA6;">为各种LLMs提供通用接口</mark>，将组件“链接”起来，简化复杂LLM应用开发  
- **语言支持**：Python、Node.js
- **第三方库**：`pip instal langchain`|`pip install langchain-community`

# 主要组件
## 1. Models组件
LangChain支持三种模型类型：

### LLMs（大语言模型）
- 输入文本字符，返回文本字符  
- 常用模型下载：[huggingface.co/models](https://huggingface.co/models)

```python
from langchain_community.llms import Ollama
model = Ollama(model="qwen2.5:7b")
```

### Chat Models（聊天模型）
- 基于LLMs，但输入和输出都是聊天消息（结构化格式）
- 消息类型：
  - **HumanMessage**：用户发送的提示信息
  - **AIMessage**：模型的响应，用于回传历史
  - **SystemMessage**：设定模型行为和目标（如“返回JSON格式”）
  - **ChatMessage**：任意形式的消息（推荐尽量使用前三种）

### Embeddings Models（嵌入模型）
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

## 2. Prompts组件
- 用于构建给模型的提示，支持zero-shot和few-shot等方式
- 提供 `PromptTemplate` 类，帮助模板化

### zero-shot 提示
```python
from langchain import PromptTemplate
from langchain_community.llms import Ollama

model = Ollama(model="qwen2.5:7b")
template = "我的邻居姓{lastname}，他生了个儿子，给他儿子起个名字"
prompt = PromptTemplate(input_variables=["lastname"], template=template)
prompt_text = prompt.format(lastname="王")
result = model(prompt_text)
```

### few-shot 提示
```python
from langchain_core.prompts import PromptTemplate, FewShotPromptTemplate
from langchain_community.llms import Ollama

model = Ollama(model="qwen3.5:9b")
examples = [
    {"word": "开心", "antonym": "难过"},
    {"word": "高", "antonym": "矮"}
]
example_template = """单词：{word}，反义词：{antonym}\\n"""
example_prompt = PromptTemplate(
    template=example_template, 
    input_variables=["word", "antonym"])
few_show_prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    prefix="请根据以下示例，给出单词的反义词：",  # 前缀
    suffix="单词：{word}，反义词：", # 后缀
    input_variables=["word"],  # 输入变量
    example_separator="\\n"  # 示例之间的分隔符
)
prompt_text = few_show_prompt.format(word="细")
res = model.invoke(prompt_text)
print(res)
```

## 3. Chains组件
- 将LLM与其他组件（如提示模板）组合成链，完成一个应用流程
- 单一 Chains
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
- 复合 Chains
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
## 4. Agents组件
- **作用**：根据用户需求，**自动选择并调用第三方工具**（如搜索引擎、数学计算），解决大模型自身局限（如实时信息、复杂数学问题）
- 代理类型示例：`AgentType.ZERO_SHOT_REACT_DESCRIPTION`
### 核心构成

- **Agent（代理）**
    - **作用**：制定计划和思考下一步需要采取的行动。
    - 负责控制整个代码的逻辑和执行，暴露接口接收用户输入，并返回 `AgentAction`（下一步动作）或 `AgentFinish`（最终结果）。
        
- **Tool（工具）**
    - **作用**：解决问题的具体能力。
    - 是**第三方服务**的集成，比如计算器、网络搜索（谷歌、Bing）等。
        
- **Toolkit（工具包）**
    - **作用**：一些为特定任务集成好的代理包。
    - **示例**：使用 `create_csv_agent` 让模型直接解读CSV文件。
	    ```python
	    from langchain.agents import create_csv_agent
		from langchain.llms import OpenAI

		agent = create_csv_agent(OpenAI(temperature=0), 'data.csv', verbose=True)
		agent.run("一共有多少行数据？")
	    ```

- **AgentExecutor（代理执行器）**
    - **作用**：将代理和工具列表包装在一起，负责迭代运行代理的循环，直到满足停止标准。
### 基本用法
[自定义工具](https://docs.langchain.com/oss/python/langchain/tools#advanced-schema-definition:~:text=Advanced%20schema%20definition%0A%E9%AB%98%E7%BA%A7%E6%A8%A1%E5%BC%8F%E5%AE%9A%E4%B9%89)
```python
from langchain_ollama import ChatOllama
from langchain_core.tools import tool
from langchain.agents import create_agent
from langchain_core.prompts import PromptTemplate

@tool
def calculate(expression: str) -> str:
    """计算数学表达式"""
    import numexpr
    return str(numexpr.evaluate(expression))

agent = create_agent(
    model = ChatOllama(model="qwen2.5:7b"), 
    tools = [calculate],
    system_prompt="你是一个数学助手。请合理使用 calculate 工具解题。"
    )

prompt = PromptTemplate(
    template="解以下方程：3x + 4(x + 2) - 84 = y; 其中x为3，请问y是多少？")
res = agent.invoke({"messages": prompt.format()})
print(f"HumanMessage--> {res['messages'][0].content}")
print(f"AIMessage--> {res['messages'][-1].content}")
```
## 5. Memory组件
- 解决大模型无状态问题，通过存储历史消息实现上下文对话
- 分为**短期记忆**（单一会话）和**长期记忆**（跨会话）

### 会话记录存储
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

### 带记忆的对话链
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
```
用户输入 {"input": "xxx"}
   ↓
[RunnableWithMessageHistory] 拦截
   ├─ 读取 history 中的旧消息
   ├─ 拼接为 [Human, AI, Human, AI, ...] 完整列表
   └─ 调模型 → 拿到新回复
   ↓
拦截器将新回复追加到 history（完成“记忆”闭环）
   ↓
返回 AI 答案
```
### 长期存储与恢复
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

## 6. Indexes组件
索引，用来结构化文档，以便和模型交互

### 文档加载器（Document Loaders）
- 基于 `Unstructured` 包，可将多种文件转为文本（`pip install unstructured`）
- 支持文件类型：CSV、JSON、Jupyter Notebook、Markdown、PowerPoint、PDF、图片、HTML、文件目录等。
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

### 文档分割器（Text Splitters）
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
- 其他分割器：`LatexTextSplitter`、`MarkdownTextSplitter`、`TokenTextSplitter`、`PythonCodeTextSplitter` 等。

### 向量数据库（VectorStores）
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
- 支持的向量数据库：Chroma、ElasticSearch、Milvus、Redis、FAISS、Pinecone 等。

### 检索器（Retrievers）
- 约定至少实现 `get_relevant_texts(query)` 方法，返回相关文档
- 使用 FAISS （`pip install faiss-cpu` / `conda install -c pytorch -c conda-forge faiss-gpu`）
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
- 支持的检索器：Azure Cognitive Search、ChatGPT Plugin、ElasticSearch BM25、Pinecone、TF-IDF、Wikipedia 等。

# LangChain使用场景
- 个人助手
- 聊天机器人
- API 交互
- 输入标题问答系统
- Tabular 数据查询
- 信息提前
- 文档总结