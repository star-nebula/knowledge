#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""记忆库**独立本地仓**工具（`vault/Memory`）—— 把「记忆库有版本历史」变成可执行、可校验。

设计（2026-09-21 由用户裁定）
------------------------------
· **范围**：只 `vault/Memory/`（276 篇 / 1.45 MB）。父仓 `.gitignore:55` 整体忽略本目录
  → 嵌一个仓进去两层互不干扰：父仓不会把本层当子模块（git 不下降进被忽略目录），
  本层也不会吸走父仓已跟踪的 `vault/Knowledge` 等文件。
  **切勿改建在 `vault/` 层**——那里有父仓已跟踪的文件，放 `.git` 会让父仓把 `vault/`
  判成「嵌入式仓库」而破坏既有跟踪关系。
· **位置**：内联（`Memory/.git`）。**不放回任何云同步目录**——同步软件会把 `.git` 当普通
  目录复制/交叉覆盖，仓库必坏；届时改用 `git init --separate-git-dir=<盘外>` 把元数据移出。
· **远端**：一个都不配（第一道保险）。另两道：
  ② 本层 `.git/hooks/pre-push` 一律拒绝推送（防手滑 `git remote add`）；
  ③ 父仓 `pre-commit` 追加守卫，拒绝任何触碰 `vault/Memory/**` 的提交
     （防将来改 `.gitignore` 或用 `git add -f` 时把私密笔记推上公开库）。
· **备份**：用户选择「只保留本地历史」，**不做冗余**。磁盘损坏则笔记与历史一起丢；
  如需补，用 `git bundle create <盘>/memory.bundle --all`（单文件快照）或另一块盘上的裸仓。

用法
----
    python mem_git.py                            # 状态（默认动作）
    python mem_git.py --check                    # 门禁：结构违规 或 有未提交改动 → 退出码 1
    python mem_git.py --check --structure-only   # 只看结构（远端/守卫/约定文件），忽略脏工作区
    python mem_git.py commit                     # 提交全部改动（消息自动生成）
    python mem_git.py commit -m "..."            # 自定义提交消息
    python mem_git.py log -n 10                  # 最近 N 次提交
    python mem_git.py init                       # 幂等重建：init + 仓库配置 + .gitignore + 钩子
    python mem_git.py lockdown                   # 应急：删掉所有远端 + 重装 pre-push 守卫

退出码：0 = 干净 / 成功；1 = 有违规或执行失败。

坑（沿用本目录约定）：本机 PowerShell 会吞 stdout → **报告默认写文件**
`_agent_scripts/_out/mem_git.txt`，实操一律 Read 读回。

运行环境：受管 Python 3.13（仅标准库）。
"""

from __future__ import annotations

import argparse
import datetime as _dt
import json
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
MEM = REPO_ROOT / "vault" / "Memory"
DEFAULT_OUT = SCRIPT_DIR / "_out" / "mem_git.txt"
PARENT_HOOK = REPO_ROOT / ".git" / "hooks" / "pre-commit"
PARENT_GUARD_MARK = "mem-parent-guard"
MEMORY_HOOK_MARK = "mem_git-guard"

REPO_CONFIG = {
    "core.autocrlf": "false",
    "core.quotepath": "false",
    "i18n.commitEncoding": "utf-8",
    "i18n.logOutputEncoding": "utf-8",
}

GITIGNORE_TEXT = """# 本层是独立的**本地**仓库（无远端，永不上云）——见 _index.md 与 Rule.md。
# 只排工具/系统噪声；**笔记一律全量入库**（私有库没有隐私顾虑，全量才有历史价值）。
# 仓库级配置：core.autocrlf=false（按字节存，Obsidian 改行尾不产生全文件 diff）
#             core.quotepath=false + i18n.logOutputEncoding=utf-8（中文文件名/提交消息不乱码）

# Obsidian / 编辑器噪声
.obsidian/
.smart-env/
.trash/
*.tmp
*.bak
*.orig

