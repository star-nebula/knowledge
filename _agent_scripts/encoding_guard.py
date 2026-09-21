#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
encoding_guard.py —— 文本文件编码守卫 / 批量转码为 UTF-8

背景（本机已复现的坑）：
  本项目多数工具覆写「已存在」的文件时会**沿用该文件原有编码**。
  即：一个原本以 GBK 落盘的中文 md，用编辑器/工具改完内容后仍然是 GBK。
  Obsidian / VitePress 按 UTF-8 读 → 整篇乱码。新建文件则默认 UTF-8，不受影响。

用途：
  1) 体检：扫描目录，列出所有非 UTF-8 文本文件（退出码 1，便于挂到流程里当门禁）。
  2) 修复：--fix 把 GBK/GB18030 文本原地转成 UTF-8（无 BOM），可选备份。

用法：
  python encoding_guard.py <路径>                      # 只体检
  python encoding_guard.py <路径> --fix                # 体检并转码
  python encoding_guard.py <路径> --fix --backup       # 转码前存 .bak
  python encoding_guard.py <路径> --ext .md,.txt,.html # 自定义扩展名
  python encoding_guard.py <路径> --fix --dry-run      # 只打印将要做的事

说明：
  - 只处理文本类扩展名（默认见 TEXT_EXTS），二进制一律跳过。
  - 自动跳过 .git / node_modules / .obsidian / $RECYCLE.BIN 等目录。
  - 「未知编码」（UTF-8、GBK 都解不开）的文件一律只报告、不动。
  - 转码是 GBK -> UTF-8 的字节级重编码，不做任何换行符转换。
"""

import argparse
import codecs
import os
import shutil
import sys

DEFAULT_EXTS = [".md", ".txt", ".html", ".htm", ".json", ".yml", ".yaml",
                ".csv", ".ts", ".js", ".py", ".css", ".xml"]

SKIP_DIRS = {".git", "node_modules", ".obsidian", "$RECYCLE.BIN",
             ".vitepress", "dist", ".venv", "venv", "__pycache__",
             ".idea", ".vscode", ".trash", "_archive_backup"}

# 先 UTF-8、再 GBK：这台的乱码源基本都是 GBK
CANDIDATES = ["utf-8", "gbk", "gb18030"]


def sniff(raw: bytes):
    """返回 (编码名, 是否 unicode 可读)。unreadable 表示 UTF-8/GBK 都解不开。"""
    if raw.startswith(codecs.BOM_UTF8):
        return "utf-8-bom", True
    for enc in CANDIDATES:
        try:
            raw.decode(enc)
            return enc, True
        except Exception:
            continue
    return "unknown", False


def iter_files(root: str, exts):
    if os.path.isfile(root):
        yield root
        return
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if os.path.splitext(fn)[1].lower() in exts:
                yield os.path.join(dirpath, fn)


def main():
    ap = argparse.ArgumentParser(description="扫描 / 修复非 UTF-8 文本文件")
    ap.add_argument("path", help="要扫描的文件或目录")
    ap.add_argument("--fix", action="store_true", help="把 GBK 系列转成 UTF-8")
    ap.add_argument("--backup", action="store_true", help="转码前生成同目录 .bak")
    ap.add_argument("--dry-run", action="store_true", help="只打印，不落盘")
    ap.add_argument("--ext", default="", help="逗号分隔扩展名，覆盖默认（如 .md,.txt）")
    args = ap.parse_args()

    exts = {e.strip().lower() for e in args.ext.split(",") if e.strip()} or set(DEFAULT_EXTS)
    for e in list(exts):
        if not e.startswith("."):
            exts.add("." + e)
            exts.discard(e)

    root = os.path.abspath(args.path)
    if not os.path.exists(root):
        print("[ERR] 路径不存在: %s" % root)
        return 2

    total = 0
    bad = []
    for p in iter_files(root, exts):
        total += 1
        try:
            raw = open(p, "rb").read()
        except Exception as ex:
            bad.append((p, "read-error", str(ex)))
            continue
        enc, ok = sniff(raw)
        if not ok:
            bad.append((p, "unknown", "UTF-8 与 GBK 均无法解码"))
        elif enc != "utf-8":
            bad.append((p, enc, "%d bytes" % len(raw)))

    is_utf8 = [b for b in bad if b[1] not in ("unknown", "read-error")]
    others = [b for b in bad if b[1] in ("unknown", "read-error")]

    print("扫描根目录 : %s" % root)
    print("文本文件数 : %d" % total)
    print("全程 UTF-8 : %d" % (total - len(bad)))
    print("需要处理   : %d" % len(bad))
    print()

    if bad:
        print("%-14s %s" % ("编码", "文件"))
        print("-" * 72)
        for p, enc, info in bad:
            print("%-14s %s   (%s)" % (enc, p, info))
        print()

    fixed = 0
    for p, enc, info in is_utf8:
        if enc == "utf-8-bom":
            direction = "GBK"
        else:
            direction = "GBK"
        target = "移除 BOM -> 纯 UTF-8" if enc == "utf-8-bom" else "%s -> UTF-8" % enc.upper()
        print("[%s] %s" % ("DRY " if (args.dry_run or not args.fix) else "FIX ", p))
        print("       %s" % target)
        if args.dry_run or not args.fix:
            continue
        raw = open(p, "rb").read()
        if enc == "utf-8-bom":
            text = raw.decode("utf-8-sig")
        else:
            text = raw.decode(enc)
        if args.backup:
            shutil.copy2(p, p + ".bak")
        with open(p, "wb") as f:
            f.write(text.encode("utf-8"))
        after = sniff(open(p, "rb").read())[0]
        print("       落盘编码 = %s  %s" % (after, "OK" if after == "utf-8" else "!! 异常"))
        fixed += 1

    for p, enc, info in others:
        print("[SKIP] %s  (%s)" % (p, info))

    print()
    if args.fix and not args.dry_run:
        print("完成：转码 %d 个文件。" % fixed)
        if others:
            print("仍有 %d 个文件无法自动处理，需人工确认。" % len(others))
        # 修复成功后返回 0，便于串到流程里
        return 1 if others else 0
    if bad:
        print("提示：加 --fix 可自动把 GBK 转成 UTF-8（建议先加 --backup）。")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
