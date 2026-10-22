import { presetMarkdownIt } from '@nolebase/integrations/vitepress/markdown-it'
import { transformHeadMeta } from '@nolebase/vitepress-plugin-meta'
import { calculateSidebar } from '@nolebase/vitepress-plugin-sidebar'
// import { buildEndGenerateOpenGraphImages } from '@nolebase/vitepress-plugin-og-image/vitepress'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItMathjax3 from 'markdown-it-mathjax3'
import { defineConfig } from 'vitepress'
import { obsidianImageEmbed } from './markdown/obsidian-image-embed'
import { sanitizeWikiPercent } from './markdown/sanitize-wikilink-percent'
import { buildKnowledgeSidebar } from '../scripts/knowledge-org'
import { blogSourceToRoute, SITE_BASE } from '../scripts/blog-paths.mjs'

import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

// 站点发布面：唯一事实来源。新增/移除发布目录只改这里。
// 三处派生共用同一份清单，保证「git 跟踪 / 构建渲染 / 双链索引」三面始终对齐：
//   1. srcExclude：非发布目录一律不渲染成页面
//   2. nolebase bidirectionalLinks excludesPatterns：非发布目录不编入 [[ ]] 双链索引
//      （必须与 srcExclude 对齐，否则未发布笔记会被解析、与已发布同名笔记冲突）
//   3. scripts/check-publish-boundary.mjs：校验 git 跟踪面 ⊆ 发布面 + 构建产物链接 ⊆ 发布面
//
// 发布面 = 内容目录 + 站点运行必需文件（首页/目录页/数据源），
// 文件级条目用 `vault/<文件>` 形式；目录级用 `vault/<目录>`（含子目录）。
const PUBLISHED_DIRS = [
  'vault/blog/作坊',
  'vault/Knowledge',
  // 附件：被 git 跟踪的图片即已发布图片（pnpm sync:assets 只 add 已发布笔记引用的图）。
  // 整目录放行，便于 ![[image]] 嵌入解析；私人图仍在 .gitignore 里不会进仓库。
  'vault/Attachments',
  // 博客专用页面集中存放；rewrites 保留原 /vault/主页/、/vault/最近/toc 网址。
  // SITE_PAGE_FILES 将这两目录进一步限制为站点必需文件。
  'vault/blog/主页',
  'vault/blog/最近',
]
// 注：`vault/🔌 知识库插件列表.md` 曾以「站点必需文件」形式列在此处（vault 根散文件）。
// 2026-09-24 已迁入 `vault/Knowledge/Methods/知识库插件列表.md` 并按原子笔记规范补 frontmatter
// （category/category 决定其侧边栏归类），随 `vault/Knowledge` 目录级放行发布，故文件级条目移除。

// vault/Knowledge/ 已入库并随站点发布（见 README「内容板块」），目录存在性检测只作兜底：
// 某些 checkout / 分支可能没有该目录（历史上它曾被 .gitignore 排除为私人库），此时跳过渲染，
// 避免「构建失败」与「死链 nav」。
// 通过检测目录是否存在决定接入，使同一份 config 在本地与 CI 下都能构建通过。
const KNOWLEDGE_DIR = resolve(process.cwd(), 'vault/Knowledge')
const HAS_KNOWLEDGE = existsSync(KNOWLEDGE_DIR)

import { githubRepoLink, siteDescription, siteName } from '../metadata'
import head from './head'

