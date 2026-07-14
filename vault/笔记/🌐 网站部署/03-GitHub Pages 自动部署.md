---
tags:
  - 部署
  - 部署/GitHub Pages
  - 部署/GitHub Actions
  - CI/CD
---

# 03 GitHub Pages 自动部署

> 本章节介绍如何配置 GitHub Pages 自动部署。GitHub Pages 是 GitHub 提供的免费静态网站托管服务，通过 GitHub Actions 可以实现"push 到 main 分支后自动构建并部署"的全流程自动化。

## 一、部署原理

### 1.1 为什么需要两个分支？

| 分支 | 用途 |
|------|------|
| **main** | 存放**源码**（Markdown 文档、配置文件、依赖声明等） |
| **gh-pages** | 存放**构建产物**（HTML、CSS、JavaScript 等浏览器可直接读取的静态文件） |

```text
   ┌──────────────────────────────────────────────────┐
   │  main 分支（源代码）                             │
   │  ├─ vault/笔记/*.md (Markdown 文档)            │
   │  ├─ .vitepress/config.ts (配置文件)             │
   │  └─ package.json (依赖声明)                      │
   └──────────────────────────────────────────────────┘
                           │
                           ▼  GitHub Actions 自动构建（VitePress）
   ┌──────────────────────────────────────────────────┐
   │  gh-pages 分支（构建产物）                       │
   │  ├─ index.html (首页)                            │
   │  ├─ assets/ (CSS、JS 文件)                       │
   │  └─ vault/ (各页面的 HTML 文件)                  │
   └──────────────────────────────────────────────────┘
                           │
                           ▼  GitHub Pages 自动读取
   ┌──────────────────────────────────────────────────┐
   │  浏览器访问 https://star-nebula.github.io/knowledge/ │
   └──────────────────────────────────────────────────┘
```

### 1.2 关于 base 路径（关键配置）

GitHub Pages 将你的网站部署在子路径下：

```
https://star-nebula.github.io/knowledge/
                       ↑            ↑
                   用户名         仓库名
                    base = '/knowledge/'
```

因此，在 `.vitepress/config.ts` 中必须配置：

```typescript
export default defineConfig({
  base: '/knowledge/',   // ← 与你的仓库名保持一致
  // ...
})
```

如果 `base` 配置不正确，会导致：
- ❌ CSS 样式找不到，页面显示为纯文本
- ❌ JavaScript 文件加载失败，页面无交互
- ❌ 图片资源 404
- ❌ 内部链接跳转到错误路径

### 1.3 使用 GitHub 自带 token

本项目的工作流配置使用 `secrets.GITHUB_TOKEN`（GitHub 在每次工作流运行时自动提供的 token），**无需手动创建或配置任何凭证**：

```yaml
permissions:
  contents: write   # ← 允许工作流写入 gh-pages 分支
```

工作流执行时，GitHub 会自动提供一个具有仓库写入权限的 token，`JamesIves/github-pages-deploy-action` 会使用它将构建产物推送到 `gh-pages` 分支。

## 二、工作流文件详解

本项目的自动部署配置保存在 `.github/workflows/production-deployment-to-github-pages.yaml`：

```yaml
name: 构建并部署到 Github Pages

on:
  workflow_dispatch:        # ← 支持手动触发（在 GitHub Actions 页面点击 Run workflow）
  push:
    branches:
      - 'main'              # ← 每次 push 到 main 分支时自动触发

concurrency:
  group: ${{ github.ref }}  # ← 同一分支只允许一个构建在运行
  cancel-in-progress: true  # ← 如果有新的 push，取消正在进行的构建

jobs:
  build:
    name: Ubuntu 构建和推送
    runs-on: ubuntu-latest
    permissions:
      contents: write       # ← 允许写入 gh-pages 分支
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: 签出代码
        uses: actions/checkout@v4
        with:
          fetch-depth: 0    # ← 完整克隆（用于侧边栏生成等功能）

      - name: 安装 pnpm
        uses: pnpm/action-setup@v4
        with:
          run_install: false

      - name: 安装 Node.js 22.x
        uses: actions/setup-node@v4
        with:
          node-version: 22.x
          cache: 'pnpm'     # ← 缓存依赖，加速后续构建

      - name: 安装依赖
        run: pnpm install --frozen-lockfile

      - name: 安装思源黑体
        run: |
          mkdir -p ~/.local/share/fonts
          cp public/source-han-sans.ttf ~/.local/share/fonts/source-han-sans.ttf

      - name: 构建
        run: pnpm docs:build

      - name: 推送到 gh-pages 分支
        id: deployment
        timeout-minutes: 10
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}  # ← GitHub 自动提供
          branch: gh-pages                     # ← 目标分支
          folder: .vitepress/dist              # ← 构建产物目录
```

