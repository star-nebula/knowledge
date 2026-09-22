#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""记忆库索引生成 / 校验（Memory 各层 _index.md）。

背景
----
记忆库的「手工索引」反复漂移（Home.md 曾落后实盘 4~5 条）。根治办法是把索引
变成**派生物**：frontmatter + 正文首段 → `_index.md`，并可用 `--check` 当门禁。

设计要点
--------
1. **合并式生成**：已有行的人工「一句话定位 / 关键词」**原样保留**，只增删行。
   因此可以放心先跑 `--write` 拿机器初稿，再手工润色，后续重跑不会抹掉润色。
2. `--check` 是门禁：报告缺失行 / 失效行 / 新增未登记，非 0 退出。
3. 顺带校验两张**手工**地图页是否漏列顶层项（`vault/_index.md`、`Memory/_index.md`）。

用法
----
    # 生成 / 更新（幂等，保留人工润色）
    python mem_index.py --write

    # 体检（CI / 收尾用）
    python mem_index.py --check

    # 只看某层
    python mem_index.py --write --layer Lessons

运行环境：受管 Python 3.13（仅标准库）。
"""

from __future__ import annotations

import argparse
import datetime as _dt
import io
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
VAULT = REPO / "vault"
MEM = VAULT / "Memory"
TODAY = _dt.date.today().isoformat()

# 需要生成 _index.md 的层（Decisions 除外：Rule.md §9 规定其专用格式）
LAYERS = ["Preferences", "Plans", "Lessons", "Workflows"]
# Projects 以「项目目录」为行单位，不走文件行
PROJECTS = "Projects"
# 层级特有的表头说明（会写进 _index.md，故必须放在脚本里才不会下次 --write 时丢失）
EXTRA_NOTE = {
    "Projects": "> 状态标记：🟢 进行中 ・ ⏸ 暂停 ・ 🔒 封存 ・ 无标记 = 资料 / 已归档。",
}

FM = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.S)
H1 = re.compile(r"^#\s+(.+?)\s*$", re.M)
ROW = re.compile(r"^\|\s*`([^`]+)`\s*\|(.*?)\|(.*?)\|(.*?)\|\s*$", re.M)


# --------------------------------------------------------------------------- #
# frontmatter / 正文抽取
# --------------------------------------------------------------------------- #
def read_text(p: Path) -> str:
    raw = p.read_bytes()
    for enc in ("utf-8-sig", "utf-8", "gb18030"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", "replace")


def split_front(text: str) -> tuple[dict[str, str], str]:
    m = FM.match(text)
    if not m:
        return {}, text
    fm: dict[str, str] = {}
    for line in m.group(1).splitlines():
        mm = re.match(r"^([A-Za-z_][\w-]*)\s*:\s*(.*)$", line)
        if mm:
            fm[mm.group(1)] = mm.group(2).strip()
    return fm, text[m.end():]


def fm_list(fm: dict[str, str], key: str) -> list[str]:
    v = fm.get(key, "").strip()
    if not v:
        return []
    v = v.strip("[]")
    return [x.strip().strip("'\"") for x in v.split(",") if x.strip()]


def first_sentence(body: str, limit: int = 62) -> str:
    """正文首个实质段落（跳过标题/引用/列表/表格/代码围栏）。"""
    in_fence = False
    for raw in body.splitlines():
        s = raw.strip()
        if s.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence or not s:
            continue
        if s[0] in "#>-|*+!" or s.startswith("<!--"):
            continue
        if re.match(r"^\d+[.、)]\s", s):
            continue
        s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
        s = re.sub(r"\*(.+?)\*", r"\1", s)
        s = re.sub(r"`([^`]*)`", r"\1", s)
        s = re.sub(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]", lambda m: m.group(2) or m.group(1), s)
        s = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)
        s = s.strip()
        if not s:
            continue
        cut = re.split(r"(?<=[。；;!?！？])", s)[0]
        s = cut if len(cut) >= 8 else s
        return s[: limit - 1] + "…" if len(s) > limit else s
    return ""


def note_meta(p: Path) -> tuple[str, str, str]:
    """返回 (一句话定位, 关键词, 更新日期)。"""
    text = read_text(p)
    fm, body = split_front(text)
    summary = fm.get("summary") or fm.get("description") or ""
    loc = summary.strip() or first_sentence(body) or "（待补一句话）"
    tags = fm_list(fm, "tags")
    kw = ", ".join(
        [t for t in tags if t.lower() not in ("lesson", "workflow", "plan", "preference")]
    ) or "—"
    upd = fm.get("updated") or fm.get("created") or ""
    if not upd:
        upd = _dt.date.fromtimestamp(p.stat().st_mtime).isoformat()
    return loc, kw, upd


def project_meta(d: Path) -> tuple[str, str, str]:
    ov = d / "_overview.md"
    if ov.exists():
        text = read_text(ov)
        fm, body = split_front(text)
        loc = (fm.get("summary") or fm.get("description") or "").strip() or first_sentence(body)
        kw = ", ".join(fm_list(fm, "tags")) or "—"
        upd = fm.get("updated") or fm.get("created") or ""
        if not upd:
            upd = _dt.date.fromtimestamp(ov.stat().st_mtime).isoformat()
    else:
        loc, kw, upd = "⚠️ 缺 `_overview.md`", "—", ""
    return loc or "（待补一句话）", kw, upd


# --------------------------------------------------------------------------- #
# 读回既有索引（合并用）
# --------------------------------------------------------------------------- #
def load_existing(idx: Path) -> dict[str, tuple[str, str, str]]:
    if not idx.exists():
        return {}
    out = {}
    for m in ROW.finditer(read_text(idx)):
        out[m.group(1).strip()] = (m.group(2).strip(), m.group(3).strip(), m.group(4).strip())
    return out


def keep_or_auto(exist: dict, key: str, auto: tuple[str, str, str]) -> tuple[str, str, str]:
    """人工值优先；但「更新」列始终刷新为实盘（它是事实，不是判断）。"""
    if key in exist:
        loc, kw, _ = exist[key]
        if loc and loc != "（待补一句话）":
            return loc, kw or auto[1], auto[2]
    return auto


def nl_of(p: Path) -> str:
    if p.exists() and b"\r\n" in p.read_bytes()[:4000]:
        return "\r\n"
    return "\n"


def render(idx: Path, title: str, scope: str, rows: list[tuple[str, str, str, str]]) -> str:
    n = nl_of(idx)
    created = "created: 2026-09-21"
    if idx.exists():
        m = re.search(r"^created:\s*(\S+)", read_text(idx), re.M)
        if m:
            created = f"created: {m.group(1)}"

    head = [
        "---",
        "type: index",
        f"scope: {scope}",
        created,
        f"updated: {TODAY}",
        f"tags: [索引, AI入口, {scope}]",
        "---",
        "",
        f"# {title}（AI 入口）",
        "",
        f"> 本层共 **{len(rows)}** 条。AI 读**本页**定位，再按路径读原文——**不要在本页找正文**。",
        "> 维护：`python _agent_scripts/mem_index.py --write`。新增条目自动补行；"
        "**本页手工写的「定位 / 关键词」会被保留**，可放心润色。",
        "> 校验：`python _agent_scripts/mem_index.py --check`（发现漂移非 0 退出）。",
    ]
    key = scope.capitalize()
    if key in EXTRA_NOTE:
        head.append(EXTRA_NOTE[key])
    head += [
        "",
        "| 路径 | 一句话定位 | 关键词 | 更新 |",
        "|---|---|---|---|",
    ]
    body = [f"| `{k}` | {loc} | {kw} | {upd} |" for k, loc, kw, upd in rows]
    return n.join(head + body) + n


def write_or_check(idx: Path, content: str, check: bool, problems: list[str]) -> None:
    if check:
        if not idx.exists():
            problems.append(f"[缺索引] {idx.relative_to(REPO)}")
            return
        old_rows = {k: (a, b) for k, (a, b, _) in load_existing(idx).items()}
        new_rows = {m.group(1).strip(): (m.group(2).strip(), m.group(3).strip())
                    for m in ROW.finditer(content)}
        for k in sorted(set(old_rows) - set(new_rows)):
            problems.append(f"[失效行] {idx.relative_to(REPO)} :: {k}（文件已不存在）")
        for k in sorted(set(new_rows) - set(old_rows)):
            problems.append(f"[缺失行] {idx.relative_to(REPO)} :: {k}（新笔记未登记）")
        return
    if idx.exists() and read_text(idx) == content:
        return
    idx.parent.mkdir(parents=True, exist_ok=True)
    with io.open(idx, "w", encoding="utf-8", newline="") as f:
        f.write(content)
    print(f"  写入 {idx.relative_to(REPO)}  ({content.count(chr(10))} 行)")


# --------------------------------------------------------------------------- #
# 手工地图页的顶层覆盖校验
# --------------------------------------------------------------------------- #
def top_entries(d: Path) -> list[str]:
    """顶层项名，供**手工地图页**的覆盖校验用（「地图页有没有漏列某顶层项」）。

    排除两类，否则门禁会假红：
      ① `_index.md` —— 地图页自身（自引用）；
      ② **点开头的项** —— `.git` / `.obsidian` / `.trash` 等工具与仓库基础设施，
         不是「内容」。（历史注：2026-09-21 曾在 `vault/Memory` 内建独立本地 git 仓，
         多出的 `.git` 与 `.gitignore` 让 `--check` 报「地图页漏列」；该仓同日已删。）
    """
    return sorted(
        p.name for p in d.iterdir()
        if p.name != "_index.md" and not p.name.startswith(".")
    )


def check_top_level(idx: Path, items: list[str], label: str, problems: list[str]) -> None:
    if not idx.exists():
        problems.append(f"[缺地图页] {idx.relative_to(REPO)}")
        return
    text = read_text(idx)
    missing = [x for x in items if x not in text]
    if missing:
        problems.append(
            f"[地图页漏列] {idx.relative_to(REPO)} :: {label} 未提及 → {', '.join(missing)}"
        )


def real_layers() -> list[tuple[str, list[tuple[str, str, str, str]]]]:
    out = []
    for layer in LAYERS:
        d = MEM / layer
        if not d.is_dir():
            continue
        exist = load_existing(d / "_index.md")
        rows = []
        for p in sorted(d.glob("*.md")):
            if p.name in ("_index.md", "README.md"):
                continue
            key = f"{layer}/{p.name}"
            rows.append((key, *keep_or_auto(exist, key, note_meta(p))))
        rows.sort(key=lambda r: r[0].lower())
        out.append((layer, rows))

    d = MEM / PROJECTS
    if d.is_dir():
        exist = load_existing(d / "_index.md")
        rows = []
        for sub in sorted(x for x in d.iterdir() if x.is_dir()):
            key = f"{PROJECTS}/{sub.name}/"
            rows.append((key, *keep_or_auto(exist, key, project_meta(sub))))
        rows.sort(key=lambda r: r[0].lower())
        out.append((PROJECTS, rows))
    return out


def main() -> int:
    ap = argparse.ArgumentParser(description="记忆库索引生成/校验")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--write", action="store_true", help="生成/更新各层 _index.md")
    g.add_argument("--check", action="store_true", help="体检：报告漂移，非 0 退出")
    ap.add_argument("--layer", help="只处理某一层（Preferences/Plans/Lessons/Workflows/Projects）")
    args = ap.parse_args()

    if not MEM.is_dir():
        print(f"!! 记忆库不存在：{MEM}", file=sys.stderr)
        return 2

    problems: list[str] = []
    layers = real_layers()
    if args.layer:
        layers = [x for x in layers if x[0].lower() == args.layer.lower()]
        if not layers:
            print(f"!! 未知层：{args.layer}", file=sys.stderr)
            return 2

    mode = "体检" if args.check else "生成"
    print(f"== 记忆库索引 {mode} == {MEM}")

    total = 0
    for layer, rows in layers:
        total += len(rows)
        idx = MEM / layer / "_index.md"
        title = {"Projects": "Projects 项目索引"}.get(layer, f"{layer} 索引")
        content = render(idx, title, layer.lower(), rows)
        print(f"[{layer}] {len(rows)} 条")
        write_or_check(idx, content, args.check, problems)

    # 手工地图页的顶层覆盖（排除地图页自身与点开头的工具/仓库基础设施，见 top_entries）
    check_top_level(VAULT / "_index.md", top_entries(VAULT), "vault 顶层", problems)
    check_top_level(MEM / "_index.md", top_entries(MEM), "Memory 顶层", problems)

    print(f"-- 共 {total} 条；手工地图页校验完成")
    if args.check:
        if problems:
            print(f"\n!! 发现 {len(problems)} 处漂移：")
            for p in problems:
                print("   " + p)
            return 1
        print("OK：无漂移。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
