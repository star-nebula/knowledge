#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ref_scan.py — 删除笔记/目录前的「引用面」扫描。

回答一个问题：这个文件（或目录）能安全删除吗？删了会留下什么。

扫描三个面：
  (1) 笔记面  全 vault 的 md 里对该目标（笔记名 / 相对路径）的 wikilink 引用
  (2) 仓库面  .gitignore 规则命中（是否已被忽略 -> 删了不影响 git 与发布）
  (3) 站点面  .vitepress/ 与 scripts/ 里对目标名的字面硬引用

用法:
  python ref_scan.py <路径>                  # 打印报告
  python ref_scan.py <路径> -o report.md     # 同时写文件（本机 PowerShell 会吞 stdout）
  python ref_scan.py <路径> --json           # 机器可读

退出码: 0 = 未见引用，可安全删除; 1 = 存在引用，需先处理。
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

DEFAULT_VAULT = Path(r"E:\knowledge\vault")
DEFAULT_ROOT = Path(r"E:\knowledge")

# 扫描时整段跳过的目录（这些不是笔记区）
SKIP_DIRS = {".git", ".trash", ".obsidian", ".vitepress", "node_modules", "backup", "dist", "cache"}

# 非笔记的附件扩展名（wikilink 指向它们时不算「笔记引用」）
ASSET_EXT = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".avif",
    ".mp4", ".mov", ".webm", ".mp3", ".wav", ".pdf", ".canvas", ".xmind", ".excalidraw",
}

WIKI_RE = re.compile(r"\[\[([^\]\n]+)\]\]")
FENCE_RE = re.compile(r"^\s*(```|~~~)")
INLINE_CODE_RE = re.compile(r"`[^`]*`")

# 站点/构建配置里需要检查的文本文件
CONF_GLOBS = (
    ".vitepress/**/*.ts",
    ".vitepress/**/*.mts",
    ".vitepress/**/*.json",
    "scripts/**/*.ts",
    "scripts/**/*.mjs",
    "scripts/**/*.js",
    "package.json",
    "uno.config.ts",
    "vite.config.ts",
)


# ---------------------------------------------------------------- 遍历与规范化

def iter_md(vault: Path):
    """产出 (绝对路径, 相对 vault 的 posix 路径)，跳过非笔记区。"""
    for p in vault.rglob("*.md"):
        try:
            rel = p.relative_to(vault)
        except ValueError:
            continue
        if any(part in SKIP_DIRS for part in rel.parts[:-1]):
            continue
        yield p, rel.as_posix()


def norm_wiki_target(raw: str) -> str | None:
    """把 wikilink 目标规范化成「不含 .md 扩展名的相对路径」；非笔记返回 None。"""
    t = raw.replace("\\", "/").split("|")[0].split("#")[0].strip().strip("/")
    if not t:
        return None
    suffix = Path(t).suffix.lower()
    if suffix == ".md":
        t = t[:-3]
    elif suffix in ASSET_EXT:
        return None
    return t


def collect_targets(target: Path, vault: Path):
    """返回 (笔记名集合, 相对路径集合, 目录路径前缀, 是否目录)。"""
    try:
        rel = target.relative_to(vault).as_posix()
    except ValueError:
        rel = target.name

    if target.is_dir():
        files = [p for p in target.rglob("*") if p.is_file() and p.suffix.lower() == ".md"]
        names = {p.stem for p in files}
        paths = set()
        for p in files:
            try:
                paths.add(p.relative_to(vault).with_suffix("").as_posix())
            except ValueError:
                continue
        prefix = rel.rstrip("/") + "/"
        return names, paths, prefix, True

    return {target.stem}, {str(Path(rel).with_suffix("")).replace("\\", "/")}, "", False


# ---------------------------------------------------------------- 三个面

def looks_like_target(t: str, names, paths, prefix) -> bool:
    """判断一个规范化后的链接目标是否指向本目标。

    带路径（含 "/"）只按路径匹配，不退化到同名匹配——否则 `Memory/AGENTS`
    会误命中根目录的 `AGENTS.md`。与 Obsidian 的实际解析口径一致。
    """
    if "/" in t:
        return bool(t in paths
                    or (prefix and t.startswith(prefix))
                    or any(t.startswith(p + "/") for p in paths))
    return t in names


