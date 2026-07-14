<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'

interface Project {
  id: number
  title: string
  period: string
  tags: string[]
  metric: string
  details: { pain: string; solution: string; result: string; difficulty: string }
  link: string
}
interface TechTag { name: string; group: string; tooltip: string; link?: string }
interface TimelineItem { period: string; title: string; org: string; desc: string; link?: string; linkText?: string }

const title = '刘昊晴 · AI应用开发工程师'
const tagline = '多Agent编排 / RAG全链路 / LLM工程化'
const summary = '电商场景AI解决方案落地，从0到1构建多Agent选品与智能客服系统'
const bioShort = '25届本科毕业生，专注AI应用开发，有电商AI产品线落地经验，擅长多Agent系统、RAG pipeline和LLM工程化。'
const bioFull = '25届本科毕业生，人工智能专业。专注于电商场景AI解决方案落地，从0到1主导了多Agent选品简报系统、电商智能客服RAG系统、商品短文本分类模型轻量化等核心项目，在多Agent编排、RAG全链路优化、模型部署推理等方面积累了丰富的工程实践经验。'

const contacts = [
  { icon: '📞', value: '13392786414', copyable: true },
  { icon: '📧', value: '13392786414@163.com', copyable: true },
  { icon: '🐙', value: 'GitHub', link: 'https://github.com/star-nebula/knowledge', external: true },
  { icon: '📝', value: 'CSDN', link: 'https://blog.csdn.net/qq_69608018?type=blog', external: true },
]
const timeline: TimelineItem[] = [
  { period: '2024.08 - 2026.05', title: 'AI应用开发工程师', desc: '负责电商AI产品线，主导3个核心项目落地', link: '#core-projects', linkText: '跳转查看关联项目' },
  { period: '2021.09 - 2025.06', title: '人工智能（本科）', desc: '主修NLP、深度学习、大模型应用开发', link: '/vault/笔记/', linkText: '跳转知识库学习笔记' },
]
const techTags: TechTag[] = [
  { name: 'LangGraph', group: 'llm', tooltip: '电商选品多Agent编排框架，实现8阶段Agent工作流', link: '/vault/笔记/🤖 AI应用开发/LangChain Agents 组件' },
  { name: 'DeepSeek', group: 'llm', tooltip: '核心推理模型，用于选品分析、客服意图识别', link: '/vault/笔记/🤖 AI应用开发/DeepSeek' },
  { name: 'ReAct', group: 'llm', tooltip: 'Agent推理范式，实现工具调用与思维链推理', link: '/vault/笔记/🤖 AI应用开发/LangChain Agents 组件' },
  { name: 'vLLM', group: 'llm', tooltip: '本地模型推理部署框架，支撑14B模型低延迟服务', link: '/vault/笔记/🤖 AI应用开发/大模型-知识扩展' },
  { name: 'LoRA', group: 'llm', tooltip: '模型微调技术，用于垂直领域模型适配', link: '/vault/笔记/🤖 AI应用开发/大模型-基础' },
  { name: 'MCP', group: 'llm', tooltip: 'Model Context Protocol，多Agent上下文通信协议', link: '/vault/笔记/🤖 AI应用开发/n8n AI Agent 工作流' },
  { name: 'PyTorch', group: 'nlp', tooltip: '深度学习框架，模型训练与推理核心工具', link: '/vault/笔记/🤖 AI应用开发/深度学习-核心工具' },
  { name: 'BERT', group: 'nlp', tooltip: '预训练模型，商品短文本分类基座模型', link: '/vault/笔记/🤖 AI应用开发/Transformer' },
  { name: '模型压缩', group: 'nlp', tooltip: '量化/蒸馏/剪枝三路线，399MB到8MB体积压缩', link: '/vault/笔记/🤖 AI应用开发/AI全景概览' },
  { name: 'HuggingFace', group: 'nlp', tooltip: '模型仓库与推理工具链', link: '/vault/笔记/🤖 AI应用开发/LangChain Models 组件' },
  { name: 'FastText', group: 'nlp', tooltip: '轻量化文本分类兜底方案', link: '/vault/笔记/🤖 AI应用开发/NLP-文本预处理' },
  { name: 'Milvus', group: 'eng', tooltip: '电商RAG知识库向量存储，支撑1000+条目混合检索', link: '/vault/笔记/🤖 AI应用开发/Milvus 向量数据库' },
  { name: 'Redis', group: 'eng', tooltip: '三级缓存实现，缓存命中率60%+', link: '/vault/笔记/🛠️ 工程工具/Redis 核心概念' },
  { name: 'FastAPI', group: 'eng', tooltip: 'API服务框架，支撑高并发接口请求' },
  { name: 'MySQL', group: 'eng', tooltip: '业务数据持久化存储', link: '/vault/笔记/🛠️ 工程工具/MySQL 数据库基础' },
  { name: 'Docker', group: 'eng', tooltip: '容器化部署，实现环境一致性', link: '/vault/笔记/🛠️ 工程工具/Docker' },
  { name: 'Streamlit', group: 'eng', tooltip: '快速Demo原型搭建，内部工具演示', link: '/vault/笔记/🛠️ 工程工具/Streamlit 入门' },
]
const tagGroups = [
  { key: 'llm', label: '大模型 & 多Agent' },
  { key: 'nlp', label: 'NLP & 深度学习' },
  { key: 'eng', label: '工程 & 工具' },
]
const projects: Project[] = [
  { id: 1, title: '电商每日精选选品简报系统（多Agent）', period: '2025.10 - 2026.05', tags: ['LangGraph','DeepSeek','ReAct','vLLM'], metric: '运营选品耗时 2h → 10min', details: { pain: '人工选品效率低、偏好难量化、跨批次重复推荐率高', solution: '八阶段多Agent编排架构 + ReAct推理循环 + 两级向量去重', result: '跨批次去重率92%+，偏好学习后命中率提升30%', difficulty: 'ReAct推理防死循环机制、去重召回率与精度平衡' }, link: '/vault/档案/电商选品简报系统-复盘笔记' },
  { id: 2, title: '电商智能客服问答系统（RAG）', period: '2024.12 - 2025.08', tags: ['Milvus','DeepSeek','Redis','vLLM'], metric: '意图准确率 95%+ / 缓存命中率 60%+', details: { pain: '传统客服回复慢、知识库更新滞后、数据隐私要求高', solution: '五层RAG分层架构 + 双路召回+重排 + 三级缓存 + vLLM本地部署', result: '响应延迟降低70%，人工介入率下降40%', difficulty: '长上下文召回精度优化、低延迟本地大模型部署' }, link: '/vault/档案/电商智能客服RAG系统-复盘笔记' },
  { id: 3, title: '商品短文本类目分类系统（模型轻量化）', period: '2024.08 - 2024.12', tags: ['PyTorch','BERT','模型压缩','FastText'], metric: '准确率 93.97% / 模型体积 399MB → 8MB', details: { pain: '大模型推理慢、部署成本高、边缘设备无法运行', solution: '三种压缩路线对比（量化/蒸馏/剪枝）+ FastText兜底', result: '分类耗时从3min降至秒级，模型体积压缩98%', difficulty: '精度与体积平衡、样本不均衡处理' }, link: '/vault/档案/商品短文本分类模型轻量化-复盘笔记' },
]

