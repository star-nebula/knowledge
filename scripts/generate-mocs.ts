/**
 * generate-mocs.ts
 * 为 vault/Knowledge 的每个「栏目」（category 路径节点）生成/补全 MOC 落地页。
 *
 * 策略（避免重复用户手写的高质量专题页）：
 *  - 先扫描所有笔记的 category，得到分类树的所有节点路径（含中间节点）。
 *  - 对每个节点路径：
 *      ① 若 vault/Knowledge 下已存在名称匹配末级分类的 `*-MOC.md`（如子分类
 *         "机器学习" → `机器学习-MOC.md`），直接复用，不生成、不覆盖。
 *      ② 否则在 `vault/Knowledge/_mocs/` 生成 `<主 · 子 · ...>-MOC.md`，
 *         带上 `generated: true` 标记；已存在且带该标记则覆盖（幂等），
 *         已存在但不带标记（用户手写）则跳过，绝不误删用户内容。
 *  - 额外生成顶层 `vault/Knowledge/_mocs/知识库总览-MOC.md` 作为 nav 落地页。
 *
 * 用法：
 *  pnpm tsx scripts/generate-mocs.ts          # 预览将生成/复用的 MOC
 *  pnpm tsx scripts/generate-mocs.ts --write   # 真实写入
 */
import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import matter from 'gray-matter'
import {
  KNOWLEDGE,
  MOCS_DIR,
  readNotes,
  mocFileName,
  noteLink,
} from './knowledge-org'

interface TreeNode {
  children: Record<string, TreeNode>
  notes: ReturnType<typeof readNotes>
}
function ensure(): TreeNode {
  return { children: {}, notes: [] }
}

/** 构建分类树并收集所有节点路径（含中间节点），返回 Map<路径key, {path, node}> */
function buildTree() {
  const root: TreeNode = { children: {}, notes: [] }
  const nodeByPath = new Map<string, { path: string[], node: TreeNode }>()

  const notes = readNotes().filter(n => !n.isMoc && n.category.length > 0)
  for (const n of notes) {
    let node = root
    const acc: string[] = []
    for (const seg of n.category) {
      acc.push(seg)
      if (!node.children[seg])
        node.children[seg] = ensure()
      node = node.children[seg]
      const key = acc.join('|')
      if (!nodeByPath.has(key))
        nodeByPath.set(key, { path: [...acc], node })
      nodeByPath.get(key)!.node.notes.push(n)
    }
  }
  return { root, nodeByPath }
}

/** 末级分类名 → 已存在的手写 *-MOC.md 路由（仅复用 vault/Knowledge 下非 _mocs 的手写页） */
function existingMocRoute(lastSeg: string): string | null {
  const hit = fg.sync(`${KNOWLEDGE}/**/*-MOC.md`, { dot: false, ignore: ['**/_mocs/**'] })
    .find((f) => path.basename(f, '.md').replace(/-MOC$/, '') === lastSeg)
  return hit ? noteLink(hit) : null
}

function isGeneratedMoc(file: string): boolean {
  if (!fs.existsSync(file))
    return false
  try {
    const { data } = matter(fs.readFileSync(file, 'utf-8'))
    return data.generated === true
  }
  catch {
    return false
  }
}

/** 渲染一个生成型 MOC 的内容（子栏目 + 直接笔记） */
function renderMoc(titlePath: string[], node: TreeNode): string {
  const title = titlePath.join(' · ')
  const directNotes = node.notes
  const subSections = Object.keys(node.children).map((seg) => {
    const child = node.children[seg]
    const childPath = [...titlePath, seg]
    // 复用既有手写 MOC（按末级名匹配，filename 稳定可解析）；否则指向 _mocs 生成页。
    const handWritten = existingMocRoute(seg)
    const targetBasename = handWritten
      ? `${seg}-MOC`
      : mocFileName(childPath).replace(/\.md$/, '')
    const display = handWritten ? seg : childPath.join(' · ')
    return { targetBasename, display, route: handWritten ?? noteLink(`${MOCS_DIR}/${mocFileName(childPath)}`) }
  })

  const lines: string[] = []
  lines.push('---')
  lines.push(`title: ${title}`)
  lines.push('type: 专题聚合页')
  lines.push('generated: true')
  lines.push(`category: [${titlePath.map(c => `"${c}"`).join(', ')}]`)
  lines.push('---')
  lines.push('')
  lines.push(`# ${title}`)
  lines.push('')
  lines.push('> 本页由 `scripts/generate-mocs.ts` 自动生成，请勿手动编辑；修改笔记的 `category` 后重跑脚本即可刷新。')
  lines.push('')

  if (subSections.length) {
    lines.push('## 子栏目')
    lines.push('')
    for (const s of subSections) {
      // [[target|alias]]：target 用文件名（稳定可解析），alias 用干净展示名
      lines.push(`- [[${s.targetBasename}|${s.display}]]`)
    }
    lines.push('')
  }

  if (directNotes.length) {
    lines.push('## 笔记清单')
    lines.push('')
    for (const n of directNotes)
      lines.push(`- [[${n.title}]]`)
    lines.push('')
  }

  return lines.join('\n')
}

const dryRun = !process.argv.includes('--write')
const { nodeByPath } = buildTree()
const plan: string[] = []
let generated = 0
let reused = 0
let skipped = 0

fs.mkdirSync(MOCS_DIR, { recursive: true })

for (const { path: catPath, node } of nodeByPath.values()) {
  const last = catPath[catPath.length - 1]
  const reusedRoute = existingMocRoute(last)
  if (reusedRoute) {
    reused++
    plan.push(`复用  ${catPath.join(' / ')}  →  ${reusedRoute}`)
    continue
  }
  const target = `${MOCS_DIR}/${mocFileName(catPath)}`
  if (fs.existsSync(target) && !isGeneratedMoc(target)) {
    skipped++
    plan.push(`跳过(手写)  ${catPath.join(' / ')}  →  ${target}`)
    continue
  }
  if (!dryRun)
    fs.writeFileSync(target, renderMoc(catPath, node))
  generated++
  plan.push(`生成  ${catPath.join(' / ')}  →  ${noteLink(target)}`)
}

// 顶层总览页（nav 落地）
const overviewTarget = `${MOCS_DIR}/知识库总览-MOC.md`
const overviewContent = (() => {
  const lines: string[] = []
  lines.push('---')
  lines.push('title: 知识库总览')
  lines.push('type: 专题聚合页')
  lines.push('generated: true')
  lines.push('---')
  lines.push('')
  lines.push('# 知识库总览')
  lines.push('')
  lines.push('> 由 `scripts/generate-mocs.ts` 自动生成。')
  lines.push('')
  lines.push('<KnowledgeExplorer />')
  lines.push('')
  return lines.join('\n')
})()
if (!dryRun)
  fs.writeFileSync(overviewTarget, overviewContent)
plan.push(`生成  总览  →  ${noteLink(overviewTarget)}`)

console.log(plan.join('\n'))
console.log(`\n${dryRun ? '[DRY-RUN] ' : '[WRITE] '}复用现有 MOC ${reused} 个，生成 ${generated} 个，跳过手写 ${skipped} 个`)
