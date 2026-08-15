import { createMarkdownRenderer } from 'vitepress'
import { presetMarkdownIt } from '@nolebase/integrations/vitepress/markdown-it'
import { obsidianImageEmbed } from '../.vitepress/markdown/obsidian-image-embed'

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

async function main() {
  const md: any = await createMarkdownRenderer(
    process.cwd(),
    {
      theme: { light: 'github-light', dark: 'one-dark-pro' },
      math: true,
      preConfig: async (m: any) => { await nolebase.install(m) },
      config: (m: any) => { m.use(obsidianImageEmbed(process.cwd())) },
    } as any,
    '/knowledge/',
    console,
    {},
  )
  const r = md.inline.ruler
  console.log('Ruler keys:', Object.keys(r))
  for (const k of Object.keys(r)) {
    const v = (r as any)[k]
    if (Array.isArray(v))
      console.log(`array prop '${k}' len=${v.length} sample=${JSON.stringify(v.slice(0, 6))}`)
  }
  // try getRules for the inline chain
  try {
    const fns = r.getRules('$inline')
    console.log('getRules($inline) length:', fns.length)
  }
  catch (e: any) { console.log('getRules err:', e.message) }
}

main().catch((e) => { console.error(e); process.exit(1) })
