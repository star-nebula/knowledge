<script setup lang="ts">
import { useRoute } from 'vitepress'
import { onMounted, watch } from 'vue'

/**
 * 站点访问统计（2026-09-14）
 * - 不蒜子：免注册计数，页脚展示「总访问量 / 访客数 / 本页访问」；脚本挂载失败时静默隐藏
 * - 51LA v6：后台分析，脚本在 head.ts，ck 号见 head.ts 内注释
 */
const route = useRoute()

// 不蒜子是按「脚本加载时刻的 URL」回填的，VitePress 是 SPA，
// 路由切换后需重挂脚本；span 一直渲染，脚本会自动往里填数。
function loadBusuanzi() {
  if (typeof window === 'undefined') return
  const id = 'busuanzi-script'
  document.getElementById(id)?.remove()
  const s = document.createElement('script')
  s.id = id
  s.async = true
  s.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
  s.onerror = () => {
    document.querySelectorAll('.site-stats').forEach(el => ((el as HTMLElement).style.display = 'none'))
  }
  document.head.appendChild(s)
}

onMounted(loadBusuanzi)
watch(() => route.path, loadBusuanzi)
</script>

<template>
  <div class="site-stats" aria-label="站点访问统计">
    <span class="stat-item">👁 本站总访问 <span id="busuanzi_value_site_pv" class="stat-num" /> 次</span>
    <span class="stat-sep">·</span>
    <span class="stat-item">访客 <span id="busuanzi_value_site_uv" class="stat-num" /> 人</span>
    <span class="stat-sep">·</span>
    <span class="stat-item">本页 <span id="busuanzi_value_page_pv" class="stat-num" /> 次</span>
  </div>
</template>

<style scoped>
.site-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin-top: 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.stat-num { font-weight: 600; color: var(--vp-c-text-1); }
.stat-sep { opacity: 0.5; }
</style>
