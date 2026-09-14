// server.cjs — skill 工作台本地服务（零依赖，端口 8788）
// API:
//   GET  /api/registry          — 注册表概览（组+副本，组内含一致性状态）
//   GET  /api/group/<canonical> — 组详情
//   GET  /api/file?path=&tool=  — 读 skill 文件（限白名单目录）
//   POST /api/file              — 保存文件 {path, content}
//   POST /api/create            — 新建 skill {tool, name, description}
//   POST /api/delete            — 删除单个真实副本 {tool, name}（移入回收站）
//   POST /api/sync              — 同步组 {canonical}（最后编辑胜出）
//   POST /api/rescan            — 重扫注册表
//   GET  /api/log               — 同步日志
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const WB = 'E:/knowledge/vault/workbenches/skill-workbench';
const PORT = 8788;

// 可访问目录白名单：注册表中出现的全部根 + vault/skills
function allowedRoots() {
  const reg = loadRegistry();
  const set = new Set();
  for (const c of reg.copies) set.add(path.resolve(c.link ? path.dirname(c.dir) : c.dir));
  set.add('E:\\knowledge\\vault\\skills');
  return [...set];
}
function loadRegistry() { return JSON.parse(fs.readFileSync(WB + '/data/registry.json', 'utf8')); }

function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

function safePath(p) {
  if (!p) return null;
  const abs = path.resolve(p);
  for (const root of allowedRoots()) {
    if (abs === root || abs.startsWith(root + path.sep)) return abs;
  }
  return null;
}

function regWithStatus() {
  const reg = loadRegistry();
  for (const g of reg.groups) {
    const reals = g.copies.map(id => reg.copies.find(c => c.id === id)).filter(c => c && !c.link);
    if (reals.length >= 2) {
      const hashes = new Set(reals.map(c => c.treeHash));
      g.syncState = hashes.size === 1 ? 'identical' : 'diverged';
      // 最新副本（=同步源候选）
      const sorted = [...reals].sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
      g.newestCopy = sorted[0].id;
      g.divergedTools = g.syncState === 'diverged' ? reals.map(c => c.tool) : [];
    } else {
      g.syncState = reals.length === 1 ? 'single-real' : 'shared-only';
    }
  }
  return reg;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let d = '';
    req.on('data', c => { d += c; if (d.length > 5e6) reject(new Error('body too large')); });
    req.on('end', () => { try { resolve(d ? JSON.parse(d) : {}); } catch (e) { reject(e); } });
  });
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), t = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, t);
    else fs.copyFileSync(s, t);
  }
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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (req.method === 'GET' && url.pathname === '/api/registry') {
      const reg = regWithStatus();
      return json(res, 200, { generatedAt: reg.generatedAt, totalCopies: reg.totalCopies, totalGroups: reg.totalGroups, groups: reg.groups, copies: reg.copies });
    }
    if (req.method === 'GET' && url.pathname === '/api/log') {
      const p = WB + '/data/log.md';
      return json(res, 200, { log: fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '' });
    }
    if (req.method === 'GET' && url.pathname.startsWith('/api/group/')) {
      const reg = regWithStatus();
      const canonical = decodeURIComponent(url.pathname.split('/').pop());
      const g = reg.groups.find(x => x.canonical === canonical);
      if (!g) return json(res, 404, { error: 'group not found' });
      const copies = g.copies.map(id => reg.copies.find(c => c.id === id));
      return json(res, 200, { group: g, copies });
    }
    if (req.method === 'GET' && url.pathname === '/api/file') {
      const p = safePath(url.searchParams.get('path'));
      if (!p) return json(res, 403, { error: 'path not allowed' });
      if (!fs.existsSync(p) || !fs.statSync(p).isFile()) return json(res, 404, { error: 'not a file' });
      return json(res, 200, { path: p, content: fs.readFileSync(p, 'utf8') });
    }
    if (req.method === 'POST' && url.pathname === '/api/file') {
      const b = await readBody(req);
      const p = safePath(b.path);
      if (!p) return json(res, 403, { error: 'path not allowed' });
      if (!fs.existsSync(p)) return json(res, 404, { error: 'file gone' });
      fs.writeFileSync(p, b.content, 'utf8');
      execFileSync('node', [WB + '/tools/scan.cjs'], { stdio: 'pipe' });
      return json(res, 200, { ok: true });
    }
    if (req.method === 'POST' && url.pathname === '/api/create') {
      const b = await readBody(req);
      const name = String(b.name || '').trim();
      if (!/^[a-z0-9][a-z0-9-]{1,63}$/.test(name)) return json(res, 400, { error: 'skill 名仅允许小写字母/数字/连字符（2-64 位）' });
      const reg = loadRegistry();
      const rootEntry = (b.tool === 'lark-master' ? { path: 'C:/Users/stars/.agents/skills' } : reg.copies.find(c => c.tool === b.tool && c.layer === 'user' && !c.link));
      const toolRoot = b.tool === 'lark-master' ? 'C:/Users/stars/.agents/skills' : path.dirname(rootEntry.dir);
      const dir = path.join(toolRoot, name);
      if (fs.existsSync(dir)) return json(res, 409, { error: '该工具下已存在同名 skill' });
      const desc = String(b.description || '').replace(/\r?\n/g, ' ').slice(0, 300);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'SKILL.md'),
        `---\nname: ${name}\ndescription: "${desc || 'TODO: 描述此 skill 的用途与触发时机'}"\n---\n\n# ${name}\n\nTODO: 编写 skill 正文（工作流、步骤、注意事项）。\n`, 'utf8');
      execFileSync('node', [WB + '/tools/scan.cjs'], { stdio: 'pipe' });
      return json(res, 200, { ok: true, dir });
    }
    if (req.method === 'POST' && url.pathname === '/api/delete') {
      const b = await readBody(req);
      const reg = loadRegistry();
      const c = reg.copies.find(x => x.id === b.id);
      if (!c) return json(res, 404, { error: 'copy not found' });
      if (c.link) return json(res, 400, { error: 'shared-link 入口不删，请删除其真身或用工具卸载' });
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const dst = path.join(WB, 'data', 'trash', ts, c.tool + '-' + c.name);
      copyDir(c.dir, dst);
      fs.rmSync(c.dir, { recursive: true, force: true });
      execFileSync('node', [WB + '/tools/scan.cjs'], { stdio: 'pipe' });
      return json(res, 200, { ok: true, trashedTo: dst });
    }
    if (req.method === 'POST' && url.pathname === '/api/sync') {
      const b = await readBody(req);
      const before = fs.readFileSync(WB + '/data/log.md', 'utf8').length;
      execFileSync('node', [WB + '/tools/sync.cjs', 'sync', String(b.canonical)], { stdio: 'pipe' });
      execFileSync('node', [WB + '/tools/scan.cjs'], { stdio: 'pipe' });
      const log = fs.readFileSync(WB + '/data/log.md', 'utf8').slice(before);
      return json(res, 200, { ok: true, log });
    }
    if (req.method === 'POST' && url.pathname === '/api/rescan') {
      execFileSync('node', [WB + '/tools/scan.cjs'], { stdio: 'pipe' });
      return json(res, 200, { ok: true });
    }
    // 静态页
    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(WB + '/public/index.html', 'utf8'));
    }
    json(res, 404, { error: 'not found' });
  } catch (e) {
    json(res, 500, { error: e.message });
  }
});

server.listen(PORT, '127.0.0.1', () => console.log(`skill workbench: http://127.0.0.1:${PORT}`));
