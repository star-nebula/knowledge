---
title: LangChain Agents 组件
tags: [agent, agents, ai, framework, langchain, tools]
type: 概念解释
created: 2026-07-08
related:
  - "[[LangChain-MOC]]"
  - "[[LangChain Chains 组件]]"
  - "[[LangChain Memory 组件]]"
---
# LangChain Agents 组件

Agents 组件根据用户需求，**自动选择并调用第三方工具**（如搜索引擎、数学计算），解决大模型自身局限（如实时信息、复杂数学问题）。代理类型示例：`AgentType.ZERO_SHOT_REACT_DESCRIPTION`。

## 核心构成

- **Agent（代理）**
  - 作用：制定计划和思考下一步需要采取的行动
  - 负责控制整个代码的逻辑和执行，暴露接口接收用户输入，并返回 `AgentAction`（下一步动作）或 `AgentFinish`（最终结果）

- **Tool（工具）**
  - 作用：解决问题的具体能力
  - 是第三方服务的集成，比如计算器、网络搜索（谷歌、Bing）等

- **Toolkit（工具包）**
  - 作用：一些为特定任务集成好的代理包
  - 示例：使用 `create_csv_agent` 让模型直接解读 CSV 文件

  ```python
  from langchain.agents import create_csv_agent
  from langchain.llms import OpenAI

  agent = create_csv_agent(OpenAI(temperature=0), 'data.csv', verbose=True)
  agent.run("一共有多少行数据？")
  ```

- **AgentExecutor（代理执行器）**
  - 作用：将代理和工具列表包装在一起，负责迭代运行代理的循环，直到满足停止标准

## 基本用法（自定义工具）

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

## 高级工具定义

自定义工具的高级 schema 定义参考：[Advanced schema definition](https://docs.langchain.com/oss/python/langchain/tools#advanced-schema-definition)

## 相关阅读

- [[n8n AI Agent 工作流]]
- [[大模型-基础]]
- [[网页笔记四步工作流]]
