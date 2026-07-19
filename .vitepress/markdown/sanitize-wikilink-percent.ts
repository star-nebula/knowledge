/**
 * sanitize-wikilink-percent.ts
 *
 * 渲染期修复：Obsidian 笔记里存在形如 `[[300%法则]]` 的双向链接，其 target 含有
 * 非法的百分号（% 后不是两位十六进制）。nolebase 的 BiDirectionalLinks 在解析时会
 * 对 target 执行 `new URL(...)` + `decodeURIComponent(...)`，遇到这种非法 % 会直接
 * 抛 "URI malformed" 导致整个站点构建失败。
 *
 * 这些笔记原先被 srcExclude 排除，从未进过构建，所以问题一直潜伏。
 * 这里在 nolebase 解析之前，把 `[[ ]]` target 中“孤立的 %”（非 %XX）转义为 %25。
 * 由于 %25 解码后仍是 %，链接依然能正确命中真实的 `300%法则.md`，且不改动用户源文件。
 *
 * 注册顺序：必须在 BiDirectionalLinks 之前（core 阶段改写 src，inline 阶段 nolebase 才解析）。
 */
export function sanitizeWikiPercent(md: any): void {
  md.core.ruler.before('normalize', 'sanitize-wiki-percent', (state: any) => {
    state.src = state.src.replace(/\[\[([^\]\n]+?)\]\]/g, (full: string, inner: string) => {
      const pipeIdx = inner.indexOf('|')
      const target = pipeIdx >= 0 ? inner.slice(0, pipeIdx) : inner
      const alias = pipeIdx >= 0 ? inner.slice(pipeIdx) : ''
      // 仅转义“孤立的 %”（后面不跟两位十六进制）；合法的 %XX 保留
      const fixedTarget = target.replace(/%(?![0-9A-Fa-f]{2})/g, '%25')
      return `[[${fixedTarget}${alias}]]`
    })
  })
}
