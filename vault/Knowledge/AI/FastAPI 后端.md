---
title: FastAPI 后端
created: 2026-07-10
tags:
  - 大模型
  - 后端
  - API
type: 概念解释
category: ["🤖 AI大模型", "模型部署"]
---


# FastAPI 后端

FastAPI 是 Python 高性能 Web 框架，常用于大模型 API 服务部署。

## 核心特性

| 特性 | 说明 |
|------|------|
| 类型提示 | 基于 Python 类型注解自动生成 OpenAPI 文档 |
| 异步支持 | 原生 `async/await`，支持高并发 |
| 自动验证 | 通过 Pydantic 模型验证请求/响应 |
| 依赖注入 | 灵活管理业务逻辑依赖 |

## 典型部署架构

```
用户请求 → Nginx（反向代理） → FastAPI（ASGI） → 大模型推理引擎
```

## 关键代码模式

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    prompt: str
    max_tokens: int = 100

@app.post("/chat")
async def chat(request: ChatRequest):
    # 调用模型推理
    result = await model.generate(request.prompt, request.max_tokens)
    return {"response": result}
```

## 性能优化

- **异步推理**：使用 `asyncio` 避免阻塞主线程
- **批处理**：合并多个请求，利用 GPU 并行
- **流式响应**：使用 `StreamingResponse` 逐步返回 token
- **限流**：`slowapi` 或 `fastapi-limiter` 防滥用

## 监控与日志

- 结构化日志（JSON）
- Prometheus + Grafana 监控 QPS、延迟、错误率
- 健康检查端点 `/health`
