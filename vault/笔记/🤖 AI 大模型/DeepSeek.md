---
title: DeepSeek
date: 2026-07-08
tags: [ai, deepseek, foundation-model, llm]
  - AI
  - 大模型
  - DeepSeek
type: topic
---
## 📘DeepSeek 基础知识介绍

### 1. 背景
- **DeepSeek（深度求索）**：中国人工智能实验室，2023年7月成立于杭州。
- **目标**：技术民主化，推动人工智能普惠发展，坚持开源路线与技术创新。

### 2. 发展历程与关键技术

| 模型 | 发布时间 | 核心参数 | 关键创新 | 主要任务 |
| :--- | :--- | :--- | :--- | :--- |
| **DeepSeek LLM (V1)** | 2023.11 | 7B / 67B | LLaMA 架构改良，GQA | 通用文本生成 |
| **DeepSeek Coder** | 2023.11 | 1.3B ~ 33B | FIM 训练，多语言 | 代码生成/理解 |
| **DeepSeek Math** | 2024.02 | 7B | GRPO 算法 | 数学推理 |
| **DeepSeek V2** | 2024.05 | 236B (MoE) | **MLA** + **DeepSeekMoE** | 通用大模型 |
| **DeepSeek Coder V2** | 2024.06 | 16B / 236B | V2 架构 + 代码数学联合 | 代码/数学推理 |
| **DeepSeek VL** | 2024.03 | 7B | 视觉编码器 + LLM | 图文理解 |
| **DeepSeek V3** | 2024.12 | 671B (MoE) | **无辅助损失负载均衡** + **MTP** | 通用大模型（SOTA） |
| **DeepSeek R1** | 2025.01 | 671B | **GRPO + 冷启动 + 拒绝采样** | 推理增强（类似 o1） |

#### DeepSeek Coder（代码模型）
- **架构**：基于 DeepSeek LLM 架构，专为代码生成与理解优化
- **数据**：训练数据包含大量代码语料（多语言），涵盖 GitHub 开源代码、编程竞赛数据等
- **创新**：
  - 采用 **Fill-In-The-Middle (FIM)** 训练目标，增强代码补全能力
  - 支持 **多语言** 代码生成（Python、Java、C++、JavaScript 等）
  - 提供 **中英文双语** 的代码理解能力
- **效果**：在 HumanEval、MBPP 等代码基准上表现优异，与同等规模的开源代码模型（如 CodeLlama）相当或更优

#### DeepSeek LLM（V1）
- **架构**：基于 LLaMA 设计（Transformer，Pre-Norm，RMSNorm，SwiGLU，RoPE，GQA）
- **参数**：7B（MHA） / 67B（GQA）
- **数据**：2T tokens（中英文为主），分词器 实现BBPE算法
- **超参数**：
  - 优化器：AdamW
  - 学习率策略：多阶段（预热 → 稳定 → 分步退火）
- **效果**：英文理解接近 LLaMA2，中文及数学推理优于 LLaMA2 70B

#### DeepSeek Math
- **发布**：2024年 2月
- **专注数学推理**，基于 DeepSeek LLM 架构两阶段训练（代码预训练 → 数学专项训练）
- **创新**：引入 **GRPO**（Group Relative Policy Optimization）替代 PPO，去除价值函数，节省资源
  - 步骤：采样 → 奖励计算 → 基线估计（组归一化）→ 优化目标 → 迭代训练
- **效果**：7B 模型在 MATH 基准上达 51.7%，接近 GPT-4

#### DeepSeek VL（多模态视觉语言模型）
- **发布**：2024年3月（DeepSeek VL）
- **架构**：基于 DeepSeek LLM + 视觉编码器（如 CLIP 或 SigLIP），通过视觉-语言对齐训练
- **能力**：
  - 支持 **图像理解**：识别物体、场景、OCR（光学字符识别）
  - 支持 **图文对话**：基于图像回答问题、生成描述
  - 支持 **视觉推理**：如数学公式识别、图表分析
- **创新**：
  - 采用 **多模态混合训练**，融合文本与图像数据
  - 支持 **中英文双语** 的视觉语言理解
- **效果**：在 VQA、OCR、图表理解等基准上表现优秀，适合文档理解、教育、智能客服等场景

