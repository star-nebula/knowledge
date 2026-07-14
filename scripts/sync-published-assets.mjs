#!/usr/bin/env node
/**
 * 只把「发布需要的图片」同步进 git。
 *
 * 原理：vault/Attachments/** 已被 .gitignore 整体忽略（不进 GitHub）。
 * 本脚本扫描所有 git 跟踪的 .md（= 站点/发布内容；个人文件夹已被 gitignore 排除），
 * 提取其中引用的图片文件名，再用 `git add -f` 只把这些图强制加入跟踪；
 * 反之，已跟踪但不再被引用的图用 `git rm --cached` 移出索引（文件仍留在磁盘 + 百度云）。
 *
 * 用途：让你 commit/push 时，GitHub 只装发布笔记真正用到的图，私人图绝不入库。
 * 建议接入 pre-commit 钩子（见 .git/hooks/pre-commit），或手动 `pnpm sync:assets`。
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const VAULT = path.join(ROOT, 'vault')
const ATTACH = path.join(VAULT, 'Attachments')

function git(args) {
  return execSync(`git ${args}`, { cwd: ROOT, encoding: 'utf-8' })
}

function walk(dir) {
  const out = []
  if (!fs.existsSync(dir))
    return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory())
      out.push(...walk(p))
    else out.push(p)
  }
  return out
}

// 去掉代码块(围栏 + 行内)，避免文档示例里的 ![..](..) 被误当成真实引用
function stripCode(txt) {
  return txt
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    .replace(/`[^`\n]*`/g, '')
}

// 1) git 跟踪的文件 / 其中 .md
const trackedAll = git('ls-files vault').split('\n').filter(Boolean)
const trackedMd = trackedAll.filter(f => f.endsWith('.md'))

// 2) 从跟踪的 .md 提取引用的图片 basename（Obsidian 双链 + 标准 markdown）
//    注意：两种写法都要保留完整「文件名.扩展名」，否则与磁盘比对会失配
const embRe = /!\[\[([^\]]+?\.(?:png|jpe?g|gif|webp|svg|bmp|ico|avif))(?:\|[^\]]*)?\]\]/gi
const mdImgRe = /!\[[^\]]*\]\(([^)]+?\.(?:png|jpe?g|gif|webp|svg|bmp|ico|avif)[^)]*)\)/gi
const needed = new Set()
for (const md of trackedMd) {
  let raw
  try {
    raw = fs.readFileSync(path.join(ROOT, md), 'utf-8')
  }
  catch {
    continue
  }
  const txt = stripCode(raw)
  let m
  while ((m = embRe.exec(txt)))
    needed.add(m[1].toLowerCase())
  while ((m = mdImgRe.exec(txt)))
    needed.add(path.basename(m[1].split('?')[0]).toLowerCase())
}

// 3) 遍历 Attachments，按需 add -f / rm --cached
const attFiles = walk(ATTACH)
const trackedAttach = new Set(trackedAll.filter(f => f.startsWith('vault/Attachments/')))
const onDisk = new Set(attFiles.map(f => path.basename(f).toLowerCase()))

let added = 0
let removed = 0
let kept = 0
for (const f of attFiles) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/')
  const base = path.basename(rel).toLowerCase()
  if (needed.has(base)) {
    if (!trackedAttach.has(rel)) {
      git(`add -f -- ${JSON.stringify(rel)}`)
      added++
    }
    else {
      kept++
    }
  }
  else if (trackedAttach.has(rel)) {
    try {
      git(`rm --cached --quiet -- ${JSON.stringify(rel)}`)
      removed++
    }
    catch {
      // 已不在索引中，忽略
    }
  }
}

// 4) 报告被引用但文件缺失的图（需用户补回磁盘）
const missing = [...needed].filter(n => !onDisk.has(n)).sort()

console.log(`git 跟踪的 .md(=站点内容): ${trackedMd.length}`)
console.log(`Attachments 磁盘图片数:       ${attFiles.length}`)
console.log(`被站点引用的图片(应入库):     ${needed.size}`)
console.log(`本次 force-add:               ${added}`)
console.log(`本次 rm --cached(移出索引):   ${removed}`)
console.log(`已跟踪且仍被引用(保持不变):   ${kept}`)
if (missing.length) {
  console.log(`\n⚠️ 被引用但文件缺失(${missing.length})，需补回 vault/Attachments/:`)
  missing.forEach(x => console.log('   -', x))
}
