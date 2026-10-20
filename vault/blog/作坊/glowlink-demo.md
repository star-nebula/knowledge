---
tags:
  - 作坊
  - AI Agent
  - RAG
  - LangGraph
---

# GlowLink：多 Agent 社媒获客系统

> 一个出海 SaaS 品牌的 AI Agent Demo，覆盖「内容生产 → 社媒运营 → 销售转化」全链路自动化。技术栈：LangGraph + RAG 混合检索 + MCP 跨进程工具调用。

## 架构总览

![[architecture-overview.png|GlowLink 系统架构总览]]

**核心设计**：Supervisor 路由模式——一个「领导」带三个「兵」，每个 Agent 执行后必须返回 Supervisor 判断是否结束。工具权限隔离：ContentAgent 不调 CRM，SalesAgent 不调搜索。

---

## 技术选型

| 技术决策 | 选定方案 | 为什么选这个 |
|---------|---------|-------------|
| LLM | DeepSeek (deepseek-chat) | 国内直连，成本低，支持 Function Calling |
| Agent 框架 | LangChain + LangGraph | StateGraph 可视化编排，条件边实现动态路由 |
| Agent 模式 | Supervisor 路由 | 路由可控，出问题可精确归因 |
| Embedding | BAAI/bge-small-zh-v1.5 | 本地离线，中文效果好，CPU 可跑 |
| 向量库 | Chroma（内存模式） | 轻量级，无需 Docker |
| Reranker | BAAI/bge-reranker-base | CrossEncoder 精排 Top-3 |
| 混合检索 | BM25 + 向量，权重 4:6 | 关键词 + 语义互补 |
| 工具调用(进程内) | LangChain @tool | RAG 和 CRM 工具 |
| 工具调用(跨进程) | MCP | 搜索工具走标准协议，展示解耦能力 |
| UI | Streamlit | 极简，链路可追踪 |

---

## 核心亮点

### 1. RAG 混合检索 + 重排序

不是简单的「调 API 查向量库」，而是一个三层漏斗：

![[rag-pipeline.png|RAG Pipeline 混合检索]]

- **BM25 关键词检索**（权重 0.4）：精准命中「$49」「试用期」等专有名词
- **向量语义检索**（权重 0.6）：理解「怎么收费」和「定价」是同一回事
- **BGE Reranker 重排序**：Top-10 候选逐个 CrossEncoder 打分，精排取 Top-3
- **引用溯源**：每条回答附带来源文件名

### 2. 双层记忆机制

| 记忆层 | 实现方式 | 作用 |
|--------|---------|------|
| short_term_memory | LangGraph messages 字段，add_messages reducer | 跨轮对话：第二轮能引用第一轮提到的信息 |
| cross_agent_memory | 每个 Agent 执行后写入 150 字摘要 | 跨 Agent 共享：SalesAgent 知道 ContentAgent 写了什么帖子 |

### 3. 工具权限隔离

| Tool | ContentAgent | SocialAgent | SalesAgent |
|------|:-----------:|:-----------:|:----------:|
| get_knowledge (RAG) | ✅ | ✅ | ✅ |
| search_web (MCP) | ✅ | ❌ | ❌ |
| save_to_crm (CRM) | ❌ | ❌ | ✅ |

> ContentAgent 不应调 CRM（写帖子时不该顺手录客户），SalesAgent 不应调搜索（回答价格不需要搜行业趋势）。权限隔离防止 Agent「越权操作」，是企业级 Agent 系统的关键设计。

### 4. 评测体系（有数据 + 有归因 + 有回归）

- 3 个测试 Case 覆盖内容生成、线索识别、RAG 溯源
- 失败归因：路由错误 / 检索失败 / 生成偏差 / 工具未调用
- 回归测试：对比历史结果，追踪改进效果

---

## 两个值得讲的「坑」

### 坑 1：向量检索搜不到「$49」

用户问「多少钱」，向量检索返回的是「定价灵活」「性价比高」等泛泛描述，而不是包含「$49/月」的段落。

**原因**：Embedding 模型对数字和符号的语义编码不够强，「多少钱」和「$49」在向量空间中距离较远。

**解法**：引入 BM25 关键词检索做补充。BM25 基于词频匹配，对「$49」「14 天」「Instagram」等关键词命中精准。混合权重 BM25:向量 = 4:6，关键词为辅、语义为主。

### 坑 2：Agent 编造不存在的数据

ContentAgent 在写帖子时，会编造「GlowLink 支持 TikTok 自动发布」等功能，这些在知识库中并不存在。

**解法**：在每个 Agent 的 System Prompt 中加入防幻觉规则——「价格、功能、数据类信息必须来自 RAG 返回结果」「如果 RAG 没搜到，明确说暂时无法确认，禁止编造」。

---

## 技术决策速查

![[tech-decisions.png|技术决策概览]]

---

## 项目信息

- **类型**：Demo / 概念验证
- **源码**：[GitHub](https://github.com/star-nebula/job-demo/tree/main/social-media-agent-demo)
- **开发方式**：全程 AI 编程工具（CodeBuddy）辅助，遵循 AI Engineering Loop
- **技术栈**：Python / LangChain + LangGraph / Chroma / Streamlit / DeepSeek / MCP
