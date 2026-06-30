---
tags:
  - 部署
  - 部署/FAQ
  - 故障排查
---

# 04 常见问题 FAQ

> 本章节汇总部署到 GitHub Pages 过程中最常遇到的问题及解决方案。按照从常见到少见的顺序排列，遇到问题时可以从第一条开始排查。

## 一、部署后页面显示为纯文本（无样式）

### 现象

访问 `https://star-nebula.github.io/knowledge/` 后，页面内容可以看到，但没有任何样式（颜色、字体、布局全部缺失）。

### 原因

**`base` 路径配置不正确**，导致构建后的 HTML 文件找不到 CSS 和 JavaScript 资源。

浏览器开发者工具（F12）控制台会看到大量 404 错误，类似于：

```text
GET https://star-nebula.github.io/assets/style.css 404 (Not Found)
```

正确的路径应该是：

```text
GET https://star-nebula.github.io/knowledge/assets/style.css 200 (OK)
```

### 解决方案

检查 `.vitepress/config.ts` 中的 `base` 配置：

```typescript
export default defineConfig({
  base: '/knowledge/',   // ← 必须是 '/你的仓库名/'
  // ...
})
```

修改后，执行：

```shell
git add .vitepress/config.ts
git commit -m "fix: 修正 base 路径配置"
git push origin main
```

等待 GitHub Actions 完成重新部署（约 2-5 分钟）。

---

## 二、首次部署后访问显示 404

### 现象

第一次配置好 GitHub Pages 后，访问 `https://star-nebula.github.io/knowledge/` 看到 GitHub 404 页面。

### 原因

| 可能原因 | 说明 |
|----------|------|
| gh-pages 分支还不存在 | 工作流尚未成功运行，还没有生成 gh-pages 分支 |
| GitHub Pages 还在初始化 | 第一次部署需要几分钟才能生效 |
| Source 配置错误 | Settings → Pages 中配置的 Source 不是 gh-pages 分支 |

### 解决方案

1. **检查 GitHub Actions**：在 **Actions** 页面确认「构建并部署到 Github Pages」工作流是否成功运行（显示 ✅）
2. **检查 gh-pages 分支**：在仓库页面的分支选择器中，确认 `gh-pages` 分支是否存在且有文件（index.html 等）
3. **检查 Pages 设置**：在 **Settings → Pages** 确认 Source 选择的是 `gh-pages` 分支的 `/ (root)` 目录
4. **耐心等待**：GitHub Pages 首次部署通常需要 5-10 分钟，甚至更久

---

## 三、构建失败（Actions 显示红色 ❌）

### 现象

push 到 main 分支后，在 **Actions** 页面看到工作流失败（红色 X）。

### 排查步骤

1. 点击失败的工作流名称进入详情页
2. 点击红色的 build job，查看具体哪一步失败
3. 展开失败的步骤，查看错误日志

### 常见错误及解决方案

#### 错误 1：依赖安装失败

```text
ERROR: Failed to install pnpm dependencies
```

**原因**：`pnpm-lock.yaml` 与 `package.json` 不一致，或网络问题。

**解决方案**：

```shell
rm -rf node_modules pnpm-lock.yaml
pnpm install
git add pnpm-lock.yaml
git commit -m "fix: 更新 lockfile"
git push origin main
```

#### 错误 2：Node.js 版本不匹配

```text
Error: The engine "node" is incompatible with this module.
```

**原因**：本地安装的 Node.js 版本与工作流中指定的版本不一致。

**解决方案**：确保本地使用 Node.js 22.x 或更高版本。

#### 错误 3：权限不足

```text
fatal: could not read Username for 'https://github.com': No such device or address
```

**原因**：工作流缺少 `contents: write` 权限。

**解决方案**：确保工作流文件中包含：

```yaml
permissions:
  contents: write
```

#### 错误 4：构建超时

```text
Error: The operation was canceled.
```

**原因**：构建步骤超过了 10 分钟的超时限制。

**解决方案**：图片资源过多时会导致构建缓慢。可以：
- 优化图片大小
- 将 `.vitepress/dist` 目录中不必要的大文件添加到 `.gitignore`
- 联系仓库管理员增加超时限制

---

## 四、本地预览正常，但线上部署异常

### 现象

在本地执行 `pnpm docs:dev` 一切正常，但 push 到 GitHub 后线上版本有问题。

### 常见原因及解决方案

| 现象 | 原因 | 解决方案 |
|------|------|---------|
| 图片显示为红叉 | 图片路径大小写不匹配（GitHub Pages 区分大小写，本地 Windows/macOS 不区分） | 检查图片文件名和引用路径的大小写是否完全一致 |
| 链接点击后 404 | Markdown 中使用了绝对路径 `/xxx`，而不是相对路径 | 所有内部链接应使用相对路径，或使用 `$withBase` 辅助函数处理路径 |
| 页面布局错乱 | 本地与线上 base 路径不一致导致 | 确认 `.vitepress/config.ts` 中的 `base` 配置为 `'/knowledge/'` |

