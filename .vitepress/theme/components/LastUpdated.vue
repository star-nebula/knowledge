<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()

const formattedTime = computed(() => {
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
  <div v-if="formattedTime" class="last-updated" text="sm zinc-400 dark:zinc-500" mb-4>
    最后更新：{{ formattedTime }}
  </div>
</template>