// unlazyImages 关闭：它依赖 thumbnail-hash 生成的 map.json 来给图片注入 blur-up 懒加载
// 属性。站点内容用 obsidian-image-embed 渲染普通 <img>，不需要该组件，且关闭 map 生成后
// 在 GHPages 干净 checkout 上会因找不到 map.json 而构建失败。
// 双向链接（BiDirectionalLinks）的 excludesPatterns 必须与 VitePress 的 srcExclude 对齐：
// 否则 nolebase 会把未发布的私有 Vault 目录（Projects/.trash/Resources/...）也编入 [[ ]] 链接索引，
// 与已发布笔记同名时发生 basename 冲突（例：网页笔记四步工作流.md 在 Projects/.trash 均有副本
// → 冲突 → 正文 [[网页笔记四步工作流]] 解析失败、渲染成原始 [[ ]]）。
// 注意：早期曾「额外」用 md.use(BiDirectionalLinks, {...}) 手动注册一次，但 presetMarkdownIt 的
// install() 已经注册了 BiDirectionalLinks（默认 excludes），两次注册导致实际生效的是默认 excludes
// 的那一次，手动配置的 excludesPatterns 形同虚设。因此这里只通过 preset 的 options 单一配置，
// 不再手动 md.use，确保 excludes 真正生效。
const nolebase = presetMarkdownIt({
  unlazyImages: false,
  bidirectionalLinks: {
    options: {
      // 注意：baseDir 必须设为根路径 '/'，而不是站点的 base '/knowledge/'。
      // nolebase 生成 href 的逻辑是 posix.join(baseDir, <相对仓库根的路径>)；
      // 而 VitePress 自身的 base('/knowledge/') 会对所有链接再统一加一次前缀。
      // 若这里写成 '/knowledge/'，最终结果会变成 '/knowledge/knowledge/...'（双前缀、404）。
      // 因此这里只输出根相对路径 '/vault/...'，由 VitePress 的 base 补成 '/knowledge/vault/...'。
      baseDir: '/',
      // 未匹配的链接仍渲染为无效链接（带 .nolebase-route-link-invalid 类），便于发现死链
      stillRenderNoMatched: true,
      // 与 VitePress srcExclude 对齐：排除所有「未发布」私有 Vault 目录。
      // 由 buildExcludes() 同源生成（与 srcExclude 共用一份数据），
      // 避免两处各自维护导致漂移（见顶部 PUBLISHED_DIRS 注释）。
      excludesPatterns: [
        ...buildExcludes(),
        // 诊断快照/备份不可参与同名匹配，否则会抢占真实博客笔记的双链。
        '_agent_scripts/**',
        'backup/**',
        // Archive 备份目录含与 Attachments 同名的图片/附件副本，同名冲突会误报；
        // 同时排除 Attachments 内的 .md（Excalidraw 画图文件用 [[Pasted Image]] 引用粘贴图，会产生噪声），
        // 但保留 .png 等图片扫描以确保 ![[image]] 嵌入可解析。
        'vault/Attachments/**/*.md',
      ],
    },
  },
})

/**
 * 修复 nolebase calculateSidebar 生成的 index 页面链接。
 *
 * nolebase 对 index.md 生成的链接形如 `/vault/作坊/网站部署/index`，
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
      if (typeof item.link === 'string')
        item.link = blogSourceToRoute(item.link)
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
      const route = blogSourceToRoute(key)
      if (route !== key) {
        sidebar[route] = sidebar[key]
        delete sidebar[key]
      }
    }
  }

  return sidebar
}

/**
 * 组装整站侧边栏：nolebase calculateSidebar 负责「站点内容」目录（作坊/档案），
 * Knowledge 由 buildKnowledgeSidebar()
 * 按各笔记的 category frontmatter 实时生成，以 `/vault/Knowledge/` 为 key 注入。
 */
function buildSiteSidebar() {
  const raw = calculateSidebar([
    { folderName: 'vault/blog/作坊', separate: true },
  ], 'vault/blog')

  // nolebase 在「只有一个 target 且命中」时会做单目录优化，直接返回**数组**而不是 { key: items }
  // （见 @nolebase/vitepress-plugin-sidebar 的 mergeSidebar 末尾）。
  // 而 VitePress 的 getSidebar 见到数组就整体返回、忽略一切属性
  // （vitepress/dist/client/theme-default/support/sidebar.js:10），
  // 所以往数组上挂 '/vault/Knowledge/' 是不生效的——曾导致全站始终共用作坊目录。
  // 这里显式包成对象：作坊页用它，'/vault/' 作兜底（主页已 sidebar:false，最近等页沿用作坊目录）。
  const sidebar: Record<string, any> = Array.isArray(raw)
    ? { '/vault/作坊/': raw, '/vault/': raw }
    : raw

  const knowledge = HAS_KNOWLEDGE ? buildKnowledgeSidebar() : []
  if (knowledge.length > 0)
    sidebar['/vault/Knowledge/'] = knowledge

  return fixSidebarIndexLinks(sidebar)
}

