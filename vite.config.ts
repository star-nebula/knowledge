import { presetVite } from '@nolebase/integrations/vitepress/vite'
import UnoCSS from 'unocss/vite'

import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import fs from 'node:fs'
import path from 'node:path'

/**
 * 缺失媒体兜底：Obsidian 笔记常通过 `![[assets/x.mp4]]` 等内嵌图片/视频，但其底层文件
 * 往往位于 gitignored 的 vault/Attachments，本地/CI 都不存在。nolebase 预设会把这类
 * 内嵌媒体转成模块 import，文件缺失时 Rollup 直接 hard-fail 整站构建。
 * 这里在解析阶段拦截“不存在的媒体文件”，返回空模块占位，让构建继续（媒体显示为空白，
 * 但链接/页面不崩）。仅对确实缺失的媒体生效，已存在的资源走正常流程，不影响既有内容。
 */
function missingAssetStub() {
  const MEDIA = /\.(mp4|webm|ogg|mov|avi|mkv|mp3|wav|flac|png|jpe?g|gif|svg|webp|bmp|avif|ico)$/i
  return {
    name: 'missing-asset-stub',
    enforce: 'pre' as const,
    resolveId(source: string, importer?: string) {
      if (!importer || !MEDIA.test(source))
        return null
      const abs = path.isAbsolute(source) ? source : path.resolve(path.dirname(importer), source)
      if (!fs.existsSync(abs))
        return `\0missing-asset:${abs}`
      return null
    },
    load(id: string) {
      if (id.startsWith('\0missing-asset:'))
        return 'export default ""'
      return null
    },
  }
}

export default defineConfig(async () => {
  const nolebase = presetVite({
    // 关闭 thumbnail-hash：该插件会 glob 仓库根下全部 jpg/jpeg/png（含 834 张未发布的
    // vault/Attachments 图与 node_modules），并用 Skia 逐一解码生成模糊占位图。
    // 本仓库只发布部分图片，全量扫描既慢（2.7GB+ 内存）又会在损坏图上卡死/崩溃
    // （Failed to make image from encoded data）。站点内容用 obsidianImageEmbed 渲染
    // 普通 <img>，并不依赖 NolebaseUnlazyImg 的模糊占位，故可安全关闭。
    thumbnailHashImages: false,
    pageProperties: {
      options: {
        markdownSection: {
          exclude: () => true,
        },
      },
    },
  })

  return {
    assetsInclude: [
      '**/*.mov',
    ],
    optimizeDeps: {
      // vitepress is aliased with replacement `join(DIST_CLIENT_PATH, '/index')`
      // This needs to be excluded from optimization
      exclude: [
        'vitepress',
      ],
    },
    plugins: [
      Inspect(),
      missingAssetStub(),
      Components({
        include: [/\.vue$/, /\.md$/],
        dirs: '.vitepress/theme/components',
        dts: '.vitepress/components.d.ts',
      }),
      UnoCSS(),
      nolebase,
      ...nolebase.plugins(),
    ],
  }
})
