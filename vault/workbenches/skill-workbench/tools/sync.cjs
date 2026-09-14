// sync.cjs — P3 同步器
// 组内真实副本（link=null 的条目）间的手动同步：
//   status            — 列出全部 multi 组：一致(identical) / 分歧(diverged)
//   diff <组名>       — 行级差异（取组内前两个不同副本对比概要）
//   sync <组名>       — 最后编辑胜出：组内最新 mtime 的真实副本为源，镜像到其余副本
//                       （多余文件移入 data/trash/<时间戳>/，不硬删）
// 同步会先刷新注册表，全程写 data/log.md。
// 用法: node sync.cjs status | node sync.cjs sync webnote-workflow
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WB = 'E:/knowledge/vault/workbenches/skill-workbench';
const TRASH = WB + '/data/trash';
const LOG = WB + '/data/log.md';

function loadRegistry() { return JSON.parse(fs.readFileSync(WB + '/data/registry.json', 'utf8')); }
function logLine(s) { fs.appendFileSync(LOG, s + '\n'); }

function realCopies(reg, group) {
  return group.copies
    .map(id => reg.copies.find(c => c.id === id))
    .filter(c => c && !c.link); // 只有真实副本可作同步源/目标
}

function refreshCopyMeta(c) {
  const st = fs.statSync(c.dir);
  c.mtime = st.mtime.toISOString();
  c.treeHash = treeHash(c.dir);
}
function treeHash(root) {
  const h = require('crypto').createHash('sha1');
  const walk = d => {
    let es; try { es = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of es.sort((a, b) => a.name.localeCompare(b.name))) {
      const r = path.join(d, e.name);
      if (e.isDirectory()) { h.update('D' + e.name + '\n'); walk(r); }
      else { try { h.update('F' + e.name + '|' + fs.statSync(r).size + '\n'); } catch {} }
    }
  };
  walk(root);
  return h.digest('hex');
}

function cmdStatus() {
  const reg = loadRegistry();
  const multi = reg.groups.filter(g => g.copies.length > 1);
  console.log(`multi-copy groups: ${multi.length}\n`);
  let diverged = 0;
  for (const g of multi) {
    const reals = realCopies(reg, g);
    if (reals.length < 2) {
      console.log(`  ${g.canonical}  [${g.copies.length} copies, all shared-link/real<2 — sync N/A]`);
      continue;
    }
    reals.forEach(refreshCopyMeta);
    const hashes = new Set(reals.map(c => c.treeHash));
    const state = hashes.size === 1 ? 'identical' : 'DIVERGED';
    if (state !== 'identical') diverged++;
    console.log(`  ${g.canonical}  [${state}] ${reals.map(c => c.tool).join(', ')}`);
  }
  console.log(`\ndiverged: ${diverged}/${multi.length}`);
}

function cmdDiff(name) {
  const reg = loadRegistry();
  const g = reg.groups.find(x => x.canonical === name);
  if (!g) return console.log('group not found: ' + name);
  const reals = realCopies(reg, g);
  if (reals.length < 2) return console.log('fewer than 2 real copies — nothing to diff');
  reals.forEach(refreshCopyMeta);
  // 找最新
  const sorted = [...reals].sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
  const src = sorted[0];
  console.log(`newest (sync source candidate): ${src.tool} ${src.dir} @ ${src.mtime}`);
  for (const c of sorted.slice(1)) {
    if (c.treeHash === src.treeHash) { console.log(`  = ${c.tool}: identical to source`); continue; }
    console.log(`  ≠ ${c.tool}: differs`);
    try {
      const out = execSync(`robocopy "${src.dir}" "${c.dir}" /L /E /NJH /NP /NS /NC`, { stdio: ['pipe', 'pipe', 'pipe'] }).toString();
      const lines = out.split(/\r?\n/).filter(l => l.trim());
      const newer = lines.filter(l => l.includes('*'));
      console.log(`      source-only/newer files (${newer.length}):`);
      newer.slice(0, 10).forEach(l => console.log('        ' + l.trim()));
      if (newer.length > 10) console.log('        ...');
    } catch (e) {
      // robocopy /L 仍可能有 rc>7 的错误
      console.log('      (diff listing failed: ' + e.status + ')');
    }
  }
}