---

## 五、如何切换到其他分支作为部署源？

如果你想从其他分支（例如 `develop`）部署，修改工作流文件 `.github/workflows/production-deployment-to-github-pages.yaml`：

```yaml
on:
  workflow_dispatch:
  push:
    branches:
      - 'develop'   # ← 将 main 改为你想使用的分支
```

同时需要在 **Settings → Pages** 中确认 Source 仍然指向 `gh-pages` 分支（部署产物始终放在 `gh-pages`，与源代码分支无关）。

---

## 六、构建产物能否存放在其他分支？

可以，但不推荐。如果想修改构建产物的目标分支，修改工作流中的 `branch` 配置：

```yaml
- name: 推送到 gh-pages 分支
  uses: JamesIves/github-pages-deploy-action@v4
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    branch: gh-pages     # ← 可以改为其他分支名
    folder: .vitepress/dist
```

同时需要在 **Settings → Pages** 中将 Source 改为对应分支。

---

## 七、本地构建正常但 GitHub Actions 失败

这是最常见的问题之一，通常是环境差异导致的。

### 检查清单

| 检查项 | 本地环境 | GitHub Actions |
|--------|---------|---------------|
| Node.js 版本 | `node --version` | 工作流中配置为 22.x |
| pnpm 版本 | `pnpm --version` | 自动由 corepack 管理 |
| 操作系统 | Windows / macOS / Linux | Ubuntu 最新版 |
| 依赖版本 | `pnpm install --frozen-lockfile` | 工作流中使用相同命令 |

### 常用调试方法

1. **在本地模拟构建**：

```shell
rm -rf node_modules .vitepress/dist
pnpm install --frozen-lockfile
pnpm docs:build
```

如果本地也失败，说明是代码问题而非环境问题。

2. **查看工作流日志**：

在 GitHub Actions 页面，点击失败的工作流 → 点击失败的步骤 → 查看详细输出。通常错误信息会在最后几行明确告诉你问题所在。

---

## 八、如何重新部署？

如果你需要在不修改代码的情况下重新部署：

### 方法 A：通过 Actions 页面手动触发

1. 打开仓库的 **Actions** 页面
2. 选择「构建并部署到 Github Pages」工作流
3. 点击右侧的 **Run workflow** 按钮
4. 选择 `main` 分支，点击 **Run workflow**

### 方法 B：提交空 commit

```shell
git commit --allow-empty -m "chore: 重新部署"
git push origin main
```

### 方法 C：清理 Pages 缓存

1. 打开 **Settings → Pages**
2. 点击页面顶部的 **Unpublish site**（如果有）
3. 重新选择 Source 为 `gh-pages` 分支 `/ (root)`

---

## 九、搜索引擎收录问题（可选）

GitHub Pages 默认不配置 `robots.txt`，搜索引擎可能不会主动收录你的站点。

如果希望搜索引擎收录，有以下方法：

### 方法 A：配置 Google Search Console

1. 访问 <https://search.google.com/search-console>
2. 添加资源：`https://star-nebula.github.io/knowledge/`
3. 选择 **DNS 验证**或**HTML 文件验证**，按提示完成验证

### 方法 B：提交 sitemap

VitePress 可以配置自动生成 sitemap，但需要额外的插件配置。这对于个人知识库通常不是必需的。

---

## 十、快速排查流程

遇到部署问题时，按照以下顺序逐步排查，99% 的问题都能定位：

```text
  第 1 步：检查 GitHub Actions 是否成功？
     │
     ├─ ✅ 成功 → 跳转到第 3 步
     │
     └─ ❌ 失败 → 点击进入失败的工作流
                → 查看失败步骤的详细日志
                → 根据错误信息查找上方对应章节
                → 修复后重新 push
                    │
                    ▼
  第 2 步：gh-pages 分支是否存在且有内容？
     │
     ├─ ✅ 有内容 → 继续第 3 步
     │
     └─ ❌ 无内容 → 说明构建步骤没有成功
                → 回到第 1 步，检查构建步骤是否真的成功
                    │
                    ▼
  第 3 步：Settings → Pages 是否配置为 gh-pages / (root)？
     │
     ├─ ✅ 配置正确 → 继续第 4 步
     │
     └─ ❌ 配置错误 → 修正后等待几分钟重新访问
                    │
                    ▼
  第 4 步：本地构建是否正常？
     │
     ├─ ✅ 正常 → 可能是 base 路径或缓存问题
     │
     └─ ❌ 本地也失败 → 是代码问题
                → 根据本地错误信息修复代码
                    │
                    ▼
  第 5 步：访问线上页面，打开开发者工具（F12）
     │
     ├─ Console 中是否有红色错误？ → 通常是 base 路径问题
     │
     ├─ Network 中是否有 404？ → 检查资源路径
     │
     └─ 页面空白但无错误？ → 可能是 JavaScript 加载失败
