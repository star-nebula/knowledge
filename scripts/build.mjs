// scripts/build.mjs
// 站点构建入口。默认把 Node 堆上限提到 8GB：并入 vault/Knowledge（~220 篇）后，
// 默认 ~4GB old-space 在「building client + server bundles」阶段会 OOM；
// 8GB 在 16GB 内存机器上留足余量且构建迅速（实测 ~150s）。
//
// 为什么这样解析 vitepress 入口：
//  - spawnSync('vitepress', ...) 在 Windows 上不带 shell 时无法解析 node_modules/.bin
//    下的 vitepress(.cmd)，会 ENOENT 静默失败（进程直接 exit 1、无任何输出）；
//  - require.resolve('vitepress/bin/vitepress.js') 会被 vitepress 的 "exports" 字段
//    屏蔽，抛 ERR_PACKAGE_PATH_NOT_EXPORTED。
// 故直接按文件系统路径指向 CLI 入口，跨平台稳定。
//
// 关于 NODE_OPTIONS：若外部环境(如 CI workflow)已经设置了 NODE_OPTIONS，则**尊重其值、
// 不覆盖**——否则在内存较小的 CI runner 上强制 8GB 反而会因超出物理内存被 OOM kill。
// 仅当未设置时才补上默认的 8GB。
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const vitepressBin = fileURLToPath(
  new URL('../node_modules/vitepress/bin/vitepress.js', import.meta.url),
)

const HEAP_MB = 8192
const env = { ...process.env }
if (!env.NODE_OPTIONS) {
  env.NODE_OPTIONS = `--max-old-space-size=${HEAP_MB}`
}

const res = spawnSync(process.execPath, [vitepressBin, 'build'], {
  stdio: 'inherit',
  env,
})

process.exit(res.status ?? 1)
