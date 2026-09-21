// scripts/check-publish-boundary.mjs
// 发布边界校验：保证「什么被发布」与 PUBLISHED_DIRS 清单一致，防漂移。
//
// 三查：
//   1. git 跟踪面 ⊆ 发布面 ∪ 入库不发布面：仓库里被 git 跟踪的 vault 文件，其顶层目录
//      必须属于「发布面」（PUBLISHED_DIRS）或「入库但不发布」名单（TRACKED_ONLY_DIRS）
//      （私人目录被误 git add 时在此报出——gitignore 只管忽略，add -f 可绕过）
//   2. 构建产物链接 ⊆ 发布面：.vitepress/dist 里所有 /vault/... 页面链接必须属于发布面
//   3. srcExclude 与 nolebase excludesPatterns 一致性：config.ts 里两份排除规则由
//      buildExcludes() 同源生成，此处做构建期断言兜底（读不到 AST 就跳过，不误报）
//
// 用法：node scripts/check-publish-boundary.mjs
// 退出码：0 全部通过；1 任一检查失败（CI 可据此拦截）。
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const ROOT = process.cwd()
const PUBLISHED_DIRS = [
  'vault/作坊', 'vault/档案', 'vault/Knowledge', 'vault/Attachments',
  'vault/index.md', 'vault/toc.md', 'vault/data/toc.data.ts', 'vault/🔌 知识库插件列表.md',
]
// 顶层目录级白名单（用于判断链接/跟踪面）
const publishedTop = new Set(
  PUBLISHED_DIRS.filter(d => d.split('/').length === 2 && !d.split('/')[1].includes('.'))
    .map(d => d.split('/')[1]),
)
// 顶层文件级白名单（vault 根下的散文件）
const publishedRootFiles = new Set(
  PUBLISHED_DIRS.filter(d => d.split('/').length === 2 && d.split('/')[1].includes('.'))
    .map(d => d.split('/')[1]),
)
// Obsidian 工具配置：.gitignore 白名单有意放行（供 Obsidian 使用随仓库备份），
// 非站点内容。校验时豁免，如需改为不跟踪，改 .gitignore 的白名单并 git rm --cached。
const OBSIDIAN_CONFIG = new Set([
  'vault/.obsidian/graph.json',
  'vault/.obsidian/workspaces.json',
  'vault/.obsidian/snippets/Color.css',
])
// 入库但不发布：进 GitHub 仓库源码（可 clone / 浏览 / 搜索），但不渲染成站点页面。
// 与 PUBLISHED_DIRS 的区别 —— 后者是「网站访客看得到」，这里是「只在仓库源码里可见」。
// 需求来源：vault/rules/（知识库操作规范）需随仓库做版本管理，但内容是本机工作方法、
// 不适合出现在站点上。加入此名单后，检查 1 不再把它判为「误 add」。
// 注意：不要为了让它通过校验而塞进 PUBLISHED_DIRS —— 那样 rules 会被渲染成网页。
const TRACKED_ONLY_DIRS = [
  'vault/rules',
]
const trackedOnlyTop = new Set(TRACKED_ONLY_DIRS.map(d => d.split('/')[1]))
// 特殊放行：首页自身链接 /vault/（index.md）
const ALLOW_ROOT_LINK = new Set(['vault/'])

let failures = 0
const fail = (msg) => { failures++; console.error(`  ✗ ${msg}`) }
const pass = (msg) => console.log(`  ✓ ${msg}`)

console.log('发布面清单:', PUBLISHED_DIRS.join(', '))
if (TRACKED_ONLY_DIRS.length)
  console.log('入库不发布清单:', TRACKED_ONLY_DIRS.join(', '))

