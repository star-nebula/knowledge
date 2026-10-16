---
title: Hermes 智能体十大技能
abstract: 十个经真实工作实测的智能体技能清单——降本三件（Defuddle 精简网页、Caveman 压缩输出、Codebase Memory 索引代码库）、增能五件（Humanizer 去 AI 味、Agent Reach 抓社交数据、Marketing Skills 营销判断、Composio 连千款工具、OpenMontage 视频制作）、团队化两件（Oh My Claude Code 多智能体编排、Superpowers 技能框架）。
created: 2026-10-15
tags:
  - AI
  - Hermes
  - Agent
  - Skills
  - 工具推荐
type: 概念解释
related:
  - "[[1.架构与中间件-MOC|架构与中间件-MOC]]"
reference:
  - "https://www.bilibili.com/video/BV1fMp76gE2e/"
  - "https://www.youtube.com/watch?v=5WQk9WiWcYQ"
source_type: 视频字幕
source_path: "Resources/B站-openclawai/10个Hermes智能体技能-降本增能一步到位-BV1fMp76gE2e.md"
category:
  - 🧩 AI框架与Agent
  - 框架与中间件
---

# Hermes 智能体十大技能

> 来源：B站视频《10个Hermes智能体技能，降本增能一步到位》（汉化配音版，UP 主 openclawai；原片：YouTube 频道 Sharbel A.《10 Hermes Agent Skills You NEED To Install Today》）。十个技能全部免费安装、经作者真实工作实测，按「降本 3 / 增能 5 / 团队化 2」组织；「技能」形态不一，有的是 SKILL.md 技能文件，有的其实是 MCP 服务器或平台。

## 一、降本三件（先装这三个）

1. **Defuddle** — [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)：智能体读网页前，先把页面剥成干净的 reader-mode Markdown（去导航栏、页脚、Cookie 弹窗、广告），大量节省输入 Token。作者评价：列表里最简单的技能，"今晚就装"；只要做调研就不是可选项，从第一页就开始回本。
2. **Caveman** — [juliusbrussee/caveman](https://github.com/juliusbrussee/caveman)：超压缩输出模式，仓库自称削减 65% 输出 Token。原理：输出是贵的一侧——单价是输入的数倍，且写出的内容会留在对话历史里、随之后每一轮反复计费。信息量不变，砍掉的是前言、复述与收尾客套。
3. **Codebase Memory** — [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp)：MCP 服务器（不是技能文件）。把整个代码库一次性索引成持久知识图谱，之后智能体"查地图"而非反复读文件——读文件很贵：一个 3000 Token 的文件在第 4 轮读入、共 40 轮的会话里，实际成本是 3000×37。官方称 158 种语言下探索 Token 减少 99%，作者实测 95%。

## 二、增能五件

4. **Humanizer** — [blader/humanizer](https://github.com/blader/humanizer)：去掉 AI 写作痕迹，把输出改写成自然口吻；内容取自维基百科"AI 生成写作特征"页面，页面更新会自动跟进。29.6 KB，是列表里最大的文件——加载后会一直占上下文，所以用法是「晚调用、只调用一次」，长会话中另开新会话做文字润色。用途：发布智能体写的内容时，这是不被识破的最后防线。
5. **Agent Reach** — [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach)：给智能体"看见互联网"的能力。X 是付费 API、Reddit 从云 IP 访问直接 403——一次安装替代这些：支持 X、Reddit、GitHub 等社交网络（仓库另列有 YouTube、B站、小红书等），零 API 费用。特色是故障切换：平台改规则封路时自动走备用路线，智能体甚至察觉不到。
6. **Marketing Skills** — [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)：49 项营销技能合一的套件——SEO、付费广告、转化率、文案、买家心理等。价值不在"工具"而在"判断力"：好落地页与坏落地页差在哪、为什么一条标题更好、三个广告变体是否真的在测试东西。如果你在卖东西，作者建议比任何精巧的基础设施都优先装。
7. **Composio** — [composiohq/composio](https://github.com/composiohq/composio)：平台（不是技能文件）。一次安装接通 1000+ 工具：Gmail、Sheets、Slack、Notion、HubSpot、Salesforce……不用折腾 API key，也不用逆向 OAuth 流程。消除了"每接一个新工具就要自己搭一个新连接"的最大瓶颈。
8. **OpenMontage** — [calesthio/OpenMontage](https://github.com/calesthio/OpenMontage)：首个开源智能体视频制作系统：12 条制作管线、100+ 工具、700+ 技能与知识文件。流程：贴入一个参考视频 → 分析转写、节奏、场景结构、关键帧与语气 → 生成任何一帧之前，先返回 2-3 个方案概念 + 工具路径 + 成本预估 + 预览，批准后才开始花钱（多数同类工具先烧钱后交货，这个先谈判）。⚠️ B站汉化版删减了此段，本条据原片补全。

## 三、团队化两件（把聊天机器人变成团队）

9. **Oh My Claude Code** — [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode)：面向 Claude Code 的"团队优先"多智能体编排。解决的问题：单会话的智能体是"最会迎合的骗子"（你说不对它立刻同意，你说其实你对它也同意）；它把一次会话变成协调的团队——拆解子任务、分派给专业智能体或外部工作者、并行或分阶段执行、验证结果而不是停在半成品。对不可逆操作（发布功能、迁移、给客户的提案）是缺失的"质量门"。
10. **Superpowers** — [obra/superpowers](https://github.com/obra/superpowers)：不只是一个技能，而是带方法论的技能框架（工作如何拆解与执行）；作者称其为"最接近智能体操作系统的东西"，视频时 GitHub 26 万+ stars（2026-10 实测近 30 万）。需要花一个下午理解，但值得。

## 附：作者自用的两个彩蛋技能

- **Mission Control** — [sharbelxyz/hermes-agent-mission-control](https://github.com/sharbelxyz/hermes-agent-mission-control)：Hermes 智能体舰队控制面板——任务派发、健康状态、实时成本追踪，一屏总览。
- **Nova** — [sharbelxyz/nova-youtube-agent](https://github.com/sharbelxyz/nova-youtube-agent)：作者的"YouTube 员工"——调研选题、检查表现数据、起草视频创意；本视频的选题就是它建议的。

## 核心观点

- 降本砍三处：进门的内容（Defuddle）、出门的内容（Caveman）、重复读文件（Codebase Memory）。
- 技能免费，真正的成本是把好技能埋在一堆永远不用的技能下面——"今晚先装前三个"。
- 所有技能都经过真实工作测试才入选。

## 关联

- [[1.架构与中间件-MOC|架构与中间件-MOC]] —— 所属栏目导航

## 参考

- [B站视频（汉化配音版）](https://www.bilibili.com/video/BV1fMp76gE2e/)：UP 主 openclawai，2026-10-12；删减了 OpenMontage 段
- [原片（YouTube）](https://www.youtube.com/watch?v=5WQk9WiWcYQ)：Sharbel A.，2026-08-16
- 转写全文：`Resources/B站-openclawai/10个Hermes智能体技能-降本增能一步到位-BV1fMp76gE2e.md`
