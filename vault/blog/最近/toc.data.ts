import { createRecentUpdatesLoader } from '@nolebase/vitepress-plugin-index/vitepress'
import { blogSourceToRoute, SITE_BASE } from '../../../scripts/blog-paths.mjs'
import { execFileSync } from 'node:child_process'

// Windows 上 createRecentUpdatesLoader 生成的 URL 使用反斜杠，
// 导致链接无法跳转。这里包装一层修复路径分隔符，同时合并多个目录。
const knowledgeLoader = createRecentUpdatesLoader({
  dir: 'vault/Knowledge',
  rewrites: [
    {
      from: /^vault\/Knowledge/,
      to: 'vault/Knowledge',
    },
  ],
})

const workshopLoader = createRecentUpdatesLoader({
  dir: 'vault/blog/作坊',
  rewrites: [
    {
      from: /^vault\/作坊/,
      to: 'vault/作坊',
    },
  ],
})

function fixUrlSeparator(url: string): string {
  return blogSourceToRoute(url)
}

export default {
  async load() {
    const [knowledge, workshop] = await Promise.all([
      knowledgeLoader.load(),
      workshopLoader.load(),
    ])
    return [...knowledge, ...workshop]
      .map((item) => ({
        ...item,
        // 尚未提交的目录迁移没有新路径 Git 历史，沿旧路径读取原更新时间。
        lastUpdated: item.lastUpdated || previousUpdate(item.filePath),
        // 最近更新组件直接渲染 href，不会像 Markdown 链接那样自动补站点 base。
        url: `${SITE_BASE}${fixUrlSeparator(item.url).replace(/^\//, '')}`,
        filePath: item.filePath.replaceAll('\\', '/'),
      }))
      .sort((a, b) => b.lastUpdated - a.lastUpdated)
  },
}

function previousUpdate(filePath: string): number {
  const source = filePath.replaceAll('\\', '/')
  const previous = blogSourceToRoute(source)
  if (source === previous)
    return 0
  const timestamp = execFileSync('git', ['log', '--format=%at', '-1', '--follow', '--', previous], { encoding: 'utf8' }).trim()
  return Number.parseInt(timestamp || '0', 10) * 1000
}
