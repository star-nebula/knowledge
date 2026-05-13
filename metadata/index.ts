import type { Creator } from '../scripts/types/metadata'
import { getAvatarUrlByGithubName } from '../scripts/utils'

/** 文本 */
export const siteName = 'Star Nebula Knowledge'
export const siteShortName = 'Star Nebula'
export const siteDescription = '记录回忆，知识和畅想的地方'

/** 文档所在目录 */
export const include = ['笔记', '生活']

/** Repo */
export const githubRepoLink = 'https://github.com/star-nebula/knowledge'

/** 无协议前缀域名 */
export const plainTargetDomain = 'star-nebula.github.io/knowledge'
/** 完整域名 */
export const targetDomain = `https://${plainTargetDomain}`

/** 创作者 */
export const creators: Creator[] = []

export const creatorNames = creators.map(c => c.name)
export const creatorUsernames = creators.map(c => c.username || '')
