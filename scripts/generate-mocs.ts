/**
 * generate-mocs.ts
 * 为 vault/Knowledge 的每个「栏目」（category 路径节点）生成/刷新 MOC 落地页。
 *
 * 约定（2026-09-28 二次反转，正本 [[Decisions/MOC统一收进_mocs集中管理]]；
 * 同日早先「与普通笔记同层」的 [[Decisions/MOC迁出_mocs至分类文件夹]] 被本决策反转）：
 *  - **所有 MOC（含手写页）统一放 `vault/Knowledge/_mocs/` 集中管理**；生成器新建固定落此。
 *  - 文件名两种合法形态：`<末级分类名>-MOC.md`（新建用）与
 *    `<主分类去emoji>-<末级分类名>-MOC.md`（子分类重名/名字太泛时可自行改用）。
 *  - frontmatter 六属性：title / created / type / tags / abstract / category。
 *  - 托管标记：生成页正文含 `<!-- MOC:AUTO -->` 对。每次运行幂等重写其正文
 *    （H1 + 子栏目 + 笔记清单），frontmatter 保留 created/tags/abstract、
 *    仅刷新 title/category 跟随分类改名。手写页（无标记）永不触碰；
 *    想修改托管页内容 → 删掉标记即脱管。
 *
 * 用法：
 *  pnpm tsx scripts/generate-mocs.ts          # 预览（新建/更新/复用/孤儿报告）
 *  pnpm tsx scripts/generate-mocs.ts --write   # 真实写入
 */