# 系统噪声
.DS_Store
Thumbs.db
desktop.ini
~$*
"""

PARENT_GUARD_TEXT = """
# mem-parent-guard  <-- 守卫身份标记，_agent_scripts/mem_git.py --check 靠这行判定守卫在位
# 私有内容绝不进公开仓库：任何提交只要触碰 vault/Memory 一律拒绝。
# 本仓远端是**公开**仓库（推送即发布）。2026-09-21 实测父仓 add 的两种形态：
#   ① git add -f vault/Memory/<文件>  → **静默不入暂存**（嵌套仓被 git 当作嵌入式仓库，
#      退出码 0、暂存区为空）——天然拦住了，但它是"假成功"，本项目吃过同类亏；
#   ② git add -f vault/Memory         → 生成 **gitlink**（暂存名 `vault/Memory`，**不带斜杠**）
#      → 只有这种会进公开库，正则是 `vault/Memory|vault/Memory/*` 两形态都覆盖。
# 只用 shell 内建（case / read / echo）：实测该钩子环境连 date 都找不到，外部命令不可靠。
# 放在钩子**顶部**：① fail-fast ② 本块在主 shell 里 exit，不落进管道子 shell
# （子 shell 里 exit 只会终止子 shell，状态会被后续命令覆盖）。
# 不依赖 cwd：git 调钩子时 cwd 本应是工作树根，但显式切一次更稳（手工单独跑也能用）
mem_top=$(git rev-parse --show-toplevel 2>/dev/null) && cd "$mem_top" || exit 0
mem_hit=$(git diff --cached --name-only | while IFS= read -r mem_f; do
  case "$mem_f" in
    vault/Memory|vault/Memory/*) echo "$mem_f"; break;;
  esac
done)
if [ -n "$mem_hit" ]; then
  echo "阻止提交：vault/Memory 属私有记忆库，不进公开仓库（命中：$mem_hit）。" >&2
  echo "   它的版本管理在本层独立本地仓：python _agent_scripts/mem_git.py commit" >&2
  exit 1
fi

"""

PRE_PUSH_HOOK_TEXT = """#!/bin/sh
# mem_git-guard  <-- 钩子身份标记，mem_git.py --check 靠这行判定守卫是否在位
#
# 本仓是「纯本地历史」仓：设计上不设远端、永不上传云端。
# 此钩子防的是「手滑 git remote add + git push」这一种意外。
# 注意：hooks 目录不受 git 管理 —— 换机器 / 重建仓库后用
#       python _agent_scripts/mem_git.py init   重装。

echo "拒绝推送：vault/Memory 是纯本地仓库（无远端、永不上云）。" >&2
echo "  要本地备份，用 git bundle（单文件、可脱离本机存放）：" >&2
echo "  git bundle create /path/to/memory-YYYYMMDD.bundle --all" >&2
exit 1
"""


# --------------------------------------------------------------------------- #
# git 调用
# --------------------------------------------------------------------------- #
def run_git(args: list[str], cwd: Path | None = None) -> tuple[int, str, str]:
    """返回 (退出码, stdout, stderr)，均按 UTF-8 解码。

    注意：绝不用 PowerShell 捕获 git 中文输出下结论 —— PS 5.1 控制台编码会把中文
    显示成「鏂板」之类乱码，那是回显假象、不是数据损坏。这里自己解码，不受影响。
    """
    try:
        p = subprocess.run(["git", *args], cwd=str(cwd or MEM), capture_output=True)
    except FileNotFoundError:
        return 127, "", "找不到 git 可执行文件（请确认 git 在 PATH 中）"
    return (
        p.returncode,
        p.stdout.decode("utf-8", "replace"),
        p.stderr.decode("utf-8", "replace"),
    )


def out_of(args: list[str]) -> str:
    return run_git(args)[1].strip()


def is_repo() -> bool:
    return (MEM / ".git").is_dir()


def hook_installed(path: Path, mark: str) -> bool:
    try:
        return mark in path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return False


# --------------------------------------------------------------------------- #
# 采集
# --------------------------------------------------------------------------- #
def collect() -> dict:
    info: dict = {
        "memory_dir": str(MEM),
        "is_repo": is_repo(),
        "gitignore": (MEM / ".gitignore").is_file(),
        "hook_pre_push": hook_installed(MEM / ".git" / "hooks" / "pre-push", MEMORY_HOOK_MARK),
        "parent_guard": hook_installed(PARENT_HOOK, PARENT_GUARD_MARK),
    }
    if not info["is_repo"]:
        return info

    info["branch"] = out_of(["branch", "--show-current"]) or "(无分支)"
    info["remotes"] = [x for x in out_of(["remote"]).splitlines() if x.strip()]
    porcelain = [x for x in run_git(["status", "--porcelain"])[1].splitlines() if x.strip()]
    info["changed"] = porcelain
    info["head"] = out_of(["log", "-1", "--oneline", "--no-decorate"]) or "(尚无提交)"
    cnt = out_of(["rev-list", "--count", "HEAD"])
    info["commits"] = cnt or "0"
    info["tags"] = [x for x in out_of(["tag", "--list"]).splitlines() if x.strip()]
    info["autocrlf"] = out_of(["config", "--local", "core.autocrlf"]) or "(未设)"
    return info


def violations_of(info: dict, structure_only: bool) -> tuple[list[str], list[str]]:
    """返回 (违规, 提醒)。违规决定退出码；提醒只报告。"""
    bad: list[str] = []
    notes: list[str] = []

    if not info["is_repo"]:
        bad.append("本层没有 git 仓库（`.git` 不存在）→ 跑 `python mem_git.py init` 重建")
        return bad, notes

    if info["remotes"]:
        bad.append(
            "配置了远端（设计上不应有）：" + ", ".join(info["remotes"])
            + " → 跑 `python mem_git.py lockdown` 清掉"
        )
    if not info["hook_pre_push"]:
        bad.append("`.git/hooks/pre-push` 拒推守卫缺失 → 跑 `python mem_git.py init` 重装")
    if not info["parent_guard"]:
        bad.append(
            "父仓 `.git/hooks/pre-commit` 缺少 `vault/Memory/**` 守卫"
            "（防私密笔记误进公开库）→ 跑 `python mem_git.py init` 重装"
        )
    if not info["gitignore"]:
        bad.append("本层 `.gitignore` 缺失（应为版本库内文件）→ 跑 `python mem_git.py init` 重建")

    if info["autocrlf"] != "false":
        notes.append(
            f"`core.autocrlf` = {info['autocrlf']}（建议 false：按字节存，避免 Obsidian 行尾产生全文件 diff）"
        )
    if not structure_only and info["changed"]:
        bad.append(f"有 {len(info['changed'])} 个文件未提交 → 跑 `python mem_git.py commit`")

    return bad, notes


# --------------------------------------------------------------------------- #
# 渲染
# --------------------------------------------------------------------------- #
def render(info: dict, bad: list[str], notes: list[str]) -> str:
    L: list[str] = []
    L.append("# 记忆库本地仓报告（vault/Memory）")
    L.append("")
    L.append(f"对象：`{info['memory_dir']}`（独立本地仓，**无远端、永不上云**）")
    L.append("")

    L.append("## 一、结构")
    L.append("")
    if not info["is_repo"]:
        L.append("- **仓库不存在** —— 跑 `python mem_git.py init` 重建")
        L.append("")
        return "\n".join(L)
    L.append(f"- 分支：`{info['branch']}`　提交数：{info['commits']}　最近提交：`{info['head']}`")
    L.append(f"- 远端：{('**' + ', '.join(info['remotes']) + '**') if info['remotes'] else '无 —— 无目标可推'}")
    L.append(f"- 拒推守卫 `pre-push`：{'在位' if info['hook_pre_push'] else '**缺失**'}")
    L.append(f"- 父仓 `pre-commit` 私有面守卫：{'在位' if info['parent_guard'] else '**缺失**'}")
    L.append(f"- 本层 `.gitignore`：{'在位' if info['gitignore'] else '**缺失**'}")
    L.append(f"- `core.autocrlf`：{info['autocrlf']}")
    if info["tags"]:
        L.append(f"- 标签：{', '.join('`' + t + '`' for t in info['tags'])}")
    L.append("")

    L.append("## 二、工作区")
    L.append("")
    if not info["changed"]:
        L.append("干净 —— 无未提交改动。")
    else:
        L.append(f"**{len(info['changed'])} 个文件未提交**（前 20 条）：")
        L.append("")
        for line in info["changed"][:20]:
            L.append(f"- `{line}`")
        if len(info["changed"]) > 20:
            L.append(f"- …另有 {len(info['changed']) - 20} 条")
    L.append("")

    L.append("## 三、判定")
    L.append("")
    if bad:
        L.append(f"**违规 {len(bad)} 处：**")
        for b in bad:
            L.append(f"- {b}")
    else:
        L.append("无违规。")
    if notes:
        L.append("")
        L.append(f"提醒 {len(notes)} 条（不拦门禁）：")
        for n in notes:
            L.append(f"- {n}")
    L.append("")
    L.append("> 备份：本仓按用户 2026-09-21 的决定**不做冗余**（只保留本地历史）。")
    L.append("> 要加本地副本：`git bundle create <另一块盘>/memory-YYYYMMDD.bundle --all` 或 `git clone --bare` 到盘外。")
    L.append("")
    return "\n".join(L)


# --------------------------------------------------------------------------- #
# 动作
# --------------------------------------------------------------------------- #
def ensure_parent_guard() -> str:
    """在父仓 `pre-commit` **紧接 shebang 之后**插入私有面守卫（已在位则不动）。

    为什么不追加到末尾：父仓钩子末尾是
        git diff --cached --name-only | while read f; do … exit 1 … done
    那个 `exit 1` 在**管道子 shell** 里，只终止子 shell —— 它的失败状态会被后面的
    命令覆盖。若把我的守卫追加在后，大文件拦截会被静默解除。插到顶部既 fail-fast，
    又让本块在主 shell 里 exit，不依赖别人怎么写。
    """
    if hook_installed(PARENT_HOOK, PARENT_GUARD_MARK):
        return "父仓 pre-commit 守卫已在位，未改"
    PARENT_HOOK.parent.mkdir(parents=True, exist_ok=True)
    if PARENT_HOOK.is_file():
        old = PARENT_HOOK.read_text(encoding="utf-8", errors="replace")
    else:
        old = "#!/bin/sh\n"
    lines = old.splitlines(keepends=True)
    if lines and lines[0].startswith("#!"):
        new = lines[0] + PARENT_GUARD_TEXT + "".join(lines[1:])
    else:
        new = "#!/bin/sh\n" + PARENT_GUARD_TEXT + old
    PARENT_HOOK.write_text(new, encoding="utf-8", newline="\n")
    return "已在父仓 .git/hooks/pre-commit 顶部插入 vault/Memory 守卫"


def do_init() -> tuple[int, list[str]]:
    log: list[str] = []
    if not MEM.is_dir():
        return 1, [f"记忆库目录不存在：{MEM}"]

    if not is_repo():
        code, _, err = run_git(["init", "-b", "main"])
        log.append(f"git init -b main → 退出码 {code} {err.strip()}")
    else:
        log.append("仓库已存在，跳过 init")

    for k, v in REPO_CONFIG.items():
        code, _, err = run_git(["config", "--local", k, v])
        log.append(f"config {k} = {v} → 退出码 {code} {err.strip()}")

    ig = MEM / ".gitignore"
    if ig.is_file() and ig.read_text(encoding="utf-8").strip() == GITIGNORE_TEXT.strip():
        log.append(".gitignore 内容一致，未改")
    else:
        ig.write_text(GITIGNORE_TEXT, encoding="utf-8", newline="\n")
        log.append(f".gitignore {'已更新' if ig.is_file() else '已写入'}")

    hooks = MEM / ".git" / "hooks"
    hooks.mkdir(parents=True, exist_ok=True)
    (hooks / "pre-push").write_text(PRE_PUSH_HOOK_TEXT, encoding="utf-8", newline="\n")
    log.append("已装 .git/hooks/pre-push（拒推守卫）")

    log.append(ensure_parent_guard())

    return 0, log


def do_lockdown() -> tuple[int, list[str]]:
    log: list[str] = []
    if not is_repo():
        return 1, ["本层没有 git 仓库，先跑 init"]
    remotes = [x for x in out_of(["remote"]).splitlines() if x.strip()]
    if not remotes:
        log.append("无远端，无需清理")
    for r in remotes:
        code, _, err = run_git(["remote", "remove", r])
        log.append(f"remote remove {r} → 退出码 {code} {err.strip()}")
    hooks = MEM / ".git" / "hooks"
    hooks.mkdir(parents=True, exist_ok=True)
    (hooks / "pre-push").write_text(PRE_PUSH_HOOK_TEXT, encoding="utf-8", newline="\n")
    log.append("已重装 .git/hooks/pre-push")
    return 0, log


def do_commit(message: str | None, message_file: str | None = None) -> tuple[int, list[str]]:
    log: list[str] = []
    if not is_repo():
        return 1, ["本层没有 git 仓库，先跑 init"]

    code, _, err = run_git(["add", "-A"])
    if code != 0:
        return 1, [f"git add -A 失败：{err.strip()}"]

    if run_git(["diff", "--cached", "--quiet"])[0] == 0:
        log.append("无改动 —— 跳过提交")
        return 0, log

    short = out_of(["diff", "--cached", "--shortstat"])
    if message_file:
        # utf-8-sig：容忍带 BOM 的消息文件（PS 5.1 `Set-Content -Encoding UTF8` 会写 BOM，
        # 那会让 commit 消息首字符变成 \ufeff —— 见 README「入库与提交」）
        msg = Path(message_file).read_text(encoding="utf-8-sig").strip()
        code, outp, err = run_git(["commit", "-F", str(Path(message_file).resolve())])
    else:
        msg = message or f"chore(memory): 快照 {_dt.datetime.now():%Y-%m-%d %H:%M}"
        code, outp, err = run_git(["commit", "-m", msg])
    if code != 0:
        return 1, [f"git commit 失败：{(err or outp).strip()}"]

    log.append(f"提交：{out_of(['log', '-1', '--oneline', '--no-decorate'])}")
    log.append(f"改动规模：{short}")
    log.append(f"提交消息：{msg.splitlines()[0] if msg else '(空)'}")
    return 0, log


def do_log(n: int) -> tuple[int, list[str]]:
    if not is_repo():
        return 1, ["本层没有 git 仓库"]
    lines = out_of(["log", f"-{n}", "--oneline", "--no-decorate", "--date=short"]).splitlines()
    return 0, lines or ["(尚无提交)"]


# --------------------------------------------------------------------------- #
# main
# --------------------------------------------------------------------------- #
def main() -> int:
    ap = argparse.ArgumentParser(
        description="记忆库独立本地仓工具（vault/Memory）",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    ap.add_argument("action", nargs="?", default="status",
                    choices=["status", "check", "commit", "log", "init", "lockdown"],
                    help="默认 status")
    ap.add_argument("--check", action="store_true", help="等同 action=check（门禁）")
    ap.add_argument("--structure-only", action="store_true",
                    help="check 时只看结构，忽略「有未提交改动」")
    ap.add_argument("-m", "--message", help="commit 的提交消息")
    ap.add_argument("-F", "--message-file", help="commit 的提交消息文件（UTF-8；自动容忍 BOM）")
    ap.add_argument("-n", type=int, default=10, help="log 显示条数（默认 10）")
    ap.add_argument("-o", "--out", default=str(DEFAULT_OUT), help="报告输出路径")
    ap.add_argument("--json", action="store_true", help="以 JSON 输出报告")
    ap.add_argument("--quiet", action="store_true", help="不往 stdout 打印摘要")
    args = ap.parse_args()

    action = "check" if args.check else args.action
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    if not MEM.is_dir():
        print(f"[!] 记忆库目录不存在：{MEM}", file=sys.stderr)
        return 1

    if action == "init":
        code, log = do_init()
        info = collect()
        report = "\n".join(["# mem_git init", ""] + [f"- {x}" for x in log] + ["", render(info, [], [])])
        out.write_text(report, encoding="utf-8")
        if not args.quiet:
            print(f"[mem_git] init 退出码 {code}")
            for x in log:
                print("  " + x)
            print(f"报告：{out}")
        return code

    if action == "lockdown":
        code, log = do_lockdown()
        info = collect()
        bad, notes = violations_of(info, structure_only=True)
        report = "\n".join(["# mem_git lockdown", ""] + [f"- {x}" for x in log] + ["", render(info, bad, notes)])
        out.write_text(report, encoding="utf-8")
        if not args.quiet:
            print(f"[mem_git] lockdown 退出码 {code}")
            for x in log:
                print("  " + x)
        return code if not bad else 1

    if action == "commit":
        code, log = do_commit(args.message, args.message_file)
        info = collect()
        report = "\n".join(["# mem_git commit", ""] + [f"- {x}" for x in log] + ["", render(info, [], [])])
        out.write_text(report, encoding="utf-8")
        if not args.quiet:
            print(f"[mem_git] commit 退出码 {code}")
            for x in log:
                print("  " + x)
            print(f"报告：{out}")
        return code

    if action == "log":
        code, lines = do_log(args.n)
        out.write_text("\n".join(["# mem_git log", ""] + lines), encoding="utf-8")
        if not args.quiet:
            for x in lines:
                print("  " + x)
        return code

    info = collect()
    bad, notes = violations_of(info, structure_only=args.structure_only)
    if args.json:
        out.write_text(json.dumps({"info": info, "violations": bad, "notes": notes},
                                  ensure_ascii=False, indent=2), encoding="utf-8")
    else:
        out.write_text(render(info, bad, notes), encoding="utf-8")

    if not args.quiet:
        print(f"记忆库本地仓：{MEM}")
        print(f"提交数 {info.get('commits', '0')} / 未提交 {len(info.get('changed', []))} / "
              f"远端 {len(info.get('remotes', []))} / 拒推守卫 {'在位' if info.get('hook_pre_push') else '缺失'} / "
              f"父仓守卫 {'在位' if info.get('parent_guard') else '缺失'}")
        for b in bad:
            print("  [!] " + b)
        for n in notes:
            print("  [提醒] " + n)
        print(f"报告：{out}")

    if action == "check" and bad:
        print(f"[!] {len(bad)} 处违规 —— 见 {out}", file=sys.stderr)
        return 1
    if action == "check":
        print("[ok] 记忆库本地仓：结构完好、工作区干净")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