// 根据完整发布路径生成排除规则；枚举 vault 顶层及嵌套发布目录的祖先层。
// 新增私人目录（包括 blog/ 下的兄弟目录）自动排除，
// 且与 nolebase 双链索引共用同一份数据（见顶部 PUBLISHED_DIRS 注释）。
// 注意：vault/Attachments 的图片不在此排除（图片不参与页面渲染，且要支持图片嵌入）。
function buildExcludes() {
  const vaultRoot = resolve(process.cwd(), 'vault')
  const excludes: string[] = []
  // 只递归白名单的祖先目录，避免把 blog/ 下新加的私人文件一起放行。
  function visit(dir: string, prefix: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const source = `${prefix}/${entry.name}`
      if (PUBLISHED_DIRS.includes(source))
        continue
      if (entry.isDirectory() && PUBLISHED_DIRS.some(p => p.startsWith(`${source}/`)))
        visit(resolve(dir, entry.name), source)
      else
        excludes.push(entry.isDirectory() ? `${source}/**` : source)
    }
  }
  visit(vaultRoot, 'vault')
  return excludes
}

const srcExclude = [
  // 仓库根级别的私有项（非 vault 顶层目录，buildExcludes 不覆盖）
  'backup/**',
  // 运维脚本区（2026-09-25 补）：_agent_scripts/ 下 164 个 md 曾被当站点内容渲染，
  // 其中 _out/verify/** 是脚本验证时留下的**自媒体文稿副本**（该目录 .gitignore 已排除，
  // GitHub Pages CI 干净检出时不存在，但本地 dist 上传「我的网页」镜像站时会一起发出去）。
  // 同时修掉 8 个构建期 URIError: URI malformed——fixture 文件名 `99.9% 是假的？….md`
  // 里的裸 % 让 nolebase 的 pathToFile → decodeURIComponent 抛错。
  '_agent_scripts/**',
  // vault 顶层「不在发布面」的目录/文件：由 buildExcludes() 动态生成
  ...buildExcludes(),
  // 追加硬排除：发布目录内若有个别不应渲染的，放这里（当前无）
  // '**/发布/**',
]
// 目录缺失时（见上方 HAS_KNOWLEDGE 说明）额外排除，避免构建扫描不存在的路径
if (!HAS_KNOWLEDGE)
  srcExclude.push('**/Knowledge/**')

