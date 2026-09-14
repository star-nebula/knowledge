# workbenches — 本地工作台根目录

> 本目录是**所有本地工作台**的统一根目录（2026-09-14 约定）。今后新建任何工作台都放这里。

## 当前工作台

### skill-workbench/ — Skill 统一工作台

管理分散在各 AI 工具（ZCode / CodeBuddy / WorkBuddy / Claude / Lingma / Trae / OpenClaw / qwenwork / Hub / LobsterAI 等 15 个根目录）中的全部 Agent Skill。

**启动**：`node E:\knowledge\vault\workbenches\skill-workbench\server.cjs` → 浏览器打开 http://127.0.0.1:8788

**能力**：
- 总览：skill × 工具矩阵（479 副本 / 225 组），用户级默认展开，插件缓存与运行时折叠标注
- 编辑：在线编辑 SKILL.md，保存即写回原位（共享链接副本经链接直达真身）
- 新建 / 删除：删除先移入 `data/trash/` 可找回
- 同步：组内真实副本分歧时提示，手动触发「最后编辑胜出」镜像同步，多余文件进回收站
- CLI 等价：`tools/sync.cjs status | diff <组> | sync <组>`

**架构约定**（2026-09-14 决策，见 `Memory/Projects/knowledge/`）：
- 所有 skill 真实副本留在各工具原生目录（Junction 中央库方案已退役）；
- 单真身共享链接（lark 系 → `~/.agents/skills`、archify、note2images）只展示/编辑真身，不做材料化；
- 插件缓存层可编辑但标记「插件更新即失效」；
- 同步 = 提示 + 手动触发 + 最后编辑胜出。

**数据文件**：`data/registry.json`（副本注册表）、`data/groups.json`（分组）、`data/log.md`（同步日志）、`data/trash/`（删除回收站）。

## 约定

1. 每个工作台一个子目录，内含自己的 `README.md`；
2. 工作台数据（registry/log/trash）随目录纳入 Obsidian 忽略范围，不当笔记索引；
3. 工作台之间不共享代码；公共能力（如 hash/扫描）以复制为主，保持各自零依赖可独立运行。
