import { createRecentUpdatesLoader } from '@nolebase/vitepress-plugin-index/vitepress'

// Windows 上 createRecentUpdatesLoader 生成的 URL 使用反斜杠，
// 导致链接无法跳转。这里包装一层修复路径分隔符，同时合并多个目录。
const notesLoader = createRecentUpdatesLoader({
  dir: 'zh-CN/笔记',
  rewrites: [
    {
      from: /^zh-CN\/笔记/,
      to: 'zh-CN/笔记',
    },
  ],
})

const workshopLoader = createRecentUpdatesLoader({
  dir: 'zh-CN/作坊',
  rewrites: [
    {
      from: /^zh-CN\/作坊/,
      to: 'zh-CN/作坊',
    },
  ],
})

function fixUrlSeparator(url: string): string {
  return url.replaceAll('\\', '/')
}

export default {
  async load() {
    const [notes, workshop] = await Promise.all([
      notesLoader.load(),
      workshopLoader.load(),
    ])
    return [...notes, ...workshop]
      .map((item) => ({
        ...item,
        url: fixUrlSeparator(item.url),
        filePath: item.filePath.replaceAll('\\', '/'),
      }))
      .sort((a, b) => b.lastUpdated - a.lastUpdated)
  },
}
