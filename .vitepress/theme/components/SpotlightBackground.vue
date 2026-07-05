<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * 墨水扩散聚光灯 —— 鼠标移动如墨水滴落纸上向外洇开
 *
 * 核心机制：
 * 1. 墨滴系统：鼠标移动沿途生成墨滴，每个墨滴从中心向外扩散（洇开）
 * 2. 扩散缓动：ease-out-cubic，初始扩散快、逐渐减慢（模拟纸张吸墨）
 * 3. 硬边挖洞：墨滴中心完全透明显示壁纸，边缘窄过渡，无光晕
 * 4. 透明度衰减：扩散同时变淡，最终消失（墨水被纸张吸收）
 * 5. 文字染色：墨滴接触文字时，被覆盖的位置变黑
 *    - 在 .text / .tagline 上覆盖 canvas
 *    - canvas 先用原始颜色绘制文字（创建文字像素遮罩）
 *    - 再用 source-atop 合成黑色墨滴（只影响文字像素，透明区域完全无效果）
 *    - 隐藏 DOM 原文字，由 canvas 替代
 *    - 文字位置通过 Range API 直接读取 DOM 真实坐标，保证像素级一致
 */

const canvasRef = ref<HTMLCanvasElement | null>(null)

// ---- 主题感知 ----
/** 夜间遮罩色（与 CSS --home-bg 一致） */
const OVERLAY_DARK = '#161618'
/** 日间遮罩色 */
const OVERLAY_LIGHT = '#ffffff'

/** 当前是否夜间模式（VitePress 在 <html> 上加 .dark class） */
function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark')
}

/** 获取当前遮罩颜色 */
function getOverlayColor(): string {
  return isDarkMode() ? OVERLAY_DARK : OVERLAY_LIGHT
}

/** 获取墨水染色颜色（与遮罩同色，使被墨水覆盖的文字融入遮罩背景） */
function getInkDyeRGBA(opacity: number): string {
  return isDarkMode()
    ? `rgba(0,0,0,${opacity})`
    : `rgba(255,255,255,${opacity})`
}

// ---- 墨滴系统 ----
interface InkDrop {
  x: number
  y: number
  age: number        // 0 → 1（归一化年龄）
  maxRadius: number  // 最大扩散半径
}
let drops: InkDrop[] = []
let lastSpawnX = -9999
let lastSpawnY = -9999

// ---- 动画 ----
let animationId = 0
let W = 0
let H = 0
let inited = false

// ---- 可调参数（用户已调定，勿改）----
const SPAWN_DIST = 14       // 鼠标移动多远生成一个新墨滴（px）
const DROP_INIT_R = 15      // 墨滴初始半径
const DROP_MAX_R = 100      // 墨滴最大扩散半径（基准，会随机化）
const DROP_LIFESPAN = 100   // 墨滴寿命（帧，60fps ≈ 1.67s）
const DROP_OPACITY = 1.0    // 单个墨滴峰值不透明度（1 = 完全挖洞显示壁纸）

// ---- 文字染色 canvas ----
interface MeasuredChar {
  char: string
  x: number   // 相对于元素左上角的 x（CSS px）
  y: number   // 相对于元素左上角的 y（CSS px）
}
interface TextLayer {
  el: HTMLElement
  canvas: HTMLCanvasElement       // 覆盖在文字上的 canvas
  ctx: CanvasRenderingContext2D
  offscreen: HTMLCanvasElement    // 离屏缓存：预渲染的文字像素
  offscreenCtx: CanvasRenderingContext2D
  offsetX: number  // element left relative to hero
  offsetY: number  // element top relative to hero
  width: number
  height: number
  dpr: number
  originalColor: string
}
let textLayers: TextLayer[] = []
let textResizeObserver: ResizeObserver | null = null
let themeObserver: MutationObserver | null = null

function getHeroRect() {
  const hero = document.querySelector('.VPHomeHero') as HTMLElement
  if (!hero) return null
  return hero.getBoundingClientRect()
}