const displayedTitle = ref('')
const bioExpanded = ref(false)
const activeTag = ref<string | null>(null)
const expandedProjects = ref<Set<number>>(new Set())
const toastMessage = ref('')
const toastVisible = ref(false)
const sectionsVisible = ref<Record<string, boolean>>({})
const activeSection = ref('hero')
const activeTooltip = ref<string | null>(null)
const tooltipPos = ref({ x: 0, y: 0 })

const tocItems = [
  { id: 'hero', label: '个人简介' },
  { id: 'about', label: '关于我' },
  { id: 'tech-stack', label: '技术栈' },
  { id: 'core-projects', label: '核心项目' },
]

const filteredProjects = computed(() => !activeTag.value ? projects : projects.filter(p => p.tags.includes(activeTag.value)))
const tagsByGroup = (g: string) => techTags.filter(t => t.group === g)

let typeTimer: number | null = null
function typeTitle() {
  let i = 0
  typeTimer = window.setInterval(() => {
    if (i <= title.length) { displayedTitle.value = title.slice(0, i); i++ }
    else if (typeTimer) clearInterval(typeTimer)
  }, 60)
}
async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); showToast('已复制: ' + text) }
  catch { showToast('复制失败，请手动复制') }
}
function showToast(msg: string) {
  toastMessage.value = msg; toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 2000)
}
function toggleTag(n: string) { activeTag.value = activeTag.value === n ? null : n }
function toggleProject(id: number) { expandedProjects.value.has(id) ? expandedProjects.value.delete(id) : expandedProjects.value.add(id) }
function isProjectExpanded(id: number) { return expandedProjects.value.has(id) }
function scrollTo(sel: string) { document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' }) }
function onCardMove(e: MouseEvent) {
  const card = e.currentTarget as HTMLElement
  const r = card.getBoundingClientRect()
  const rx = ((e.clientY - r.top) / r.height - 0.5) * -8
  const ry = ((e.clientX - r.left) / r.width - 0.5) * 8
  card.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale3d(1.02,1.02,1.02)'
}
function onCardLeave(e: MouseEvent) { (e.currentTarget as HTMLElement).style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)' }

function updateActiveSection() {
  const sections = ['hero', 'about', 'tech-stack', 'core-projects']
  const navOffset = 120
  let current = 'hero'
  for (const id of sections) {
    const el = document.querySelector(`[data-section="${id}"]`) as HTMLElement | null
    if (el && el.getBoundingClientRect().top <= navOffset) {
      current = id
    }
  }
  activeSection.value = current
}

let scrollHandler: (() => void) | null = null
let observer: IntersectionObserver | null = null
function observeSections() {
  observer = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const id = (en.target as HTMLElement).dataset.section
      if (id && en.isIntersecting) sectionsVisible.value[id] = true
    })
  }, { threshold: 0.1 })
  document.querySelectorAll('[data-section]').forEach(el => observer!.observe(el))

  scrollHandler = updateActiveSection
  window.addEventListener('scroll', scrollHandler, { passive: true })
  updateActiveSection()
}
function showTip(tag: string, e: MouseEvent) {
  activeTooltip.value = tag
  const r = (e.target as HTMLElement).getBoundingClientRect()
  tooltipPos.value = { x: r.left + r.width / 2, y: r.top - 8 }
}
function hideTip() { activeTooltip.value = null }

