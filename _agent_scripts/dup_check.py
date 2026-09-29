"""
扫描 Decisions/ + Workflows/ + rule/ 分节，检测同一规则在多个文件中重述。
报告版（非门禁）：恒退出码 0；报告写 _agent_scripts/_out/dup_check.txt（PowerShell 吞 stdout 惯例）。
排除各层 _index.md（脚本生成的导航摘要，与详笔记重述属设计内行为）。
已知误报来源：有意保持一致的副本（如子代理透传模板双正本）、标题回声、冻结文件——报告中人工判断，勿机械处理。
用法：python _agent_scripts/dup_check.py [--min-len 8]
"""
import argparse, collections, pathlib, re, sys

MEMORY = pathlib.Path(r"E:\knowledge\vault\Memory")
SCAN_DIRS = ["Decisions", "Workflows", "rule"]
SCAN_FILES = ["Rule.md"]

def main():
    ap = argparse.ArgumentParser(description="规则重述报告（报告版，非门禁）")
    ap.add_argument("--min-len", type=int, default=8, help="特征短语最小长度（中文字符）")
    ap.add_argument("--out", default=str(pathlib.Path(__file__).parent / "_out" / "dup_check.txt"))
    args = ap.parse_args()

    pat = re.compile(r"[\u4e00-\u9fff]{%d,}" % args.min_len)
    phrases = collections.defaultdict(set)

    def scan(fp, rel):
        text = fp.read_text(encoding="utf-8")
        for m in pat.finditer(text):
            phrases[m.group()].add(rel)

    for d in SCAN_DIRS:
        for f in (MEMORY / d).rglob("*.md"):
            if f.name == "_index.md":
                continue
            scan(f, str(f.relative_to(MEMORY)))
    for fn in SCAN_FILES:
        fp = MEMORY / fn
        if fp.exists():
            scan(fp, fn)

    dups = {p: fs for p, fs in phrases.items() if len(fs) > 1}
    lines = ["# dup_check · 报告版（非门禁）", "# root=%s" % MEMORY,
             "phrases=%d  duplicated=%d" % (len(phrases), len(dups)), ""]
    for p, fs in sorted(dups.items(), key=lambda x: -len(x[1])):
        lines.append("[%s…] 出现在: %s" % (p[:30], ", ".join(sorted(fs))))

    out = pathlib.Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines), encoding="utf-8")
    print("duplicated_phrases=%d -> %s" % (len(dups), args.out))
    return 0

if __name__ == "__main__":
    sys.exit(main())
