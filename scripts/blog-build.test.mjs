import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { blogSourceToRoute } from './blog-paths.mjs'

const dist = '.vitepress/dist'

function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = `${dir}/${entry.name}`
    return entry.isDirectory() ? markdownFiles(path) : path.endsWith('.md') ? [path] : []
  })
}

test('every moved blog page is built at its previous public URL', () => {
  for (const source of markdownFiles('vault/博客')) {
    const output = blogSourceToRoute(source).replace(/\.md$/, '.html')
    assert.ok(existsSync(join(dist, output)), `Missing output: ${output}`)
  }
})

test('workshop project links resolve after migration instead of becoming hash placeholders', () => {
  const html = decodeURI(readFileSync(join(dist, 'vault/作坊/index.html'), 'utf8'))
  for (const name of ['feedlens-project', 'glowlink-demo', 'ai-tryon-video-demo', '网页笔记四步工作流']) {
    // Require the body link; a valid sidebar entry alone does not prove wikilinks work.
    assert.match(html, new RegExp(`class="VPNolebaseInlinePreviewLink"[^>]*href="/knowledge/vault/作坊/${name}\\.html"`), `Broken body link: ${name}`)
  }
})

test('recent-update links include the GitHub Pages base path', () => {
  const html = decodeURI(readFileSync(join(dist, 'vault/最近/toc.html'), 'utf8'))
  assert.doesNotMatch(html, /href="\/vault\//, 'Recent-update links must retain /knowledge/')
  assert.ok(html.includes('href="/knowledge/vault/作坊/feedlens-project.html"'))
})