onMounted(() => { typeTitle(); setTimeout(observeSections, 200) })
onUnmounted(() => {
  if (typeTimer) clearInterval(typeTimer)
  observer?.disconnect()
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
})
</script>
<template>
  <div class="pp-layout">
    <div class="pp-root">
    <Transition name="pp-toast">
      <div v-if="toastVisible" class="pp-toast">{{ toastMessage }}</div>
    </Transition>

    <section data-section="hero" class="pp-section pp-hero" :class="{ visible: sectionsVisible.hero }">
      <div class="pp-hero-grid">
        <div class="pp-hero-left">
          <h1 class="pp-hero-title">{{ displayedTitle }}<span class="pp-cursor">|</span></h1>
          <p class="pp-hero-tagline">{{ tagline }}</p>
          <p class="pp-hero-summary">{{ summary }}</p>
          <div class="pp-actions">
            <button class="pp-btn pp-btn-primary" @click="scrollTo('#core-projects')">🔍 查看核心项目</button>
          </div>
        </div>
        <div class="pp-hero-right">
          <div class="pp-contact-card">
            <h3 class="pp-contact-title">联系方式</h3>
            <div class="pp-contact-list">
              <div v-for="c in contacts" :key="c.value" class="pp-contact-item">
                <span class="pp-contact-icon">{{ c.icon }}</span>
                <a v-if="c.link && c.external" :href="c.link" target="_blank" class="pp-contact-value pp-link">{{ c.value }}</a>
                <a v-else-if="c.link" :href="withBase(c.link)" class="pp-contact-value pp-link">{{ c.value }}</a>
                <span v-else class="pp-contact-value">{{ c.value }}</span>
                <button v-if="c.copyable" class="pp-copy-btn" @click="copyText(c.value)" title="复制">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section data-section="about" id="about" class="pp-section pp-about" :class="{ visible: sectionsVisible.about }">
      <h2 class="pp-section-title">关于我</h2>
      <div class="pp-about-grid">
        <div class="pp-info-card">
          <div class="pp-avatar">
            <img :src="withBase('/avatar.png')" alt="刘昊晴头像" class="pp-avatar-img" @error="(e: Event) => { (e.target as HTMLImageElement).src = withBase('/avatar.svg') }" />
          </div>
          <div class="pp-info-list">
            <div class="pp-info-item"><span class="pp-info-label">毕业届别</span><span class="pp-info-value">25届本科</span></div>
            <div class="pp-info-item"><span class="pp-info-label">专业</span><span class="pp-info-value">人工智能</span></div>
            <div class="pp-info-item"><span class="pp-info-label">求职意向</span><span class="pp-info-value">AI应用开发工程师</span></div>
          </div>
        </div>
        <div class="pp-about-content">
          <div class="pp-bio-box">
            <p class="pp-bio-text">{{ bioExpanded ? bioFull : bioShort }}</p>
            <button class="pp-expand-btn" @click="bioExpanded = !bioExpanded">
              {{ bioExpanded ? '收起' : '展开查看完整介绍' }}
              <span class="pp-chevron" :class="{ up: bioExpanded }">›</span>
            </button>
          </div>
          <div class="pp-timeline">
            <div v-for="(item, idx) in timeline" :key="idx" class="pp-timeline-item">
              <div class="pp-timeline-dot"></div>
              <div class="pp-timeline-content">
                <div class="pp-timeline-period">{{ item.period }}</div>
                <div class="pp-timeline-title">{{ item.title }}  {{ item.org }}</div>
                <div class="pp-timeline-desc">{{ item.desc }}</div>
                <a v-if="item.link" :href="item.link.startsWith('#') ? item.link : withBase(item.link)" class="pp-timeline-link"
                  @click="item.link.startsWith('#') ? (e) => { e.preventDefault(); scrollTo(item.link) } : null">
                  {{ item.linkText }} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section data-section="tech-stack" id="tech-stack" class="pp-section pp-tech" :class="{ visible: sectionsVisible['tech-stack'] }">
      <h2 class="pp-section-title">技术栈</h2>
      <div v-if="activeTag" class="pp-filter-hint">
        当前筛选: <span class="pp-filter-tag">{{ activeTag }}</span>
        <button class="pp-clear-filter" @click="activeTag = null">✕ 清除</button>
      </div>
      <div class="pp-tech-groups">
        <div v-for="g in tagGroups" :key="g.key" class="pp-tech-group">
          <h3 class="pp-tech-group-title">{{ g.label }}</h3>
          <div class="pp-tag-row">
            <template v-for="tag in tagsByGroup(g.key)" :key="tag.name">
              <a v-if="tag.link"
                :href="withBase(tag.link)"
                class="pp-tech-tag pp-tech-tag-link"
                :class="{ dimmed: activeTag && activeTag !== tag.name }"
                @mouseenter="showTip(tag.name, $event)" @mouseleave="hideTip">
                {{ tag.name }}
                <span class="pp-tag-arrow">→</span>
              </a>
              <button v-else
                class="pp-tech-tag" :class="{ active: activeTag === tag.name, dimmed: activeTag && activeTag !== tag.name }"
                @click="toggleTag(tag.name)" @mouseenter="showTip(tag.name, $event)" @mouseleave="hideTip">{{ tag.name }}</button>
            </template>
          </div>
        </div>
      </div>
    </section>

    <Transition name="pp-tooltip">
      <div v-if="activeTooltip" class="pp-tag-tooltip" :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }">
        {{ techTags.find(t => t.name === activeTooltip)?.tooltip }}
      </div>
    </Transition>

    <section data-section="core-projects" id="core-projects" class="pp-section pp-projects" :class="{ visible: sectionsVisible['core-projects'] }">
      <h2 class="pp-section-title">核心项目</h2>
      <div class="pp-projects-grid">
        <div v-for="p in filteredProjects" :key="p.id" class="pp-project-card" :class="{ expanded: isProjectExpanded(p.id) }"
          @mousemove="onCardMove" @mouseleave="onCardLeave" @click="toggleProject(p.id)">
          <div class="pp-card-header">
            <h3 class="pp-project-title">{{ p.title }}</h3>
            <div class="pp-project-period">{{ p.period }}</div>
          </div>
          <div class="pp-project-tags">
            <span v-for="t in p.tags" :key="t" class="pp-project-tag" :class="{ match: activeTag === t }">{{ t }}</span>
          </div>
          <div class="pp-project-metric">{{ p.metric }}</div>
          <Transition name="pp-expand">
            <div v-show="isProjectExpanded(p.id)" class="pp-project-details">
              <div class="pp-detail-row"><span class="pp-detail-label">痛点</span><span class="pp-detail-value">{{ p.details.pain }}</span></div>
              <div class="pp-detail-row"><span class="pp-detail-label">方案</span><span class="pp-detail-value">{{ p.details.solution }}</span></div>
              <div class="pp-detail-row"><span class="pp-detail-label">成果</span><span class="pp-detail-value">{{ p.details.result }}</span></div>
              <div class="pp-detail-row"><span class="pp-detail-label">难点</span><span class="pp-detail-value">{{ p.details.difficulty }}</span></div>
              <a :href="withBase(p.link)" class="pp-project-link" @click.stop>查看项目复盘笔记 →</a>
            </div>
          </Transition>
          <div class="pp-card-hint">{{ isProjectExpanded(p.id) ? '点击收起' : '点击展开详情' }}</div>
        </div>
      </div>
    </section>
    </div>
    <nav class="pp-toc">
      <div class="pp-toc-inner">
        <div class="pp-toc-title"></div>
        <ul class="pp-toc-list">
          <li v-for="item in tocItems" :key="item.id">
            <a
              href="#"
              class="pp-toc-link"
              :class="{ active: activeSection === item.id }"
              @click.prevent="scrollTo('#' + item.id)"
            >{{ item.label }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.pp-layout { max-width: 80%; margin: 0 auto; display: grid; grid-template-columns: 1fr 180px; gap: 32px; padding: 0 24px; position: relative; }
.pp-root { min-width: 0; }

/* Right TOC */
.pp-toc { position: relative; }
.pp-toc-inner { position: sticky; top: 80px; padding: 16px 0; border-left: 1px solid var(--vp-c-divider); }
.pp-toc-title { font-size: 12px; font-weight: 600; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; padding-left: 16px; }
.pp-toc-list { list-style: none; margin: 0; padding: 0; }
.pp-toc-link { display: block; padding: 6px 0 6px 16px; font-size: 13px; color: var(--vp-c-text-3); text-decoration: none; border-left: 2px solid transparent; margin-left: -1px; transition: all 0.2s ease; line-height: 1.5; }
.pp-toc-link:hover { color: var(--vp-c-text-1); }
.pp-toc-link.active { color: var(--vp-c-brand-1); border-left-color: var(--vp-c-brand-1); font-weight: 500; }
.pp-toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); background: var(--vp-c-brand-1); color: #fff; padding: 10px 20px; border-radius: 8px; font-size: 14px; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
.pp-toast-enter-active, .pp-toast-leave-active { transition: all 0.3s ease; }
.pp-toast-enter-from, .pp-toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }
.pp-section { padding: 40px 0; opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
.pp-section.visible { opacity: 1; transform: translateY(0); }
.pp-section-title { font-size: 28px; font-weight: 700; color: var(--vp-c-text-1); margin-bottom: 32px; padding-bottom: 12px; }

.pp-hero-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 48px; align-items: center; min-height: auto; }
.pp-hero-title { font-size: 42px; font-weight: 700; color: var(--vp-c-text-1); margin-bottom: 16px; line-height: 1.3; }
.pp-cursor { color: var(--vp-c-brand-1); animation: pp-blink 1s step-end infinite; }
@keyframes pp-blink { 50% { opacity: 0; } }
.pp-hero-tagline { font-size: 18px; color: var(--vp-c-brand-1); font-weight: 500; margin-bottom: 12px; }
.pp-hero-summary { font-size: 15px; color: var(--vp-c-text-2); line-height: 1.8; margin-bottom: 28px; }
.pp-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.pp-btn { padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s ease; display: inline-flex; align-items: center; text-decoration: none; line-height: 1.4; }
.pp-btn-primary { background: var(--vp-c-brand-1); color: #fff; }
.pp-btn-primary:hover { background: var(--vp-c-brand-2); transform: translateY(-1px); }
.pp-btn-ghost { background: transparent; color: var(--vp-c-text-1); border: 1px solid var(--vp-c-divider); }
.pp-btn-ghost:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

.pp-contact-card { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 24px; background: var(--vp-c-bg-soft); }
.pp-contact-title { font-size: 16px; font-weight: 600; color: var(--vp-c-text-1); margin-bottom: 16px; }
.pp-contact-list { display: flex; flex-direction: column; gap: 12px; }
.pp-contact-item { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.pp-contact-icon { font-size: 16px; flex-shrink: 0; width: 20px; text-align: center; }
.pp-contact-value { flex: 1; color: var(--vp-c-text-2); font-family: monospace; }
.pp-link { color: var(--vp-c-brand-1); text-decoration: none; transition: color 0.2s; }
.pp-link:hover { text-decoration: underline; }
.pp-copy-btn { background: transparent; border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 4px 6px; cursor: pointer; color: var(--vp-c-text-3); transition: all 0.2s; display: flex; align-items: center; }
.pp-copy-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

.pp-about-grid { display: grid; grid-template-columns: 280px 1fr; gap: 32px; align-items: start; }
.pp-info-card { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 24px; background: var(--vp-c-bg-soft); display: flex; flex-direction: column; align-items: center; text-align: center; }
.pp-avatar { width: 120px; height: 120px; margin: 0 0 20px; border-radius: 50%; overflow: hidden; border: 3px solid var(--vp-c-brand-1); box-shadow: 0 4px 16px rgba(0,0,0,0.15); flex-shrink: 0; display: flex; align-items: center; justify-content: center; line-height: 0; }
.dark .pp-avatar { box-shadow: 0 4px 16px rgba(0,0,0,0.4); }
.pp-avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; margin: 0 !important; border-radius: 50%; }
.pp-info-list { display: flex; flex-direction: column; gap: 12px; width: 100%; align-items: center; }
.pp-info-item { display: flex; flex-direction: column; gap: 4px; align-items: center; }
.pp-info-label { font-size: 12px; color: var(--vp-c-text-3); }
.pp-info-value { font-size: 14px; color: var(--vp-c-text-1); font-weight: 500; text-align: center; }
.pp-bio-box { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 20px 24px; background: var(--vp-c-bg-soft); margin-bottom: 24px; }
.pp-bio-text { font-size: 14px; color: var(--vp-c-text-2); line-height: 1.8; margin: 0 0 12px; }
.pp-expand-btn { background: none; border: none; color: var(--vp-c-brand-1); font-size: 13px; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 4px; }
.pp-chevron { display: inline-block; transition: transform 0.2s; font-size: 16px; }
.pp-chevron.up { transform: rotate(-90deg); }

.pp-timeline { position: relative; padding-left: 28px; }
.pp-timeline::before { content: ''; position: absolute; left: 5px; top: 4px; bottom: 4px; width: 2px; background: var(--vp-c-divider); }
.pp-timeline-item { position: relative; margin-bottom: 28px; }
.pp-timeline-item:last-child { margin-bottom: 0; }
.pp-timeline-dot { position: absolute; left: -28px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: var(--vp-c-brand-1); border: 2px solid var(--vp-c-bg); box-shadow: 0 0 0 2px var(--vp-c-brand-1); }
.pp-timeline-period { font-size: 13px; color: var(--vp-c-text-3); margin-bottom: 4px; }
.pp-timeline-title { font-size: 16px; font-weight: 600; color: var(--vp-c-text-1); margin-bottom: 6px; }
.pp-timeline-desc { font-size: 14px; color: var(--vp-c-text-2); line-height: 1.6; margin-bottom: 8px; }
.pp-timeline-link { font-size: 13px; color: var(--vp-c-brand-1); text-decoration: none; }
.pp-timeline-link:hover { text-decoration: underline; }

.pp-filter-hint { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--vp-c-text-2); margin-bottom: 20px; }
.pp-filter-tag { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); padding: 2px 10px; border-radius: 4px; font-size: 13px; }
.pp-clear-filter { background: none; border: none; color: var(--vp-c-text-3); font-size: 13px; cursor: pointer; }
.pp-clear-filter:hover { color: var(--vp-c-brand-1); }
.pp-tech-groups { display: flex; flex-direction: column; gap: 24px; }
.pp-tech-group-title { font-size: 15px; font-weight: 600; color: var(--vp-c-text-1); margin-bottom: 12px; }
.pp-tag-row { display: flex; flex-wrap: wrap; gap: 8px; }
.pp-tech-tag { padding: 6px 16px; border-radius: 20px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; }
.pp-tech-tag:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.pp-tech-tag.active { background: var(--vp-c-brand-1); color: #fff; border-color: var(--vp-c-brand-1); }
.pp-tech-tag.dimmed { opacity: 0.4; }
.pp-tech-tag-link { cursor: pointer; }
.pp-tech-tag-link:hover { background: var(--vp-c-brand-soft); }
.pp-tag-arrow { font-size: 11px; opacity: 0; transition: opacity 0.2s; }
.pp-tech-tag-link:hover .pp-tag-arrow { opacity: 1; }

.pp-tag-tooltip { position: fixed; transform: translateX(-50%) translateY(-100%); background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); padding: 8px 14px; border-radius: 6px; font-size: 12px; border: 1px solid var(--vp-c-divider); max-width: 260px; z-index: 9998; box-shadow: 0 4px 12px rgba(0,0,0,0.1); pointer-events: none; }
.pp-tooltip-enter-active, .pp-tooltip-leave-active { transition: opacity 0.15s; }
.pp-tooltip-enter-from, .pp-tooltip-leave-to { opacity: 0; }

