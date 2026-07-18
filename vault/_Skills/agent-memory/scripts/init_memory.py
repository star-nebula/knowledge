#!/usr/bin/env python3
"""
初始化项目的 .memory/ 目录结构。

用法:
    python init_memory.py [项目根目录] [--desc "项目描述"] [--stack "技术栈,逗号分隔"]

如果不指定目录，默认使用当前工作目录。

示例:
    python init_memory.py ./my-project --desc "宠物医院预约系统" --stack "Python,FastAPI,SQLite,Vue3"
"""
import os
import sys
import argparse
from pathlib import Path
from datetime import datetime

# 模板目录（相对 skill 根目录）
SKILL_ROOT = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = SKILL_ROOT / "assets" / "templates"

# 要创建的文件映射：相对路径 → 模板路径
FILE_MAP = {
    "AGENTS.md": "AGENTS.md",
    "context/decisions.md": "context/decisions.md",
    "working/todo.md": "working/todo.md",
    "working/plan.md": "working/plan.md",
}

# AI 工具配置文件 → 需写入的引用行
CONFIG_FILES = {
    ".cursorrules": "每次会话开始时，先读取 .memory/AGENTS.md。",
    "CLAUDE.md": "每次会话开始时，先读取 .memory/AGENTS.md。",
    ".windsurfrules": "每次会话开始时，先读取 .memory/AGENTS.md。",
    ".github/copilot-instructions.md": "每次会话开始时，先读取 .memory/AGENTS.md。",
    "AGENT.md": "每次会话开始时，先读取 .memory/AGENTS.md。",
}


def init_memory(project_root: Path, desc: str = "", stack: str = ""):
    """在项目根目录创建 .memory/ 目录结构"""
    memory_dir = project_root / ".memory"

    if memory_dir.exists():
        print(f"[SKIP] .memory/ 已存在: {memory_dir}")
        return

    print(f"初始化项目记忆: {memory_dir}")

    # 创建目录结构
    for rel_path in FILE_MAP:
        target = memory_dir / rel_path
        target.parent.mkdir(parents=True, exist_ok=True)

        template_path = TEMPLATES_DIR / FILE_MAP[rel_path]
        if template_path.exists():
            content = template_path.read_text(encoding="utf-8")
        else:
            content = ""

        target.write_text(content, encoding="utf-8")
        print(f"  创建: {rel_path}")

    # 替换项目名称
    agents_path = memory_dir / "AGENTS.md"
    content = agents_path.read_text(encoding="utf-8")
    content = content.replace("{{PROJECT_NAME}}", project_root.name)

    # 如果传了描述，替换占位符
    if desc:
        content = content.replace(
            "*一两句话：这个项目是什么、解决什么问题。*",
            desc
        )

    # 如果传了技术栈，解析并填充表格
    if stack:
        layers = [s.strip() for s in stack.split(",") if s.strip()]
        # 在空表格中插入行
        old_table = "| 层 | 选型 | 备注 |\n|----|------|------|\n"
        rows = "\n".join(f"| {layer} | | |" for layer in layers)
        new_table = old_table + rows + "\n"
        content = content.replace(old_table, new_table)

    agents_path.write_text(content, encoding="utf-8")

    # 更新 todo.md 初始内容
    todo_path = memory_dir / "working" / "todo.md"
    content = todo_path.read_text(encoding="utf-8")
    content = content.replace("{{PROJECT_NAME}}", project_root.name)
    todo_path.write_text(content, encoding="utf-8")

    print(f"\n完成！.memory/ 目录结构已创建。")

    # 工具配置自检
    check_tool_configs(project_root)


def check_tool_configs(project_root: Path):
    """检查 AI 工具配置文件是否引用了 .memory/，不存在则自动创建"""
    print(f"\n--- 工具配置检查 ---")
    created_count = 0
    ok_count = 0
    warn_count = 0

    for cfg_file, line in CONFIG_FILES.items():
        cfg_path = project_root / cfg_file

        if cfg_path.exists():
            existing = cfg_path.read_text(encoding="utf-8")
            if ".memory/AGENTS.md" in existing:
                print(f"  [OK]   {cfg_file} 已引用 .memory/")
                ok_count += 1
            else:
                print(f"  [WARN] {cfg_file} 存在但未引用 .memory/ — 请手动加入：")
                print(f"         {line}")
                warn_count += 1
        else:
            # 配置文件不存在 → 自动创建
            cfg_path.parent.mkdir(parents=True, exist_ok=True)
            cfg_path.write_text(line + "\n", encoding="utf-8")
            print(f"  [创建] {cfg_file}")
            created_count += 1

    print(f"\n汇总: {created_count} 个已创建 | {ok_count} 个已配置 | {warn_count} 个需手动处理")

    if warn_count > 0:
        print(f"提示: [WARN] 项需手动编辑对应文件加入 .memory/AGENTS.md 引用行。")
    elif created_count > 0:
        print(f"提示: 已自动创建配置文件，AI 工具下次会话即可自动读取 .memory/。")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="初始化项目 .memory/ 目录",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="示例:\n  python init_memory.py ./my-project --desc \"预约系统\" --stack \"Python,FastAPI,SQLite\""
    )
    parser.add_argument("project_root", nargs="?", default=".", help="项目根目录（默认当前目录）")
    parser.add_argument("--desc", default="", help="项目一句话描述，如 \"宠物医院预约管理系统\"")
    parser.add_argument("--stack", default="", help="技术栈，逗号分隔，如 \"Python,FastAPI,SQLite,Vue3\"")
    args = parser.parse_args()

    root = Path(args.project_root).resolve()
    if not root.exists():
        print(f"错误: 目录不存在: {root}")
        sys.exit(1)

    init_memory(root, desc=args.desc, stack=args.stack)