function resize() {
  const rect = getHeroRect()
  if (!rect) return
  const canvas = canvasRef.value
  if (!canvas) return
  W = rect.width
  H = rect.height
  canvas.width = W
  canvas.height = H
  inited = true
  updateTextLayerSizes()
}

function spawnDrop(x: number, y: number) {
  const maxR = DROP_MAX_R * (0.7 + Math.random() * 0.6)
  drops.push({ x, y, age: 0, maxRadius: maxR })
}

/** ease-out-cubic：开始快、结束慢 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * 用 Range API 直接读取 DOM 中每个字符的真实坐标。
 * 逐字符测量，不做行分组 —— 这样 canvas 绘制时每个字符都在 DOM 真实位置，
 * 完全不受 letter-spacing / 断行 / 字体度量差异影响。
 */
function measureTextChars(el: HTMLElement): MeasuredChar[] {
  const elRect = el.getBoundingClientRect()
  const chars: MeasuredChar[] = []

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    const textNode = node as Text
    const textContent = textNode.textContent || ''
    for (let i = 0; i < textContent.length; i++) {
      const range = document.createRange()
      range.setStart(textNode, i)
      range.setEnd(textNode, i + 1)
      const cr = range.getBoundingClientRect()
      if (cr.width === 0 && cr.height === 0) continue

      chars.push({
        char: textContent[i],
        x: cr.left - elRect.left,
        y: cr.top - elRect.top,
      })
    }
  }
  return chars
}

/**
 * 在离屏 canvas 上按 DOM 真实坐标逐字符渲染文字。
 * - 逐字符 fillText，每个字符在 DOM 中的精确 (x, y) 位置绘制
 * - 不设 letterSpacing（每个字符独立绘制，位置已包含字间距）
 * - textBaseline = 'top'，y 直接用 DOM 的 boundingRect.top
 * - 关键修复：range.getBoundingClientRect().top 返回的是 **line box 顶部**，
 *   而 canvas textBaseline='top' 对齐的是 **em square 顶部**。
 *   两者之间相差 half-leading = (lineHeight - fontSize) / 2。
 *   不加这个偏移，canvas 文字会比 DOM 原文字偏上。
 */
function renderTextToOffscreen(
  offscreen: HTMLCanvasElement,
  offscreenCtx: CanvasRenderingContext2D,
  el: HTMLElement,
  color: string,
  width: number,
  height: number,
  dpr: number
): void {
  // 重置 canvas 尺寸（会清空内容、重置 context state）
  offscreen.width = width * dpr
  offscreen.height = height * dpr
  offscreenCtx.scale(dpr, dpr)

  // 从计算样式获取字体
  const style = getComputedStyle(el)
  offscreenCtx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  offscreenCtx.fillStyle = color
  offscreenCtx.textBaseline = 'top'
  offscreenCtx.textAlign = 'left'

  // 计算 half-leading 偏移：
  // DOM rect.top = line box top
  // canvas textBaseline='top' = em square top = line box top + half-leading
  // half-leading = (lineHeight - fontSize) / 2
  const fontSize = parseFloat(style.fontSize)
  const lineHeightParsed = parseFloat(style.lineHeight)
  // line-height: normal 时 parseFloat 返回 NaN，此时 half-leading ≈ 0
  const leadingOffset = isNaN(lineHeightParsed) ? 0 : (lineHeightParsed - fontSize) / 2

  // 用 Range API 读取 DOM 真实坐标，逐字符绘制（y 加 leadingOffset 对齐 em square）
  const measuredChars = measureTextChars(el)
  for (const ch of measuredChars) {
    offscreenCtx.fillText(ch.char, ch.x, ch.y + leadingOffset)
  }
}

