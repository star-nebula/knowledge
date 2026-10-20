import assert from 'node:assert/strict'
import { test } from 'node:test'
import { blogRouteToSource, blogSourceToRoute, isWithinPublished } from './blog-paths.mjs'

test('moving blog sources preserves every existing section URL', () => {
  for (const section of ['主页', '最近', '作坊', '档案']) {
    for (const suffix of ['index.md', '网站部署/03-GitHub Pages 自动部署.md']) {
      const source = `vault/博客/${section}/${suffix}`
      const route = `vault/${section}/${suffix}`
      assert.equal(blogSourceToRoute(source), route)
      assert.equal(blogRouteToSource(route), source)
    }
  }
  assert.equal(blogSourceToRoute('vault/Knowledge/AI/Transformer.md'), 'vault/Knowledge/AI/Transformer.md')
  assert.equal(blogSourceToRoute('/vault/博客/作坊/'), '/vault/作坊/')
  assert.equal(blogSourceToRoute('vault\\博客\\最近\\toc.html'), 'vault/最近/toc.html')
  assert.equal(blogSourceToRoute('vault/博客/私人/index.md'), 'vault/博客/私人/index.md')
})

test('nested publication boundaries reject siblings and prefix lookalikes', () => {
  const published = ['vault/博客/作坊', 'vault/博客/主页', 'vault/Knowledge']
  assert.ok(isWithinPublished('vault/博客/作坊/网站部署/index.md', published))
  assert.ok(isWithinPublished('vault/博客/主页/index.md', published))
  assert.ok(isWithinPublished('vault/Knowledge/AI/test.md', published))
  for (const file of ['vault/博客/私人.md', 'vault/博客/私人/index.md', 'vault/博客/作坊备份/test.md', 'vault/Memory/test.md'])
    assert.equal(isWithinPublished(file, published), false, file)
})
