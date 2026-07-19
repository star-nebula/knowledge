import{_ as o,a8 as a,o as l,c as p,ah as i,K as n}from"./chunks/framework.BFh3fQh2.js";import"./chunks/theme.HquEHxkg.js";const f=JSON.parse('{"title":"All notes-MOC","description":"","frontmatter":{"title":"All notes-MOC","created":"2026-07-08T00:00:00.000Z","tags":["MOC","索引"],"type":"专题聚合页","abstract":"Knowledge 区全部笔记的总索引——按笔记名、领域、所属 MOC 三列呈现，支持快速定位与导航。"},"headers":[],"relativePath":"vault/Knowledge/All notes-MOC.md","filePath":"vault/Knowledge/All notes-MOC.md","lastUpdated":1784459023000}'),c={name:"vault/Knowledge/All notes-MOC.md"};function r(d,s,u,g,q,_){const e=a("NolebaseGitContributors"),t=a("NolebaseGitChangelog");return l(),p("div",null,[s[0]||(s[0]=i(`<h1 id="全部笔记索引" tabindex="-1">全部笔记索引 <a class="header-anchor" href="#全部笔记索引" aria-label="Permalink to “全部笔记索引”">​</a></h1><blockquote><p>自动扫描 Knowledge 下所有非 MOC 笔记，通过反向链接（MOC → 笔记）推断所属专题。</p></blockquote><div class="language-dataviewjs"><button title="Copy Code" class="copy"></button><span class="lang">dataviewjs</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"><span>const pages = dv.pages(&#39;&quot;Knowledge&quot;&#39;).where(p =&gt; p.type !== &quot;专题聚合页&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const rows = [];</span></span>
<span class="line"><span>for (const p of pages.sort(p =&gt; p.file.folder + p.file.name)) {</span></span>
<span class="line"><span>  const domain = p.file.folder.replace(&quot;Knowledge/&quot;, &quot;&quot;);</span></span>
<span class="line"><span>  const mocLinks = p.file.inlinks</span></span>
<span class="line"><span>    .map(l =&gt; l.path.split(&quot;/&quot;).pop().replace(&quot;.md&quot;, &quot;&quot;))</span></span>
<span class="line"><span>    .filter(name =&gt; name.includes(&quot;MOC&quot;))</span></span>
<span class="line"><span>    .join(&quot;, &quot;);</span></span>
<span class="line"><span>  rows.push([p.file.link, domain, mocLinks || &quot;—&quot;]);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>dv.table([&quot;笔记&quot;, &quot;领域&quot;, &quot;所属MOC&quot;], rows);</span></span></code></pre></div>`,3)),n(e),n(t)])}const b=o(c,[["render",r]]);export{f as __pageData,b as default};
