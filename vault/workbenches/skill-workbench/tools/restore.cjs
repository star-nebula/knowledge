// restore.js — P1 物理还原执行器
// 动作：对 restore-plan.json 中每条 r1 记录：
//   1) cmd rmdir 删除 Junction（只删链接，不碰真身）
//   2) robocopy 从 vault 主本复制真实目录（保留时间戳）
//   3) 树哈希校验副本 == 主本
// 用法: node restore.cjs [--exec]   （无 --exec 仅打印动作清单 = dry-run）
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PLAN = 'E:/knowledge/vault/workbenches/skill-workbench/data/restore-plan.json';
const LOG = 'E:/knowledge/vault/workbenches/skill-workbench/data/restore-log.md';
const VAULT = 'E:/knowledge/vault/skills';
const EXEC = process.argv.includes('--exec');

const p = JSON.parse(fs.readFileSync(PLAN, 'utf8'));
const results = { ok: [], fail: [] };

function treeHash(root) {
  // 轻量树哈希：相对路径+大小+mtime 的 sha1
  const { createHash } = require('crypto');
  const h = createHash('sha1');
  const walk = d => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const r = path.join(d, e.name);
      const rel = path.relative(root, r);
      if (e.isDirectory()) { walk(r); }
      else {
        const st = fs.statSync(r);
        h.update(rel + '|' + st.size + '|' + Math.floor(st.mtimeMs / 2000) + '\n');
      }
    }
  };
  walk(root);
  return h.digest('hex');
}

function robocopy(src, dst) {
  // rc<8 为成功；复制目录数据+时间戳
  try {
    execSync(`robocopy "${src}" "${dst}" /E /COPY:DAT /DCOPY:DAT /R:1 /W:1 /NFL /NDL /NJH /NP`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    return e.status < 8;
  }
}

const lines = [`# 还原执行日志\n`, `- 时间：${new Date().toISOString()}`, `- 模式：${EXEC ? 'EXEC 实际执行' : 'DRY-RUN 预演'}`, ''];

for (const rec of p.r1) {
  const B = String.fromCharCode(92);
  const linkPath = rec.dir + B + rec.name;
  const master = rec.target; // vault 主本
  const toolDir = rec.dir.split(B).slice(2, 4).join('/');
  const action = `materialize ${toolDir}/${rec.name}`;
  lines.push(`## ${action}\n`, `- link: ${linkPath}`, `- master: ${master}`);

  if (!EXEC) { console.log('[DRY] ' + action); continue; }

  try {
    if (!fs.existsSync(master)) throw new Error('vault master missing: ' + master);
    // 1) 删 Junction
    execSync(`cmd /c rmdir "${linkPath}"`, { stdio: 'pipe' });
    if (fs.existsSync(linkPath)) throw new Error('rmdir failed, link still exists');
    // 2) 复制真实副本
    if (!robocopy(master, linkPath)) throw new Error('robocopy failed');
    // 3) 校验
    const hm = treeHash(master), hc = treeHash(linkPath);
    if (hm !== hc) throw new Error(`hash mismatch master=${hm} copy=${hc}`);
    const isReal = fs.lstatSync(linkPath).isDirectory() && !fs.readlinkSync && true;
    results.ok.push(action);
    lines.push(`- 结果：OK (hash ${hm.slice(0, 8)})`);
    console.log('[OK] ' + action);
  } catch (e) {
    results.fail.push(action + ' :: ' + e.message);
    lines.push(`- 结果：FAIL — ${e.message}`);
    console.log('[FAIL] ' + action + ' :: ' + e.message);
  }
}

lines.push('', `## 汇总`, `- OK: ${results.ok.length}`, `- FAIL: ${results.fail.length}`);
if (results.fail.length) lines.push('', '失败清单：', ...results.fail.map(f => '- ' + f));
fs.writeFileSync(LOG, lines.join('\n'));
console.log(`\nDONE: ok=${results.ok.length} fail=${results.fail.length} log=${LOG}`);
if (!EXEC) console.log('(dry-run only, rerun with --exec to apply)');
