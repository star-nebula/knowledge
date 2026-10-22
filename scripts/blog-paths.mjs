// Obsidian sources live under blog/; public URLs retain their existing paths.

/**
 * 站点默认部署根路径 = GitHub Pages 项目页（https://star-nebula.github.io/knowledge/）。
 * 不设置环境变量时**永远**是这个值，GitHub Pages 的部署行为不受任何影响。
 */
const DEFAULT_BASE = '/knowledge/'

/**
 * 归一化 base：'/'、''、'knowledge'、'/knowledge'、'/knowledge/' 都得到规范形态。
 * 返回的字符串必以 '/' 开头，且除根路径外必以 '/' 结尾（VitePress 的硬性要求）。
 */
function normalizeBase(raw) {
  const trimmed = String(raw ?? '').trim()
  if (!trimmed || trimmed === '/')
    return '/'
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}

/**
 * 站点部署根路径（VitePress 的 `base`）。
 *
 * 同一份代码要部署到不同根路径的平台，靠环境变量切换：
 *   - GitHub Pages（项目页）：不设变量 → '/knowledge/'
 *   - 根域名部署（EdgeOne Pages 等）：`SITE_BASE=/ pnpm docs:build`
 *
 * 空字符串视为未设置（防止 CI 里定义了空变量却把站点打到根路径）。
 */
export const SITE_BASE = normalizeBase(process.env.SITE_BASE || DEFAULT_BASE)

const sections = '(主页|最近|作坊|档案)'
const sourcePrefix = new RegExp(`^(\/?)vault/blog/${sections}(?=/|$)`)
const routePrefix = new RegExp(`^(\/?)vault/${sections}(?=/|$)`)

export function blogSourceToRoute(path) {
  return path.replaceAll('\\', '/').replace(sourcePrefix, '$1vault/$2')
}

export function blogRouteToSource(path) {
  return path.replaceAll('\\', '/').replace(routePrefix, '$1vault/blog/$2')
}

export function isWithinPublished(path, publishedDirs) {
  return publishedDirs.some(dir => path === dir || path.startsWith(`${dir}/`))
}
