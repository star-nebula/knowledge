# vault/Skills — 本地技能目录

本目录是发布站（vault）侧的本地技能镜像，仅保留自建/需要的技能。完整技能库在用户级目录 `~/.workbuddy/skills/`。

## 当前包含的技能

| 技能 | 说明 | 版本 |
|------|------|------|
| **agent-memory** | 项目级 Agent 长期记忆系统 — 自动创建 `.memory/` 目录结构，让不同 AI 编码工具（WorkBuddy / Cursor / Codex / Claude Code 等）之间共享项目上下文、技术决策和开发进度。 | 1.4.0 |
| **mianshiya** | 从面试鸭 (mianshiya.com) 抓取面试题完整内容（含推荐答案 + 面试问答），并整理为结构化 Obsidian 笔记。处理反 DevTools 检测，产出可复用的 clean content。 | 1.0.0 |

## 备注
- 本目录整体被 `.gitignore` 忽略，不纳入版本控制（`vault/Skills/` 视为本地工作镜像）。
- 如需新增技能，从 `~/.workbuddy/skills/<name>` 复制对应目录到此处即可。
