# 知识库日志

## [2026-07-17] DeepSeek 剪藏提炼入 Knowledge
[20:25:00-ingest] 处理 `Resources/Clippings/DeepSeek技术发展详细时间轴与技术核心解析.md`（CSDN 剪藏，时间轴+技术核心）；判定其时间轴与技术核心与既有 `Knowledge/AI/DeepSeek.md` 大量重叠，按反重复原则只提炼「新增且事实性」内容，剪藏原文保留不动
[20:25:30-new] 新建 `Knowledge/AI/DeepSeek 开源周五大工具.md`（概念解释）：2025-02 开源周 FlashMLA/DeepEP/DeepGEMM/DualPipe·EPLB/3FS 五工具
[20:26:00-new] 新建 `Knowledge/AI/DeepSeek NSA 稀疏注意力.md`（概念解释）：NSA 原生稀疏注意力，训练推理统一、64K 提速数据
[20:26:30-update] `Knowledge/AI/DeepSeek.md` 补 related 双链 + 新增「2025 技术进展（延伸）」小节（开源周/NSA/V3-0324）
[20:26:40-fix] 剪藏中投机/营销内容（R2 预告、GTLF、8ms 质检、算力+300% 等）不入库；不确定数据标注 ⚠️ 时效

## [2026-07-17] 修复 Knowledge 12 篇属性异常 + 新增 type 枚举校验规则
[20:37:00-fix] 修复 5 篇 CRITICAL：frontmatter 被 AIGC 数字水印块顶替，重建合规属性（title/created=2026-07-08/tags/type=概念解释/related 合法 MOC/reference），保留正文不动：`RAG 概述`/`RAG Query 改写`/`RAGAS 评估框架`→`[[AI 应用核心范式-MOC]]`，`Milvus 向量数据库`→`[[框架与中间件-MOC]]`，`LLM 产品形态`→`[[AI 应用核心范式-MOC]]`
[20:37:10-fix] 修复 7 篇旧 schema：`date`→`created`，非法 type 映射标准枚举（算法笔记→概念解释×3、代码模板→步骤操作×1、实战案例→概念解释×1），并补 related=`[[机器学习-MOC]]`/reference=""：时间序列预测、机器学习-KNN算法、机器学习-决策树、机器学习-基础代码、机器学习-案例、机器学习-GBDT、机器学习-核心概念
[20:37:30-rule] 新增规则「新建笔记先校验 type 标准枚举，对不上须思考是否扩展枚举并写入规则」：写进 `指南-创建笔记.md` Step 3（含 ≥3 篇价值判定 + 禁止私自用非标准值），并在 `原子笔记编写规范.md` §2 注明枚举可经决策扩展、须同步两处
[20:37:40-health] 复验脚本确认 Knowledge 208 篇属性异常归零



[11:30:00-dir] 新建 `Knowledge/_assets/` 作为 Knowledge 附件统一存放目录
[11:30:30-dir] 将 `01-可迁移部分/04-通用知识/计算机科学基础/Python工程` 下 5 个 assets 子目录共 39 个附件（图片 38 + Redis zip 1）平移至 `Knowledge/_assets/`；平移前跑同名检测无冲突，清理 5 个空 assets 目录
[11:32:00-new] 迁移 19 篇 Python 非拆分笔记至 `Knowledge/Engineering/`（两层封顶，不开 Python/ 子目录），统一改写 frontmatter（新增 title/related/reference，date 取源 updated，type 按类型映射，丢弃 domain/description/created），不改正文
[11:35:00-merge] 按《原子笔记编写规范》逐篇审查后拆分 2 篇违反单一性的笔记：
  [11:35:10-merge] `Python 函数与类.md` 拆为 `Python 函数入门.md` + `Python 类入门.md`（函数与类是两个独立知识闭环）
  [11:35:20-merge] `Python 进阶特性与协程.md` 拆为 `Python 迭代器与生成器进阶.md` + `Python 协程与异步编程.md` + `Python 反射.md`（迭代器进阶/协程/反射三个互不相关主题硬塞同一篇）
  [11:35:30-fix] 修链：`Python 生成器与迭代器.md` 文内扩展链接 `[[Python 并发与运行时控制]]` 改为指向拆分产物；其余笔记"相关链接"小节内对 `[[Python 函数与类]]` 的引用统一改指向拆分产物
[11:36:00-new] 新建 `Knowledge/Engineering/Python-MOC.md`（按 MOC 模板），整合原 `Python 工程.md` 与 `__index__.md` 两索引页的有效内容：五模块分组导航（24 行）、学习路径、与 AI 关联表、关联专题
[11:36:30-index] 更新 `Knowledge/「Engineering」MOC.md` 专题导航表格，新增 Python 行指向 `[[Python-MOC]]`
[11:37:00-dir] 源目录 `01-.../计算机科学基础/Python工程/` 归档至 `Archive/2026-07-Python工程迁移备份/`（保留原结构作为回溯凭据，按《指南-异常处理》冷却约定 30 天后再彻底删除）
## [2026-07-04] 工具使用笔记迁移入 Knowledge