function cmdSync(name) {
  const reg = loadRegistry();
  const g = reg.groups.find(x => x.canonical === name);
  if (!g) return console.log('group not found: ' + name);
  const reals = realCopies(reg, g);
  if (reals.length < 2) return console.log('fewer than 2 real copies — nothing to sync');
  reals.forEach(refreshCopyMeta);
  const sorted = [...reals].sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
  const src = sorted[0];
  console.log(`SYNC ${name}: source = ${src.tool} (${src.dir}) @ ${src.mtime}`);
  logLine(`\n## sync ${name} @ ${new Date().toISOString()}`);
  logLine(`- source: ${src.dir} (mtime ${src.mtime})`);
  const targets = sorted.slice(1).filter(c => c.treeHash !== src.treeHash);
  if (!targets.length) { console.log('all copies already identical; nothing to do'); return; }

  for (const t of targets) {
    // 多余文件先移入回收站（镜像语义 = 目标应与源一致）
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const tdir = `${TRASH}/${ts}/${t.tool}-${t.canonical}`;
    const delList = [];
    const collectExtra = (s, d, rel) => {
      const sNames = new Set(fs.readdirSync(s));
      let dNames; try { dNames = fs.readdirSync(d); } catch { return; }
      for (const n of dNames) {
        const rs = path.join(s, n), rd = path.join(d, n), r = rel ? rel + '/' + n : n;
        if (!sNames.has(n)) { delList.push(r); }
        else if (fs.statSync(rs).isDirectory() && fs.statSync(rd).isDirectory()) collectExtra(rs, rd, r);
      }
    };
    collectExtra(src.dir, t.dir, '');
    if (delList.length) {
      fs.mkdirSync(tdir, { recursive: true });
      for (const rel of delList) {
        const from = path.join(t.dir, rel), to = path.join(tdir, rel);
        fs.mkdirSync(path.dirname(to), { recursive: true });
        try { fs.renameSync(from, to); } catch { // 跨盘（C:→E:）rename 会 EXDEV，退化为复制+删除
          fs.copyFileSync(from, to);
          fs.rmSync(from, { recursive: true, force: true });
        }
      }
      console.log(`  ${t.tool}: moved ${delList.length} extra file(s) to trash: ${delList.slice(0, 8).join(', ')}${delList.length > 8 ? ' ...' : ''}`);
      logLine(`  - ${t.tool}: trash ${delList.length} files -> ${tdir}`);
    }
    // 镜像复制
    try {
      execSync(`robocopy "${src.dir}" "${t.dir}" /E /COPY:DAT /DCOPY:DAT /R:1 /W:1 /NFL /NDL /NJH /NP`, { stdio: 'pipe' });
    } catch (e) { if (e.status >= 8) { console.log(`  ${t.tool}: robocopy FAILED rc=${e.status}`); logLine(`  - ${t.tool}: robocopy FAIL rc=${e.status}`); continue; } }
    refreshCopyMeta(t);
    const ok = t.treeHash === src.treeHash;
    console.log(`  ${t.tool}: ${ok ? 'synced OK (hash match)' : 'POST-CHECK MISMATCH'}`);
    logLine(`  - ${t.tool}: ${ok ? 'OK' : 'MISMATCH'} -> ${t.dir}`);
  }
  // 写回注册表元数据
  fs.writeFileSync(WB + '/data/registry.json', JSON.stringify(reg, null, 1));
  console.log('done.');
}

const [, , cmd, arg] = process.argv;
if (cmd === 'status') cmdStatus();
else if (cmd === 'diff') cmdDiff(arg);
else if (cmd === 'sync') cmdSync(arg);
else console.log('usage: node sync.cjs status | diff <group> | sync <group>');
