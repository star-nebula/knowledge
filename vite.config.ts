import { presetVite } from '@nolebase/integrations/vitepress/vite'
import UnoCSS from 'unocss/vite'

import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

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
