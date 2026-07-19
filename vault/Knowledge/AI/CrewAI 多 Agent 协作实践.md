---
title: CrewAI 多 Agent 协作实践
created: 2026-07-09
tags:
  - AI
  - Agent
  - CrewAI
  - 多Agent协作
type: 步骤操作
related:
  - "[[AI 应用核心范式-MOC]]"
reference: ""
category: ["🧩 AI框架与Agent", "AI 应用核心范式"]
---



# CrewAI 多 Agent 协作实践

以 CrewAI 为框架，开发 AI Agent 实现自动写信及发送邮件。

## 项目流程

1. 作家 Agent 根据用户需求创作文章
2. 编辑 Agent 对文章进行编辑排版并保存到本地
3. 寄信人 Agent 读取本地文件并通过邮件发送

![[Agent实现邮件自动发送.svg]]

## CrewAI 核心组件

| 组件 | 说明 |
|------|------|
| **Agent 代理** | 每个 Agent 有独特的角色、背景故事和技能 |
| **Task 任务** | 明确的目标和要求，可拆分为子任务 |
| **Tools 工具** | 根据任务定制化工具 |
| **Process 流程** | 任务分解、资源分配、沟通协调 |
| **Crew 执行者** | Agent + Task + Process 的容器，实际执行场所 |

## 环境配置

- Python 3.10 - 3.11
- 安装依赖：`pip install crewai langchain openai`
- 配置 OpenAI API Key

## 代码实现

### custom_tools.py

定义两个工具函数：保存文本到本地、发送邮件。

```python
from langchain.tools import tool
import datetime
import os
import smtplib
from email.mime.text import MIMEText
from email.utils import formataddr

class CustomTools():
    
    @tool("将文本写入文档中")
    def store_poesy_to_txt(content: str) -> str:
        """将编辑后的书信文本内容自动保存到txt文档中"""
        try:
            filename = f"./LLM/Agents/Email_Generate/poie.txt"
            with open(filename, 'w') as file:
                file.write(content)
            return f"File written to {filename}."
        except Exception:
            return "Error with the input for the tool."

    @tool("发送文本到邮件")
    def send_message(self):
        """读取生成的本地书信文件txt文本，并以邮件的形式发送"""
        from_name = "小可爱"
        from_addr = "934****65@qq.com"
        from_pwd = "ar****wzbtbfah"
        to_addr = "1gl****9@163.com"
        my_title = "520小情书"
        filename = f"./LLM/Agents/Email_Generate/poie.txt"
        
        with open(filename) as f:
            my_msg = f.read()
            
        msg = MIMEText(my_msg, 'plain', 'utf-8')
        msg['From'] = formataddr([from_name, from_addr])
        msg['Subject'] = my_title
        
        smtp_srv = "smtp.qq.com"
        
        try:
            srv = smtplib.SMTP_SSL(smtp_srv.encode(), 465)
            srv.login(from_addr, from_pwd)
            srv.sendmail(from_addr, [to_addr], msg.as_string())
            print('发送成功')
        except Exception as e:
            print('发送失败')
        finally:
            pass
```

### main.py

定义三个角色的 Agent 及其任务，按顺序执行。

```python
import os
from crewai import Agent, Task, Crew, Process
from tools.custom_tools import CustomTools
from dotenv import load_dotenv, find_dotenv
from langchain_community.chat_models import ChatOpenAI

load_dotenv(find_dotenv())
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
base_url = os.environ['OPENAI_BASE_URL']

client = ChatOpenAI(model_name="gpt-3.5-turbo")

# 1. 作家 Agent
poet = Agent(
    role='作家',
    goal='根据用户需求,创作出情感丰富的文章(最长字数不超过300个词)。',
    backstory="你作为一名著名的作家,拥有千万级别的粉丝,最擅长写情感类型的文章。",
    verbose=True,
    allow_delegation=False,
    llm=client
)

# 2. 编辑 Agent
letter_writer = Agent(
    role='内容编辑',
    goal='对作家撰写的文章内容进行精心编辑。',
    backstory="""
    作为一名经验丰富的编辑，你在编辑书信方面有多年的专业经验，
    你需要将作家写的文章内容整理编排成书信的样式，并将书信内容存储在本地磁盘上。
    你必须使用提供的工具将存储到指定文件中，并确保文件已保存到磁盘上。
    """,
    verbose=True,
    allow_delegation=False,
    tools=[CustomTools.store_poesy_to_txt],
    llm=client
)

# 3. 寄信人 Agent
sender = Agent(
    role="寄信人",
    goal="将编辑好的书信以邮件的形式发送给心仪的人",
    backstory="你是一名勤恳的信使，专注于将书信传递给每个人，你必须使用提供的工具将指定文件的书信内容中传送到其他人的邮箱里",
    verbose=True,
    allow_delegation=True,
    tools=[CustomTools.send_message],
    llm=client
)

# 4. 创建任务
task1 = Task(
    description="用户输入：帮我写一份情书，表达爱意，并用于送给心仪的人。",
    agent=poet
)

task2 = Task(
    description="""
    查找任何语法错误，进行编辑和格式化（如果需要）。
    并要求将内容保存在本地磁盘中。最后的答案必须是信息是否已被存储在本地磁盘中。
    """,
    agent=letter_writer
)

task3 = Task(
    description="根据本次磁盘保存的书信内容，你将整理并发送邮件给心仪的人。最后的答案一定要成功发送该邮件。",
    agent=sender
)

# 5. 启动任务（顺序执行）
crew = Crew(
    agents=[poet, letter_writer, sender],
    tasks=[task1, task2, task3],
    verbose=2,
    process=Process.sequential
)

result = crew.kickoff()
```

## 关键要点

- 每个 Agent 有独立角色（role）、目标（goal）、背景（backstory），LLM 据此规划行为
- `allow_delegation` 控制 Agent 间是否能互相委派任务
- `Process.sequential` 保证任务按顺序执行，上一任务结果传递给下一任务
- 工具通过 `tools=[...]` 绑定到具体 Agent，Agent 在执行时自动选择调用
*（内容由AI生成，仅供参考）*
