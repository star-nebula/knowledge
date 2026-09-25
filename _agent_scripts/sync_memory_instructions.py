# -*- coding: utf-8 -*-
r"""
sync_memory_instructions.py — 记忆库自定义指令「单一真源」同步器

唯一可编辑来源：
    E:\knowledge\vault\Memory\Workflows\AI工具自定义指令-完整版.md

本脚本读真源，派生部署到三处（避免人手逐份抄写导致漂移）：
    1. WorkBuddy  C:\Users\stars\.workbuddy\app\app-config.json
                  -> personalization.customPrompt （JSON 注入，备份 + 校验）
    2. ZCode      C:\Users\stars\.zcode\AGENTS.md
                  -> 优先软链接到真源；软链不可用则退化为复制（备份原文件）
    3. Trae       C:\Users\stars\.trae-cn\user_rules\rule-memory-library.md
                  -> 同上（工具未安装则跳过）

用法：改完真源后跑一次
    python sync_memory_instructions.py

幂等：重复运行安全（已软链/已一致则跳过）。所有写操作前先备份到 E:\knowledge\backup。
"""
import io
import json
import os
import shutil
from datetime import datetime

CANON = r"E:\knowledge\vault\Memory\Workflows\AI工具自定义指令-完整版.md"
BAK_DIR = r"E:\knowledge\backup"

WB_CFG = r"C:\Users\stars\.workbuddy\app\app-config.json"
ZCODE_TARGET = r"C:\Users\stars\.zcode\AGENTS.md"
TRAE_TARGET = r"C:\Users\stars\.trae-cn\user_rules\rule-memory-library.md"


def log(msg):
    print(msg)


def backup_file(path):
    os.makedirs(BAK_DIR, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    base = os.path.basename(path)
    bak = os.path.join(BAK_DIR, "%s.sync-bak-%s" % (base, stamp))
    shutil.copyfile(path, bak)
    return bak


def deploy_workbuddy(text):
    if not os.path.exists(WB_CFG):
        log("[SKIP] WorkBuddy: app-config.json 不存在")
        return
    bak = backup_file(WB_CFG)
    raw = io.open(WB_CFG, encoding="utf-8").read()
    data = json.loads(raw)  # 校验 JSON 合法
    data.setdefault("personalization", {})["customPrompt"] = text
    # 回写（保持中文可读、2 空格缩进）
    io.open(WB_CFG, "w", encoding="utf-8", newline="").write(
        json.dumps(data, ensure_ascii=False, indent=2)
    )
    log("[OK]   WorkBuddy: customPrompt 已注入（备份 %s）" % os.path.basename(bak))
    log("        ⚠ 必须重启 WorkBuddy 生效；重启前勿在「设置→个性化」点保存，否则内存旧值覆盖回旧版")


def deploy_file_based(target, label):
    parent = os.path.dirname(target)
    if not os.path.isdir(parent):
        log("[SKIP] %s: 目录不存在（工具未安装），跳过" % label)
        return
    canon_text = io.open(CANON, encoding="utf-8").read().strip()
    # 移除旧文件 / 失效软链（真文件先备份）
    if os.path.islink(target):
        try:
            os.remove(target)
        except OSError:
            pass
    elif os.path.exists(target):
        backup_file(target)
        try:
            os.remove(target)
        except OSError:
            pass
    method = None
    # 先试软链，再验证确实能读回真源内容；失败则退化为复制
    try:
        os.symlink(CANON, target)
        with io.open(target, encoding="utf-8") as f:
            if f.read().strip() == canon_text:
                method = "软链"
            else:
                raise OSError("软链未能正确解析到真源内容")
    except OSError:
        try:
            os.remove(target)
        except OSError:
            pass
        shutil.copyfile(CANON, target)
        method = "复制"
    if method == "软链":
        log("[OK]   %s: 软链 → %s" % (label, CANON))
    else:
        log("[OK]   %s: 软链不可用，已复制 → %s" % (label, target))


def main():
    if not os.path.exists(CANON):
        log("[FATAL] 真源文件不存在：%s" % CANON)
        return
    text = io.open(CANON, encoding="utf-8").read().strip()
    if not text:
        log("[FATAL] 真源文件为空")
        return

    log("=== 记忆库指令同步 ===")
    log("真源: %s (%d 字符)" % (CANON, len(text)))
    deploy_workbuddy(text)
    deploy_file_based(ZCODE_TARGET, "ZCode")
    deploy_file_based(TRAE_TARGET, "Trae")
    log("=== 完成 ===")


if __name__ == "__main__":
    main()
