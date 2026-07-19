---
title: Python PyInstaller 打包
created: 2026-05-22
tags:
  - Python
  - PyInstaller
  - 打包
  - 部署
type: 步骤操作
related:
  - "[[Python-MOC]]"
  - "[[Python 模块与包]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# PyInstaller：Python 程序打包为可执行文件

> **学习目标**：掌握 PyInstaller 打包 Python 脚本为独立可执行文件的方法。

## 基本用法

```bash
pyinstaller script.py              # 默认单目录模式
pyinstaller -D script.py           # 等价于上面
pyinstaller --onedir script.py     # 同上
```

生成产物：
- `dist/script/` — 打包后的可执行文件目录
- `build/` — 构建临时文件
- `script.spec` — 打包配置文件（可修改后重新打包）

## 打包成单个可执行文件

```bash
pyinstaller -F app.py
pyinstaller --onefile app.py
```

生成 `dist/app.exe`。

## 常用参数

| 参数 | 含义 |
|------|------|
| `-F` / `--onefile` | 打包成单个可执行文件 |
| `-w` | 不显示命令行窗口（GUI 程序） |
| `-i icon.ico` | 设置可执行文件图标 |
| `--add-data "src;dest"` | 添加非代码资源文件（Windows 用 `;`，Linux 用 `:`） |
| `--hidden-import module` | 手动指定未自动识别的模块 |
| `-n NAME` | 设置生成的可执行文件名称 |

## 示例：打包带图标的 GUI 程序

```bash
pyinstaller -F -w -i myicon.ico my_gui_app.py
```

## 相关链接

- [[Python 模块与包]] — 模块导入机制