import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import matter from 'gray-matter'
import {
  KNOWLEDGE,
  MOCS_DIR,
  MOC_AUTO_END,
  MOC_AUTO_START,
  findMocRels,
  mocFileCategory,
  mocFileNameOrder,
  mocNameVariants,
  noteLink,
  readNotes,
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

/**
 * rel -> 文件名（不含扩展名，即 Obsidian/VitePress 解析 wikilink 所用的键）。
 * ⚠️ 不能用 `title` 生成 wikilink：wikilink 按**文件名**解析，而 `title` 是可任意起的
 * 展示名（例：文件 `机器学习-KNN算法.md` 的 title 是 `KNN算法`）。用 title 会生成
 * `[[KNN算法]]` 这类**必然断链**的链接，且每次重跑生成器都会重新写坏。
 */
function noteBasename(rel: string): string {
  return rel.replace(/\\/g, '/').split('/').pop()!.replace(/\.md$/, '')
}

/** 子栏目链接：指向该子栏目实际存在的 MOC 文件名（跟随用户改名），否则用默认 `<末级>-MOC`；展示名用完整层级路径 */
function childLinks(titlePath: string[], node: TreeNode) {
  return Object.keys(node.children).map((seg) => {
    const childPath = [...titlePath, seg]
    const hits = findMocRels(childPath)
    return {
      target: hits.length > 0 ? noteBasename(hits[0]) : canonicalMocName(childPath),
      display: childPath.join(' · '),
    }
  })
}

/** 渲染托管 MOC 正文（标记对包裹，生成器每次整段重写） */
function renderMocBody(display: string, node: TreeNode): string {
  const lines: string[] = []
  lines.push(MOC_AUTO_START)
  lines.push('')
  lines.push(`# ${display}`)
  lines.push('')

  const subs = childLinks(display.split(' · '), node)
  if (subs.length) {
    lines.push('## 子栏目')
    lines.push('')
    for (const s of subs)
      lines.push(`- [[${s.target}|${s.display}]]`)
    lines.push('')
  }

  if (node.notes.length) {
    lines.push('## 笔记清单')
    lines.push('')
    for (const n of node.notes) {
      // target 用文件名（解析键），alias 用 title（展示名）；两者相同则省略 alias
      const base = noteBasename(n.rel)
      lines.push(base === n.title ? `- [[${base}]]` : `- [[${base}|${n.title}]]`)
    }
    lines.push('')
  }

  lines.push(MOC_AUTO_END)
  lines.push('')
  return lines.join('\n')
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

/** gray-matter 会把 YAML 裸日期（created: 2026-09-28）解析成 Date 对象，
 *  序列化前必须归一回 ISO 日期串，否则回写会变成 toString 的长格式。 */
function normalizeDates(data: Record<string, unknown>): void {
  for (const k of Object.keys(data)) {
    const v = data[k]
    if (v instanceof Date) {
      data[k] = v.toISOString().slice(0, 10)
      continue
    }
    if (typeof v === 'string' && k === 'created' && !/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      const d = new Date(v)
      data[k] = Number.isNaN(d.getTime()) ? today() : d.toISOString().slice(0, 10)
    }
  }
}

/** 含 YAML 特殊字符的标量才加双引号；emoji/CJK/日期保持原样可读 */
function yamlScalar(v: string): string {
  if (/^\s|\s$|^[-?:,[\]{}#&*!|>'"%@`]/.test(v) || v.includes(': ') || v.includes(' #') || v.includes('"'))
    return `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  return v
}

/** 手写式 frontmatter 序列化：gray-matter 的 js-yaml 会把 emoji 转成 \U 转义、日期加引号，不用它写 */
function serializeFrontmatter(data: Record<string, unknown>): string {
  const lines = Object.entries(data).map(([k, v]) => {
    if (Array.isArray(v)) {
      if (v.length === 0)
        return `${k}: []`
      return `${k}:\n${v.map(item => `  - ${yamlScalar(String(item))}`).join('\n')}`
    }
    return `${k}: ${yamlScalar(String(v))}`
  })
  return `---\n${lines.join('\n')}\n---`
}

const dryRun = !process.argv.includes('--write')
const { nodeByPath } = buildTree()
const plan: string[] = []
let created = 0
let updated = 0
let reused = 0
let skipped = 0

/**
 * 子分类末级名 -> MOC title 显示名（2026-09-28 用户参考命名：加空格等微调）。
 * category 与文件匹配不受影响——只影响托管页 title 与展示。
 */
const DISPLAY_NAME: Record<string, string> = {
  'AI框架与Agent': 'AI 框架与 Agent',
  'AI大模型': 'AI 大模型',
  '架构与中间件': '架构与中间件',
  'NLP基础': 'NLP 基础',
}
const displayName = (seg: string) => DISPLAY_NAME[seg] ?? seg

/** 子 MOC 的规范文件名：主分类序号 N 为 1~7 时，专属子 MOC 命名 `N.<末级>-MOC.md`；
 *  共享子 MOC（被多个主分类引用）与顶层/无序主分类退回 `<末级>-MOC.md`。
 *  判定「专属」依据 = 该末级名 + 主分类的组合是否唯一（扫描所有节点路径）。 */
function canonicalMocName(catPath: string[]): string {
  const last = catPath[catPath.length - 1]
  if (catPath.length < 2)
    return `${last}-MOC.md`
  const main = catPath[0]
  const num = mocFileNameOrder(main)
  if (!num)
    return `${last}-MOC.md`
  const owners = new Set(
    [...nodeByPath.values()]
      .filter(({ path: p }) => p.length >= 2 && p[p.length - 1] === last)
      .map(({ path: p }) => p[0]),
  )
  return owners.size === 1 ? `${num}.${last}-MOC.md` : `${last}-MOC.md`
}

/** 本次运行已声明要创建的目标 rel -> 分类路径，用于拦截「两个栏目算出同一个落点」 */
const claimedTargets = new Map<string, string>()

if (!dryRun)
  fs.mkdirSync(MOCS_DIR, { recursive: true })

for (const { path: catPath, node } of nodeByPath.values()) {
  const last = catPath[catPath.length - 1]
  const display = catPath.map(displayName).join(' · ')
  const targetRel = `${MOCS_DIR}/${canonicalMocName(catPath)}`

  const existingRels = findMocRels(catPath)
  if (existingRels.length > 1) {
    skipped++
    plan.push(`跳过(同名MOC歧义)  ${display}  →  ${existingRels.join(' , ')}  请人工合并`)
    continue
  }
  const hit = existingRels[0]
  if (hit) {
    const content = fs.readFileSync(hit, 'utf-8')
    if (content.includes(MOC_AUTO_START)) {
      if (!dryRun) {
        const { data } = matter(content)
        data.title = display
        data.category = [...catPath]
        delete data.generated // 旧约定残留，清除
        normalizeDates(data)
        fs.writeFileSync(hit, `${serializeFrontmatter(data)}\n\n${renderMocBody(display, node)}`)
      }
      updated++
      plan.push(`更新  ${display}  →  ${noteLink(hit)}`)
    }
    else {
      reused++
      plan.push(`复用  ${display}  →  ${noteLink(hit)}`)
    }
    continue
  }

  if (claimedTargets.has(targetRel)) {
    skipped++
    plan.push(`跳过(目标重名)  ${display}  →  ${targetRel}（已被「${claimedTargets.get(targetRel)}」占用）`)
    continue
  }
  claimedTargets.set(targetRel, display)

  if (!dryRun) {
    const data: Record<string, unknown> = {
      title: display,
      created: today(),
      type: '专题聚合页',
      tags: ['MOC'],
      abstract: `收录「${display}」栏目的笔记导航，共 ${node.notes.length} 篇。`,
      category: [...catPath],
    }
    fs.writeFileSync(targetRel, `${serializeFrontmatter(data)}\n\n${renderMocBody(display, node)}`)
  }
  created++
  plan.push(`新建  ${display}  →  ${noteLink(targetRel)}`)
}

// ---- 顶层总览页（nav 落地；不属于任何分类 → 放 _mocs/） ----
const overviewRel = `${MOCS_DIR}/知识库总览-MOC.md`
const overviewBody = [MOC_AUTO_START, '', '# 知识库总览', '', '<KnowledgeExplorer />', '', MOC_AUTO_END, ''].join('\n')
if (fs.existsSync(overviewRel)) {
  const content = fs.readFileSync(overviewRel, 'utf-8')
  if (content.includes(MOC_AUTO_START)) {
    if (!dryRun) {
      const data = matter(content).data
      normalizeDates(data)
      fs.writeFileSync(overviewRel, `${serializeFrontmatter(data)}\n\n${overviewBody}`)
    }
    updated++
    plan.push(`更新  知识库总览  →  ${noteLink(overviewRel)}`)
  }
  else {
    reused++
    plan.push(`复用  知识库总览  →  ${noteLink(overviewRel)}（手写，未触碰）`)
  }
}
else {
  if (!dryRun) {
    const data: Record<string, unknown> = {
      title: '知识库总览',
      created: today(),
      type: '专题聚合页',
      tags: ['MOC'],
      abstract: '全站知识库入口，按分类浏览全部笔记。',
      category: [],
    }
    fs.writeFileSync(overviewRel, matter.stringify(overviewBody, data))
  }
  created++
  plan.push(`新建  知识库总览  →  ${noteLink(overviewRel)}`)
}

// ---- 孤儿报告：MOC 的 category 与文件名都对不上任何栏目（分类改名/删除的遗留），仅报告不删除 ----
// 位置漂移（MOC 留在领域目录而非 _mocs/）不判孤儿——resolveMoc 按名/按 category 全库定位，功能不破；
// 需要归位时手工 git mv 进 _mocs/ 即可。
const validNames = new Set(['知识库总览-MOC.md'])
for (const { path: p } of nodeByPath.values())
  for (const n of mocNameVariants(p))
    validNames.add(n)
const validCategories = new Set(
  [...nodeByPath.values()].map(({ path: p }) => p.join('|')),
)
for (const f of fg.sync(`${KNOWLEDGE}/**/*-MOC.md`, { dot: false })) {
  const cat = mocFileCategory(f)
  const catOk = cat !== null && (cat.length === 0 ? validNames.has(path.basename(f)) : validCategories.has(cat.join('|')))
  if (!validNames.has(path.basename(f)) && !catOk)
    plan.push(`孤儿  ${f}  （category 与文件名都对不上任何栏目，请人工确认）`)
}

console.log(plan.join('\n'))
console.log(`\n${dryRun ? '[DRY-RUN] ' : '[WRITE] '}新建 ${created} / 更新 ${updated} / 复用 ${reused} / 跳过 ${skipped} / 孤儿 ${plan.filter(p => p.startsWith('孤儿')).length}`)
