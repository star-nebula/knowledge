import { createRecentUpdatesLoader } from '@nolebase/vitepress-plugin-index/vitepress'

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
  dir: 'vault/作坊',
  rewrites: [
    {
      from: /^vault\/作坊/,
      to: 'vault/作坊',
    },
  ],
})

function fixUrlSeparator(url: string): string {
  return url.replaceAll('\\', '/')
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
        url: fixUrlSeparator(item.url),
        filePath: item.filePath.replaceAll('\\', '/'),
      }))
      .sort((a, b) => b.lastUpdated - a.lastUpdated)
  },
}
