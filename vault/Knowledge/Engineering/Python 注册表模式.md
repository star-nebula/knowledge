---
title: Python 注册表模式
created: 2026-05-22
tags:
  - Python
  - 设计模式
  - 注册表模式
  - 装饰器
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Python 模块与包]]"
  - "[[Python 装饰器]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Python 注册表模式：从 if-elif 到插件化架构

> **学习目标**：理解注册表模式的演进过程，掌握装饰器工厂实现自动注册的方法。

## 演进过程

### 阶段 1：if-elif 链（原始方案）

```python
def export_data(data, format):
    if format == "pdf":
        export_pdf(data)
    elif format == "csv":
        export_csv(data)
    elif format == "json":
        export_json(data)
    else:
        raise ValueError(f"不支持的格式: {format}")
```

**问题**：新增格式需要修改 `export_data` 函数，扩展性差。

### 阶段 2：字典注册表

```python
exporters = {
    "pdf": export_pdf,
    "csv": export_csv,
    "json": export_json,
    "xml": export_xml,
}

def export_data(data, format):
    exporter = exporters.get(format)
    if exporter is None:
        raise ValueError(f"不支持的格式: {format}")
    exporter(data)
```

**改进**：解耦了分发逻辑。**问题**：新增格式仍需手动修改字典。

### 阶段 3：装饰器工厂自动注册

```python
from functools import wraps
from typing import Any, Callable

type Data = dict[str, Any]
type ExportFn = Callable[[Data], None]

exporters: dict[str, ExportFn] = {}

def register_exporter(name: str):
    def decorator(func: ExportFn):
        @wraps(func)
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        exporters[name] = wrapper
        return wrapper
    return decorator

@register_exporter("pdf")
def export_pdf(data: Data) -> None:
    print(f"Exporting data to PDF: {data}")

@register_exporter("csv")
def export_csv(data: Data) -> None:
    print(f"Exporting data to CSV: {data}")

def export_data(data: Data, format: str) -> None:
    exporter = exporters.get(format)
    if exporter is None:
        raise ValueError(f"不支持的格式: {format}")
    exporter(data)
```

**优势**：新增格式只需添加一个带 `@register_exporter` 装饰器的函数，无需修改其他代码。

## 进阶：插件化架构

结合 `importlib` 和 `pkgutil` 实现自动发现和加载插件：

```python
# registry.py
from typing import Callable

_registry: list[tuple[str, str, Callable]] = []

def register_command(group: str, name: str):
    def decorator(func):
        _registry.append((group, name, func))
        return func
    return decorator

def get_registry():
    return _registry.copy()
```

```python
# commands/text/reverse.py
from registry import register_command

@register_command("text", "reverse")
def reverse_text(text: str) -> None:
    print(text[::-1])
```

```python
# main.py
import importlib
import pkgutil

def load_plugins():
    import plugins
    for _, module_name, _ in pkgutil.iter_modules(plugins.__path__):
        importlib.import_module(f"plugins.{module_name}")
```

**核心思想**：定义注册接口 → 各模块自行注册 → 主程序发现并加载 → 统一分发调用。

## 相关链接

- [[Python 模块与包]] — 模块导入机制
