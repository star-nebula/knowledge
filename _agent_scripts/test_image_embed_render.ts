/**
 * 验证 obsidianImageEmbed 插件在 VitePress 渲染管线中的生效顺序。
 *
 * 背景：![[Attachments/x.jpg]] 这类 Obsidian 图片嵌入，必须抢在 nolebase 的
 * wikilink/embed 规则之前拦截，否则会被渲染成死链(#)。本脚本用 VitePress 的
 * createMarkdownRenderer 复刻 config.ts 的 markdown 管线，测试指定顺序：
 *   - old: nolebase.install 先，obsidianImageEmbed 后（复现线上死链）
 *   - new: obsidianImageEmbed 先，nolebase.install 后（修复后预期出 <img>）
 *
 * 用法：node_modules/.bin/tsx _agent_scripts/test_image_embed_render.ts <old|new>
 * （createMarkdownRenderer 有模块级缓存，故两种顺序分两次进程运行）
 */
import { createMarkdownRenderer } from 'vitepress'
import { presetMarkdownIt } from '@nolebase/integrations/vitepress/markdown-it'
import { obsidianImageEmbed } from '../.vitepress/markdown/obsidian-image-embed'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItMathjax3 from 'markdown-it-mathjax3'
import fs from 'node:fs'
import path from 'node:path'

const order = (process.argv[2] || 'new') as 'old' | 'new'
const notePath = 'vault/Knowledge/AI/DeepSeek Harness 部署流程.md'
const absNote = path.resolve(process.cwd(), notePath)
const src = fs.readFileSync(absNote, 'utf-8')

const nolebase = presetMarkdownIt({
  unlazyImages: false,
  bidirectionalLinks: {
    options: {
      baseDir: '/',
      stillRenderNoMatched: true,
      excludesPatterns: ['dist', 'node_modules', '.obsidian', '.vitepress'],
    },
  },
})

async function run() {
  const md: any = await createMarkdownRenderer(
    process.cwd(),
    {
      theme: { light: 'github-light', dark: 'one-dark-pro' },
      math: true,
      preConfig: async (m: any) => {
        if (order === 'old') {
          await nolebase.install(m)
          m.use(obsidianImageEmbed(process.cwd()))
        }
        else {
          m.use(obsidianImageEmbed(process.cwd()))
          await nolebase.install(m)
        }
      },
      config: (m: any) => {
        m.use(MarkdownItFootnote)
        m.use(MarkdownItMathjax3)
      },
    } as any,
    '/knowledge/',
    console,
    {},
  )

  const html: string = md.render(src, { path: notePath })
  const imgCount = (html.match(/<img /g) || []).length
  const missingCount = (html.match(/obsidian-image-missing/g) || []).length
  const hrefHashCount = (html.match(/href="#"/g) || []).length
  const imgSample = (html.match(/<img[^>]*Attachments[^>]*>/) || ['(none)'])[0]
  const idx = html.indexOf('Attachments')
  const snippet = idx >= 0 ? html.slice(Math.max(0, idx - 100), idx + 220) : '(no Attachments in html)'
  console.log(`order=${order}`)
  console.log(`  <img> tags            : ${imgCount}`)
  console.log(`  obsidian-image-missing: ${missingCount}`)
  console.log(`  <a href="#"> count     : ${hrefHashCount}`)
  console.log(`  img src sample        : ${imgSample}`)
  console.log(`  --- snippet around 'Attachments' ---`)
  console.log(`  ${snippet.replace(/\n/g, ' ')}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