.pp-projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.pp-project-card { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 24px; background: var(--vp-c-bg-soft); cursor: pointer; transition: box-shadow 0.3s ease, transform 0.15s ease; transform-style: preserve-3d; will-change: transform; position: relative; }
.pp-project-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
.dark .pp-project-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
.pp-card-header { margin-bottom: 12px; }
.pp-project-title { font-size: 16px; font-weight: 600; color: var(--vp-c-text-1); margin: 0 0 6px; line-height: 1.4; }
.pp-project-period { font-size: 12px; color: var(--vp-c-text-3); }
.pp-project-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.pp-project-tag { padding: 3px 10px; border-radius: 4px; background: var(--vp-c-bg-mute); color: var(--vp-c-text-2); font-size: 12px; }
.pp-project-tag.match { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.pp-project-metric { font-size: 20px; font-weight: 700; color: var(--vp-c-brand-1); margin-bottom: 12px; }
.pp-project-details { padding-top: 16px; border-top: 1px solid var(--vp-c-divider); }
.pp-detail-row { display: flex; gap: 8px; margin-bottom: 10px; font-size: 13px; line-height: 1.6; }
.pp-detail-label { flex-shrink: 0; color: var(--vp-c-text-3); font-weight: 500; min-width: 32px; }
.pp-detail-value { color: var(--vp-c-text-2); }
.pp-project-link { display: inline-block; margin-top: 12px; font-size: 13px; color: var(--vp-c-brand-1); text-decoration: none; }
.pp-project-link:hover { text-decoration: underline; }
.pp-card-hint { font-size: 12px; color: var(--vp-c-text-3); text-align: center; margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--vp-c-divider); }
.pp-expand-enter-active, .pp-expand-leave-active { transition: all 0.3s ease; overflow: hidden; }
.pp-expand-enter-from, .pp-expand-leave-to { opacity: 0; max-height: 0; }
.pp-expand-enter-to, .pp-expand-leave-from { opacity: 1; max-height: 500px; }

