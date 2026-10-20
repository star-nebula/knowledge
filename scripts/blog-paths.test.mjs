import assert from 'node:assert/strict'
import { test } from 'node:test'
import { blogRouteToSource, blogSourceToRoute, isWithinPublished } from './blog-paths.mjs'

test('moving blog sources preserves every existing section URL', () => {
  for (const section of ['主页', '最近', '作坊', '档案']) {
    for (const suffix of ['index.md', '网站部署/03-GitHub Pages 自动部署.md']) {
      const source = `vault/blog/${section}/${suffix}`
      const route = `vault/${section}/${suffix}`
      assert.equal(blogSourceToRoute(source), route)
      assert.equal(blogRouteToSource(route), source)
    }
  }
  assert.equal(blogSourceToRoute('vault/Knowledge/AI/Transformer.md'), 'vault/Knowledge/AI/Transformer.md')
  assert.equal(blogSourceToRoute('/vault/blog/作坊/'), '/vault/作坊/')
  assert.equal(blogSourceToRoute('vault\\blog\\最近\\toc.html'), 'vault/最近/toc.html')
  assert.equal(blogSourceToRoute('vault/blog/私人/index.md'), 'vault/blog/私人/index.md')
})

test('nested publication boundaries reject siblings and prefix lookalikes', () => {
  const published = ['vault/blog/作坊', 'vault/blog/主页', 'vault/Knowledge']
  assert.ok(isWithinPublished('vault/blog/作坊/网站部署/index.md', published))
  assert.ok(isWithinPublished('vault/blog/主页/index.md', published))
  assert.ok(isWithinPublished('vault/Knowledge/AI/test.md', published))
  for (const file of ['vault/blog/私人.md', 'vault/blog/私人/index.md', 'vault/blog/作坊备份/test.md', 'vault/Memory/test.md'])
    assert.equal(isWithinPublished(file, published), false, file)
})