/** 从计算样式构建一个 TextLayer（不含 ink 绘制） */
function createTextLayer(el: HTMLElement, heroRect: DOMRect): TextLayer | null {
  const rect = el.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return null

  const dpr = window.devicePixelRatio || 1
  const width = rect.width
  const height = rect.height

  // ---- 创建可见 canvas ----
  const canvas = document.createElement('canvas')
  canvas.className = 'ink-text-canvas'
  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.pointerEvents = 'none'
  el.appendChild(canvas)
  canvas.width = width * dpr
  canvas.height = height * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  // ---- 创建离屏缓存 canvas ----
  const offscreen = document.createElement('canvas')
  const offscreenCtx = offscreen.getContext('2d')!

  // ---- 从计算样式获取颜色 ----
  const style = getComputedStyle(el)
  const color = style.color

  // ---- 在离屏 canvas 上按 DOM 真实坐标渲染文字 ----
  renderTextToOffscreen(offscreen, offscreenCtx, el, color, width, height, dpr)

  return {
    el, canvas, ctx, offscreen, offscreenCtx,
    offsetX: rect.left - heroRect.left,
    offsetY: rect.top - heroRect.top,
    width, height, dpr,
    originalColor: color,
  }
}

function setupTextLayers() {
  // 清理旧图层
  for (const layer of textLayers) {
    if (layer.canvas.parentNode) layer.canvas.parentNode.removeChild(layer.canvas)
    layer.el.style.color = layer.originalColor
  }
  textLayers = []

  const heroRect = getHeroRect()
  if (!heroRect) return

  const selectors = ['.VPHomeHero .text', '.VPHomeHero .tagline']
  for (const selector of selectors) {
    const el = document.querySelector(selector) as HTMLElement
    if (!el) continue
    const layer = createTextLayer(el, heroRect)
    if (layer) {
      textLayers.push(layer)
      // 隐藏 DOM 原文字（canvas 替代显示）
      el.style.color = 'transparent'
    }
  }

  // ResizeObserver：监听文字元素尺寸变化（含 CSS font-size 改动导致的布局变化）
  // 这样改 CSS 后 HMR 触发布局变化时，canvas 会自动重新读取字号并重渲染
  if (textResizeObserver) textResizeObserver.disconnect()
  textResizeObserver = new ResizeObserver(() => {
    updateTextLayerSizes()
  })
  for (const layer of textLayers) {
    textResizeObserver!.observe(layer.el)
  }
}

function updateTextLayerSizes() {
  if (textLayers.length === 0) return
  const heroRect = getHeroRect()
  if (!heroRect) return

  for (const layer of textLayers) {
    const rect = layer.el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue

    const dpr = window.devicePixelRatio || 1
    layer.width = rect.width
    layer.height = rect.height

    // 重置可见 canvas
    layer.canvas.width = rect.width * dpr
    layer.canvas.height = rect.height * dpr
    layer.ctx.scale(dpr, dpr)

    // 重新读取 CSS 中的颜色：先临时移除 inline color:transparent，
    // 这样 getComputedStyle 读到的是 CSS 样式表里定义的真实颜色
    const savedInlineColor = layer.el.style.color
    layer.el.style.color = ''
    const style = getComputedStyle(layer.el)
    const currentColor = style.color
    layer.originalColor = currentColor
    layer.el.style.color = 'transparent' // 恢复隐藏

    // 重新渲染离屏文字（也会重置 offscreen 尺寸、重新读取字号）
    renderTextToOffscreen(
      layer.offscreen, layer.offscreenCtx,
      layer.el, currentColor,
      rect.width, rect.height, dpr
    )

    layer.offsetX = rect.left - heroRect.left
    layer.offsetY = rect.top - heroRect.top
  }
}