@media (max-width: 1024px) {
  .pp-layout { grid-template-columns: 1fr; padding: 0 24px; }
  .pp-toc { display: none; }
  .pp-projects-grid { grid-template-columns: repeat(2, 1fr); }
  .pp-hero-grid { grid-template-columns: 1fr; gap: 32px; min-height: auto; }
  .pp-about-grid { grid-template-columns: 1fr; }
}
@media (min-width: 641px) and (max-width: 1024px) {
  .pp-info-card { flex-direction: row; text-align: left; align-items: center; padding: 20px 24px; }
  .pp-avatar { width: 80px; height: 80px; margin: 0; }
  .pp-info-list { align-items: flex-start; }
  .pp-info-item { align-items: flex-start; }
  .pp-info-value { text-align: left; }
}
@media (max-width: 640px) {
  .pp-layout { padding: 0 16px; }
  .pp-section { padding: 32px 0; }
  .pp-hero-title { font-size: 28px; }
  .pp-section-title { font-size: 22px; margin-bottom: 20px; }
  .pp-hero { padding-top: 24px; }
  .pp-projects-grid { grid-template-columns: 1fr; gap: 16px; }
  .pp-project-metric { font-size: 17px; }
  .pp-project-card { padding: 20px; }
  .pp-info-card { flex-direction: column; text-align: center; align-items: center; }
  .pp-avatar { width: 100px; height: 100px; margin: 0 0 16px; }
  .pp-info-list { align-items: center; }
  .pp-info-item { align-items: center; }
  .pp-info-value { text-align: center; }
  .pp-contact-card { padding: 20px; }
  .pp-bio-box { padding: 16px 20px; }
}
</style>

<style>
.VPContent:has(.pp-layout),
.VPDoc:has(.pp-layout),
.VPDoc:has(.pp-layout) .container,
.VPDoc:has(.pp-layout) .content-container,
.VPDoc:has(.pp-layout) .content,
.VPDoc:has(.pp-layout) .main,
.VPDoc:has(.pp-layout) .doc-container,
.VPDoc:has(.pp-layout) .doc-content-container,
.vp-doc:has(.pp-layout),
.vp-doc:has(.pp-layout) > div {
  max-width: unset !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}
.vp-doc:has(.pp-layout) h1:first-of-type { display: none; }
.VPDoc:has(.pp-layout) .VPDocFooter { max-width: 1400px; margin: 32px auto 0; padding: 0 24px; }
.VPDoc:has(.pp-layout) .VPDocAside,
.VPDoc:has(.pp-layout) .aside-container,
.VPDoc:has(.pp-layout) .aside {
  display: none !important;
}
.VPDoc:has(.pp-layout) .main-container,
.VPDoc:has(.pp-layout) .content-container {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
