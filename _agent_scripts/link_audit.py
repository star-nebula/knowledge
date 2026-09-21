#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""link_audit.py — 知识库 wikilink 断链审计（区分活链与记录文本）

用途
  扫描 vault/ 全库 md 中的 [[wikilink]]，判定目标是否真实存在，按层输出断链报告。
  用于「改前出筛选清单 / 改后验收」两端。

用法
  python _agent_scripts/link_audit.py                              # 全库报告 → _agent_scripts/_out/link_audit.txt
  python _agent_scripts/link_audit.py --layers Memory,Knowledge     # 只输出这两层的断链
  python _agent_scripts/link_audit.py --out D:/tmp/x.txt           # 指定输出文件
  python _agent_scripts/link_audit.py --quiet                       # 只打印计数行

判定规则（四处易错，均已内建）
  1. 剥离代码块与行内代码 —— Obsidian 不解析其中的 [[...]]，不剥离必然误报
  2. 判定表收录**全库所有文件**（笔记 + 附件）—— 否则 ![[img.png]] 全被误判为断链
  3. 同时认 [[Note]] 与 [[Note.md]] 两种写法，并带 Windows 大小写不敏感回退（[[todo]] 命中 Todo.md）
  4. **站点视角的漏报**：判定表是全库的，而站点只发布 .vitepress/config.ts 的 PUBLISHED_DIRS。
     若某目标**只**在非发布目录（Resources/ Archive/ Canvas/ .opencode/ …）里有同名文件，
     Obsidian 里算活链，但站点上 nolebase 双链索引不含该目录 → 渲染成死链（404）。
     本脚本把它单列为「站点侧死链」段，不计入主断链表。

退出码
  0 = 扫描完成（不代表无断链）    1 = 参数/路径错误

