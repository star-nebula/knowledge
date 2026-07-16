#!/usr/bin/env node
/**
 * 把「工作笔记源」(vault/Knowledge, vault/Projects) 中标记为发布的笔记，
 * 自动生成到发布目录 vault/笔记/<分类>/ 下。
 *
 * 设计原则（单一数据源）：
 *   - vault/Knowledge、vault/Projects 是私人工作笔记（.gitignore 忽略，不进仓库）
 *   - vault/笔记 是「派生发布副本」，由本脚本从源生成，原则上不手改
 *   - 改源 → 跑本脚本 → 笔记更新 → 提交 → 站点更新
 *
 * 发布标记（满足其一即发布）：
 *   - frontmatter 含 `published: true`
 *   - frontmatter 含 `status: published`
 * 目标分类（必填，否则跳过并告警）：
 *   - frontmatter 含 `publish_category: "🤖 AI应用开发"`（即 vault/笔记 下的分类目录名，须与现有目录完全一致）
 *
 * 变换：
 *   - Obsidian 笔记双链 [[Target]] / [[Target|别名]] / [[Target#标题|别名]]
 *     → 标准 markdown 链接，并尽量解析为跨分类的相对路径
 *   - 图片嵌入 ![[图.png]] 保持不变（由图片同步脚本与站点处理）
 *   - frontmatter 内的 [[...]]（如 related）同样改写
 *   - 输出时剥离源专属标记 published / status / publish_category，保持发布笔记清爽
 *   - frontmatter 其余格式原样保留（不做 YAML 重排）
 *
 * 安全（清单保护式）：
 *   - 用 manifest 记录「本脚本生成的文件」
 *   - 删除时只删「上次要、这次不要」的生成稿；绝不碰手写笔记
 *
 * 用法：
 *   node scripts/sync-published-notes.mjs            # 执行
 *   node scripts/sync-published-notes.mjs --dry-run  # 只打印，不写盘
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT = process.cwd()
const NOTES_ROOT = path.join(ROOT, 'vault', '笔记')
const SRC_DIRS = [
  path.join(ROOT, 'vault', 'Knowledge'),
  path.join(ROOT, 'vault', 'Projects'),
]
const MANIFEST = path.join(ROOT, '.workbuddy', 'published-notes-manifest.json')
const DRY = process.argv.includes('--dry-run')

const WIKI_RE = /(?<!!)\[\[([^\]\n]+?)\]\]/g // 笔记双链（排除前面的 ! 即嵌入图）

// ---------- 工具 ----------
function walk(dir) {
  const out = []
  if (!fs.existsSync(dir))
    return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory())
      out.push(...walk(p))
    else if (e.isFile() && p.endsWith('.md'))
      out.push(p)
  }
  return out
}

function isPublished(data) {
  return data?.published === true || data?.status === 'published'
}

/** 把 raw 拆成 {fm, body}，保留原始格式 */
function splitFront(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m)
    return { fm: '', body: raw }
  return { fm: m[1], body: raw.slice(m[0].length) }
}

/** 解析双链内部：[[Target#heading|alias]] */
function parseInner(inner) {
  const [left, alias] = inner.split('|')
  const [target, heading] = left.split('#')
  return {
    target: target.trim(),
    heading: (heading || '').trim(),
    alias: (alias || '').trim(),
  }
}

/** 源 basename(无扩展名) -> 目标相对路径(相对 vault/笔记 根, posix) */
function buildLinkMap(published) {
  const map = new Map()
  for (const p of published) {
    const base = path.basename(p.src, '.md')
    const rel = path.posix.join(...p.category.split('/'), path.basename(p.src))
    map.set(base, rel)
    map.set(base.toLowerCase(), rel) // 容错：大小写不敏感
  }
  return map
}

/** 从 fromCat 到 targetRel 的相对 markdown 链接 */
function relLink(fromCat, targetRel) {
  const targetDir = path.posix.dirname(targetRel)
  const targetFile = path.posix.basename(targetRel)
  let rel = path.posix.relative(fromCat, targetDir)
  if (rel === '')
    rel = '.'
  const prefix = rel.startsWith('.') ? rel : `./${rel}`
  return `${prefix}/${targetFile}`
}

/** 改写一段文本里的笔记双链 */
function rewriteWikilinks(text, fromCat, linkMap) {
  return text.replace(WIKI_RE, (full, inner) => {
    const { target, heading, alias } = parseInner(inner)
    if (!target)
      return full
    const tBase = target.replace(/\.md$/i, '')
    const resolved = linkMap.get(tBase) || linkMap.get(tBase.toLowerCase())
    let url
    if (resolved) {
      url = relLink(fromCat, resolved)
    }
    else {
      // 目标未发布：退化为同目录 ./Target.md（站点可能 404，需用户也发布目标）
      url = `./${tBase}.md`
    }
    if (heading)
      url += `#${heading}`
    const label = alias || target
    return `[${label}](${url})`
  })
}