def scan_notes(vault: Path, target: Path, names, paths, prefix, is_dir):
    """全库 md 里对目标的 wikilink 引用。返回 (路径命中, 名称命中, 代码内忽略数)。"""
    path_hits, name_hits, ignored = [], [], 0

    for md, md_rel in iter_md(vault):
        if md == target:
            continue  # 不自引用
        try:
            text = md.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue

        in_fence = False
        for lineno, line in enumerate(text.splitlines(), 1):
            if FENCE_RE.match(line):
                in_fence = not in_fence
                continue
            if in_fence:
                # 围栏代码块内的 [[...]] 不解析（只统计指向本目标的那些）
                for m in WIKI_RE.finditer(line):
                    t = norm_wiki_target(m.group(1))
                    if t and looks_like_target(t, names, paths, prefix):
                        ignored += 1
                continue

            spans = [m.span() for m in INLINE_CODE_RE.finditer(line)]
            for m in WIKI_RE.finditer(line):
                t = norm_wiki_target(m.group(1))
                if any(a <= m.start() < b for a, b in spans):
                    if t and looks_like_target(t, names, paths, prefix):
                        ignored += 1
                    continue
                if t is None or not looks_like_target(t, names, paths, prefix):
                    continue
                rec = {"file": md_rel, "line": lineno, "raw": m.group(0)[:80]}
                (path_hits if "/" in t else name_hits).append(rec)

    return path_hits, name_hits, ignored


