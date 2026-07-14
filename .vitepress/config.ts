import { presetMarkdownIt } from '@nolebase/integrations/vitepress/markdown-it'
import { transformHeadMeta } from '@nolebase/vitepress-plugin-meta'
import { calculateSidebar } from '@nolebase/vitepress-plugin-sidebar'
// import { buildEndGenerateOpenGraphImages } from '@nolebase/vitepress-plugin-og-image/vitepress'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItMathjax3 from 'markdown-it-mathjax3'
import { defineConfig } from 'vitepress'
import { obsidianImageEmbed } from './markdown/obsidian-image-embed'

const SITE_BASE = '/knowledge/'

import { githubRepoLink, siteDescription, siteName } from '../metadata'
import head from './head'

// unlazyImages 关闭：它依赖 thumbnail-hash 生成的 map.json 来给图片注入 blur-up 懒加载
// 属性。站点内容用 obsidian-image-embed 渲染普通 <img>，不需要该组件，且关闭 map 生成后
// 在 GHPages 干净 checkout 上会因找不到 map.json 而构建失败。
const nolebase = presetMarkdownIt({
  unlazyImages: false,
})

/**
 * 修复 nolebase calculateSidebar 生成的 index 页面链接。
 *
 * nolebase 对 index.md 生成的链接形如 `/vault/笔记/🌐 网站部署/index`，
 * 而 VitePress 的 isActive / normalize 只处理 `.md` / `.html` 结尾，
 * 无法剥离末尾的 `/index`，导致 pager（上下页导航）对所有 index 页面
 * 都找不到当前页，退化到始终取侧边栏第一项作为 "Next page"。
 *
 * 修复方式：将链接末尾的 `/index` 替换为 `/`。
 */
function fixSidebarIndexLinks(sidebar: any): any {
  function walk(items: any[]) {
    for (const item of items) {
      if (typeof item.link === 'string' && item.link.endsWith('/index'))
        item.link = item.link.replace(/\/index$/, '/')
      if (item.items)
        walk(item.items)
    }
  }

  if (Array.isArray(sidebar)) {
    walk(sidebar)
  }
  else if (sidebar && typeof sidebar === 'object') {
    for (const key of Object.keys(sidebar)) {
      if (Array.isArray(sidebar[key]))
        walk(sidebar[key])
    }
  }

  return sidebar
}