/** 从 frontmatter 文本中剥离源专属标记行（兼容末行无换行） */
function stripMarkers(fm) {
  return fm
    .replace(/^[ \t]*publish_category:[^\n]*\n?/gm, '')
    .replace(/^[ \t]*published:[ \t]*true[ \t]*\n?/gim, '')
    .replace(/^[ \t]*status:[ \t]*published[ \t]*\n?/gim, '')
}

// ---------- 主流程 ----------
function main() {
  const sources = SRC_DIRS.flatMap(walk)
  console.log(`扫描源笔记: ${sources.length} 篇 (Knowledge/Projects)`)

  // 收集「已发布」笔记
  const published = []
  const skippedNoCat = []
  for (const src of sources) {
    let raw
    try {
      raw = fs.readFileSync(src, 'utf-8')
    }
    catch {
      continue
    }
    const { data } = matter(raw)
    if (!isPublished(data))
      continue
    const category = data.publish_category
    if (!category) {
      skippedNoCat.push({ src, title: data.title || path.basename(src) })
      continue
    }
    published.push({ src, category: String(category).replace(/\\/g, '/') })
  }
  console.log(`已标记发布: ${published.length} 篇`)
  if (skippedNoCat.length) {
    console.log(`\n⚠️ 跳过 ${skippedNoCat.length} 篇（缺 publish_category 字段，未指定发布分类）:`)
    skippedNoCat.forEach(s => console.log(`   - ${s.title}  (${path.relative(ROOT, s.src)})`))
  }

  const linkMap = buildLinkMap(published)

  // 旧 manifest
  let prevGenerated = []
  try {
    prevGenerated = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8')).generated || []
  }
  catch {
    prevGenerated = []
  }

  const newGenerated = [] // repo 相对路径，如 vault/笔记/🤖 AI应用开发/Foo.md
  let written = 0
  const overwroteHandwritten = []

  for (const { src, category } of published) {
    const raw = fs.readFileSync(src, 'utf-8')
    const { fm, body } = splitFront(raw)

    const newFm = stripMarkers(rewriteWikilinks(fm, category, linkMap))
    const newBody = rewriteWikilinks(body, category, linkMap)
    const outRel = path.posix.join('vault', '笔记', ...category.split('/'), path.basename(src))
    const outAbs = path.join(ROOT, ...outRel.split('/'))

    // 安全：若目标已存在且非本次生成、也不在旧 manifest（疑似手写同名），告警并按源覆盖
    if (fs.existsSync(outAbs) && !newGenerated.includes(outRel) && !prevGenerated.includes(outRel)) {
      overwroteHandwritten.push(outRel)
    }

    if (!DRY) {
      fs.mkdirSync(path.dirname(outAbs), { recursive: true })
      const out = fm.trim() === ''
        ? newBody
        : `---\n${newFm}\n---\n\n${newBody.replace(/^\n+/, '')}`
      fs.writeFileSync(outAbs, out, 'utf-8')
    }
    newGenerated.push(outRel)
    written++
  }

  // 删除「上次要、这次不要」的生成稿（清单保护：绝不碰手写）
  const toDelete = prevGenerated.filter(p => !newGenerated.includes(p))
  let deleted = 0
  if (!DRY) {
    for (const rel of toDelete) {
      const abs = path.join(ROOT, ...rel.split('/'))
      if (fs.existsSync(abs)) {
        fs.rmSync(abs, { force: true })
        deleted++
      }
    }
    // 清理空分类目录
    try {
      for (const d of fs.readdirSync(NOTES_ROOT)) {
        const dp = path.join(NOTES_ROOT, d)
        if (fs.statSync(dp).isDirectory()) {
          try { fs.rmdirSync(dp) } catch { /* 非空，保留 */ }
        }
      }
    }
    catch { /* ignore */ }
    // 写 manifest
    fs.mkdirSync(path.dirname(MANIFEST), { recursive: true })
    fs.writeFileSync(MANIFEST, JSON.stringify({ generated: newGenerated }, null, 2), 'utf-8')
  }

  console.log(`\n生成笔记: ${written} 篇 → vault/笔记/`)
  console.log(`删除旧稿: ${DRY ? toDelete.length : deleted} 篇`)
  if (overwroteHandwritten.length) {
    console.log(`\n⚠️ 以下目标路径已存在且非本脚本生成（疑似手写同名笔记），已按「源为真相」覆盖:`)
    overwroteHandwritten.forEach(p => console.log(`   - ${p}`))
  }
  if (DRY)
    console.log('\n[dry-run] 未做任何写入。')
  else
    console.log(`\nmanifest: ${path.relative(ROOT, MANIFEST)}`)
}

main()
