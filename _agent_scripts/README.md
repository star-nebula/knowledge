# _agent_scripts

工作区操作/诊断脚本统一存放处（供 agent 调用）。

## 脚本清单

### `test_image_embed_render.ts`
验证 `obsidianImageEmbed` 插件在 VitePress 渲染管线中的生效顺序。
- 背景：`![[Attachments/x.jpg]]` 必须抢在 nolebase 的双向链接规则之前拦截，否则被渲染成死链(#)。
- 用法：`node_modules/.bin/tsx _agent_scripts/test_image_embed_render.ts <old|new>`
  - `old` = nolebase 先装、obsidianImageEmbed 后装（== 真实 config 顺序），预期 7 `<img>`、0 死链。
  - `new` = obsidianImageEmbed 先装（preConfig 早于 nolebase），用于对比验证锚点顺序。

### `debug_ruler.ts`
探查 VitePress markdown-it 内联规则链（`__rules__`），定位 nolebase 双向链接规则的真实名字（当前为 `bi_directional_link_replace`）。
- 用法：`node_modules/.bin/tsx _agent_scripts/debug_ruler.ts`

## 注意事项
- 这些脚本仅用于本地诊断，**不参与站点构建**（不在 `vault/` 下，VitePress 不会渲染）。
- `createMarkdownRenderer` 有模块级缓存，两种顺序需分两次进程运行。
- 顶层 await 在 `tsx -e` 的 cjs 输出下会报错，故一律用 `.ts` 文件方式运行。