// ── 检查 1：git 跟踪面 ⊆ 发布面 ──────────────────────────────
console.log('\n[1/3] git 跟踪面 ⊆ 发布面')
const tracked = execSync('git ls-files vault', { cwd: ROOT, encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  // 过滤「工作区已删除、待提交」的文件：它们提交后即不存在，不参与发布面判断
  .filter(f => existsSync(join(ROOT, f)))
const trackedOutside = tracked
  .filter(f => {
    if (OBSIDIAN_CONFIG.has(f)) return false
    const parts = f.split('/')
    if (publishedTop.has(parts[1])) return false
    // vault 根散文件（index.md / toc.md / 插件列表.md）在发布面内
    if (parts.length === 2 && publishedRootFiles.has(parts[1])) return false
    // vault/data/ 目录整体在发布面内（toc.data.ts 数据源）
    if (parts[1] === 'data') return false
    // 入库但不发布（见 TRACKED_ONLY_DIRS）：进仓库源码，但不进站点
    if (trackedOnlyTop.has(parts[1])) return false
    return true
  })
if (trackedOutside.length) {
  fail(`git 跟踪了 ${trackedOutside.length} 个非发布面文件（首个：${trackedOutside[0]}）——请检查是否误 add，或加入 PUBLISHED_DIRS`)
  console.log('  前 10 个：', trackedOutside.slice(0, 10).join(', '))
}
else {
  pass(`git 跟踪的 ${tracked.length} 个 vault 文件全部在发布面或「入库不发布」名单内`)
}

// ── 检查 2：构建产物链接 ⊆ 发布面 ─────────────────────────────
console.log('\n[2/3] 构建产物链接 ⊆ 发布面')
const dist = join(ROOT, '.vitepress/dist')
if (!existsSync(dist)) {
  console.log('  ⚠ .vitepress/dist 不存在（尚未构建），跳过产物链接检查')
}
else {
  // 收集 dist 下所有 html 里的 /vault/... 链接
  const hrefRe = /href="(\/knowledge\/vault\/[^"#?]*)"/g
  const links = new Set()
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name)
      if (e.isDirectory()) { walk(p); continue }
      if (!e.name.endsWith('.html')) continue
      const t = readFileSync(p, 'utf8')
      for (const m of t.matchAll(hrefRe))
        links.add(m[1].replace(/^\/knowledge/, ''))
    }
  }
  walk(dist)

  const badLinks = [...links].filter(u => {
    const path = decodeURIComponent(u).replace(/^\//, '') // vault/...
    if (ALLOW_ROOT_LINK.has(path)) return false
    const parts = path.split('/')               // [vault, 作坊, ...] 或 [vault, toc.html]
    if (parts[0] !== 'vault') return false       // 非 vault 链接（如 /assets）不算发布面
    const top = parts[1]                          // 顶层：作坊 / Knowledge / toc.html ...
    if (publishedTop.has(top)) return false
    // 顶层文件（如 toc.html → toc.md、index.html → index.md）
    if (parts.length === 2 && publishedRootFiles.has(top.replace(/\.html$/, '.md'))) return false
    return true
  })
  if (badLinks.length) {
    fail(`产物链接指向 ${badLinks.length} 个非发布面路径（首个：${badLinks[0]}）`)
  }
  else {
    pass(`产物 ${links.size} 个唯一 /vault/ 链接全部在发布面内`)
  }
}

// ── 检查 3：srcExclude / excludesPatterns 一致性（构建期断言兜底）──
console.log('\n[3/3] 排除规则一致性（弱检查）')
const config = readFileSync(join(ROOT, '.vitepress/config.ts'), 'utf8')
// buildExcludes() 同时被 srcExclude 与 excludesPatterns 引用——若未来有人改成两份手写，
// 这里通过「两份都应包含 buildExcludes 调用」做兜底提示
const srcUses = config.includes('srcExclude = [') && config.includes('...buildExcludes()')
const linkUses = config.includes('excludesPatterns: [') && config.includes('...buildExcludes()')
if (srcUses && linkUses) {
  pass('srcExclude 与 excludesPatterns 均由 buildExcludes() 派生（同源）')
}
else {
  fail('config.ts 中 srcExclude 或 excludesPatterns 未引用 buildExcludes()——可能已漂移，请检查')
}

console.log(failures ? `\n✗ 共 ${failures} 项失败` : '\n✓ 发布边界全部通过')
process.exit(failures ? 1 : 0)
