import { presetVite } from '@nolebase/integrations/vitepress/vite'
import UnoCSS from 'unocss/vite'

import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig(async () => {
  const nolebase = presetVite({
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
