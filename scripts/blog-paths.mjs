// Obsidian sources live under blog/; public URLs retain their existing paths.
export const SITE_BASE = '/knowledge/'

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
