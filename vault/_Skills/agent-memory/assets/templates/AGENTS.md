# {{PROJECT_NAME}}

> 我是本项目的 AI 记忆入口。每次新会话，先读完我，你就知道项目的一切——包括怎么开始、怎么收尾。

## 项目概述
*一两句话：这个项目是什么、解决什么问题。*

## 技术栈
*首次技术选型后填写。*

| 层 | 选型 | 备注 |
|----|------|------|

## 关键约定
*在开发中逐步添加。每条一行，示例：*
- *所有 API 统一返回 `{code, data, msg}`*
- *函数参数超过 3 个改用对象传参*

---

## 记忆文件

| 文件 | 用途 | 何时读 |
|------|------|--------|
| `.memory/AGENTS.md` | 本文件 | **每次会话必读** |
| `.memory/context/decisions.md` | 技术决策日志 | 做架构/选型/重构时**搜索**，不全量加载 |
| `.memory/working/todo.md` | 进度跟踪 | 继续开发时读 |
| `.memory/working/plan.md` | 实施计划 | 存在时读 |

---

## 会话工作流

### 启动
1. **读完本文件**（你正在做的）
2. 如果继续之前的开发 → 读 `.memory/working/todo.md` 了解进度
3. 如果涉及架构/选型 → 搜索 `.memory/context/decisions.md`

### 收尾（每次会话结束必做）
1. 更新 `.memory/working/todo.md`：打勾已完成、更新当前位置
2. 如有新决策 → 追加到 `.memory/context/decisions.md`
3. 如果 `plan.md` 存在 → 同步状态

### 决策记录格式
```
[YYYY-MM-DD] [分类] 决策项 → 选定方案 | 原因 | via:来源
```
分类标签：`[架构]` `[工具]` `[约定]` `[性能]` `[安全]`

---

## 工具适配（换 AI 时检查）

> AI 工具不会自动读 `.memory/`。在对应配置文件中加一行引用，让每次会话自动加载本文件。

| 工具 | 配置文件 | 需加入的内容 |
|------|---------|------------|
| Cursor | `.cursorrules` | `每次会话开始时，先读取 .memory/AGENTS.md。` |
| Claude Code | `CLAUDE.md` | 同上 |
| WorkBuddy | `AGENT.md` 或 `.workbuddy/rules/` | 同上 |
| Codex/Windsurf | `.windsurfrules` | 同上 |
| Copilot | `.github/copilot-instructions.md` | 同上 |

**换工具时只需加这一行。** 加完后 AI 读 AGENTS.md 就会自然按上面的工作流执行。
