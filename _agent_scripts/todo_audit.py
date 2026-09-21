#!/usr/bin/env python3
"""Todo 归档体检 —— 校验 `Memory/Todo.md` 是否守住「完成 = 移走」。

背景（2026-09-21）：
    「待办 → `Memory/Todo.md`；完成 → `Projects/<项目名>/working/completed.md`」
    这条链路原本只写在会话收尾 checklist 里，**没有任何门禁**，于是静默积累
    「已标完成却未移走」的条目（实测 4 条，含一条 2000 字符的重复复盘）。
    对比：索引漂移有 `mem_index.py --check`、断链有 `link_audit.py`，唯独待办归档没有。
    本脚本把「归档动作」变成可校验项。

检查三件事：
    1. 完成信号残留 —— Todo 里带完成标记、但未移走的条目（违规）
    2. 分组名映射   —— `## 分组` 标题必须等于 `Projects/` 下的目录名（规则要求）
    3. completed.md —— 被 Todo 提到的项目是否已有 `working/completed.md`

不算违规的两类（脚本会单独计数、不拦门禁）：
    · 引用块（`>` 开头的说明行）
    · 「不再继续」的删除线留档（整行含 `~~`）—— 规则明确要求保留在原分组

用法：
    python todo_audit.py                 # 全量报告 → _agent_scripts/_out/todo_audit.txt
    python todo_audit.py --check         # 门禁模式：有违规则退出码 1
    python todo_audit.py -o <文件>        # 指定输出
    python todo_audit.py --json           # 机器可读
    python todo_audit.py --todo <路径>    # 覆盖 Todo 路径

退出码：0 = 干净；1 = 有违规（可当门禁）。

坑：本机 PowerShell 会吞 stdout（exit 0 但无输出）——**实操一律默认写文件**，
    再 Read 读回；`--quiet` 只是额外压掉 stdout。

运行环境：受管 Python 3.13（仅标准库）。
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
MEMORY_DIR = REPO_ROOT / "vault" / "Memory"
TODO_PATH = MEMORY_DIR / "Todo.md"
PROJECTS_DIR = MEMORY_DIR / "Projects"
DEFAULT_OUT = SCRIPT_DIR / "_out" / "todo_audit.txt"

# 强完成信号：命中即视为「已标完成」→ 必须已移走
STRONG_SIGNALS = ("✅", "✔", "已执行完毕", "已完成：", "已完成:", "已结清", "已归档")

# 顶部说明块 / 引用块前缀
QUOTE_PREFIX = ">"

TRAILING_PAREN = re.compile(r"[（(][^）)]*[）)]\s*$")


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def norm_group(title: str) -> str:
    """分组标题 → 候选目录名：去首尾空白、去掉结尾的括号补充说明。"""
    t = title.strip()
    t = TRAILING_PAREN.sub("", t).strip()
    return t


def project_dirs() -> dict[str, Path]:
    if not PROJECTS_DIR.is_dir():
        return {}
    return {p.name: p for p in PROJECTS_DIR.iterdir() if p.is_dir()}


def has_completed(dirname_path: Path) -> bool:
    return (dirname_path / "working" / "completed.md").is_file()


def scan_todo(todo_path: Path) -> dict:
    lines = read_text(todo_path).splitlines()
    dirs = project_dirs()
    dirs_lower = {k.lower(): k for k in dirs}

    signals: list[dict] = []
    retired: list[dict] = []
    groups: list[dict] = []
    sub_groups = 0
    cur_group = "(文件头)"
    char_total = 0
    char_by_group: dict[str, int] = {}
    item_count = 0

    for i, raw in enumerate(lines, start=1):
        line = raw.rstrip("\n")
        char_total += len(line)
        char_by_group[cur_group] = char_by_group.get(cur_group, 0) + len(line)
        stripped = line.strip()
        if not stripped:
            continue

        if stripped.startswith(QUOTE_PREFIX):
            continue

        h2 = re.match(r"^##\s+(.+)$", line)
        if h2:
            title = h2.group(1).strip()
            cur_group = title
            char_by_group.setdefault(cur_group, 0)
            cand = norm_group(title)
            hit = dirs_lower.get(cand.lower())
            entry = {
                "line": i,
                "title": title,
                "candidate": cand,
                "matched_dir": dirs[hit].name if hit else None,
                "completed_md": has_completed(dirs[hit]) if hit else None,
            }
            groups.append(entry)
            continue

        if re.match(r"^###\s+", line):
            sub_groups += 1
            continue

        if re.match(r"^[-*]\s", stripped):
            item_count += 1

        typed_item = bool(re.match(r"^[-*]\s", stripped))
        is_retired = typed_item and "~~" in line
        hit_signal = next((s for s in STRONG_SIGNALS if s in line), None)

        if is_retired:
            retired.append({
                "line": i,
                "group": cur_group,
                "signal": hit_signal,
                "text": stripped[:120],
            })
        elif hit_signal:
            signals.append({
                "line": i,
                "signal": hit_signal,
                "group": cur_group,
                "indent": len(line) - len(line.lstrip()),
                "text": stripped[:120],
            })

    # 分组 → completed.md 缺失汇总
    missing_completed = [
        {"group": g["title"], "dir": g["matched_dir"]}
        for g in groups
        if g["matched_dir"] and g["completed_md"] is False
    ]
    unmapped = [g for g in groups if g["matched_dir"] is None]

    return {
        "todo": str(todo_path),
        "char_total": char_total,
        "char_by_group": char_by_group,
        "item_count": item_count,
        "sub_group_count": sub_groups,
        "groups": groups,
        "signals": signals,
        "retired": retired,
        "unmapped_groups": unmapped,
        "missing_completed": missing_completed,
    }


def render(r: dict) -> str:
    out: list[str] = []
    out.append("# Todo 归档体检报告")
    out.append("")
    out.append(f"对象：`{r['todo']}`")
    out.append(f"体积：{r['char_total']} 字符 / 明确条目 {r['item_count']} 条 / `##` 分组 {len(r['groups'])} 个 / `###` 子分组 {r['sub_group_count']} 个")
    out.append("")

    out.append("## 一、完成信号残留（违规 —— 应移走却还在 Todo）")
    if r["signals"]:
        out.append("")
        out.append(f"共 {len(r['signals'])} 条：")
        for s in r["signals"]:
            kind = "子项（父项可能仍未完成，人工判断）" if s["indent"] > 0 else "顶层"
            out.append(f"- L{s['line']} [{s['signal']}] 分组「{s['group']}」· {kind}")
            out.append(f"  {s['text']}")
    else:
        out.append("")
        out.append("无 —— 干净。")
    out.append("")

    out.append("## 二、分组名 ↔ 项目目录映射（规则：分组标题取 `Projects/` 目录名）")
    out.append("")
    out.append("| L | 分组标题 | 解析为 | 目录命中 | completed.md |")
    out.append("|---|---|---|---|---|")
    for g in r["groups"]:
        cm = g["completed_md"]
        cm_txt = "有" if cm else ("缺" if cm is False else "—")
        out.append(f"| {g['line']} | {g['title']} | {g['candidate'] if g['candidate'] != g['title'] else ''} | {g['matched_dir'] or '**无**'} | {cm_txt} |")
    out.append("")
    if r["unmapped_groups"]:
        out.append(f"**无对应项目目录的分组 {len(r['unmapped_groups'])} 个**（违规 —— 归档无处落地，应改名或结清解散）：")
        for g in r["unmapped_groups"]:
            out.append(f"- L{g['line']}「{g['title']}」")
    else:
        out.append("分组名全部命中项目目录。")
    out.append("")
    if r["missing_completed"]:
        out.append(f"**缺 `working/completed.md` 的项目 {len(r['missing_completed'])} 个**（归档前先建文件）：")
        for m in r["missing_completed"]:
            out.append(f"- `Projects/{m['dir']}/working/completed.md`（分组「{m['group']}」）")
    else:
        out.append("被 Todo 引用的项目均有 `completed.md`。")
    out.append("")

    out.append("## 三、合法留档（不拦门禁）")
    out.append("")
    out.append(f"- 引用块说明行：跳过不计")
    out.append(f"- 「不再继续」删除线留档：{len(r['retired'])} 条")
    for s in r["retired"]:
        out.append(f"  - L{s['line']} 分组「{s['group']}」")
    out.append("")

    out.append("## 四、各组体积（找臃肿分组）")
    out.append("")
    ranked = sorted(r["char_by_group"].items(), key=lambda kv: -kv[1])
    for name, cnt in ranked:
        if cnt <= 0:
            continue
        share = (cnt / r["char_total"] * 100) if r["char_total"] else 0
        out.append(f"- {name:<28} {cnt:>6} 字符  {share:5.1f}%")
    out.append("")
    return "\n".join(out)


def main() -> int:
    ap = argparse.ArgumentParser(description="Todo 归档体检（完成 = 移走）")
    ap.add_argument("--todo", default=str(TODO_PATH), help="Todo 文件路径")
    ap.add_argument("-o", "--out", default=str(DEFAULT_OUT), help="报告输出路径")
    ap.add_argument("--check", action="store_true", help="门禁模式：有违规退出码 1")
    ap.add_argument("--json", action="store_true", help="输出 JSON")
    ap.add_argument("--quiet", action="store_true", help="不往 stdout 打印")
    args = ap.parse_args()

    todo = Path(args.todo)
    if not todo.is_file():
        print(f"[!] 找不到 Todo 文件：{todo}", file=sys.stderr)
        return 1

    result = scan_todo(todo)
    violations = len(result["signals"]) + len(result["unmapped_groups"])

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if args.json:
        out.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    else:
        out.write_text(render(result), encoding="utf-8")

    summary = (
        f"完成信号残留 {len(result['signals'])} 条 / 无对应目录分组 {len(result['unmapped_groups'])} 个 / "
        f"缺 completed.md 项目 {len(result['missing_completed'])} 个 / 删除线留档 {len(result['retired'])} 条"
    )
    if not args.quiet:
        print(f"Todo: {todo}")
        print(f"体积: {result['char_total']} 字符 / 条目 {result['item_count']} 条 / 分组 {len(result['groups'])} 个")
        print(summary)
        for s in result["signals"]:
            print(f"  L{s['line']} [{s['signal']}] {s['group']} :: {s['text'][:70]}")
        for g in result["unmapped_groups"]:
            print(f"  L{g['line']} 分组无对应项目目录: {g['title']}")
        print(f"报告: {out}")

    if args.check and violations:
        print(f"[!] 有 {violations} 处违规 —— 完成 = 移走（追加到 working/completed.md 并从 Todo 删除该条）", file=sys.stderr)
        return 1

    print(f"[ok] 干净：无完成信号残留、分组名全部命中项目目录" if not violations else f"[ok] --check 未启用，仅报告（{violations} 处违规）")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
