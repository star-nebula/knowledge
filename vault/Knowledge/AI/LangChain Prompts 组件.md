---
title: LangChain Prompts 组件
tags: [langchain, prompts, template, few-shot, framework]
type: 概念解释
created: 2026-07-08
related:
  - "[[LangChain-MOC]]"
  - "[[LangChain Models 组件]]"
  - "[[LangChain Chains 组件]]"
category: ["🧩 AI框架与Agent", "框架与中间件"]
---

# LangChain Prompts 组件

Prompts 组件用于构建给模型的提示，支持 zero-shot 和 few-shot 等方式，提供 `PromptTemplate` 类帮助模板化。

## zero-shot 提示

```python
from langchain import PromptTemplate
from langchain_community.llms import Ollama

model = Ollama(model="qwen2.5:7b")
template = "我的邻居姓{lastname}，他生了个儿子，给他儿子起个名字"
prompt = PromptTemplate(input_variables=["lastname"], template=template)
prompt_text = prompt.format(lastname="王")
result = model(prompt_text)
```

## few-shot 提示

通过示例引导模型输出，适合反义词、格式转换等任务。

```python
from langchain_core.prompts import PromptTemplate, FewShotPromptTemplate
from langchain_community.llms import Ollama

model = Ollama(model="qwen3.5:9b")
examples = [
    {"word": "开心", "antonym": "难过"},
    {"word": "高", "antonym": "矮"}
]
example_template = """单词：{word}，反义词：{antonym}\n"""
example_prompt = PromptTemplate(
    template=example_template,
    input_variables=["word", "antonym"])
few_show_prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    prefix="请根据以下示例，给出单词的反义词：",  # 前缀
    suffix="单词：{word}，反义词：", # 后缀
    input_variables=["word"],  # 输入变量
    example_separator="\n"  # 示例之间的分隔符
)
prompt_text = few_show_prompt.format(word="细")
res = model.invoke(prompt_text)
print(res)
```

## 关键参数

| 参数 | 说明 |
|------|------|
| `examples` | 示例列表（字典形式） |
| `example_prompt` | 单个示例的模板 |
| `prefix` | 示例前引导语 |
| `suffix` | 示例后、用户输入前的提示 |
| `example_separator` | 示例之间的分隔符 |
