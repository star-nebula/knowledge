---
skill_name: mianshiya
description: 从面试鸭 (mianshiya.com) 抓取面试题完整内容（含推荐答案 + 面试问答），并整理为结构化 Obsidian 笔记。处理反 DevTools 检测，产出可复用的 clean content。
version: 1.0.0
agent_created: true
---

# mianshiya — 面试鸭内容抓取与整理

从 [mianshiya.com](https://www.mianshiya.com) 抓取面试题页面，提取完整内容并整理为结构化 Markdown 笔记。

## 使用场景

- 用户提供 mianshiya.com 面试题 URL，要求抓取内容
- 需要将面试题整理为 Obsidian 知识库笔记
- 批量抓取面试题库

## 前置条件

1. **bsk CLI** 已安装（BrowserSkill），`bsk doctor` 全部通过
2. 浏览器扩展已连接（Edge/Chrome）
3. 用户浏览器中已登录 mianshiya.com（可选，但登录后可看全部内容）

## 核心工作流

### 阶段一：抓取「推荐答案」标签页

这是页面的默认标签页，包含：回答重点、扩展知识、面试官追问。

```
1. bsk session start                          → 获取 session_id
2. bsk tab create --url <面试题URL> --session <id>
3. bsk wait-ms 8s                             → 等待 JS 渲染
4. bsk snapshot --session <id>                → 获取完整 ARIA 树
```

**关键**：必须在新创建的 agent tab 中加载，首次加载时 disable-devtool 检测尚未触发，可以拿到完整 snapshot。

### 阶段二：抓取「面试问答」标签页

⚠️ **mianshiya.com 使用了 disable-devtool 反检测库**，CDP 连接触发后页面会重定向到 404。

**已确认无法自动化的操作**：
- 在 agent tab 中点击标签页切换 → 触发检测 → 页面跳转
- 借用用户已打开的 tab → CDP 连接触发检测 → 页面跳转

**唯一可行方案：request-help（人工协助）**

```
1. bsk tab create --url <面试题URL> --session <id>
2. bsk wait-ms 3s
3. bsk request-help --session <id> \
     --prompt "请点击页面上的「面试问答」标签页，等待内容加载完成后点击「继续」" \
     --title "切换到面试问答标签页" \
     --timeout 2m
4. 等待用户操作完成后
5. bsk snapshot --session <id>                → 获取面试问答标签页内容
```

**备选方案**：如果 request-help 也因页面跳转失败，则：
- 告知用户手动复制「面试问答」标签页内容
- 或从已打开的浏览器标签页中手动复制

### 阶段三：内容整理

从 snapshot 中提取文本，按以下结构整理：

```markdown
# 题目编号. 标题

> 来源：<URL>
> 抓取时间：YYYY-MM-DD
> 标签：<从页面提取的标签>

## 回答重点
（完整保留原文，包括「拆选扔」展开内容）

## 扩展知识
### 模块化组装方案
（保留三层模块的详细 bullet points）

### 插件化扩展机制
（保留四种注入方式的详细说明）

### 长 System Prompt 的性能影响
### 业界其他方案的对比

## 面试官追问
（保留所有追问及其回答）

## 面试问答
（从「面试问答」标签页提取的 Q&A 对）
```

### 阶段四：清理与对比

1. 将抓取内容写入 `Inbox/题目编号. 标题.md`
2. 与用户手动复制版本对比（如存在）
3. 修正差异：
   - 补充缺失的「面试问答」部分
   - 恢复代码反引号格式（`before_tool_call`、`buildAgentSystemPrompt` 等）
   - 统一标题层级
4. 输出对比报告至 `Inbox/_comparison_report.md`

## 已知限制

| 限制 | 影响 | 解决方案 |
|------|------|---------|
| disable-devtool 检测 | 无法自动切换标签页 | request-help 人工协助 |
| snapshot 丢失内联格式 | 代码反引号、加粗等丢失 | 后期从手动版恢复 |
| 需登录才能看完整内容 | 匿名用户可能看不到所有答案 | 确保浏览器已登录 |
| 页面 JS 渲染需等待 | 过早 snapshot 内容为空 | wait-ms 8s 以上 |

## 内容结构模板

mianshiya 面试题页面标准结构：

```
├── 标题 + 编号
├── 标签（AI、OpenClaw 等）
├── 统计数据（浏览数、收藏数）
├── [推荐答案] 标签页
│   ├── 回答重点
│   ├── 扩展知识
│   │   ├── 模块化组装方案（如有）
│   │   ├── 插件化扩展机制（如有）
│   │   ├── 性能影响（如有）
│   │   └── 业界对比（如有）
│   └── 面试官追问（N 个追问+回答）
├── [面试问答] 标签页（7-8 对 Q&A）
├── [回答讨论] 标签页（社区讨论）
└── 相关题目列表
```

## 关闭会话

```
bsk tab return <tab_id> --session <id>   → 归还借用的标签页
bsk session stop <id>                    → 关闭会话
```

## 示例

执行时主动向用户确认：
- 目标输出目录（Obsidian vault 中的路径）
- 是否需要与已有笔记做对比（如有，请提供现有笔记文件路径）