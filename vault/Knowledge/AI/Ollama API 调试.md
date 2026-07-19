---
title: Ollama API 调试
created: 2026-07-08
tags:
  - Ollama
  - API
  - Apifox
type: 步骤操作
related:
  - "[[模型部署-MOC]]"
  - "[[Ollama 概述]]"
category: ["🤖 AI大模型", "模型部署"]
---

# Ollama API 调试

## 开通远程访问（Linux）

修改 `/etc/systemd/system/ollama.service`，在 `[Service]` 段添加：

```ini
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_ORIGINS=*"
```

```shell
systemctl daemon-reload
systemctl restart ollama
# 开放防火墙端口
firewall-cmd --zone=public --add-port=11434/tcp --permanent
firewall-cmd --reload
```

## API 接口一览

| 接口 | 方法 | 路径 |
|------|------|------|
| 内容生成 | POST | `/api/generate` |
| 聊天对话 | POST | `/api/chat` |
| 向量化 | POST | `/api/embeddings` |
| 运行中的模型 | GET | `/api/ps` |
| 可用模型列表 | GET | `/api/tags` |
| 拉取模型 | POST | `/api/pull` |
| 删除模型 | DELETE | `/api/delete` |

## Apifox 调试

1. 从 [Ollama 官方文档](https://github.com/ollama/ollama/tree/main/docs) 下载 `openapi.yaml`
2. Apifox → 导入 → 选择 OpenAPI 格式 → 导入文件
3. 设置环境 URL 为 `http://localhost:11434`
4. 选择接口 → 填写参数 → 发送测试

![[image-20251205163718-2r1n4vl.png]]

### 聊天对话接口示例

```json
{
    "model": "qwen3:4b",
    "messages": [
        { "role": "user", "content": "你是谁？" }
    ],
    "stream": false
}
```

![[聊天对话接口-文字形式 - 信息提取-20251213154438-fougru9.png]]
![[image-20251205174606-9kmrudq.png]]

**图片对话**需使用 LLaVA 等多模态模型，并将图片转为 Base64 后放入 `images` 字段。

![[image-20251205174515-36si70r.png]]

### 向量化接口示例

```json
{
    "model": "qwen3-embedding:4b",
    "prompt": "待向量化的文本"
}
```

![[image-20251205180737-yfeyorr.png]]

## 相关笔记

- 命令速查 → [[Ollama 命令参考]]
- 图形界面 → [[Ollama 集成 Chatbox]]
