<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
// 字数映射由 config.ts 的 virtual:words-count 插件在构建期生成（约 10KB）。
// 早先这里 import 'virtual:nolebase-page-properties' 只为取 wordsCount，
// 却把全部页面原文（2.9MB）打进了首屏 theme chunk，故改为读这份精简映射。
// @ts-expect-error 虚拟模块由 .vitepress/config.ts 的 vite 插件提供
import wordsMap from 'virtual:words-count'

const { page, frontmatter } = useData()

// Tags
const tags = computed(() => {
  const fmTags = frontmatter.value.tags
  if (Array.isArray(fmTags)) return fmTags
  if (typeof fmTags === 'string') return [fmTags]
  return []
})

// 字数：按页面 filePath 查构建期生成的映射（key 形如 /vault/blog/作坊/index.md）
const wordsCount = computed(() => {
  const fp = page.value.filePath
  if (!fp)
    return 0
  return (wordsMap as Record<string, number>)[`/${fp}`] ?? 0
})

// Last updated
const lastUpdated = computed(() => {
  const ts = page.value.lastUpdated
  if (!ts) return ''
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
})
</script>

<template>
  <div v-if="tags.length || wordsCount || lastUpdated" class="page-meta" text="sm zinc-400 dark:zinc-500" mb-4 flex="~ wrap" items-center gap-3>
    <!-- Last Updated -->
    <span v-if="lastUpdated" class="meta-item" flex items-center gap-1>
      <span i-icon-park-outline:time />
      <span>{{ lastUpdated }}</span>
    </span>

    <!-- Word Count -->
    <span v-if="wordsCount" class="meta-item" flex items-center gap-1>
      <span i-icon-park-outline:add-text />
      <span>{{ wordsCount }} 字</span>
    </span>

    <!-- Tags -->
    <template v-if="tags.length">
      <span class="meta-item" flex items-center gap-1>
        <span i-icon-park-outline:tag-one />
      </span>
      <span
        v-for="(tag, i) in tags"
        :key="i"
        class="meta-tag"
        bg="zinc-100 dark:zinc-800"
        px-1.5 py-0.5 rounded
        text="xs"
      >{{ tag }}</span>
    </template>
  </div>
</template>

<style scoped>
.page-meta {
  line-height: 1.6;
}
.meta-item {
  white-space: nowrap;
}
.meta-tag {
  border: 1px solid var(--vp-c-divider-light);
}
</style>