[14:50:00-dir] 将 `01-可迁移部分/03-通用技能/工具使用` 下 Git/Jupyter/Linux/Obsidian 4 个 assets 子目录共 11 个附件平移至 `Knowledge/_assets/`（与上次 Python 的 39 项合并后 _assets 共 50 项）；平移前跑同名检测无冲突，清理 4 个空 assets 目录
[14:52:00-new] 按《分类映射表》归类：Git(4)+Linux(4)+Anaconda/PyCharm/Jupyter×2/FVM 共 13 篇 → `Knowledge/Engineering/`；Obsidian×2(无 frontmatter)+Markdown×1 共 3 篇 → `Knowledge/Methods/`；统一改写 frontmatter（新增 title/related/reference，date 取源 updated，type 按"概念解释/步骤操作/极简速记/故障排查"映射，丢弃 domain/description/created）；Obsidian 两篇无 frontmatter 直接整文前置新 frontmatter
[14:54:30-merge] 按《原子笔记编写规范》逐案审查 16 篇后全部保留不拆：Linux.md（基础/命令/权限内聚为大纲）、Git 基础（概念→操作顺序递进）均属同一主题强从属；其余单工具笔记天然单一闭环
[14:55:00-new] 新建 3 个专题 MOC 按模板：
  [14:55:10-new] `Knowledge/Engineering/Git-MOC.md` 聚合 4 篇 Git 笔记
  [14:55:20-new] `Knowledge/Engineering/Linux-MOC.md` 聚合 4 篇 Linux 笔记
  [14:55:30-new] `Knowledge/Engineering/IDE与环境-MOC.md` 聚合 5 篇 IDE/环境/Notebook/FVM 工具链笔记
[14:56:00-index] 更新 `Knowledge/「Engineering」MOC.md` 专题导航表格，新增 Git/Linux/IDE与环境三行；更新 `Knowledge/「Methods」MOC.md` 在域级增设"工具与实践笔记"小节直接挂 Obsidian×2 与 Markdown×1（3 篇，未达 3+ 篇阈值暂按域直挂不建专题 MOC）
[14:57:00-dir] 源目录 `01-.../03-通用技能/工具使用/` 归档至 `Archive/2026-07-工具使用迁移备份/`（30 天冷却后彻底删除）

## [2026-07-04] 数据处理笔记迁移入 Knowledge

[15:30:00-dir] 将 `01-可迁移部分/04-通用知识/计算机科学基础/数据处理/assets` 下 10 个附件（图片 9 + Redis zip 1）平移至 `Knowledge/_assets/`（与既存 50 项合并后共 60 项）；平移前跑同名检测无冲突，清理空 assets 目录
[15:32:00-new] 按《分类映射表》归类：18 篇原子笔记全部 → `Knowledge/Engineering/`（NumPy/Pandas/Matplotlib/MySQL/Redis 均属 Engineering 域下数据库与数据处理主题，与 Python-MOC 并列）；统一改写 frontmatter（新增 title/related/reference，date 取源 updated，type 按 concept→概念解释、reference→极简速记、guide→步骤操作、overview→概念解释、topic→概念解释 映射，丢弃 domain/description/created）；不改正文
[15:33:30-merge] 按《原子笔记编写规范》逐案审查 18 篇后全部保留不拆：MySQL 数据库基础（SQL 基础顺序结构强从属）、Pandas（结构→运算→分组内聚）、Redis 核心概念（5 种数据类型属同主题清单）均长但内聚，作卡片笔记
[15:34:00-merge] 4 个索引/聚合/summary 页（__index__.md 总索引、数据处理.md 专题聚合页、Python MySQL.md summary 子索引、Python Redis.md summary 子索引）与新 MOC 功能重叠，内容已融入对应专题 MOC 的"学习路径""与 AI 的关联""关联"等段；原文件随源目录归档
[15:35:00-new] 新建 3 个专题 MOC 按模板：
  [15:35:10-new] `Knowledge/Engineering/DataAnalysis-MOC.md` 聚合 4 篇（NumPy/Pandas/Matplotlib/数据分析概览）
  [15:35:20-new] `Knowledge/Engineering/MySQL-MOC.md` 聚合 10 篇（MySQL×8 + Python 操作 MySQL + 数据库开发概览）
  [15:35:30-new] `Knowledge/Engineering/Redis-MOC.md` 聚合 4 篇（核心概念/安装/客户端/实战案例）
[15:36:00-index] 更新 `Knowledge/「Engineering」MOC.md` 专题导航表格，新增 数据分析/MySQL/Redis 三行
[15:37:00-dir] 源目录 `01-.../计算机科学基础/数据处理/` 归档至 `Archive/2026-07-数据处理迁移备份/`（30 天冷却后彻底删除）