#### DeepSeek V2
- **发布**：2024年 5月
- **创新架构**：
  - **MLA（Multi-Head Latent Attention）**：低秩压缩 KV Cache，显著降低推理显存占用，同时保留多头能力
  - **DeepSeekMoE（混合专家）**：细粒度专家分割 + 共享专家隔离，缓解知识杂糅与冗余
- **效果**：英文、数学、编码优于 Qwen1.5 72B 和 Mixtral 8x22B；中文优于 LLaMA3

#### DeepSeek Coder V2
- **发布**：2024年6月17日
- **架构**：基于 DeepSeek V2 架构（MLA + MoE），专为代码与数学推理优化
- **参数**：提供多种规模（如 16B、236B 等）
- **创新**：
  - 继承 **MLA**（低秩 KV Cache）和 **MoE**（细粒度专家分割 + 共享专家隔离）
  - 进一步强化 **代码与数学推理** 的联合训练，支持更复杂的逻辑推理任务
  - 支持 **长上下文**（128K tokens），可处理大型代码库和文档
- **效果**：
  - 在 HumanEval、MBPP、CodeContests 等代码基准上超越多数开源模型
  - 在数学推理（MATH、GSM8K）上表现接近专业数学模型
  - 与 GPT-4 Turbo 在代码任务上表现相当，且开源可部署

#### DeepSeek V3
- **发布**：2024年12月26日，671B 参数 MoE 架构
- **创新**：
  - **无辅助损失的负载均衡策略**：添加偏置项调节路由专家选择概率
  - **Multi-Token Prediction**：多 token 预测训练，提升主模型性能（推理时只使用主模型）
- **成本**：仅 557.6 万美元（Llama3 405B 成本为其几十倍）
- **效果**：多项基准接近 GPT-4o 和 Claude-3.5-Sonnet，中文事实知识超越 GPT-4o

#### DeepSeek R1
- **发布**：2025年1月20日
- **R1-Zero**：无监督微调（SFT），仅用强化学习（GRPO）训练，涌现推理行为，但可读性差、语言混合
- **R1**：加入冷启动数据 → 多阶段训练（冷启动 SFT → 推理 RL → 拒绝采样 SFT → 全场景 RL）
- **蒸馏**：将 R1 推理能力蒸馏到小模型（Qwen、Llama），仅需 SFT，无需 RL
- **效果**：R1 推理性能与 OpenAI-o1-1217 相当


## 📘DeepSeek 模型部署使用

### 1. 通过官网 Web 访问
- 网址：https://chat.deepseek.com/
- 登录后直接对话，可选择“深度思考”模式体验 R1 逐步推理

### 2. 通过 DeepSeek API 访问
- API 兼容 OpenAI 格式，方便嵌入应用程序

### 3. 本地部署 DeepSeek R1

#### 硬件需求
- **完整模型**：需要高性能 GPU（如 RTX 3090+）或 CPU（至少 48GB RAM + 250GB 磁盘）
- **蒸馏模型**（1.5B ~ 70B）：适合低配置，例如 7B 模型需 ≥6GB VRAM

#### 3.1 使用 Ollama 部署
- **安装 Ollama**：https://ollama.com/
- **验证安装**：`ollama --version`
- **下载模型**：
  ```bash
  ollama run deepseek-r1          # 默认 7B
  ollama run deepseek-r1:1.5b     # 指定版本
  ```
- **Python 调用**：
  ```python
  import ollama
  response = ollama.chat(model='deepseek-r1', messages=[{'role':'user', 'content':'为什么天空是蓝色的？'}])
  print(response['message']['content'])
  ```

#### 3.2 使用 Hugging Face 部署
```python
from transformers import AutoModelForCausalLM, AutoTokenizer
model = AutoModelForCausalLM.from_pretrained("deepseek-ai/DeepSeek-R1")
tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1")
inputs = tokenizer("请解释量子力学的基本原理。", return_tensors="pt")
outputs = model.generate(**inputs, max_length=100)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
```

### 总结
- **DeepSeek** 从 V1 到 R1 持续迭代，在架构（MLA、MoE、GRPO）、训练策略（冷启动、拒绝采样、蒸馏）和成本控制上均有重大创新。
- **部署方式**灵活：Web 聊天、API、本地 Ollama / Hugging Face，适合不同规模的需求。

