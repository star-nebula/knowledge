/**
 * knowledge-org.ts — vault/Knowledge 基于属性（category frontmatter）组织的共享工具。
 * 被 migrate-category.ts / generate-mocs.ts 共用，
 * 也被 .vitepress/config.ts 在构建期直接调用以动态生成侧边栏。
 *
 * 设计要点：
 *  - category[0] = 主分类（emoji 体系），category[1..] = 子分类（可选，可多级）。
 *  - 每级「栏目」都需要一个 MOC 作为落地页，物理位置与普通笔记同层：
 *      · 文件名两种合法形态：`<末级分类名>-MOC.md`（生成器新建用）与
 *        `<主分类去emoji>-<末级分类名>-MOC.md`（子分类重名/名字太泛时可自行改用，
 *        如 `OpenClaw-基础层-MOC.md`）；领域目录取成员笔记多数派（mocTargetDir），
 *        `_mocs/` 目录已于 2026-09-28 废除；
 *      · resolveMoc 全库按上述两种形态匹配（精确末级名优先）——手写页与生成页
 *        放哪个领域目录都能被侧边栏/总览组件命中；
 *      · 找不到时由 scripts/generate-mocs.ts 生成带 `<!-- MOC:AUTO -->` 标记的
 *        托管页，每次运行幂等刷新；删掉标记即脱管为手写页，生成器不再触碰。
 *  - 侧边栏在 config 加载时实时扫描 frontmatter 生成，因此 category 变更后
 *    `docs:dev` / `docs:build` 自动反映最新归类，无需手动维护。
 */
import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import matter from 'gray-matter'

export const KNOWLEDGE = 'vault/Knowledge'

/** 托管 MOC 标记：文件正文含 START 即视为生成器托管，正文可被 --write 幂等重写 */
export const MOC_AUTO_START = '<!-- MOC:AUTO -->'
export const MOC_AUTO_END = '<!-- /MOC:AUTO -->'

/** 历史 `_mocs/` 目录（2026-09-28 废除）——扫描时一律排除，防止旧文件被当作有效落地页 */
export const LEGACY_MOCS_IGNORE = ['**/_mocs/**']

export interface Note {
  rel: string
  title: string
  category: string[]
  isMoc: boolean
}

export interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsible?: boolean
  collapsed?: boolean
}

/** 扫描 vault/Knowledge 下所有 md，返回笔记元数据（含 category frontmatter） */
export function readNotes(): Note[] {
  const files = fg.sync(`${KNOWLEDGE}/**/*.md`, { dot: false })
  return files.map((rel) => {
    const content = fs.readFileSync(rel, 'utf-8')
    const { data } = matter(content)
    const isMoc = rel.endsWith('-MOC.md')
    return {
      rel,
      title: typeof data.title === 'string'
        ? data.title
        : rel.replace(/\.md$/, '').split('/').pop() ?? rel,
      category: Array.isArray(data.category) ? data.category.map(String) : [],
      isMoc,
    }
  })
}

/** rel (vault/Knowledge/AI/Transformer.md) -> 站点路由 (/vault/Knowledge/AI/Transformer) */
export function noteLink(rel: string): string {
  return `/${rel.replace(/\\/g, '/').replace(/\.md$/, '')}`.replace(/^\/+/, '/').replace(/%/g, '%25')
}

/** 去掉分类名开头的 emoji（含变体选择符）与空白：`🦀 OpenClaw` -> `OpenClaw` */
export function stripCategoryEmoji(name: string): string {
  return name.replace(/^\p{Extended_Pictographic}\uFE0F?\s*/u, '')
}

/**
 * category 路径对应的 MOC 文件名合法形态（两种皆可，精确末级名优先）：
 *  1) `<末级分类名>-MOC.md`（生成器新建用此形态）
 *  2) `<主分类去emoji>-<末级分类名>-MOC.md`（子分类在目录内易混淆时可自行改用）
 */
export function mocNameVariants(categoryPath: string[]): string[] {
  const last = categoryPath[categoryPath.length - 1]
  if (categoryPath.length < 2)
    return [`${last}-MOC.md`]
  const main = stripCategoryEmoji(categoryPath[0])
  return [`${last}-MOC.md`, `${main}-${last}-MOC.md`]
}

