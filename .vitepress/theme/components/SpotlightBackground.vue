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
 */

const canvasRef = ref<HTMLCanvasElement | null>(null)

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

// ---- 可调参数 ----
const SPAWN_DIST = 14       // 鼠标移动多远生成一个新墨滴（px）
const DROP_INIT_R = 15      // 墨滴初始半径
const DROP_MAX_R = 100      // 墨滴最大扩散半径（基准，会随机化）
const DROP_LIFESPAN = 100   // 墨滴寿命（帧，60fps ≈ 1.67s）
const DROP_OPACITY = 1.0    // 单个墨滴峰值不透明度（1 = 完全挖洞显示壁纸）

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
}

function spawnDrop(x: number, y: number) {
  const maxR = DROP_MAX_R * (0.7 + Math.random() * 0.6)
  drops.push({ x, y, age: 0, maxRadius: maxR })
}

/** ease-out-cubic：开始快、结束慢 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 1) 清空 + 铺暗色遮罩
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#161618'
  ctx.fillRect(0, 0, W, H)

  // 2) destination-out：所有绘制都"挖洞"露出底层壁纸
  ctx.globalCompositeOperation = 'destination-out'

  // 绘制墨滴（中心完全挖洞 + 边缘窄过渡，无光晕）
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i]
    d.age += 1 / DROP_LIFESPAN
    if (d.age >= 1) {
      drops.splice(i, 1)
      continue
    }

    const t = d.age
    // 半径：ease-out 扩散（快速洇开 → 逐渐减速）
    const radius = DROP_INIT_R + (d.maxRadius - DROP_INIT_R) * easeOutCubic(t)
    // 不透明度：前半段保持完全挖洞，后半段加速淡出
    const opacity = DROP_OPACITY * (1 - t) * (1 - t * 0.4)

    // 中心区域完全透明（完全显示壁纸），仅边缘窄过渡
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

  animationId = requestAnimationFrame(draw)
}

function handleMove(x: number, y: number) {
  // 沿移动路径插值生成墨滴，确保快速移动时无断点
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

onMounted(() => {
  const hero = document.querySelector('.VPHomeHero')
  const canvas = canvasRef.value
  if (hero && canvas) {
    hero.appendChild(canvas)
  }
  resize()
  draw()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  drops = []
  const canvas = canvasRef.value
  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas)
  }
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