相关：断链处置清单见 vault/Memory/Projects/knowledge/断链修复筛选清单-2026-09-21.md
"""
import argparse
import datetime
import io
import os
import re
import sys
from collections import defaultdict

DEFAULT_ROOT = r"E:\knowledge\vault"
SKIP_DIRS = {".trash", ".obsidian", ".opencode", ".git", "node_modules"}
MAX_ROWS_PER_TARGET = 40

# 站点发布面：唯一事实来源是 .vitepress/config.ts 的 PUBLISHED_DIRS。
# 从配置里正则抽取其顶层名，避免两处手工维护导致漂移。
CONFIG_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                           ".vitepress", "config.ts")


def load_published():
    """返回发布面顶层名集合；读不到配置则返回 None（此时跳过站点视角检查）。"""
    if not os.path.isfile(CONFIG_PATH):
        return None
    try:
        txt = io.open(CONFIG_PATH, encoding="utf-8").read()
    except Exception:
        return None
    m = re.search(r"const PUBLISHED_DIRS = \[(.*?)\n\]", txt, re.S)
    if not m:
        return None
    names = {p.split("/")[0] for p in re.findall(r"'vault/([^']+)'", m.group(1))}
    return names or None


def walk_all(root):
    for dp, dn, fns in os.walk(root):
        dn[:] = [d for d in dn if d not in SKIP_DIRS]
        for fn in fns:
            yield os.path.join(dp, fn)


def main():
    ap = argparse.ArgumentParser(description="vault wikilink 断链审计")
    ap.add_argument("--root", default=DEFAULT_ROOT)
    ap.add_argument("--out", default=os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                                  "_out", "link_audit.txt"))
    ap.add_argument("--layers", default="", help="逗号分隔的顶层目录名，只输出这些层的断链")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    if not os.path.isdir(args.root):
        sys.stderr.write("root not found: %s\n" % args.root)
        return 1

    all_files = sorted(walk_all(args.root))
    mds = [f for f in all_files if f.lower().endswith(".md")]

    # 判定表：basename 与 stem 都收（[[Note]] / [[Note.md]] 皆有效），另收小写作 Windows 回退
    base, base_lower = defaultdict(list), defaultdict(list)
    for f in all_files:
        fn = os.path.basename(f)
        stem = os.path.splitext(fn)[0]
        rel = os.path.relpath(f, args.root)
        for k in {fn, stem}:
            base[k].append(rel)
            base_lower[k.lower()].append(rel)

    fence = re.compile(r"```.*?```", re.S)
    inline = re.compile(r"`[^`\n]*`")
    wl = re.compile(r"\[\[([^\[\]]+?)\]\]")

    def blank(m):
        return "".join("\n" if c == "\n" else " " for c in m.group(0))

    def strip_code(t):
        return inline.sub(blank, fence.sub(blank, t))

    broken = defaultdict(list)
    pubmiss = defaultdict(list)
    published = load_published()
    total = 0
    for f in mds:
        rel = os.path.relpath(f, args.root)
        try:
            txt = io.open(f, encoding="utf-8").read()
        except Exception:
            continue
        clean = strip_code(txt)
        lines = txt.split("\n")
        for m in wl.finditer(clean):
            raw = m.group(1).strip()
            tgt = raw.split("|")[0].split("#")[0].strip()
            if not tgt or re.match(r"^[a-zA-Z]+://", tgt) or tgt.startswith("."):
                continue
            total += 1
            leaf = tgt.split("/")[-1].strip()
            hits = base.get(leaf) or base_lower.get(leaf.lower())
            ln = clean[:m.start()].count("\n")
            ctx = lines[ln].strip() if ln < len(lines) else ""
            if hits:
                # 站点视角：引用方在发布层、但所有同名命中都落在非发布目录 →
                # Obsidian 活链、站点死链。引用方本身不在发布层的不算（那两页都不渲染，无 404 可言）
                if (published
                        and re.split(r"[\\/]", rel)[0] in published
                        and not ({re.split(r"[\\/]", h)[0] for h in hits} & published)):
                    pubmiss[tgt].append((rel, ln + 1, ctx[:170]))
                continue
            broken[tgt].append((rel, ln + 1, ctx[:170]))

    want = {s.strip() for s in args.layers.split(",") if s.strip()} or None

    def layer_of(rel):
        return re.split(r"[\\/]", rel)[0]

    def render(title, table):
        """渲染一个断链表；返回 (行列表, 显示目标数)"""
        buf = [title, ""]
        n = 0
        for tgt in sorted(table, key=lambda k: (-len(table[k]), k)):
            rows = table[tgt]
            ls = sorted({layer_of(r) for r, _, _ in rows})
            if want and not (set(ls) & want):
                continue
            n += 1
            buf.append("[[%s]]  x%d  [%s]" % (tgt, len(rows), ",".join(ls)))
            for rel, ln, ctx in rows[:MAX_ROWS_PER_TARGET]:
                buf.append("    %s:%d  %s" % (rel, ln, ctx))
            if len(rows) > MAX_ROWS_PER_TARGET:
                buf.append("    ... 另 %d 处" % (len(rows) - MAX_ROWS_PER_TARGET))
        if n == 0:
            buf.append("（无）")
        return buf, n

    pub_n = len(pubmiss)
    pub_rows = sum(len(v) for v in pubmiss.values())

    out = []
    out.append("# link_audit · %s" % datetime.datetime.now().strftime("%Y-%m-%d %H:%M"))
    out.append("# root=%s" % args.root)
    out.append("md=%d  wikilinks=%d  broken_targets=%d  hit_rows=%d"
               % (len(mds), total, len(broken), sum(len(v) for v in broken.values())))
    out.append("published_top=%s" % (",".join(sorted(published)) if published else "(未读到 config，跳过站点视角)"))
    out.append("site_dead_targets=%d  site_dead_rows=%d" % (pub_n, pub_rows))
    out.append("")
    main_rows, shown = render("## 一、真断链（全库无同名文件）", broken)
    out.extend(main_rows)
    out.append("")
    site_rows, _ = render("## 二、站点侧死链（全库有同名，但只在非发布目录里 → 站点 404）", pubmiss)
    out.extend(site_rows)

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    io.open(args.out, "w", encoding="utf-8").write("\n".join(out))

    print("md=%d wikilinks=%d broken_targets=%d hit_rows=%d shown=%d | site_dead_targets=%d site_dead_rows=%d -> %s" % (
        len(mds), total, len(broken), sum(len(v) for v in broken.values()), shown, pub_n, pub_rows, args.out))
    return 0


if __name__ == "__main__":
    sys.exit(main())
