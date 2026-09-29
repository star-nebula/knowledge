/**
 * knowledge-org.ts — vault/Knowledge 基于属性（category frontmatter）组织的共享工具。
 * 被 migrate-category.ts / generate-mocs.ts 共用，
 * 也被 .vitepress/config.ts 在构建期直接调用以动态生成侧边栏。
 *
 * 设计要点：
 *  - category[0] = 主分类（emoji 体系），category[1..] = 子分类（可选，可多级）。
 *  - 每级「栏目」都需要一个 MOC 作为落地页，**全部 MOC 统一放 `vault/Knowledge/_mocs/`
 *    集中管理**（2026-09-28 二次反转，同日早先的「与普通笔记同层」约定作废）：
 *      · 文件名两种合法形态：`<末级分类名>-MOC.md`（生成器新建用）与
 *        `<主分类去emoji>-<末级分类名>-MOC.md`（子分类重名/名字太泛时可自行改用，
 *        如 `OpenClaw-基础层-MOC.md`）；
 *      · resolveMoc 按 `-MOC.md` 后缀全库定位（含 `_mocs/`，兼容历史遗留位置），
 *        生成器新建固定落 `_mocs/`；
 *      · 托管页正文含 `<!-- MOC:AUTO -->` 标记，`--write` 每次幂等刷新；
 *        删掉标记即脱管为手写页，生成器不再触碰。
 *  - 侧边栏在 config 加载时实时扫描 frontmatter 生成，因此 category 变更后
 *    `docs:dev` / `docs:build` 自动反映最新归类，无需手动维护。
 */
import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import matter from 'gray-matter'

export const KNOWLEDGE = 'vault/Knowledge'
export const MOCS_DIR = `${KNOWLEDGE}/_mocs`

/** 托管 MOC 标记：文件正文含 START 即视为生成器托管，正文可被 --write 幂等重写 */
export const MOC_AUTO_START = '<!-- MOC:AUTO -->'
export const MOC_AUTO_END = '<!-- /MOC:AUTO -->'

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

/** 顶层主分类固定顺序（MOC 编号与排序的唯一依据，2026-09-28 用户定） */
export const MAIN_CATEGORY_ORDER = [
  '🧩 AI框架与Agent',
  '🤖 AI大模型',
  '🔍 RAG',
  '🦀 OpenClaw',
  '🛠️ 工程工具',
  '📚 个人知识管理',
  '🌱 生活',
]

/** 顶层主分类的序号（1~7；未知主分类返回 null）——专属子 MOC 文件名序号前缀的依据 */
export function mocFileNameOrder(mainCategory: string): number | null {
  const idx = MAIN_CATEGORY_ORDER.indexOf(mainCategory)
  return idx >= 0 ? idx + 1 : null
}

/**
 * MOC 文件名的兜底匹配形态（category 精确匹配不上时用）：
 *  1) `<末级分类名>-MOC.md`
 *  2) `<主分类去emoji>-<末级分类名>-MOC.md`（如 OpenClaw-基础层-MOC.md）
 *  3) 序号前缀形态 `<顶层序号>.<末级分类名>-MOC.md`（如 1.Jev-MOC.md；专属子 MOC 用，
 *     共享子 MOC 被多个主分类引用、无法编号，保持无前缀）
 */
export function mocNameVariants(categoryPath: string[]): string[] {
  const last = categoryPath[categoryPath.length - 1]
  if (categoryPath.length < 2)
    return [`${last}-MOC.md`]
  const main = stripCategoryEmoji(categoryPath[0])
  const num = mocFileNameOrder(categoryPath[0])
  const forms = [`${last}-MOC.md`, `${main}-${last}-MOC.md`]
  if (num)
    forms.push(`${num}.${last}-MOC.md`)
  return forms
}

/** 读取 MOC 文件自身的 category frontmatter（字符串数组），解析失败返回 null */
export function mocFileCategory(rel: string): string[] | null {
  try {
    const { data } = matter(fs.readFileSync(rel, 'utf-8'))
    return Array.isArray(data.category) ? data.category.map(String) : null
  }
  catch {
    return null
  }
}

/**
 * 全库扫描某 category 路径对应的 *-MOC.md 文件，匹配优先级：
 *  1) **MOC 自身 category frontmatter === 目标分类路径**（精确唯一，2026-09-28 起首选；
 *     文件名可自由带序号/前缀/空格，不再受匹配约束）
 *  2) 文件名兜底形态（mocNameVariants），精确末级名排前
 * 位置不限（约定落点 `_mocs/`，错位仍可命中）。
 */
export function findMocRels(categoryPath: string[]): string[] {
  const all = fg.sync(`${KNOWLEDGE}/**/*-MOC.md`, { dot: false })
  const byCategory = all.filter((f) => {
    const c = mocFileCategory(f)
    return c !== null && c.length === categoryPath.length && c.every((seg, i) => seg === categoryPath[i])
  })
  if (byCategory.length > 0)
    return byCategory
  const names = new Set(mocNameVariants(categoryPath))
  const leaf = `${categoryPath[categoryPath.length - 1]}-MOC.md`
  return all
    .filter((f) => names.has(path.basename(f)))
    .sort((a, b) => (path.basename(b) === leaf ? 1 : 0) - (path.basename(a) === leaf ? 1 : 0))
}

/**
 * 解析某 category 路径对应的 MOC 落地页路由：
 * 先按 MOC 自身 category frontmatter 精确匹配，再按文件名兜底形态（位置不限）。
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
