---
tags:
  - 部署
  - 部署/GitHub Pages
  - 部署/教程
---

# 网站部署

> 本章节介绍如何将本知识库部署到 **GitHub Pages**，涵盖从本地环境搭建到自动部署的完整流程。

本知识库基于 Nólëbase 模板，使用 [VitePress](https://vitepress.dev) 作为静态站点生成器，通过 **GitHub Actions** 自动构建并部署到 **GitHub Pages**。

## 目录

1. [本地环境搭建](./01-本地环境搭建.md) — 安装 Node.js 和 pnpm
2. [本地预览](./02-本地预览.md) — 启动开发服务器，实时查看修改效果
3. [GitHub Pages 自动部署](./03-GitHub Pages 自动部署.md) — 配置工作流和 Pages 设置
4. [常见问题 FAQ](./04-常见问题 FAQ.md) — 部署过程中可能遇到的问题及解决方案

## 技术栈一览

| 组件 | 说明 |
|------|------|
| **静态站点生成器** | VitePress |
| **包管理器** | pnpm |
| **运行环境** | Node.js 22.x |
| **自动化构建** | GitHub Actions |
| **托管平台** | GitHub Pages（`gh-pages` 分支） |
| **部署路径** | `https://star-nebula.github.io/knowledge/` |
| **渲染引擎** | Vue 3 + Vite |

## 部署流程概览

```text
  在本地编辑 Markdown 文件
        │
        ▼
  git commit + git push 到 main 分支
        │
        ▼
  GitHub Actions 自动触发构建
        │
        ▼
  VitePress 生成静态 HTML 文件
        │
        ▼
  自动推送到 gh-pages 分支
        │
        ▼
  GitHub Pages 自动生效
        │
        ▼
  https://star-nebula.github.io/knowledge/
```

## 关于 base 路径（重要！）

GitHub Pages 默认把你的站点部署在子路径下：

```
https://用户名.github.io/仓库名/
                    ↑
              base = '/仓库名/'
```

因此 `.vitepress/config.ts` 中必须配置：

```typescript
export default defineConfig({
  base: '/knowledge/',   // ← 关键！GitHub Pages 部署必需
  // ...
})
```

如果没有正确配置 `base`，构建后的页面将无法找到 CSS、JavaScript 和图片资源，网站会显示为纯文本无样式。