## [2026-07-04] 前端开发笔记迁移入 Knowledge

[16:10:00-dir] 将 `01-可迁移部分/04-通用知识/计算机科学基础/前端开发/assets` 下 27 个图片附件平移至 `Knowledge/_assets/`（与既存 60 项合并后共 87 项）；平移前跑同名检测无冲突，清理空 assets 目录
[16:12:00-new] 按《分类映射表》归类：7 篇原子笔记（HTML/CSS/JavaScript/JSON/jQuery/Bootstrap/Vue3基础）全部 → `Knowledge/Engineering/`（前端框架、HTML/CSS/JS 显式归 Engineering）；统一改写 frontmatter（新增 title/related/reference，date 取源 updated，type 按 topic→概念解释映射、JSON 单独标极简速记，丢弃 domain/description/created）；源笔记原本 related 全空，按"前端开发.md 知识点小节的兄弟笔记 wikilink"补全互链
[16:13:30-merge] 按《原子笔记编写规范》逐案审查 7 篇后全部保留不拆：CSS（选择器/盒模型/布局/动画/响应式同主题强从属）、JavaScript（语法/DOM/ES6+/异步/OOP 单语言递进）、Vue3（响应式/组件/路由/状态同框架强从属）均长但内聚，作卡片笔记
[16:14:00-merge] 2 个聚合/索引页（__index__.md 旧索引、前端开发.md 新专题聚合页 status:curated）与新 Frontend-MOC 功能重叠，有效段（学习路径、与 AI 关联、关联专题）已融入 Frontend-MOC；原文件随源目录归档
[16:15:00-new] 新建 `Knowledge/Engineering/Frontend-MOC.md` 按模板，分 4 组导航（基础三件套 / 数据格式与库 / CSS 框架 / 现代框架）聚合 7 篇笔记，含学习路径、与 AI 关联表、关联专题
[16:16:00-index] 更新 `Knowledge/「Engineering」MOC.md` 专题导航表格，新增 前端开发 行
[16:17:00-dir] 源目录 `01-.../计算机科学基础/前端开发/` 归档至 `Archive/2026-07-前端开发迁移备份/`（30 天冷却后彻底删除）

## [2026-07-04] 统一附件目录至根目录 Attachments/

[16:40:00-dir] 新建根目录 `Attachments/` 作为整个库的统一附件存放位置（语义中性，不归属任何子域）
[16:40:30-dir] 合并 `Knowledge/_assets/`（87 项，前 4 次迁移累积）与 `Knowledge/assets/`（8 项，仓库历史遗留）至 `Attachments/`，平移前同名检测无冲突；合并后共 95 项；删除空的 `Knowledge/_assets` 与 `Knowledge/assets` 目录
[16:41:00-fix] 修链 `Knowledge/Engineering/Jupyter 保存路径.md` 中 8 处带路径前缀的附件引用 `![[Knowledge/assets/xxx.png]]` → `![[xxx.png]]`（去路径前缀，由 Obsidian 自动从 Attachments/ 解析）；全仓扫描确认无其他带路径前缀附件引用残留
[16:41:30-rule] 修改 `.obsidian/app.json` 的 `attachmentFolderPath`：`Knowledge/_assets` → `Attachments`；其余配置（newFileLocation: current、alwaysUpdateLinks: true）保持不变
[16:42:00-health] 校验 Knowledge 下所有 md 的附件引用均可从 `Attachments/` 解析，零断链

## [2026-07-04] DailyNotes 附件迁移 + DataviewJS 自动 MOC

[17:10:00-dir] 同名检测：DailyNotes/2025/assets(453) + 2026/assets(2) 与 Attachments/(95) 三方对比，零同名冲突
[17:10:30-dir] 平移 455 项附件至 `Attachments/`（合并后共 550 项）；清理 DailyNotes/2025/assets 与 2026/assets 空目录
[17:11:00-fix] 扫描 DailyNotes 下所有 md 的附件引用：均为 markdown 形式 `![image](xxx.png)` 纯文件名无路径前缀，无需修链；附件可解析性校验零断链
[17:11:30-rule] 禁用 obsidian-custom-attachment-location 插件：从 `.obsidian/community-plugins.json` 移除（保留插件文件备用）；附件行为改由 app.json 全局配置（attachmentFolderPath: Attachments）主导
[17:12:00-rule] 开启 dataview DataviewJS：新建 `.obsidian/plugins/dataview/data.json` 含 `enableDataviewJs: true`（enableInlineJavaScript 保持 false）
[17:12:30-new] 新建 `DailyNotes/DailyNotes-MOC.md`（DataviewJS 自动聚合视图）：4 个 dataviewjs 代码块——总览统计/最近 14 篇/按年份分组/高频标签；新增日记即时出现零维护
