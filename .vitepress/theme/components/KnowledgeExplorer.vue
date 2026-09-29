<script setup lang="ts">
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'

// 构建期通过 Vite glob 自动发现 vault/Knowledge 下全部 .md，
// 读取每篇笔记的 `category` frontmatter，构建多级分类树。
// 关键差异：按 category 多级树渲染（而非按文件夹），且链接用显式路径
// /vault/Knowledge/... 走 VitePress 路由，完全不经过 nolebase 的裸名解析，
// 从根本上规避「同名撞车 / 命名对不上」导致的 [[ ]] 死链。
defineOptions({ name: 'KnowledgeExplorer' })

interface NoteEntry {
  name: string
  path: string
  /** 完整 category 路径，如 ["📚 个人知识管理", "00后群体特征"] */
  cats: string[]
  /** tags frontmatter（可缺失），参与搜索 */
  tags: string[]
}
interface Branch {
  name: string
  /** 从根到本节点的完整 category 路径，如 ["🌱 生活"]；用于解析对应 MOC */
  path: string[]
  children: Branch[]
  notes: NoteEntry[]
}

// 直接读原始文本（?raw），仅解析 frontmatter，避免 eager 导入整篇编译产物。
const modules = import.meta.glob('/vault/Knowledge/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

/** category frontmatter 原始解析缓存（MOC 索引与建树共用一次解析） */
const rawCategoryCache = new Map<string, string[]>()

// ---- 运行时 MOC 索引：两种命中途径，与 knowledge-org.ts 的 findMocRels 一致 ----
// ① category 索引（首选）：MOC 自身 frontmatter category === 分支完整路径 → 精确唯一命中，
//    文件名可自由带序号/前缀/空格（如 1.Jev-MOC.md），不再受命名约束
// ② 基名兜底：末级分类名或 <主去emoji>-<末级> === 文件名去 -MOC（兼容无 category 的历史页）
const mocByBase = new Map<string, string>()
const mocByCategory = new Map<string, string>()
for (const [p, raw] of Object.entries(modules)) {
  const fileBase = p.split('/').pop()!
  if (!fileBase.endsWith('-MOC.md'))
    continue
  const route = p.replace(/\.md$/, '').replace(/%/g, '%25')
  const name = fileBase.replace(/-MOC\.md$/, '')
  if (!mocByBase.has(name))
    mocByBase.set(name, route)
  const cats = parseCategory(raw)
  rawCategoryCache.set(p, cats)
  if (cats.length > 0 && !mocByCategory.has(cats.join('|')))
    mocByCategory.set(cats.join('|'), route)
}

function resolveMoc(cats: string[]): string | null {
  if (cats.length === 0)
    return null
  const hit = mocByCategory.get(cats.join('|'))
  if (hit)
    return hit
  const last = cats[cats.length - 1]
  const baseHit = mocByBase.get(last)
  if (baseHit)
    return baseHit
  if (cats.length >= 2) {
    const main = cats[0].replace(/^\p{Extended_Pictographic}\uFE0F?\s*/u, '')
    return mocByBase.get(`${main}-${last}`) ?? null
  }
  return null
}

function parseCategory(raw: string): string[] {
  const m = raw.match(/category:\s*\[([^\]]*)\]/)
  if (!m)
    return []
  return m[1]
    .split(',')
    .map(s => s.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

/** 解析 YAML 块式 tags 列表（tags:\n  - xxx），行内 [a, b] 与引号形式均兼容 */
function parseTags(raw: string): string[] {
  const m = raw.match(/tags:\s*\n((?:\s*-\s*[^\n]+\n?)+)/)
  if (m) {
    return m[1]
      .split('\n')
      .map(l => l.trim().replace(/^-\s*/, '').replace(/^["']|["']$/g, '').trim())
      .filter(Boolean)
  }
  const inline = raw.match(/tags:\s*\[([^\]]*)\]/)
  if (inline) {
    return inline[1]
      .split(',')
      .map(s => s.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean)
  }
  return []
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, 'zh-Hans-CN', { numeric: true })
}

function buildRoots(): Branch[] {
  const roots: Branch[] = []

  const ensureChild = (parent: Branch, name: string, cats: string[]): Branch => {
    let child = parent.children.find(c => c.name === name)
    if (!child) {
      child = { name, path: cats, children: [], notes: [] }
      parent.children.push(child)
    }
    return child
  }

  for (const [path, raw] of Object.entries(modules)) {
    // MOC 落地页不作为普通成员参与建树（它们也可能带 category frontmatter）
    if (path.split('/').pop()!.endsWith('-MOC.md'))
      continue
    const cats = parseCategory(raw)
    if (cats.length === 0)
      continue

    const tags = parseTags(raw)
    const baseName = path.split('/').pop()!.replace(/\.md$/, '')
    const notePath = path.replace(/\.md$/, '').replace(/%/g, '%25')
    const entry: NoteEntry = { name: baseName, path: notePath, cats, tags }

    // 在 roots 中找/建根分类
    let branch = roots.find(r => r.name === cats[0])
    if (!branch) {
      branch = { name: cats[0], path: [cats[0]], children: [], notes: [] }
      roots.push(branch)
    }
    // 逐层 descend，把子分类挂到父的 children 上（同时记录完整 category 路径）
    for (let i = 1; i < cats.length; i++)
      branch = ensureChild(branch, cats[i], cats.slice(0, i + 1))

    branch.notes.push(entry)
  }

  const sortTree = (list: Branch[]) => {
    list.sort((a, b) => naturalSort(a.name, b.name))
    for (const b of list) {
      b.notes.sort((a, b2) => naturalSort(a.name, b2.name))
      sortTree(b.children)
    }
  }
  sortTree(roots)
  return roots
}

const roots = buildRoots()
const props = defineProps<{ node?: Branch; depth?: number }>()
const depth = computed(() => props.depth ?? 0)

// 默认合并（折叠）——符合「内容默认折叠」的需求；左侧 VitePress 侧边栏同步在
// knowledge-org.ts 的 buildKnowledgeSidebar 顶层 collapsed 改为 true。
const open = ref(false)

// 本分支是否有对应 MOC 可跳转（有则分支名渲染为链接，点名跳 MOC；无则点名仅展开）
const mocPath = computed(() => resolveMoc(props.node?.path ?? []))

// ================= 筛选视图（入口模式专属） =================
// 视图切换：'filter' 默认（搜索 + 分类 chips + 平铺列表），'tree' 为原递归树兜底
const view = ref<'filter' | 'tree'>('filter')
const query = ref('')
/** 当前选中的根分类；null = 全部 */
const activeCat = ref<string | null>(null)

const allNotes = computed<NoteEntry[]>(() => {
  const list: NoteEntry[] = []
  const walk = (b: Branch) => {
    list.push(...b.notes)
    b.children.forEach(walk)
  }
  roots.forEach(walk)
  return list
})

const rootCats = computed(() =>
  roots.map(r => ({ name: r.name, count: countNotes(r) })),
)

function countNotes(b: Branch): number {
  return b.notes.length + b.children.reduce((s, c) => s + countNotes(c), 0)
}

/** 去掉分类名前导 emoji，用于 chip 显示与匹配 */
function stripEmoji(s: string): string {
  return s.replace(/^\p{Extended_Pictographic}\uFE0F?\s*/u, '').trim()
}

const filteredNotes = computed(() => {
  let list = allNotes.value
  if (activeCat.value)
    list = list.filter(n => n.cats[0] === activeCat.value)
  const q = query.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      n =>
        n.name.toLowerCase().includes(q)
        || n.tags.some(t => t.toLowerCase().includes(q))
        || n.cats.some(c => c.toLowerCase().includes(q)),
    )
  }
  return [...list].sort((a, b) => naturalSort(a.name, b.name))
})

function clearFilters() {
  query.value = ''
  activeCat.value = null
}
</script>

<template>
  <!-- 入口模式：<KnowledgeExplorer /> 无 node prop → 筛选视图 + 树形兜底 -->
  <div v-if="!node" class="knowledge-explorer">
    <div class="ke-toolbar">
      <div class="ke-viewswitch" role="tablist">
        <button
          class="ke-viewbtn"
          :class="{ active: view === 'filter' }"
          @click="view = 'filter'"
        >筛选</button>
        <button
          class="ke-viewbtn"
          :class="{ active: view === 'tree' }"
          @click="view = 'tree'"
        >树形</button>
      </div>
      <input
        v-model="query"
        class="ke-search"
        type="search"
        placeholder="搜索笔记名 / 标签 / 分类…"
        @keydown.esc="query = ''"
      >
    </div>

    <!-- 筛选视图 -->
    <div v-if="view === 'filter'">
      <div class="ke-chips">
        <button
          class="ke-chip"
          :class="{ active: activeCat === null }"
          @click="activeCat = null"
        >
          全部 <span class="ke-chip-count">{{ allNotes.length }}</span>
        </button>
        <button
          v-for="c in rootCats"
          :key="c.name"
          class="ke-chip"
          :class="{ active: activeCat === c.name }"
          :title="c.name"
          @click="activeCat = activeCat === c.name ? null : c.name"
        >
          {{ stripEmoji(c.name) }} <span class="ke-chip-count">{{ c.count }}</span>
        </button>
      </div>

      <div v-if="filteredNotes.length === 0" class="empty-hint">
        没有匹配「{{ query }}」的笔记，试试换个关键词或 <a href="#" @click.prevent="clearFilters">清空筛选</a>。
      </div>
      <div v-else class="ke-flat">
        <a
          v-for="n in filteredNotes"
          :key="n.path"
          class="ke-flat-note"
          :href="withBase(n.path)"
        >
          <span class="ke-dot" />
          <span class="ke-flat-name">{{ n.name }}</span>
          <span class="ke-flat-cat">{{ n.cats.map(stripEmoji).join(' / ') }}</span>
        </a>
      </div>
    </div>

    <!-- 树形视图（原手风琴，兜底按层级浏览） -->
    <div v-else class="knowledge-explorer">
      <KnowledgeExplorer v-for="b in roots" :key="b.name" :node="b" :depth="0" />
    </div>
  </div>

  <!-- 分支模式：递归渲染单个分类节点 -->
  <div v-else class="ke-branch">
    <div class="ke-header" :style="{ paddingLeft: depth * 16 + 12 + 'px' }">
      <span class="ke-chevron" :class="{ open }" @click.stop="open = !open">▶</span>
      <!-- 有对应 MOC：分支名作为链接，点击跳转到该 MOC；箭头仍负责展开/折叠 -->
      <a v-if="mocPath" class="ke-name ke-link" :href="withBase(mocPath)">{{ node.name }}</a>
      <!-- 无 MOC：整行点击展开/折叠 -->
      <span v-else class="ke-name" @click="open = !open">{{ node.name }}</span>
      <span class="ke-count">
        {{ node.notes.length }} 篇{{ node.children.length ? ' · ' + node.children.length + ' 类' : '' }}
      </span>
    </div>
    <div v-show="open" class="ke-body">
      <KnowledgeExplorer
        v-for="c in node.children"
        :key="c.name"
        :node="c"
        :depth="depth + 1"
      />
      <a
        v-for="n in node.notes"
        :key="n.path"
        class="ke-note"
        :style="{ paddingLeft: (depth + 1) * 16 + 28 + 'px' }"
        :href="withBase(n.path)"
      >
        <span class="ke-dot" />
        <span class="ke-note-name">{{ n.name }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.knowledge-explorer {
  margin-top: 16px;
}

/* ---- 工具栏：视图切换 + 搜索 ---- */
.ke-toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}
.ke-viewswitch {
  display: flex;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}
.ke-viewbtn {
  padding: 6px 14px;
  font-size: 13px;
  border: none;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.ke-viewbtn + .ke-viewbtn {
  border-left: 1px solid var(--vp-c-divider);
}
.ke-viewbtn.active {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.ke-search {
  flex: 1;
  min-width: 0;
  padding: 7px 14px;
  font-size: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.15s, background 0.15s;
}
.ke-search:focus {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

/* ---- 分类 chips ---- */
.ke-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}
.ke-chip {
  padding: 5px 12px;
  font-size: 13px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ke-chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.ke-chip.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}
.ke-chip-count {
  font-size: 11px;
  opacity: 0.75;
  margin-left: 2px;
}

/* ---- 平铺列表 ---- */
.ke-flat {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}
.ke-flat-note {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
}
.ke-flat-note + .ke-flat-note {
  border-top: 1px solid var(--vp-c-divider);
}
.ke-flat-note:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-brand-1);
}
.ke-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: background 0.12s;
}
.ke-flat-note:hover .ke-dot,
.ke-note:hover .ke-dot {
  background: var(--vp-c-brand-1);
}
.ke-flat-name {
  line-height: 1.5;
  min-width: 0;
}
.ke-flat-cat {
  margin-left: auto;
  font-size: 12px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  max-width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---- 树形视图（原样式保留） ---- */
.ke-branch {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s;
}
.ke-branch:hover {
  border-color: var(--vp-c-brand-1);
}

.ke-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}
.ke-header:hover {
  background: var(--vp-c-bg-mute);
}

.ke-chevron {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-3);
  font-size: 10px;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}
.ke-chevron.open {
  transform: rotate(90deg);
}

.ke-name {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.ke-name.ke-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.12s, opacity 0.12s;
}
.ke-name.ke-link:hover {
  opacity: 0.78;
  text-decoration: underline;
}

.ke-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.ke-body {
  border-top: 1px solid var(--vp-c-divider);
  padding: 4px 0;
}

.ke-note {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
}
.ke-note:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-brand-1);
}

.ke-note-name {
  line-height: 1.5;
}

.empty-hint {
  padding: 24px;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 14px;
}
.empty-hint code {
  background: var(--vp-c-bg-mute);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 13px;
}
</style>
