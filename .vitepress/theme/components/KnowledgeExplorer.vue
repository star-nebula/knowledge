<script setup lang="ts">
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'

// 与 NoteExplorer 同理：构建期通过 Vite glob 自动发现 vault/Knowledge 下全部 .md，
// 读取每篇笔记的 `category` frontmatter，构建多级分类树。
// 关键差异：按 category 多级树渲染（而非按文件夹），且链接用显式路径
// /vault/Knowledge/... 走 VitePress 路由，完全不经过 nolebase 的裸名解析，
// 从根本上规避「同名撞车 / 命名对不上」导致的 [[ ]] 死链。
defineOptions({ name: 'KnowledgeExplorer' })

interface NoteEntry {
  name: string
  path: string
}
interface Branch {
  name: string
  children: Branch[]
  notes: NoteEntry[]
}

// 直接读原始文本（?raw），仅解析 frontmatter 中的 category 数组，避免 eager 导入整篇编译产物。
const modules = import.meta.glob('/vault/Knowledge/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function parseCategory(raw: string): string[] {
  const m = raw.match(/category:\s*\[([^\]]*)\]/)
  if (!m)
    return []
  return m[1]
    .split(',')
    .map(s => s.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, 'zh-Hans-CN', { numeric: true })
}

function buildRoots(): Branch[] {
  const roots: Branch[] = []

  const ensureChild = (parent: Branch, name: string): Branch => {
    let child = parent.children.find(c => c.name === name)
    if (!child) {
      child = { name, children: [], notes: [] }
      parent.children.push(child)
    }
    return child
  }

  for (const [path, raw] of Object.entries(modules)) {
    if (path.includes('/_mocs/'))
      continue
    const cats = parseCategory(raw)
    if (cats.length === 0)
      continue

    // 在 roots 中找/建根分类
    let branch = roots.find(r => r.name === cats[0])
    if (!branch) {
      branch = { name: cats[0], children: [], notes: [] }
      roots.push(branch)
    }
    // 逐层 descend，把子分类挂到父的 children 上
    for (let i = 1; i < cats.length; i++)
      branch = ensureChild(branch, cats[i])

    // 文件名可能含 `%`（如 `300%法则.md`）。把 `%` 预编码为 `%25`，
    // 浏览器/Vue Router 解码后还原为 `%`，与 VitePress 路由匹配一致。
    const baseName = path.split('/').pop()!.replace(/\.md$/, '')
    const notePath = path.replace(/\.md$/, '').replace(/%/g, '%25')
    branch.notes.push({ name: baseName, path: notePath })
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
const open = ref(depth.value < 1)
</script>

<template>
  <!-- 入口模式：<KnowledgeExplorer /> 无 node prop → 渲染全部根分类 -->
  <div v-if="!node" class="knowledge-explorer">
    <KnowledgeExplorer v-for="b in roots" :key="b.name" :node="b" :depth="0" />
    <div v-if="roots.length === 0" class="empty-hint">
      暂无知识库分类，给笔记加上 <code>category</code> frontmatter 后即可自动显示。
    </div>
  </div>

  <!-- 分支模式：递归渲染单个分类节点 -->
  <div v-else class="ke-branch">
    <div
      class="ke-header"
      :style="{ paddingLeft: depth * 16 + 12 + 'px' }"
      @click="open = !open"
    >
      <span class="ke-chevron" :class="{ open }">▶</span>
      <span class="ke-name">{{ node.name }}</span>
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

.ke-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: background 0.12s;
}
.ke-note:hover .ke-dot {
  background: var(--vp-c-brand-1);
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
