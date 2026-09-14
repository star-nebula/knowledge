// gen-restore-plan.js — 从 P0 快照生成 P1 还原动作清单（dry-run）
const fs = require('fs');
const SNAP = 'E:/knowledge/backup/skills-restore-2026-09-14/junction-map-2026-09-14.txt';
const OUT = 'E:/knowledge/vault/workbenches/skill-workbench/data/restore-plan.json';

let t = fs.readFileSync(SNAP, 'utf8');
if (t.charCodeAt(0) === 0xFFFE || t.charCodeAt(0) === 0xFEFF) t = t.slice(1);

const BS = String.fromCharCode(92);
const r1 = [], keep = [], broken = [];
let cur = null;
for (const line of t.split(/\r?\n/)) {
  if (line.startsWith('###')) { cur = line.slice(4).trim(); continue; }
  const m = line.match(/^([^|]+)\|(Junction|)\|(.*)$/);
  if (!m) continue;
  const [, name, type, target] = m;
  if (type !== 'Junction') continue;
  const rec = { dir: cur, name, target };
  const live = fs.existsSync(rec.dir + BS + name);
  const masterLive = target && fs.existsSync(target);
  if (!masterLive) { broken.push({ ...rec, live }); continue; }
  if (target.toLowerCase().startsWith('e:' + BS + 'knowledge' + BS + 'vault' + BS + 'skills')) r1.push(rec);
  else keep.push(rec);
}

const byDir = {};
r1.forEach(x => { (byDir[x.dir] = byDir[x.dir] || []).push(x.name); });
console.log('=== R1 vault-junction materialize:', r1.length, '===');
Object.entries(byDir).forEach(([d, names]) => console.log(`  ${d} => ${names.length}`));

console.log('=== KEEP (single-master shared links):', keep.length, '===');
const roots = {};
keep.forEach(x => {
  const root = x.target.split(BS).slice(0, 3).join(BS);
  (roots[root] = roots[root] || []).push(x.name);
});
Object.entries(roots).forEach(([r, a]) => console.log(`  ${r} => ${a.length}`));

console.log('=== BROKEN (master missing):', broken.length, '===');
broken.forEach(x => console.log(`  ${x.dir}\\${x.name} -> ${x.target}`));

fs.mkdirSync(require('path').dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), r1, keep, broken }, null, 2));
console.log('plan written to', OUT);
