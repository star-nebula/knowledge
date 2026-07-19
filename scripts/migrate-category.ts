/**
 * migrate-category.ts
 * 为 vault/Knowledge 下每篇笔记注入 `category` frontmatter 字段，
 * 实现从「文件夹组织」到「基于属性（category）组织」的平滑过渡。
 *
 * 设计：
 *  - category[0] = 主分类（emoji 体系），由 文件夹 + 文件名关键词 推断
 *  - category[1] = 子分类（可选），由该笔记被哪些 *-MOC.md 链接到推断
 *                 （解析 MOC 的 [[链接]]，链接目标命中则取其 MOC 名去 -MOC 后缀）
 *
 * 用法：
 *  pnpm tsx scripts/migrate-category.ts            # 仅预览，不修改任何文件
 *  pnpm tsx scripts/migrate-category.ts --write     # 真实写入 category 字段
 *
 * 注意：始终保留物理文件夹结构不动，只新增/补全 frontmatter 字段。
 */
import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import matter from 'gray-matter'

const KNOWLEDGE = 'vault/Knowledge'

// 1) 主分类（emoji 体系）：文件夹 -> 主分类
const FOLDER_MAIN: Record<string, string> = {
  AI: '🤖 AI大模型',
  Engineering: '🛠️ 工程工具',
  Life: '🌱 生活',
  Methods: '📚 个人知识管理',
}

// 2) 主分类覆盖：文件名关键词 -> 主分类（优先级高于文件夹）
const KEYWORD_MAIN: Array<[RegExp, string]> = [
  [/RAG/i, '🔍 RAG'],
  [/LangChain|n8n|Agent|Function\s*Call|MCP|Claude\s*Code/i, '🧩 AI框架与Agent'],
]

/** 解析所有 *-MOC.md，建立 链接目标(文件名/title) -> 子分类名(去 -MOC 后缀) 的映射 */
function buildTitleToSub(): Map<string, string> {
  const map = new Map<string, string>()
  const mocs = fg.sync(`${KNOWLEDGE}/**/*-MOC.md`, { dot: false })
  for (const f of mocs) {
    const sub = path.basename(f, '.md').replace(/-MOC$/, '')
    const text = fs.readFileSync(f, 'utf-8')
    const links = [...text.matchAll(/\[\[([^\]|#]+)(?:[^\]]*)\]\]/g)].map(m => m[1].trim())
    for (const link of links) {
      map.set(link, sub)
      map.set(link.replace(/\.md$/i, ''), sub)
    }
  }
  return map
}

function getTitle(content: string): string | undefined {
  const { data } = matter(content)
  return typeof data.title === 'string' ? data.title : undefined
}

/** 推断某篇笔记的 category */
function inferCategory(relPath: string, content: string, titleToSub: Map<string, string>): string[] {
  const parts = relPath.split('/')
  const folder = parts[parts.length - 2] // vault/Knowledge/AI/xxx.md -> AI
  let main = FOLDER_MAIN[folder] ?? folder
  const base = path.basename(relPath, '.md')
  for (const [re, m] of KEYWORD_MAIN) {
    if (re.test(base)) {
      main = m
      break
    }
  }
  const title = getTitle(content)
  const sub = (title && titleToSub.get(title)) || titleToSub.get(base)
  return sub ? [main, sub] : [main]
}

function hasCategory(content: string): boolean {
  const m = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/)
  if (!m)
    return false
  return /^\s*category\s*:/m.test(m[1])
}

/** 最小化写回：在 frontmatter 块内追加一行 category，不重新序列化其他字段（保护原格式/diff） */
function injectCategory(content: string, category: string[]): string {
  const m = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/)
  if (!m)
    return content
  if (/^\s*category\s*:/m.test(m[1]))
    return content
  const body = m[1]
  const line = `category: [${category.map(c => `"${c}"`).join(', ')}]`
  const newFm = `---\n${body}\n${line}\n---`
  return content.replace(/^---[\r\n]+[\s\S]*?[\r\n]+---/, newFm)
}

const dryRun = !process.argv.includes('--write')
const titleToSub = buildTitleToSub()
const files = fg.sync(`${KNOWLEDGE}/**/*.md`, { dot: false })

const lines: string[] = []
let changed = 0
let skipped = 0
for (const f of files) {
  if (f.endsWith('-MOC.md'))
    continue
  const content = fs.readFileSync(f, 'utf-8')
  if (hasCategory(content)) {
    skipped++
    continue
  }
  const category = inferCategory(f, content, titleToSub)
  lines.push(`${f}\n    → category: [${category.map(c => `"${c}"`).join(', ')}]`)
  if (!dryRun) {
    fs.writeFileSync(f, injectCategory(content, category))
    changed++
  }
}

console.log(lines.join('\n'))
console.log(`\n${dryRun ? '[DRY-RUN] ' : '[WRITE] '}扫描 ${files.length} 个 md，本批拟注入 ${lines.length} 篇，已存在 category 跳过 ${skipped} 篇（MOC 不处理）`)
