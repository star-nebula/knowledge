<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

let animationId = 0
let mouseX = -1
let mouseY = -1
let curX = -1
let curY = -1
let opacity = 0
let targetOpacity = 0
let idleTimer: ReturnType<typeof setTimeout> | null = null
let W = 0
let H = 0
let heroRect: DOMRect | null = null

const RADIUS = 280
const LERP = 0.12
const FADE_SPEED = 0.1

function getHeroRect() {
  const hero = document.querySelector('.VPHomeHero') as HTMLElement
  if (!hero) return null
  return hero.getBoundingClientRect()
}

function resize() {
  const rect = getHeroRect()
  if (!rect) return
  heroRect = rect

  const canvas = canvasRef.value
  if (!canvas) return

  // Canvas 尺寸 = Hero 区域尺寸
  W = rect.width
  H = rect.height
  canvas.width = W
  canvas.height = H

  if (curX < 0) { curX = W / 2; curY = H / 2 }
  if (mouseX < 0) { mouseX = W / 2; mouseY = H / 2 }
}

function wakeUp() {
  targetOpacity = 1
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = setTimeout(() => { targetOpacity = 0 }, 0)
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  curX += (mouseX - curX) * LERP
  curY += (mouseY - curY) * LERP

  opacity += (targetOpacity - opacity) * FADE_SPEED
  if (Math.abs(opacity - targetOpacity) < 0.005) opacity = targetOpacity

  ctx.clearRect(0, 0, W, H)

  // 铺满遮罩色
  ctx.fillStyle = '#161618'
  ctx.fillRect(0, 0, W, H)

  if (opacity > 0.01) {
    ctx.globalCompositeOperation = 'destination-out'
    const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, RADIUS)
    grad.addColorStop(0,    `rgba(0,0,0,${opacity})`)
    grad.addColorStop(0.15, `rgba(0,0,0,${opacity * 0.98})`)
    grad.addColorStop(0.30, `rgba(0,0,0,${opacity * 0.92})`)
    grad.addColorStop(0.45, `rgba(0,0,0,${opacity * 0.80})`)
    grad.addColorStop(0.60, `rgba(0,0,0,${opacity * 0.60})`)
    grad.addColorStop(0.75, `rgba(0,0,0,${opacity * 0.35})`)
    grad.addColorStop(0.88, `rgba(0,0,0,${opacity * 0.12})`)
    grad.addColorStop(1,    'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(curX, curY, RADIUS, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }

  animationId = requestAnimationFrame(draw)
}

function onMouseMove(e: MouseEvent) {
  const rect = getHeroRect()
  if (!rect) return
  // 鼠标坐标相对于 Hero 区域
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  wakeUp()
}

function onTouchMove(e: TouchEvent) {
  if (e.touches[0]) {
    const rect = getHeroRect()
    if (!rect) return
    mouseX = e.touches[0].clientX - rect.left
    mouseY = e.touches[0].clientY - rect.top
    wakeUp()
  }
}

onMounted(() => {
  // 将 canvas 移到 .VPHomeHero 内部，使其绝对定位相对于 Hero 区域
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
  if (idleTimer) clearTimeout(idleTimer)
  // 将 canvas 移回原位置
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
