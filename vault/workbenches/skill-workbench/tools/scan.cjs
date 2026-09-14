// scan.cjs — P2 注册表扫描器
// 扫描 config/roots.js 全部 roots + pluginGlobs，产出：
//   data/registry.json  — 每个 skill 副本一条记录（含链接解析到真身）
//   data/groups.json    — 按归一化名聚合的“组”（每组含 1..N 副本）
// 用法: node scan.cjs
const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');

const WB = 'E:/knowledge/vault/workbenches/skill-workbench';
const cfg = require(WB + '/config/roots.cjs');

function isLink(p) {
  try { return fs.lstatSync(p).isSymbolicLink(); } catch { return false; }
}
function isJunction(p) {
  try {
    const st = fs.lstatSync(p);
    if (!st.isDirectory()) return false;
    // junction/symlink dir 检测：readlink 返回非空即链接
    return fs.readlinkSync(p) ? true : false;
  } catch { return false; }
}
function linkTarget(p) {
  try { return fs.readlinkSync(p) || null; } catch { return null; }
}
function parseFrontmatter(mdPath) {
  try {
    const txt = fs.readFileSync(mdPath, 'utf8');
    const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) return {};
    const fm = {};
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
      if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
    }
    return fm;
  } catch { return {}; }
}
function treeHash(root) {
  const h = createHash('sha1');
  const walk = d => {
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const r = path.join(d, e.name);
      if (e.isDirectory()) { h.update('D' + e.name + '\n'); walk(r); }
      else {
        try { const st = fs.statSync(r); h.update('F' + e.name + '|' + st.size + '\n'); } catch {}
      }
    }
  };
  try { walk(root); } catch {}
  return h.digest('hex');
}
function canonicalize(name) {
  for (const a of cfg.aliases) {
    if (name === a.canonical || a.variants.includes(name)) return a.canonical;
  }
  return name;
}

const copies = [];
const errors = [];

function scanRoot(root) {
  let names;
  try { names = fs.readdirSync(root.path); } catch (e) { errors.push('read ' + root.path + ': ' + e.message); return; }
  for (const name of names) {
    if (name.startsWith('.')) continue; // 点开头一律跳过：.system/.git/.temp/.hot-update-tmp 等工具内部目录，skill 名不会以 . 开头
    if (name.startsWith('@')) continue; // @user_xxx 特殊目录跳过
    const full = path.join(root.path, name);
    let st;
    try { st = fs.lstatSync(full); } catch { continue; }
    // junction/symlink 在 Windows 上 lstat 返回 symlink 类型而非 directory，须用 stat 判定目录实体
    const isDir = st.isDirectory() || (st.isSymbolicLink() && (() => { try { return fs.statSync(full).isDirectory(); } catch { return false; } })());
    if (!isDir) continue;
    const linked = isJunction(full) || isLink(full);
    const target = linked ? linkTarget(full) : null;
    const resolved = linked && target ? path.resolve(path.dirname(full), target) : full;
    const masterLive = linked ? fs.existsSync(resolved) : true;
    const skillMd = fs.existsSync(path.join(resolved, 'SKILL.md')) ? path.join(resolved, 'SKILL.md')
      : fs.existsSync(path.join(full, 'SKILL.md')) ? path.join(full, 'SKILL.md') : null;
    const fm = skillMd ? parseFrontmatter(skillMd) : {};
    const stat = fs.statSync(resolved);
    copies.push({
      id: root.tool + '/' + name,
      tool: root.tool,
      dir: full.replace(/\\/g, '/'),
      name,
      canonical: canonicalize(fm.name || name),
      layer: linked && root.master ? 'shared' : root.layer,
      link: linked ? { target: target.replace(/\\/g, '/'), resolved: resolved.replace(/\\/g, '/'), masterLive } : null,
      hasSkillMd: !!skillMd,
      frontmatter: { name: fm.name || null, version: fm.version || null, description: fm.description ? String(fm.description).slice(0, 160) : null },
      treeHash: treeHash(resolved),
      mtime: stat.mtime.toISOString(),
      scannedAt: new Date().toISOString(),
    });
  }
}

for (const root of cfg.roots) scanRoot(root);

// 插件缓存：找 .../skills/<name>/SKILL.md 形态的叶子
for (const pg of cfg.pluginGlobs) {
  const walkPlugins = (d, depth) => {
    if (depth > pg.maxDepth) return;
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (!e.isDirectory() || cfg.ignore.includes(e.name)) continue;
      const r = path.join(d, e.name);
      if (fs.existsSync(path.join(r, 'SKILL.md'))) {
        const fm = parseFrontmatter(path.join(r, 'SKILL.md'));
        const stat = fs.statSync(r);
        const name = fm.name || e.name;
        copies.push({
          id: pg.tool + '/' + name + '@' + createHash('md5').update(r).digest('hex').slice(0, 6),
          tool: pg.tool,
          dir: r.replace(/\\/g, '/'),
          name,
          canonical: canonicalize(name),
          layer: 'plugin',
          link: null, hasSkillMd: true,
          frontmatter: { name: fm.name || null, version: fm.version || null, description: fm.description ? String(fm.description).slice(0, 160) : null },
          treeHash: treeHash(r),
          mtime: stat.mtime.toISOString(),
          scannedAt: new Date().toISOString(),
        });
      } else {
        walkPlugins(r, depth + 1);
      }
    }
  };
  walkPlugins(pg.path, 0);
}

// 组：按 canonical 聚合
const groupMap = {};
for (const c of copies) {
  (groupMap[c.canonical] = groupMap[c.canonical] || []).push(c.id);
}
const groups = Object.entries(groupMap).map(([canonical, ids]) => ({
  canonical,
  copies: ids,
  status: ids.length > 1 ? 'multi' : 'single',
  // 初步一致性：仅当组内 >=2 个真实副本（link!=null 的共享入口不算分歧源）
  needsReview: null,
})).sort((a, b) => a.canonical.localeCompare(b.canonical));

const out = { generatedAt: new Date().toISOString(), totalCopies: copies.length, totalGroups: groups.length, copies, groups, errors };
fs.writeFileSync(WB + '/data/registry.json', JSON.stringify(out, null, 1));
fs.writeFileSync(WB + '/data/groups.json', JSON.stringify({ generatedAt: out.generatedAt, groups }, null, 1));
console.log(`scanned ${copies.length} copies -> ${groups.length} groups; errors: ${errors.length}`);
if (errors.length) console.log(errors.join('\n'));
// 概览
const byLayer = {};
copies.forEach(c => byLayer[c.layer] = (byLayer[c.layer] || 0) + 1);
console.log('by layer:', JSON.stringify(byLayer));
const multi = groups.filter(g => g.status === 'multi').length;
console.log('multi-copy groups:', multi);
