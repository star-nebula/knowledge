---
title: All notes-MOC
created: 2026-07-08
tags:
  - MOC
  - 索引
type: 专题聚合页
abstract: Knowledge 区全部笔记的总索引——按笔记名、领域、所属 MOC 三列呈现，支持快速定位与导航。
---

# 全部笔记索引

> 自动扫描 Knowledge 下所有非 MOC 笔记，通过反向链接（MOC → 笔记）推断所属专题。

```dataviewjs
const pages = dv.pages('"Knowledge"').where(p => p.type !== "专题聚合页");

const rows = [];
for (const p of pages.sort(p => p.file.folder + p.file.name)) {
  const domain = p.file.folder.replace("Knowledge/", "");
  const mocLinks = p.file.inlinks
    .map(l => l.path.split("/").pop().replace(".md", ""))
    .filter(name => name.includes("MOC"))
    .join(", ");
  rows.push([p.file.link, domain, mocLinks || "—"]);
}

dv.table(["笔记", "领域", "所属MOC"], rows);
```
