/**
 * knowledge-org.ts — vault/Knowledge 基于属性（category frontmatter）组织的共享工具。
 * 被 migrate-category.ts / generate-mocs.ts / build-knowledge-sidebar.ts 共用，
 * 也被 .vitepress/config.ts 在构建期直接调用以动态生成侧边栏。
 *
 * 设计要点：
 *  - category[0] = 主分类（emoji 体系），category[1..] = 子分类（可选，可多级）。
 *  - 每级「栏目」都需要一个 MOC 作为落地页：
 *      · 优先复用 vault/Knowledge 下已存在的 `*-MOC.md`（按末级分类名匹配，例如
 *        子分类 "机器学习" → 已存在的 `机器学习-MOC.md`），避免重复用户手写的高质量专题页；
 *      · 找不到时，由 scripts/generate-mocs.ts 在 `vault/Knowledge/_mocs/` 下生成
 *        `<主 · 子 · ...>-MOC.md`。
 *  - 侧边栏在 config 加载时实时扫描 frontmatter 生成，因此 category 变更后
 *    `docs:dev` / `docs:build` 自动反映最新归类，无需手动维护。
 */
import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import matter from 'gray-matter'

export const KNOWLEDGE = 'vault/Knowledge'
export const MOCS_DIR = `${KNOWLEDGE}/_mocs`

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

/** category 数组 -> MOC 文件名（层级用 ` · ` 连接，避免为栏目建物理子目录） */
export function mocFileName(categories: string[]): string {
  return `${categories.join(' · ').replace(/\//g, '·')}-MOC.md`
}

/**
 * category 数组 -> 站点内 link（路由路径，不含 base 前缀 /knowledge/）。
 * 文件名可能含 `%`（如 `300%法则.md`），直接拼进 link 会让 VitePress 的
 * `isActive` 在 `decodeURI` 时抛 `URIError: URI malformed`。故把 `%` 预编码为
 * `%25`，浏览器/Vue Router 解码后即还原为 `%`，路由匹配正常。
 */
export function mocLink(categories: string[]): string {
  return `/${MOCS_DIR}/${mocFileName(categories)}`.replace(/^\/+/, '/').replace(/%/g, '%25')
}

/** rel (vault/Knowledge/AI/Transformer.md) -> 站点路由 (/vault/Knowledge/AI/Transformer) */
export function noteLink(rel: string): string {
  return `/${rel.replace(/\\/g, '/').replace(/\.md$/, '')}`.replace(/^\/+/, '/').replace(/%/g, '%25')
}

/**
 * 解析某 category 路径对应的 MOC 落地页路由：
 *  1) 优先复用已存在的 `*-MOC.md`——其去 -MOC 后的名称 === 末级分类名
 *     （例如 category ["🤖 AI大模型","机器学习"] → 命中 `.../机器学习-MOC.md`）。
 *  2) 否则若 `_mocs/` 下已生成同名 MOC，则返回其路由。
 *  3) 都没有返回 null（该栏目暂无落地页，侧边栏仅作为分组、不挂链接）。
 */
export function resolveMoc(categoryPath: string[]): string | null {
  if (categoryPath.length === 0)
    return null
  const last = categoryPath[categoryPath.length - 1]

  const existing = fg.sync(`${KNOWLEDGE}/**/*-MOC.md`, { dot: false })
    .find((f) => {
      const base = path.basename(f, '.md').replace(/-MOC$/, '')
      return base === last
    })
  if (existing)
    return noteLink(existing)

  const gen = `${MOCS_DIR}/${mocFileName(categoryPath)}`
  if (fs.existsSync(gen))
    return noteLink(gen)

  return null
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