export default defineConfig({
  base: SITE_BASE,
  // 2026-10-20：仅移动 Obsidian 源文件，现有公开 URL、导航与外链保持可用。
  rewrites: blogSourceToRoute,
  // 仅构建「站点内容」文件夹，排除 Obsidian 私人库（Resources/Inbox/DailyNotes/...
  // 等）。这些私人笔记引用了 vault/Attachments 中无法被 Skia 解码的损坏图，
  // 会让 @nolebase/thumbnail-hash 在构建期崩溃（Failed to make image from encoded data）。
  // srcExclude 相对 srcDir（即仓库根 E:\knowledge）匹配，故用 **/ 前缀兜底。
  srcExclude,
  // 仅构建「站点内容」文件夹（vault/blog/作坊、vault/blog/档案；Knowledge 由 buildKnowledgeSidebar 接入），
  // 排除 Obsidian 私人库。好处：① 构建更快、产物更干净；② 私人笔记不会被发布。
  // 发布面清单见顶部 PUBLISHED_DIRS。
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
      // 注意：link 必须带尾斜杠，否则 normalizeLink 会补成 …主页.html（GitHub Pages 404）。
      // 2026-09-25：首页源文件已从 vault/index.md 迁到 vault/主页/index.md，路由随之变成
      // /knowledge/vault/主页/ —— 此处 link（主题 logo 点击目标 / 默认语言回退）必须跟着改，
      // 否则点 logo 会落到已不存在的 /knowledge/vault/ 上 404。
      // dir 仍留 '/vault'：它决定 root locale 的页面归属前缀，收窄到 /vault/主页 会把
      // 作坊/档案/Knowledge 甩到 locale 之外。
      link: '/vault/主页/',
      themeConfig: {
        nav: [
          // 2026-10-20：源文件收进 vault/blog/；rewrites 保留这里的旧 URL。
          { text: '主页', link: '/vault/主页/' },
          // 「知识」项随 HAS_KNOWLEDGE 条件化：vault/Knowledge 缺失时整项不出，避免死链 nav。
          // （srcExclude 与 sidebar 早已条件化，唯此处遗漏）
          ...(HAS_KNOWLEDGE
            ? [{ text: '知识', link: '/vault/Knowledge/_mocs/知识库总览-MOC', activeMatch: '^/vault/Knowledge/' }]
            : []),
          { text: '作坊', link: '/vault/作坊/' },
          { text: '最近', link: '/vault/最近/toc' },
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
        sidebar: buildSiteSidebar(),
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
      sanitizeWikiPercent(md)
      await nolebase.install(md)
    },
    config: (md) => {
      // 渲染期兜底：Obsidian 笔记存在文件名/链接含裸 %（如 `300%法则.md`），
      // VitePress 的 link_open → normalizeHref → decodeURI 会因非法 % 直接抛错导致整站构建失败。
      // 这里在 nolebase 解析之后、VitePress 归一化之前，把链接 href 里的“孤立 %”转义为 %25，
      // 避免崩溃（链接仍指向 URL 编码后的真实路径）。源文件不做改动。
      const origLinkOpen = md.renderer.rules.link_open
        ?? ((tokens: any, idx: any, options: any, env: any, self: any) => self.renderToken(tokens, idx, options))
      md.renderer.rules.link_open = (tokens: any, idx: any, options: any, env: any, self: any) => {
        const token = tokens[idx]
        const href = token.attrGet('href') || ''
        if (href) {
          const safeHref = href.replace(/%(?![0-9A-Fa-f]{2})/g, '%25')
          // nolebase 输出源文件的绝对路径，不经过 VitePress 的相对链接重写。
          // 中文路径可能已编码；统一映射到保留的公开 URL。
          token.attrSet('href', blogSourceToRoute(decodeURI(safeHref)))
        }
        return origLinkOpen(tokens, idx, options, env, self)
      }
      // 用项目根目录作为图片索引的 cwd。obsidianImageEmbed 内部会动态探测并抢在 nolebase 的
      // 双向链接规则（bi_directional_link_replace）之前注册，从而把 ![[Attachments/x.jpg]]
      // 拦截成 <img>，而不是被渲染成死链(#)。非图片的 ![[笔记]] 不匹配 IMAGE_EXT，
      // 自动回退给 nolebase，不影响双向链接/图谱。
      md.use(obsidianImageEmbed(process.cwd()))
      md.use(MarkdownItFootnote)
      md.use(MarkdownItMathjax3)
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
    // 站点首页源文件 = vault/blog/主页/index.md；rewrites 保留原公开 URL。
    // 中文段一律用 percent-encoded 形态，meta refresh / href / 内联脚本三处共用同一常量，
    // 避免浏览器对裸 CJK 的编码差异影响跳转。
    const home = `${base}vault/%E4%B8%BB%E9%A1%B5/`

    // 1) 根路径 /knowledge/ 没有 index.html（内容在 /vault/主页/），GitHub Pages 会直接回退到 404.html。
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
    //    (/knowledge/zh-CN/)，而实际内容在站点首页 /knowledge/vault/主页/。该错误跳转目标在
    //    404 页和每个内容页的内联脚本里都会出现，递归全部改掉（旧 /zh-CN/ 路径已不存在，无副作用）。
    const wrong = `${base}zh-CN/`
    const right = home

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
