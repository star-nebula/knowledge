---
title: Ollama 命令参考
created: 2026-07-08
tags:
  - Ollama
  - CLI
  - 命令
type: 步骤操作
related:
  - "[[模型部署-MOC]]"
  - "[[Ollama 概述]]"
category: ["🤖 AI大模型", "模型部署"]
---

# Ollama 命令参考

## CLI 命令（终端执行）

| 命令 | 作用 | 示例 |
|------|------|------|
| `run` | 运行模型，未下载则自动拉取 | `ollama run qwen2:0.5b` |
| `show` | 查看模型信息（许可/参数/模板等） | `ollama show qwen2 --modelfile` |
| `pull` | 拉取远程模型 | `ollama pull deepseek-r1:14b` |
| `list` / `ls` | 列出本地模型 | `ollama list` |
| `ps` | 查看运行中的模型 | `ollama ps` |
| `rm` | 删除本地模型 | `ollama rm qwen2:0.5b` |

`run` 常用参数：

| 参数 | 说明 |
|------|------|
| `--verbose` | 输出推理耗时统计（token 数、速度） |
| `--keepalive 1h` | 模型在内存中保持 1 小时 |

## REPL 对话指令（`>>>` 提示符下）

| 指令 | 作用 |
|------|------|
| `/set parameter ...` | 设置生成参数（temperature 等） |
| `/set system <str>` | 设置系统角色提示词 |
| `/show info` | 查看模型基本信息 |
| `/show modelfile` | 查看 Modelfile（制作私有模型） |
| `/load <model>` | 切换到另一模型 |
| `/save <name>` | 保存当前会话为新模型 |
| `/clear` | 清空会话上下文 |
| `/bye` | 退出对话（快捷键 Ctrl+D） |
| `/? shortcuts` | 查看键盘快捷键 |

## 相关笔记

- 安装配置 → [[Ollama 安装与配置]]
- API 调试 → [[Ollama API 调试]]