function drawTextLayers() {
  for (const layer of textLayers) {
    const { ctx, offscreen, width, height, offsetX, offsetY } = layer

    // 1) 清空 + 从离屏缓存复制预渲染的文字
    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'
    ctx.drawImage(offscreen, 0, 0, width, height)

    // 2) source-atop：墨水染色只影响已有像素（文字），透明区域完全无效果
    //    染色颜色 = 遮罩色（夜间黑/日间白），使被覆盖文字融入遮罩背景
    //    数学保证：αo = αb，非文字区域 αb=0 → αo=0 → 永远透明
    ctx.globalCompositeOperation = 'source-atop'
    for (const d of drops) {
      const localX = d.x - offsetX
      const localY = d.y - offsetY
      const maxR = d.maxRadius
      if (localX + maxR < 0 || localX - maxR > width ||
          localY + maxR < 0 || localY - maxR > height) continue

      const t = d.age
      const radius = DROP_INIT_R + (d.maxRadius - DROP_INIT_R) * easeOutCubic(t)
      const opacity = DROP_OPACITY * (1 - t) * (1 - t * 0.4)
      const grad = ctx.createRadialGradient(localX, localY, 0, localX, localY, radius)
      grad.addColorStop(0, getInkDyeRGBA(opacity))
      grad.addColorStop(0.65, getInkDyeRGBA(opacity))
      grad.addColorStop(1, getInkDyeRGBA(0))
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(localX, localY, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'source-over'
  }
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 1) 清空 + 铺遮罩（随主题变化：夜间 #161618 / 日间 #ffffff）
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = getOverlayColor()
  ctx.fillRect(0, 0, W, H)

  // 2) destination-out：所有绘制都"挖洞"露出底层壁纸
  ctx.globalCompositeOperation = 'destination-out'

  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i]
    d.age += 1 / DROP_LIFESPAN
    if (d.age >= 1) {
      drops.splice(i, 1)
      continue
    }
    const t = d.age
    const radius = DROP_INIT_R + (d.maxRadius - DROP_INIT_R) * easeOutCubic(t)
    const opacity = DROP_OPACITY * (1 - t) * (1 - t * 0.4)
    const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, radius)
    grad.addColorStop(0,    `rgba(0,0,0,${opacity})`)
    grad.addColorStop(0.65, `rgba(0,0,0,${opacity})`)
    grad.addColorStop(1,    'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(d.x, d.y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.globalCompositeOperation = 'source-over'

  // 3) 文字染色
  drawTextLayers()

  animationId = requestAnimationFrame(draw)
}

function handleMove(x: number, y: number) {
  const dx = x - lastSpawnX
  const dy = y - lastSpawnY
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist > SPAWN_DIST) {
    const steps = Math.ceil(dist / SPAWN_DIST)
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      spawnDrop(lastSpawnX + dx * t, lastSpawnY + dy * t)
    }
    lastSpawnX = x
    lastSpawnY = y
  }
}

function onMouseMove(e: MouseEvent) {
  const rect = getHeroRect()
  if (!rect) return
  handleMove(e.clientX - rect.left, e.clientY - rect.top)
}

function onTouchMove(e: TouchEvent) {
  if (e.touches[0]) {
    const rect = getHeroRect()
    if (!rect) return
    handleMove(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top)
  }
}

/** 带重试的文字图层初始化（确保 VitePress 已渲染 hero + 字体已加载） */
function setupTextLayersWithRetry(retries: number) {
  const textEl = document.querySelector('.VPHomeHero .text')
  if (!textEl || textEl.getBoundingClientRect().width === 0) {
    if (retries > 0) setTimeout(() => setupTextLayersWithRetry(retries - 1), 100)
    return
  }
  setupTextLayers()
}

onMounted(() => {
  const hero = document.querySelector('.VPHomeHero')
  const canvas = canvasRef.value
  if (hero && canvas) {
    hero.appendChild(canvas)
  }
  resize()
  draw()
  // 等字体加载完成后再初始化文字图层，确保 Range API 读到正确坐标
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => setupTextLayersWithRetry(10))
  } else {
    setupTextLayersWithRetry(10)
  }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('resize', resize)

  // 监听主题切换：VitePress 在 <html> 上增删 .dark class
  // 切换时文字颜色变化（白↔深色），需重新渲染 canvas 文字图层
  themeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'class') {
        updateTextLayerSizes()
        break
      }
    }
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  drops = []
  if (textResizeObserver) {
    textResizeObserver.disconnect()
    textResizeObserver = null
  }
  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }
  const canvas = canvasRef.value
  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas)
  }
  for (const layer of textLayers) {
    if (layer.canvas.parentNode) layer.canvas.parentNode.removeChild(layer.canvas)
    layer.el.style.color = layer.originalColor
  }
  textLayers = []
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvasRef" class="spotlight-canvas" />
</template>

<style scoped>
.spotlight-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
</style>