/** 全库扫描某 category 路径对应的 *-MOC.md 文件（两种形态皆查，精确末级名排前；排除历史 `_mocs/`）。 */
export function findMocRels(categoryPath: string[]): string[] {
  const names = new Set(mocNameVariants(categoryPath))
  const leaf = `${categoryPath[categoryPath.length - 1]}-MOC.md`
  return fg.sync(`${KNOWLEDGE}/**/*-MOC.md`, { dot: false, ignore: LEGACY_MOCS_IGNORE })
    .filter((f) => names.has(path.basename(f)))
    .sort((a, b) => (path.basename(b) === leaf ? 1 : 0) - (path.basename(a) === leaf ? 1 : 0))
}

/**
 * 解析某 category 路径对应的 MOC 落地页路由：
 * 全库（排除历史 `_mocs/`）按 mocNameVariants 两种命名形态匹配，精确末级名优先。
 * 找不到返回 null（该栏目暂无落地页，侧边栏仅作为分组、不挂链接，
 * 跑 `scripts/generate-mocs.ts --write` 可补齐）。
 */
export function resolveMoc(categoryPath: string[]): string | null {
  if (categoryPath.length === 0)
    return null
  const hit = findMocRels(categoryPath)[0]
  return hit ? noteLink(hit) : null
}

/**
 * category 节点的 MOC 应落在哪个一级领域目录：
 * 取成员笔记所在一级目录的多数派（并列取先出现者；成员直接在 Knowledge 根时归入根）。
 * 返回 '' 表示 Knowledge 根。
 */
export function mocTargetDir(memberRels: string[]): string {
  const counts = new Map<string, number>()
  for (const rel of memberRels) {
    const p = rel.replace(/\\/g, '/')
    const under = p.startsWith(`${KNOWLEDGE}/`) ? p.slice(KNOWLEDGE.length + 1) : p
    const dir = path.dirname(under)
    const seg = dir === '.' ? '' : dir.split('/')[0]
    counts.set(seg, (counts.get(seg) ?? 0) + 1)
  }
  let best = ''
  let bestCount = -1
  for (const [seg, n] of counts) {
    if (n > bestCount) {
      best = seg
      bestCount = n
    }
  }
  return best
}

/**
 * 由所有笔记的 category 实时构建 VitePress 侧边栏树。
 * 返回结构可直接拼接到 themeConfig.sidebar 数组前。
 */
export function buildKnowledgeSidebar(): SidebarItem[] {
  const notes = readNotes().filter(n => !n.isMoc && n.category.length > 0)

  // 构建分类树
  interface TreeNode {
    children: Record<string, TreeNode>
    notes: Note[]
  }
  const root: TreeNode = { children: {}, notes: [] }
  const ensure = (): TreeNode => ({ children: {}, notes: [] })
  for (const n of notes) {
    let node = root
    for (let i = 0; i < n.category.length; i++) {
      const seg = n.category[i]
      if (!node.children[seg])
        node.children[seg] = ensure()
      node = node.children[seg]
    }
    node.notes.push(n)
  }

  const toItems = (node: TreeNode, pathSoFar: string[]): SidebarItem[] => {
    const items: SidebarItem[] = []
    // 直接挂在该精确路径下的笔记
    for (const n of node.notes)
      items.push({ text: n.title, link: noteLink(n.rel) })
    // 子分类
    for (const seg of Object.keys(node.children)) {
      const child = node.children[seg]
      const childPath = [...pathSoFar, seg]
      const subItems = toItems(child, childPath)
      items.push({
        text: seg,
        link: resolveMoc(childPath) ?? undefined,
        items: subItems,
        collapsible: subItems.length > 0,
        collapsed: pathSoFar.length > 0,
      })
    }
    return items
  }

  const result: SidebarItem[] = []
  for (const main of Object.keys(root.children)) {
    const child = root.children[main]
    const subItems = toItems(child, [main])
    result.push({
      text: main,
      link: resolveMoc([main]) ?? undefined,
      items: subItems,
      collapsible: true,
      collapsed: true,
    })
  }
  return result
}
