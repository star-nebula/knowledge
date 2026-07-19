---
title: JSON
created: 2026-05-22
tags:
  - JSON
  - 数据格式
  - 前端
type: 极简速记
related:
  - "[[Frontend-MOC]]"
  - "[[Knowledge/Engineering/JavaScript]]"
  - "[[Python-MOC]]"
reference:
category: ["🛠️ 工程工具", "Frontend"]
---

## JSON

JSON（JavaScript Object Notation）是一种<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">纯文本的数据交换格式</span>，基于 ECMAScript 对象字面量语法，但<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">独立于语言</span>，几乎所有主流语言都能解析 / 生成。

- **轻量级**：只有两种结构

  1. ​`{"键": 值}`​ 的<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">对象</span>（无序键值对），键名必须是"字符串"
  2. ​`[值, 值]`​ 的<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">数组</span>（有序列表）
- **值类型**：字符串、数字、布尔、`null`​、对象、数组

- **语言无关**：虽然语法源自 JavaScript，但 Python、Go、Java、C# 等都有官方或第三方库支持

json数据也可以保存到文件中,一般以"`.json`​"结尾

前端项目中,一般使用json作为配置文件