export default defineConfig({
  base: SITE_BASE,
  // 仅构建「站点内容」文件夹，排除 Obsidian 私人库（Knowledge/Resources/Skills/...
  // 等）。这些私人笔记引用了 vault/Attachments 中无法被 Skia 解码的损坏图，
  // 会让 @nolebase/thumbnail-hash 在构建期崩溃（Failed to make image from encoded data）。
  // srcExclude 相对 srcDir（即仓库根 E:\knowledge）匹配，故用 **/ 前缀兜底。
  srcExclude: [
    '**/Knowledge/**',
    '**/Projects/**',
    '**/DailyNotes/**',
    '**/Inbox/**',
    '**/Interview/**',
    '**/Resources/**',
    '**/Skills/**',
    '**/Canvas/**',
    '**/Templates/**',
    '**/Archive/**',
    '**/rules/**',
    '**/AgentLog/**',
    '**/Published/**',
    '**/.opencode/**',
    '**/.trash/**',
    '**/.workbuddy/**',
    '**/.obsidian/**',
    '**/.codebuddy/**',
    '**/data/**',
    '**/视图/**',
    '**/Home.md',
    '**/AGENT.md',
  ],
  // 仅构建「站点内容」文件夹（vault/笔记、vault/作坊、vault/档案、vault/编目 Catalog），
  // 排除 Obsidian 私人库。好处：① 构建更快、产物更干净；② 私人笔记不会被发布。
  // 注意：srcExclude 只影响「页面构建」，不影响 thumbnail-hash（该插件已在本仓库
  // vite.config.ts 中关闭，因为它会全量扫描仓库图片并在损坏图上卡死/崩溃）。
  lastUpdated: true,
  vue: {
    template: {
      transformAssetUrls: {
        video: ['src', 'poster'],
        source: ['src'],
        img: ['src'],
        image: ['xlink:href', 'href'],
        use: ['xlink:href', 'href'],
      },
    },
  },
  title: siteName,
  description: siteDescription,
  ignoreDeadLinks: true,
  head,
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },

        // Add title ang tags field in frontmatter to search
        // You can exclude a page from search by adding search: false to the page's frontmatter.
        _render(src, env, md) {
          // without `md.render(src, env)`, the some information will be missing from the env.
          let html = md.render(src, env)
          let tagsPart = ''
          let headingPart = ''
          let contentPart = ''
          let fullContent = ''
          const sortContent = () => [headingPart, tagsPart, contentPart] as const
          let { frontmatter, content } = env

          if (!frontmatter)
            return html

          if (frontmatter.search === false)
            return ''

          contentPart = content ||= src

          const headingMatch = content.match(/^# .*/m)
          const hasHeading = !!(headingMatch && headingMatch[0] && headingMatch.index !== undefined)

          if (hasHeading) {
            const headingEnd = headingMatch.index! + headingMatch[0].length
            headingPart = content.slice(0, headingEnd)
            contentPart = content.slice(headingEnd)
          }
          else if (frontmatter.title) {
            headingPart = `# ${frontmatter.title}`
          }

          const tags = frontmatter.tags
          if (tags && Array.isArray(tags) && tags.length)
            tagsPart = `Tags: #${tags.join(', #')}`

          fullContent = sortContent().filter(Boolean).join('\n\n')

          html = md.render(fullContent, env)

          return html
        },
      },
    },
  },
  locales: {
    root: {
      lang: 'zh-CN',
      label: '中文',
      dir: '/vault',
      link: '/vault',
      themeConfig: {
        nav: [
          { text: '主页', link: '/vault/' },
          { text: '笔记', link: '/vault/笔记/' },
          { text: '作坊', link: '/vault/作坊/' },
          { text: '档案', link: '/vault/档案/', activeMatch: '^/vault/档案/' },
          { text: '最近更新', link: '/vault/toc' },
        ],
        lastUpdated: {
          text: '最后更新',
        },
        socialLinks: [
          { icon: 'github', link: githubRepoLink },
        ],
        darkModeSwitchLabel: '切换主题',
        outline: { label: '页面大纲', level: 'deep' },
        editLink: {
          pattern: `${githubRepoLink}/tree/main/:path`,
          text: '编辑本页面',
        },
        sidebar: fixSidebarIndexLinks(calculateSidebar([
          { folderName: 'vault/笔记', separate: true },
          { folderName: 'vault/作坊', separate: true },
          { folderName: 'vault/档案', separate: true },
          { folderName: 'vault/编目 Catalog', separate: true },
        ], 'vault')),
        footer: {
          message: '每一篇文章，都是时间的标本',
        },
      },
    },
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'one-dark-pro',
    },
    math: true,
    preConfig: async (md) => {
      await nolebase.install(md)
    },
    config: (md) => {
      md.use(obsidianImageEmbed(SITE_BASE))
      md.use(MarkdownItFootnote)
      md.use(MarkdownItMathjax3)
      // Obsidian 风格双向链接：[[页面名]] 解析为站内链接（baseDir 对齐 VitePress base '/knowledge/'）
      md.use(BiDirectionalLinks, {
        baseDir: '/knowledge/',
        // 排除非内容目录，避免把 Obsidian 库/构建产物等当成链接目标
        excludesPatterns: ['_*', 'dist', 'node_modules', '.obsidian', '.vitepress', '.workbuddy', 'public', 'scripts', 'metadata'],
        // 未匹配的链接仍渲染为无效链接（带 .nolebase-route-link-invalid 类），便于发现死链
        stillRenderNoMatched: true,
      })
    },
  },
  async transformHead(context) {
    let head = [...context.head]

    const returnedHead = await transformHeadMeta()(head, context)
    if (typeof returnedHead !== 'undefined')
      head = returnedHead

    return head
  },
  async buildEnd(siteConfig) {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const outDir = siteConfig.outDir
    const base = SITE_BASE
    const home = `${base}vault/`

    // 1) 根路径 /knowledge/ 没有 index.html（内容在 /vault/），GitHub Pages 会直接回退到 404.html。
    //    这里写一个根 index.html 做客户端跳转，避免依赖 404 流程、也更明确。
    const rootHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${home}">
<script>location.href="${home}" + (location.hash || "")</script>
</head>
<body><a href="${home}">进入首页</a></body>
</html>`
    fs.writeFileSync(path.join(outDir, 'index.html'), rootHtml)

    // 2) 修复 VitePress 2.0 alpha 的内置重定向：它把“默认语言路径”算成了 lang 值
    //    (/knowledge/zh-CN/)，而实际内容在 /knowledge/vault/。该错误跳转目标在 404 页和
    //    每个内容页的内联脚本里都会出现，递归全部改掉（旧 /zh-CN/ 路径已不存在，无副作用）。
    const wrong = `${base}zh-CN/`
    const right = `${base}vault/`

    // 3) VitePress 把 locale 的 dir 选项 (/vault) 误用为 <html dir> 属性（应为 ltr/rtl）。
    //    浏览器对非法 dir 值按 ltr 处理，无功能影响，此处顺手修正所有页面（含嵌套 excalidraw 页）。
    const walkDir = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fp = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          walkDir(fp)
          continue
        }
        if (!entry.name.endsWith('.html'))
          continue
        let s = fs.readFileSync(fp, 'utf-8')
        if (s.includes(wrong) || s.includes('dir="/vault"')) {
          if (s.includes(wrong))
            s = s.split(wrong).join(right)
          if (s.includes('dir="/vault"'))
            s = s.replace(/dir="\/vault"/g, 'dir="ltr"')
          fs.writeFileSync(fp, s)
        }
      }
    }
    walkDir(outDir)
  },
})
