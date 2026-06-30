<script setup lang="ts">
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'

interface FileEntry {
  name: string
  displayName: string
  path: string
  isIndex: boolean
}

interface FolderEntry {
  name: string
  files: FileEntry[]
}

// Auto-discover all markdown files at build time via Vite glob
const allModules = import.meta.glob('/zh-CN/笔记/**/*.md')
const allPaths = Object.keys(allModules)

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, 'zh-Hans-CN', { numeric: true })
}

function stripNumberPrefix(name: string): string {
  return name.replace(/^\d+[-_]\s*/, '')
}

function buildTree(): FolderEntry[] {
  const folderMap = new Map<string, FileEntry[]>()

  for (const filePath of allPaths) {
    const relative = filePath.replace('/zh-CN/笔记/', '')
    const slashIdx = relative.indexOf('/')
    if (slashIdx === -1) continue

    const folderName = relative.slice(0, slashIdx)
    const fileName = relative.slice(slashIdx + 1)
    if (!fileName.endsWith('.md')) continue

    const baseName = fileName.replace(/\.md$/, '')
    const isIndex = baseName === 'index'

    if (!folderMap.has(folderName)) folderMap.set(folderName, [])

    folderMap.get(folderName)!.push({
      name: baseName,
      displayName: stripNumberPrefix(baseName),
      path: isIndex
        ? `/zh-CN/笔记/${folderName}/`
        : `/zh-CN/笔记/${folderName}/${baseName}`,
      isIndex,
    })
  }

  const entries = [...folderMap.entries()]
  entries.sort((a, b) => naturalSort(a[0], b[0]))

  return entries.map(([name, files]) => {
    files.sort((a, b) => {
      if (a.isIndex) return -1
      if (b.isIndex) return 1
      return naturalSort(a.name, b.name)
    })
    return { name, files }
  })
}

const tree = computed(() => buildTree())
const expanded = ref<Record<string, boolean>>({})

function toggle(folderName: string) {
  expanded.value[folderName] = !expanded.value[folderName]
}
function isOpen(folderName: string) {
  return !!expanded.value[folderName]
}
</script>

<template>
  <div class="note-explorer">
    <div
      v-for="folder in tree"
      :key="folder.name"
      class="folder-card"
    >
      <div class="folder-header" @click="toggle(folder.name)">
        <span class="folder-chevron" :class="{ open: isOpen(folder.name) }">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <a
          :href="withBase(folder.files.find(f => f.isIndex)?.path || `/zh-CN/笔记/${folder.name}/`)"
          class="folder-name"
          @click.stop
        >
          {{ folder.name }}
        </a>
        <span class="folder-count">
          {{ folder.files.filter(f => !f.isIndex).length }} 篇
        </span>
      </div>

      <Transition name="folder-slide">
        <div v-show="isOpen(folder.name)" class="folder-files">
          <a
            v-for="file in folder.files.filter(f => !f.isIndex)"
            :key="file.path"
            :href="withBase(file.path)"
            class="file-link"
          >
            <span class="file-dot" />
            <span class="file-name">{{ file.displayName }}</span>
          </a>
        </div>
      </Transition>
    </div>

    <div v-if="tree.length === 0" class="empty-hint">
      暂无笔记分类，在 <code>zh-CN/笔记/</code> 下创建文件夹即可自动显示。
    </div>
  </div>
</template>

<style scoped>
.note-explorer {
  margin-top: 16px;
}

/* ---- Folder Card ---- */
.folder-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s;
}
.folder-card:hover {
  border-color: var(--vp-c-brand-1);
}

/* ---- Folder Header ---- */
.folder-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}
.folder-header:hover {
  background: var(--vp-c-bg-mute);
}

/* ---- Chevron ---- */
.folder-chevron {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-3);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}
.folder-chevron.open {
  transform: rotate(90deg);
}

/* ---- Folder Name ---- */
.folder-name {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.15s;
}
.folder-name:hover {
  color: var(--vp-c-brand-1);
}

/* ---- Folder File Count ---- */
.folder-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

/* ---- Expanded Files ---- */
.folder-files {
  border-top: 1px solid var(--vp-c-divider);
  padding: 4px 0;
}

.file-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 40px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
}
.file-link:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-brand-1);
}

.file-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: background 0.12s;
}
.file-link:hover .file-dot {
  background: var(--vp-c-brand-1);
}

.file-name {
  line-height: 1.5;
}

/* ---- Empty State ---- */
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

/* ---- Slide Transition ---- */
.folder-slide-enter-active,
.folder-slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.folder-slide-enter-from,
.folder-slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.folder-slide-enter-to,
.folder-slide-leave-from {
  opacity: 1;
  max-height: 800px;
}
</style>
