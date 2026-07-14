import path from 'node:path'
import fg from 'fast-glob'
import type MarkdownIt from 'markdown-it'

/**
 * 把 Obsidian 风格图片嵌入 `![[name.png]]` / `![[name.png|alt]]` / `![[name.png|alt|width]]`
 * 渲染成标准 <img>，并指向 vault 中图片的真实相对路径，交由 Vite 打包（自动处理 base 与哈希）。
 *
 * 为什么不用 public/attachments + 绝对路径：VitePress 2.0 alpha 的 @mdit-vue transformAssetUrls
 * 会把所有 <img src> 当模块去解析，带 base 或不带 base 的绝对路径都无法作为 public 资源放行，
 * 只有「相对于当前 md 文件的相对路径」能被正确打包。因此这里用 env.path 算出相对引用。
 *
 * 仅当目标带图片扩展名时才拦截；非图片的 `![[note]]`（Obsidian 的笔记内嵌）保持原样。
 * 找不到文件的图渲染成「图片缺失」占位（data-URI SVG），构建不挂，且能在页面上看出缺图。
 */
const IMAGE_EXT = /\.(png|jpe?g|gif|svg|webp|bmp|avif|ico)$/i

let byBase: Map<string, string> | null = null
function buildIndex(root: string): Map<string, string> {
  if (byBase)
    return byBase
  const map = new Map<string, string>()
  const files = fg.sync('vault/**/*', { cwd: root, absolute: true, dot: false })
  for (const p of files) {
    if (!IMAGE_EXT.test(p))
      continue
    const b = path.basename(p)
    const isAttach = p.includes(`${path.sep}Attachments${path.sep}`)
    if (!map.has(b) || isAttach)
      map.set(b, p)
  }
  byBase = map
  return map
}

function missingPlaceholder(name: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'>`
    + `<rect width='100%' height='100%' fill='#262626' stroke='#444'/>`
    + `<text x='50%' y='50%' fill='#9a9a9a' font-size='14' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>图片缺失：${name}</text>`
    + `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function obsidianImageEmbed(root: string): (md: MarkdownIt) => void {
  const index = buildIndex(root)
  const warned = new Set<string>()

  return (md: MarkdownIt) => {
    md.inline.ruler.before('link', 'obsidian_image_embed', (state, silent) => {
      const start = state.pos
      if (state.src.charCodeAt(start) !== 0x21 /* ! */)
        return false
      if (state.src.slice(start + 1, start + 3) !== '[[')
        return false
      const end = state.src.indexOf(']]', start + 3)
      if (end < 0)
        return false

      const raw = state.src.slice(start + 3, end)
      const [name, ...rest] = raw.split('|').map(s => s.trim())
      const fileBase = name.split('/').pop() || ''
      if (!IMAGE_EXT.test(fileBase))
        return false

      if (!silent) {
        const token = state.push('obsidian_image_embed', '', 0)
        token.meta = { fileBase, rest }
      }
      state.pos = end + 2
      return true
    })

    md.renderer.rules.obsidian_image_embed = (tokens, idx, _options, env) => {
      const { fileBase, rest } = tokens[idx].meta
      const att = index.get(fileBase)

      let alt = ''
      let width = ''
      if (rest.length === 1) {
        if (/^\d+$/.test(rest[0]))
          width = rest[0]
        else
          alt = rest[0]
      }
      else if (rest.length >= 2) {
        alt = rest[0]
        if (/^\d+$/.test(rest[1]))
          width = rest[1]
      }

      // 缺失文件：渲染占位，构建不挂
      if (!att) {
        if (!warned.has(fileBase)) {
          warned.add(fileBase)
          // eslint-disable-next-line no-console
          console.warn(`[obsidian-image-embed] 图片缺失，需补回：${fileBase}`)
        }
        const attrs = [
          `src="${missingPlaceholder(fileBase)}"`,
          `alt="图片缺失：${fileBase}"`,
          'class="obsidian-image-missing"',
        ].filter(Boolean).join(' ')
        return `<img ${attrs} />`
      }

      // 计算相对路径（Vite 据此打包，自动处理 base 与哈希）
      const noteDir = path.dirname(env.path as string)
      let rel = path.relative(noteDir, att).replace(/\\/g, '/')
      if (!rel.startsWith('.'))
        rel = `./${rel}`

      const attrs = [
        `src="${rel}"`,
        alt ? `alt="${alt}"` : '',
        width ? `width="${width}"` : '',
      ].filter(Boolean).join(' ')
      return `<img ${attrs} />`
    }
  }
}