def scan_gitignore(root: Path, target: Path):
    """返回命中的 (.gitignore 行号, 原始模式) 列表。"""
    gi = root / ".gitignore"
    if not gi.is_file():
        return []
    try:
        rel = target.relative_to(root).as_posix()
    except ValueError:
        return []

    hits = []
    for lineno, raw in enumerate(gi.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#") or line.startswith("!"):
            continue
        if match_gitignore(rel, line):
            hits.append((lineno, line))
    return hits


def match_gitignore(rel_posix: str, pattern: str) -> bool:
    """简化版 gitignore 语义：够用即可（支持 **、前导 /、目录尾 /、* 与 ?）。"""
    pat = pattern.rstrip()
    pat = pat.rstrip("/")
    if not pat:
        return False
    anchored = pat.startswith("/") or "/" in pat
    if pat.startswith("/"):
        pat = pat[1:]

    rx, i = "", 0
    while i < len(pat):
        c = pat[i]
        if c == "*":
            if pat[i:i + 2] == "**":
                rx += ".*"
                i += 2
                if pat[i:i + 1] == "/":
                    i += 1
                continue
            rx += "[^/]*"
        elif c == "?":
            rx += "[^/]"
        else:
            rx += re.escape(c)
        i += 1

    body = rx + r"(/.*)?$"
    regex = re.compile(r"^" + body) if anchored else re.compile(r"(^|.*/)" + body)
    return bool(regex.search(rel_posix))


def scan_site(root: Path, names, rel_paths):
    """构建配置里对目标名的字面引用。"""
    hits = []
    seen = set()
    for glob in CONF_GLOBS:
        for f in root.glob(glob):
            if not f.is_file() or f in seen:
                continue
            seen.add(f)
            if any(part in SKIP_DIRS for part in f.parts):
                continue
            try:
                text = f.read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue
            for needle in list(names) + [Path(p).name for p in rel_paths]:
                if len(needle) < 3:
                    continue
                rx = re.compile(r"(?<![A-Za-z0-9_.\-/])" + re.escape(needle) + r"(?![A-Za-z0-9_\-])")
                for lineno, line in enumerate(text.splitlines(), 1):
                    if rx.search(line):
                        rel_f = f.relative_to(root).as_posix()
                        key = (rel_f, lineno, needle)
                        if key in seen:
                            continue
                        seen.add(key)
                        hits.append({
                            "file": rel_f, "line": lineno, "needle": needle,
                            "text": line.strip()[:90],
                        })
    return hits


# ---------------------------------------------------------------- 报告

def build_report(target: Path, vault: Path, root: Path) -> dict:
    names, paths, prefix, is_dir = collect_targets(target, vault)
    path_hits, name_hits, ignored = scan_notes(vault, target, names, paths, prefix, is_dir)
    gi_hits = scan_gitignore(root, target)
    site_hits = scan_site(root, names, paths)

    all_stems = {}
    for _, rel in iter_md(vault):
        stem = Path(rel).stem
        all_stems[stem] = all_stems.get(stem, 0) + 1

    dup = sorted((n, all_stems.get(n, 0)) for n in names if all_stems.get(n, 0) > 1)

    return {
        "target": str(target),
        "exists": target.exists(),
        "is_dir": is_dir,
        "names": sorted(names),
        "rel_paths": sorted(paths),
        "dup_names": dup,
        "path_hits": path_hits,
        "name_hits": name_hits,
        "ignored_in_code": ignored,
        "gitignore_hits": [{"line": ln, "pattern": p} for ln, p in gi_hits],
        "site_hits": site_hits,
    }


def render(r: dict) -> str:
    L = []
    L.append(f"# ref_scan — {r['target']}")
    L.append("")
    L.append(f"- 存在：{'是' if r['exists'] else '**否**'}　类型：{'目录' if r['is_dir'] else '文件'}")
    L.append(f"- 笔记名：{', '.join('`' + n + '`' for n in r['names'][:12]) or '—'}"
             + (f"（共 {len(r['names'])} 个）" if len(r['names']) > 12 else ""))
    if r["dup_names"]:
        dup_txt = "、".join(f"`{n}`（全库 {c} 处）" for n, c in r["dup_names"][:8])
        L.append(f"- ⚠️ **同名歧义**：{dup_txt} —— 裸 `[[名]]` 链接由 Obsidian 按就近解析，可能不是本目标")
    L.append("")

    L.append("## ① 笔记面（全 vault wikilink）")
    if r["path_hits"]:
        L.append(f"🔴 **路径引用 {len(r['path_hits'])} 处**（精确指向本目标）：")
        for h in r["path_hits"][:40]:
            L.append(f"  - `{h['file']}:{h['line']}` {h['raw']}")
    else:
        L.append("🟢 路径引用 0 处")
    if r["name_hits"]:
        L.append(f"🟡 名称引用 {len(r['name_hits'])} 处（按笔记名匹配，可能含同名他文件）：")
        for h in r["name_hits"][:40]:
            L.append(f"  - `{h['file']}:{h['line']}` {h['raw']}")
    else:
        L.append("🟢 名称引用 0 处")
    if r.get("ignored_in_code"):
        L.append(f"ℹ️ 另有 {r['ignored_in_code']} 处指向本目标的 `[[...]]` 写在**行内代码 / 代码块**里"
                 "（文档中的举例文字），Obsidian 不解析，不计为引用。")
    L.append("")

    L.append("## ② 仓库面（.gitignore）")
    if r["gitignore_hits"]:
        for h in r["gitignore_hits"]:
            L.append(f"🟢 已忽略 —— 第 {h['line']} 行 `{h['pattern']}`（删后不影响 git 跟踪与发布）")
    else:
        L.append("🟡 **未被 .gitignore 忽略** —— 若它当前被 git 跟踪，删除会体现在提交里；若在发布面（`PUBLISHED_DIRS`）还会影响站点")
    L.append("")

    L.append("## ③ 站点面（构建配置硬引用）")
    if r["site_hits"]:
        for h in r["site_hits"][:30]:
            L.append(f"🔴 `{h['file']}:{h['line']}` 含 `{h['needle']}` → {h['text']}")
    else:
        L.append("🟢 无")
    L.append("")

    blocking = len(r["path_hits"]) + len(r["site_hits"])
    if not r["exists"]:
        verdict = "⚠️ 目标不存在，请检查路径"
    elif blocking:
        verdict = f"🔴 **不可直接删除**：路径引用 {len(r['path_hits'])} 处 + 站点硬引用 {len(r['site_hits'])} 处，需先改指或移除"
    elif r["name_hits"]:
        verdict = f"🟡 **改完链接即可删**：{len(r['name_hits'])} 处名称引用（多为 frontmatter `related`），改指后无死链"
    else:
        verdict = "🟢 **可安全删除**：全库无 wikilink 引用，站点配置无硬引用"

    L.append("## 结论")
    L.append("")
    L.append(verdict)
    return "\n".join(L) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser(description="删除前扫描引用面（wikilink / .gitignore / 站点配置）")
    ap.add_argument("target", help="要删除的文件或目录路径")
    ap.add_argument("-o", "--out", help="把报告写入该文件（UTF-8）")
    ap.add_argument("--vault", default=str(DEFAULT_VAULT), help=f"Obsidian vault 根（默认 {DEFAULT_VAULT}）")
    ap.add_argument("--root", default=str(DEFAULT_ROOT), help=f"仓库根（默认 {DEFAULT_ROOT}）")
    ap.add_argument("--json", action="store_true", help="输出 JSON 而非 markdown 报告")
    args = ap.parse_args()

    target = Path(args.target).resolve()
    vault, root = Path(args.vault).resolve(), Path(args.root).resolve()

    if not target.exists():
        print(f"[ref_scan] 目标不存在：{target}", file=sys.stderr)

    r = build_report(target, vault, root)
    out = json.dumps(r, ensure_ascii=False, indent=2) if args.json else render(r)

    if args.out:
        Path(args.out).write_text(out, encoding="utf-8")
        print(f"[ref_scan] 报告已写入 {args.out}")
    else:
        print(out)

    blocking = len(r["path_hits"]) + len(r["site_hits"])
    return 1 if (blocking or r["name_hits"] or not r["exists"]) else 0


if __name__ == "__main__":
    sys.exit(main())
