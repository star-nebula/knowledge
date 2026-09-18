<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

/**
 * 站点访问统计（2026-09-14 落地，2026-09-18 去掉「本页」）
 * - 不蒜子：免注册计数；只展示站点级「总访问 / 访客」（site_pv / site_uv）
 * - 去掉「本页」（page_pv）：不蒜子按「脚本加载时刻」计数，SPA 路由切换重挂脚本会让
 *   同一页反复 +1（实测「反复进入同一页，本页次数连续上涨」），页面级数字不可信。
 * - 51LA v6：后台分析，脚本在 head.ts，ck 号见 head.ts 内注释
 * 用法：<SiteStats />（挂 doc-footer-before）；主页简版由 HomePage.vue 内引用
 */
const route = useRoute()

// 不蒜子按「脚本加载时刻的 URL」回填 site 级数字；SPA 路由切换后重挂脚本刷新数值。
// 站点级（site_pv/site_uv）按站点统计，不随路由虚增；「本页」已移除。
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
  </div>
</template>

<style scoped>
.site-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.site-stats.home-stats { margin-top: 0; }
.stat-num { font-weight: 600; color: var(--vp-c-text-1); }
.stat-sep { opacity: 0.5; }
</style>
