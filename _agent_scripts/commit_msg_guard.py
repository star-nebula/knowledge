#!/usr/bin/env python
"""提交消息围栏守卫 —— 剥掉套在提交消息最外层的 ``` 围栏。

## 为什么存在

部分 AI 编程工具会把整个 commit message 包进一对 markdown 代码围栏再交给
`git commit`，于是 `git log --oneline` 显示成：

    ``` docs(AI): 更新AI知识库链接结构和文档引用

2026-09-21 实测本仓 1103 个提交中有 **86 个**中招，集中在最近 115 个提交里
（第 115 位 `e66f395b` 起，分界线之前的历史是干净的）。已用 `git commit-tree`
链式重建一次性清除（见技能 git-rewrite-without-checkout）。

钩子只能拦住**未来**的提交；历史里那 86 个必须靠改写解决。两者互补。

## 用法

    python commit_msg_guard.py <msg-file>     # 原地剥围栏（由 .git/hooks/commit-msg 调用）
    python commit_msg_guard.py --check <file> # 只报不改；会改则退出码 1
    python commit_msg_guard.py --scan         # 扫全历史，报还有多少提交中招

## 判定规则（只动最外层那一对，绝不碰消息内部）

  1. 首个非空逻辑行必须是孤立的 ```（只允许尾随空白）
  2. 末尾非空行必须是孤立的 ```
  3. 二者之间至少留有一行非空正文 —— 否则可能把消息剥成空的，此时不剥

三条同时满足才剥；只满足部分一律原样返回。这样即使消息内部含有代码块
（例如贴了 diff 或 shell 片段），也不会被误剥。
"""

import subprocess
import sys
from pathlib import Path

FENCE = "```"


def strip_fences(text: str):
    """剥掉首尾成对的围栏。返回 (新文本, 是否改动)。"""
    lines = text.split("\n")
    if len(lines) < 3 or lines[0].strip() != FENCE:
        return text, False

    # 末尾非空行
    close = None
    for i in range(len(lines) - 1, 0, -1):
        if lines[i].strip():
            close = i
            break
    # idx<2 说明围栏之间没有正文空间
    if close is None or close < 2 or lines[close].strip() != FENCE:
        return text, False

    body = lines[1:close]
    if not any(l.strip() for l in body):
        return text, False

    while body and not body[0].strip():
        body.pop(0)
    while body and not body[-1].strip():
        body.pop()

    return "\n".join(body) + "\n", True


def scan_history() -> int:
    """扫全历史：Subject 以围栏开头的提交数。"""
    r = subprocess.run(
        ["git", "log", "--format=%h%x09%s"],
        capture_output=True,
    )
    if r.returncode != 0:
        print("不在 git 仓库里或 git 不可用")
        return -1
    bad = []
    for line in r.stdout.decode("utf-8", "replace").split("\n"):
        if "\t" not in line:
            continue
        sha, subj = line.split("\t", 1)
        if subj.lstrip().startswith(FENCE):
            bad.append((sha, subj.strip()[:80]))
    print("中招提交数 = %d" % len(bad))
    for sha, subj in bad[:20]:
        print("  %s  %s" % (sha, subj))
    if len(bad) > 20:
        print("  ... 另 %d 个" % (len(bad) - 20))
    return len(bad)


def main() -> int:
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return 2

    if args[0] == "--scan":
        return 0 if scan_history() == 0 else 1

    check_only = args[0] == "--check"
    path = Path(args[1] if check_only else args[0])
    if not path.is_file():
        print("找不到消息文件：%s" % path, file=sys.stderr)
        return 2

    # 用 bytes 读、按 utf-8 解码，保留原样回写（不改换行风格）
    raw = path.read_bytes()
    text = raw.decode("utf-8", "replace")
    new, changed = strip_fences(text)

    if not changed:
        if check_only:
            print("干净：无需剥围栏")
        return 0

    first = new.split("\n")[0]
    if check_only:
        print("会改动：剥掉外层围栏后首行 = %s" % first)
        return 1

    path.write_bytes(new.encode("utf-8"))
    print("commit-msg guard: 已剥掉消息外层 ``` 围栏，首行 = %s" % first)
    return 0


if __name__ == "__main__":
    sys.exit(main())