## 三、配置 GitHub Pages

### 步骤 1：确保 gh-pages 分支存在

`gh-pages` 分支会在工作流**第一次成功运行**后由 `JamesIves/github-pages-deploy-action` 自动创建。你也可以手动创建一个空的 `gh-pages` 分支，但通常不需要。

### 步骤 2：在 GitHub 仓库设置中启用 Pages

1. 打开仓库页面：<https://github.com/star-nebula/knowledge>
2. 点击顶部的 **Settings**
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 下拉菜单中选择 **Deploy from a branch**
5. 在 **Branch** 部分：
   - 第一个下拉选择 **gh-pages**
   - 第二个下拉选择 **/ (root)**
   - 点击 **Save**

配置完成后，页面会显示：

```
  Your site is live at https://star-nebula.github.io/knowledge/
```

### 步骤 3：触发第一次部署

```shell
git add .
git commit -m "feat: 初始化博客内容"
git push origin main
```

push 之后：

1. 在 GitHub 仓库页面点击 **Actions** 标签
2. 你会看到名为「构建并部署到 Github Pages」的工作流正在运行
3. 等待它变成绿色对勾 ✅（约 2-5 分钟）
4. 然后回到 **Settings → Pages**，顶部会显示部署成功的信息

> 💡 **提示**：GitHub Pages 第一次部署到生效可能需要几分钟。如果立即访问看到 404，请耐心等待几分钟后刷新。

## 四、日常使用

### 4.1 发布新内容

```shell
# 1. 在本地编辑 Markdown 文件

# 2. commit 并 push
git add .
git commit -m "feat: 添加新文章《XXX》"
git push origin main

# 3. 访问 GitHub Actions 页面查看构建进度
```

### 4.2 查看部署状态

| 位置 | 查看内容 |
|------|---------|
| **Code** 页面右上角 | 最新 commit 的状态图标（✅/❌） |
| **Actions** 页面 | 所有构建的详细日志和状态 |
| **Settings → Pages** | 当前部署的站点 URL |

### 4.3 手动触发部署

如果你在不修改代码的情况下想重新部署（例如清空缓存后），可以手动触发工作流：

1. 打开 **Actions** 页面
2. 选择「构建并部署到 Github Pages」工作流
3. 点击右侧的 **Run workflow** 按钮
4. 选择 `main` 分支，点击 **Run workflow**

## 五、部署配置清单

| 配置项 | 当前值 | 说明 |
|--------|--------|------|
| base 路径 | `/knowledge/` | 必须与 GitHub Pages 子路径一致 |
| 触发分支 | `main` | push 到该分支触发自动部署 |
| Node.js 版本 | 22.x | 工作流使用的 Node.js 版本 |
| 包管理器 | pnpm | 通过 corepack 启用 |
| 目标分支 | `gh-pages` | 存放构建产物的分支 |
| 工作流文件 | `.github/workflows/production-deployment-to-github-pages.yaml` | 自动构建部署配置 |
| 站点 URL | `https://star-nebula.github.io/knowledge/` | 最终部署地址 |

配置正确无误后，你就可以专注于写作，GitHub Pages 会帮你自动完成所有的构建和部署工作！
