// scripts/build.mjs
// 站点构建入口。把 Node 堆上限提到 8GB：并入 vault/Knowledge（~220 篇）后，
// 默认 ~4GB old-space 在「building client + server bundles」阶段会 OOM；
// 8GB 在 16GB 内存机器上留足余量且构建迅速（实测 ~150s）。
//
// 为什么这样解析 vitepress 入口：
//  - spawnSync('vitepress', ...) 在 Windows 上不带 shell 时无法解析 node_modules/.bin
//    下的 vitepress(.cmd)，会 ENOENT 静默失败（进程直接 exit 1、无任何输出）；
//  - require.resolve('vitepress/bin/vitepress.js') 会被 vitepress 的 "exports" 字段
//    屏蔽，抛 ERR_PACKAGE_PATH_NOT_EXPORTED。
// 故直接按文件系统路径指向 CLI 入口，跨平台稳定。
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const vitepressBin = fileURLToPath(
  new URL('../node_modules/vitepress/bin/vitepress.js', import.meta.url),
)

const HEAP_MB = 8192
const res = spawnSync(process.execPath, [vitepressBin, 'build'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_OPTIONS: `--max-old-space-size=${HEAP_MB}` },
})

process.exit(res.status ?? 1)
