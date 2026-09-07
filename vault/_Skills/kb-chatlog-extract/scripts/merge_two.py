#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""合并两个 agent 的提炼 CSV：去重 + 列出冲突待裁项，供 main 定稿。

用法: python merge_two.py <A.csv> <B.csv> <out.csv>
- 去重键: (会话ID, 提炼后_问题 归一化去空白)
- 两方都有的键: 默认保留 A（main 再裁定）；若双方 提炼后_答案 不同，记入待审。
- 仅一方有的键: 直接并入。
- 输出 12 列合并 CSV（out.csv）；同目录生成 批次_合并待审.txt 列出冲突项。
- 自动处理输入 CSV 被转成 zip（PK 头）的情况。
"""
import sys
import os
import io
import re
import csv
import zipfile
import openpyxl

COLS = ["批次", "会话ID", "商品", "提炼前_原始问答", "提炼后_问题", "提炼后_答案",
        "意图", "答案标签", "适用对象", "优先级", "入库结论", "备注"]


def load_rows(path):
    with open(path, "rb") as f:
        head = f.read(2)
    if head == b"PK":
        with open(path, "rb") as f:
            blob = f.read()
        wb = openpyxl.load_workbook(io.BytesIO(blob), read_only=False, data_only=True)
        ws = wb[wb.sheetnames[0]]
        rows = [[c.value for c in r] for r in ws.iter_rows()]
        wb.close()
        hdr = rows[0]
        return [dict(zip(hdr, r)) for r in rows[1:]]
    with io.open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def key(r):
    return (r.get("会话ID", ""), re.sub(r"\s+", "", r.get("提炼后_问题", "") or ""))


def main():
    if len(sys.argv) < 4:
        print("用法: merge_two.py <A.csv> <B.csv> <out.csv>")
        sys.exit(1)
    a_path, b_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
    A = load_rows(a_path)
    B = load_rows(b_path)
    a_map = {}
    b_map = {}
    for r in A:
        a_map.setdefault(key(r), r)
    for r in B:
        b_map.setdefault(key(r), r)

    merged = []
    conflicts = []
    seen = set()
    for k, r in a_map.items():
        merged.append(r)
        seen.add(k)
    for k, r in b_map.items():
        if k not in seen:
            merged.append(r)
            seen.add(k)
        else:
            ra = a_map[k]
            rb = b_map[k]
            if (ra.get("提炼后_答案", "") or "").strip() != (rb.get("提炼后_答案", "") or "").strip():
                conflicts.append((k, ra, rb))

    with io.open(out, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLS)
        w.writeheader()
        w.writerows(merged)

    d = os.path.dirname(out) or "."
    audit = os.path.join(d, "批次_合并待审.txt")
    with io.open(audit, "w", encoding="utf-8-sig") as f:
        f.write(f"合并 A={os.path.basename(a_path)}  B={os.path.basename(b_path)}\n")
        f.write(f"合并后总行数: {len(merged)}（A {len(a_map)} + B独有 {len(b_map) - len(seen & set(b_map))}）\n")
        f.write(f"冲突待裁项（同会话同问题、答案不同）: {len(conflicts)}\n\n")
        for k, ra, rb in conflicts:
            f.write(f"=== 会话 {k[0]} | 问题 {k[1]}\n")
            f.write(f"[A] {ra.get('提炼后_答案', '')}\n")
            f.write(f"[B] {rb.get('提炼后_答案', '')}\n\n")

    print(f"已合并: {out} | 行数 {len(merged)}")
    print(f"冲突待裁: {len(conflicts)} 项 → 见 {audit}")


if __name__ == "__main__":
    main()
