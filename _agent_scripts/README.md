# _agent_scripts

工作区操作/诊断脚本统一存放处（供 agent 调用）。

## 脚本清单

### `test_image_embed_render.ts`
验证 `obsidianImageEmbed` 插件在 VitePress 渲染管线中的生效顺序。
- 背景：`![[Attachments/x.jpg]]` 必须抢在 nolebase 的双向链接规则之前拦截，否则被渲染成死链(#)。
- 用法：`node_modules/.bin/tsx _agent_scripts/test_image_embed_render.ts <old|new>`
  - `old` = nolebase 先装、obsidianImageEmbed 后装（== 真实 config 顺序），预期 7 `<img>`、0 死链。
  - `new` = obsidianImageEmbed 先装（preConfig 早于 nolebase），用于对比验证锚点顺序。

### `ai_daily_post/count_chars.py`
AI 资讯文章字数校验（配合技能 `ai-hot-article-daily` 使用）。
- 模式 1：`python count_chars.py <文章.md>` —— 统计正文字数（自动剥离 frontmatter/备选标题/引用块/标题行/话题标签区），要求纯中文 >1200。
- 模式 2：`python count_chars.py --text "<摘要>"` —— 按Python len() 口径统计字符数，摘要要求 90–120。
- 运行环境：受管 Python 3.13（`C:/Users/stars/.workbuddy/binaries/python/versions/3.13.12/python.exe`）。

### `xhs_card/render_html.py`
把 HTML 卡片渲染成 PNG（小红书 / 公众号配图产线的核心工具）。
- 原理：直接调用 Playwright 缓存里的 Chromium **无头截图**，不依赖 playwright / puppeteer 库；输出尺寸精确等于 `--size`。
- 用法：
  - 单文件：`python render_html.py card.html --preset xhs`
  - 整目录：`python render_html.py ./cards --preset xhs --out ./png`
  - 尺寸预设：`xhs` 1080x1440（3:4）、`xhs1x1` 1080x1080、`gzh-cover` 900x383（2.35:1）、`gzh-body` 1080x1440
  - 高清：`--scale 2`（默认，输出 2160x2880）；`--size 1080x1440` 可自定义
- **坑**：输出路径必须传绝对路径，Chromium 的 `--screenshot` 对相对路径解析不可靠（脚本内已做 abspath）。
- 运行环境：受管 Python 3.13。

### `xhs_card/render_deck.py`
把「多卡片 deck.html」**逐张**渲染成 PNG（一篇文章 = 一套卡片序列的产线工具）。
- 适用场景：一个 `deck.html` 里纵向排 N 张卡片（每张 `.card`，尺寸=预设宽高），页面支持 `#N` 锚点只显示第 N 张。脚本先 `--dump-dom` 数出卡片总数，再逐张带 `#N` 截图。
- 用法：
  - `python render_deck.py deck.html --preset xhs --out ./png`
  - `--from 1 --to 3` 只渲染第 1~3 张（调试单卡时省时间）
  - `--scale 2`（默认高清）；`--size 1080x1440` 可覆盖预设
- 输出：`deck-01.png`、`deck-02.png` …（编号即卡序）
- 为什么不用「截长图再切」：Chromium 单张截图高度上限约 16384px，12 张 × 1440 × 2 倍 = 34560px 会超限。逐张截图长度可控、还能只重跑改动的那几张。
- **坑**：数卡片数时不能直接 `count('class="card')` —— deck.html 的 JS 模板字符串里也有 `class="card` 字面量，会把卡片数虚报。必须先 `re.sub(r"<script[\s\S]*?</script>", "", html)` 剥离脚本段再统计（脚本内已处理）。
- 依赖：同目录 `render_html.py` 只是并列关系（各自独立），无 import 依赖。
- 运行环境：受管 Python 3.13。

### `xhs_card/finalize_unit.py`
发布单元**收尾**：把渲染出的卡片图并入发布单元、把没用到的素材送回收站（产线最后一步）。
- 用法：
  - 先干跑：`python finalize_unit.py --unit "<发布单元>" --cards "<deck 渲染输出目录>" --trash <未使用文件...> --dry-run`
  - 再执行：去掉 `--dry-run`
  - 卡片处理方式 `--mode move`（默认）/ `copy`；命名前缀 `--prefix 卡片`（默认）
- 行为：`deck-01.png … deck-NN.png` → `<单元>/assets/卡片_01.png …`；`总览_deck.png` → `assets/卡片_总览.png`；`--trash` 列出的文件逐个送 Windows 回收站。
- **坑 1（重要）**：`send2trash` 的 `win.legacy` 实现（未装 pywin32 时）在部分环境会「**回收成功却抛 WinError 2 / FileNotFoundError**」。所以判据不能看异常，只能看「操作后源文件是否消失」。脚本已按此容错。彻底规避：给 venv 装 `pywin32`，send2trash 自动切到 `win.modern`（IFileOperation）。
- **坑 2**：回收 ≠ 永久删除，`--trash` 一律走回收站；执行前务必先 `--dry-run` 列清单确认。
- 运行环境：受管 venv `C:/Users/stars/.workbuddy/binaries/python/envs/default/Scripts/python.exe`（该 venv 已装 `send2trash` + `pywin32`）。

### `encoding_guard.py`
文本文件**编码守卫**：扫描目录列出所有非 UTF-8 文本文件，并可按需原地转码为 UTF-8。
- 背景：本项目多数工具**覆写已存在文件时会沿用该文件原编码**。原本以 GBK 落盘的中文 md，改完内容后仍是 GBK，Obsidian 按 UTF-8 读即整篇乱码（新建文件不受影响，默认 UTF-8）。
- 用法：
  - 体检：`python encoding_guard.py <路径或文件>`（有非 UTF-8 时退出码 1，可当门禁）
  - 修复：`python encoding_guard.py <路径> --fix --backup`（GBK/GB18030/BOM → 纯 UTF-8）
  - 预览：加 `--dry-run` 只打印；`--ext .md,.txt` 自定义扩展名
- 行为：自动跳过 `.git` / `node_modules` / `.obsidian` / `$RECYCLE.BIN` 等；「未知编码」（UTF-8、GBK 都解不开）只报告不修改；转码为字节级重编码，不动换行符。
- 运行环境：受管 Python 3.13（仅用标准库）。

### `mem_index.py`
记忆库**索引生成 / 校验**（`E:\knowledge\vault\Memory` 各层 `_index.md`）。
- 背景：手工索引必然漂移（`Home.md` 曾落后实盘 4~5 条）。故把索引变成**派生物**：frontmatter + 正文首段 → 各层 `_index.md`，根治漂移。
- 用法：
  - 生成/更新：`python mem_index.py --write`（幂等；**新增笔记自动补行/删行，已有行手工写的「定位 / 关键词」原样保留**，可放心润色）
  - 体检门禁：`python mem_index.py --check`（报告「缺索引 / 缺失行 / 失效行 / 手工地图页漏列顶层项」，有漂移退出码 1）
  - 单层：`--layer Lessons`（可选 `Preferences` / `Plans` / `Lessons` / `Workflows` / `Projects`）
- 覆盖范围：`Preferences` `Plans` `Lessons` `Workflows` `Projects`（**`Decisions` 除外**——`Rule.md` §9 规定其专用格式，勿用本脚本覆盖）。
- 顺带校验两张**手工**地图页是否漏列顶层项：`vault/_index.md`（vault 顶层 25 项）、`Memory/_index.md`。
- 一句话定位取值优先级：frontmatter `summary` / `description` → 正文首个实质段落（截 62 字）。
- **坑**：`_index.md` 的表头说明由脚本模板生成，直接手改表头会在下次 `--write` 时被覆盖——要改表头请改脚本里的 `EXTRA_NOTE`；表格**数据行**的手工内容是安全的。
- 运行环境：受管 Python 3.13（仅标准库）。

### `todo_audit.py`
记忆库**待办归档体检**（`Memory/Todo.md`）——把「**完成 = 移走**」变成可校验项。
- 背景（2026-09-21）：索引漂移有 `mem_index.py --check`、断链有 `link_audit.py`、删文件有 `ref_scan.py`，唯独「待办 → 项目 `working/completed.md`」这一环**只写在会话收尾 checklist 里、零门禁** → 静默积累 4 条「已标完成却未移走」的条目（含一条 2000 字符、与 `completed.md` 完全重复的复盘）。根因之一：`Rule.md`「写入」第 2 条写「**移入**」，而「会话收尾」① 只写「**追加到**」——差一个动词，归档就只做了一半，且收尾时读的正是 ①。
- 用法：
  - 体检：`python todo_audit.py`（报告默认写 `_agent_scripts/_out/todo_audit.txt`）
  - 门禁：`python todo_audit.py --check`（有违规则退出码 1）
  - 其余：`-o <文件>` / `--json` / `--todo <路径>` / `--quiet`
- 检查三件事：① **完成信号残留** —— 带 `✅` `✔` `已执行完毕` `已完成：` `已结清` `已归档` 等强标记却未移走的条目（引用块说明行与「不再继续」删除线留档**单独计数、不拦门禁**）② **分组名 ↔ `Projects/` 目录名映射** —— 规则要求分组标题一律取目录名，否则归档无处落地 ③ **`working/completed.md` 是否存在** —— 归档前需先建
- **坑 1**：本机 PowerShell 会吞 stdout → 默认写文件再 Read 读回（与 `link_audit.py` 同）。
- **坑 2**：强信号词会命中**指针行** —— 在 Todo 里写归档指引要用「记录见 / 详情见」，别写「已归档」，否则自己把自己判成违规（本次实测踩到）。
- 运行环境：受管 Python 3.13（仅标准库）。

### `ref_scan.py`
删除笔记/目录前的**引用面扫描**（回答「这个文件能安全删吗？删了会留下什么」）。
- 背景：`vault/AGENT.md` 的删除清理——除用户已知的 `vault/Home.md` 外，另在 `rules/` 8 个文件的 frontmatter `related:` 里藏着引用，手工漏查风险高。故把「删前先扫引用面」固化成一条命令。
- 扫描三个面：
  1. **笔记面** —— 全 vault md 里的 wikilink（区分「带路径引用」与「裸名引用」；裸名会额外提示**同名歧义**）
  2. **仓库面** —— `.gitignore` 命中情况（是否已忽略、删后是否影响 git 与发布）
  3. **站点面** —— `.vitepress/` 与 `scripts/` 里对目标名的字面硬引用
- 用法：
  - `python ref_scan.py <路径>`（路径可为文件或目录；目录会展开其下所有 md）
  - `-o report.md` 写文件（**本机 PowerShell 会吞 stdout，实操建议一律带 `-o`**）
  - `--json` 机器可读；`--vault` / `--root` 覆盖默认根
- 退出码：0 = 可安全删除；1 = 存在引用或目标不存在（可当门禁）。
- **坑（已处理）**：① `[[...]]` 出现在**行内代码 / 代码块**里时 Obsidian **不解析**（文档举例文字），必须剥离后再统计，否则大量误报（实测 5 处举例被误判为真引用）；② 带路径的引用（含 `/`）**不得**退化到同名匹配，否则 `[[Memory/AGENTS]]` 会误命中根目录的 `AGENTS.md`。
- 运行环境：受管 Python 3.13（仅标准库）。

### `link_audit.py`
全库 wikilink **断链审计**（区分「活链」与「记录文本」，供"改前出清单 / 改后验收"两端使用）。
- 背景：批 B 断链修复需要先筛选再改。旧口径统计出「622 个断链」几乎不可用——含大量误报，直接照修会污染素材。
- 用法：
  - `python link_audit.py` —— 全库报告写入 `_agent_scripts/_out/link_audit.txt`
  - `python link_audit.py --layers Memory,Knowledge` —— 只看指定顶层目录的断链
  - `-o <文件>` 指定输出；`--quiet` 只打印计数
- **四个必踩的口径陷阱（均已内建处理）**：
  1. **代码块 / 行内代码里的 `[[...]]`** Obsidian 不解析 —— 不剥离必然误报（实测 `ref_scan.py` 同类问题少报 5 处、本脚本旧口径虚增 500+）
  2. **判定表必须收录全库所有文件**（笔记 **+ 附件**）—— 只收 `.md` 会把 `![[image.png]]` 全部误判为断链
  3. **`[[Note]]` 与 `[[Note.md]]` 两种写法都有效**，且 Windows 下大小写不敏感（`[[todo]]` 命中 `Todo.md`）
  4. **站点视角漏报** —— 判定表是全库的，站点却只发布 `PUBLISHED_DIRS`。目标**只在非发布目录**（`Resources/` `Archive/` `Canvas/` `DailyNotes/`）里有同名文件时，Obsidian 算活链、**站点是死链**。本脚本把它单列为输出第二段「站点侧死链」，并只报「引用方在发布层」的（否则 `DailyNotes/`→`DailyNotes-MOC` 202 处噪声会淹没真问题）。发布面从 `.vitepress/config.ts` **正则抽取**，不手工维护。
- 输出分两段：`## 一、真断链（全库无同名文件）` / `## 二、站点侧死链（只在非发布目录里有同名 → 站点 404）`。
- 实测基线（2026-09-21 批 B 执行后）：md 1589 篇 / wikilink 2814 条 / **断链目标 103 / 命中 339 行**（改前 141 / 405）；**站点侧死链 6 目标 / 28 行**。
- 处置清单见 `vault/Memory/Projects/knowledge/断链修复筛选清单-2026-09-21.md`。
- 运行环境：受管 Python 3.13（仅标准库）。

### `debug_ruler.ts`
探查 VitePress markdown-it 内联规则链（`__rules__`），定位 nolebase 双向链接规则的真实名字（当前为 `bi_directional_link_replace`）。
- 用法：`node_modules/.bin/tsx _agent_scripts/debug_ruler.ts`

## 注意事项
- 这些脚本仅用于本地诊断，**不参与站点构建**（不在 `vault/` 下，VitePress 不会渲染）。
- `createMarkdownRenderer` 有模块级缓存，两种顺序需分两次进程运行。
- 顶层 await 在 `tsx -e` 的 cjs 输出下会报错，故一律用 `.ts` 文件方式运行。

## 入库与提交（本目录的 git 约定）

- **`.gitignore` 用「忽略目录内容 + 白名单」，不要写「忽略整个目录」**：
  ```
  _agent_scripts/*
  !_agent_scripts/*.py
  !_agent_scripts/*.ts
  !_agent_scripts/*.md
  _agent_scripts/_tmp*
  ```
  写成 `_agent_scripts/`（目录级忽略）会让 `git add` **静默跳过脚本本体** —— 提交照样成功、消息还能写「新增 X 脚本」，而 X 从未进库。**2026-09-21 实测踩到**：提交 `43cdc751` 标题为「新增待办归档体检工具 todo_audit.py」，`git show --stat` 实际只有 `README.md` 12 行，5 个 py（`encoding_guard` / `link_audit` / `mem_index` / `ref_scan` / `todo_audit`）全在库外，且 `git status` 显示 clean（被忽略故不列出）→ **典型的假成功**。
  末行 `_tmp*` **后置反排除**是必需的：白名单 `*.py` 会连带放行临时脚本 `_tmp*.py`（靠 gitignore「最后匹配者胜」压回）。
- **核验「有没有入库」要看 `git ls-files`，不是 `git status`** —— 被忽略的文件在 `status` 里根本不会出现，`git status` clean ≠ 文件已入库。若要判单个文件，用 `git ls-files --error-unmatch <path>` **看退出码**（该命令会把失败原因写到 stderr，合并 2>&1 再加 `-ne ""` 判断会得到「全部已跟踪」的假结论）。
- **提交消息文件别用 PowerShell `Set-Content -Encoding UTF8` 生成**（PS 5.1 会写 BOM）→ `git commit -F` 后消息**首字符变成 `\ufeff`**。用 Python `encoding="utf-8", newline="\n"` 写、或 `[IO.File]::WriteAllText` 配无 BOM 编码；校验：`git cat-file commit HEAD` 取消息段，前 3 字节不应是 `ef bb bf`。
- **git 的中文输出经 PowerShell 捕获会显示成乱码**（`鏂板` 之类），那是 PS 5.1 控制台编码假象，**不代表库数据损坏**。要复核编码就用 Python `subprocess.run(..., capture_output=True)` + `decode("utf-8")`，不要凭 PowerShell 的回显下结论。
