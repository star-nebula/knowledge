<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import pagePropertiesData from 'virtual:nolebase-page-properties'

const { page, frontmatter } = useData()

// Tags
const tags = computed(() => {
  const fmTags = frontmatter.value.tags
  if (Array.isArray(fmTags)) return fmTags
  if (typeof fmTags === 'string') return [fmTags]
  return []
})

// Word count from page properties virtual module
const wordsCount = computed(() => {
  const filePath = page.value.filePath?.toLowerCase()
  if (!filePath) return 0
  const data = (pagePropertiesData as Record<string, { wordsCount?: number }>)[filePath]
  return data?.wordsCount ?? 0
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
