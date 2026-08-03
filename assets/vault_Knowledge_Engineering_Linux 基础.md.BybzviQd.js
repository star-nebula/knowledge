import{_ as c,a8 as p,o as r,c as d,ah as n,a as i,a3 as a,K as l,L as h}from"./chunks/framework.CdNVSOxJ.js";import"./chunks/theme.BBWCvTyn.js";const E=JSON.parse('{"title":"Linux 基础","description":"","frontmatter":{"title":"Linux 基础","created":"2026-05-22T00:00:00.000Z","tags":["Linux","系统管理","命令行"],"type":"概念解释","related":["[[Linux-MOC]]","[[Ubuntu 配置]]","[[Ubuntu 远程桌面]]","[[VSCode 远程开发配置]]"],"reference":null,"category":["🛠️ 工程工具","Linux"]},"headers":[],"relativePath":"vault/Knowledge/Engineering/Linux 基础.md","filePath":"vault/Knowledge/Engineering/Linux 基础.md","lastUpdated":1785140936000}'),g={name:"vault/Knowledge/Engineering/Linux 基础.md"};function o(y,s,F,C,b,f){const t=p("VPNolebaseInlineLinkPreview"),e=p("NolebaseGitContributors"),k=p("NolebaseGitChangelog");return r(),d("div",null,[s[5]||(s[5]=n('<h2 id="linux" tabindex="-1">Linux <a class="header-anchor" href="#linux" aria-label="Permalink to “Linux”">​</a></h2><h2 id="linux-基础" tabindex="-1">Linux 基础 <a class="header-anchor" href="#linux-基础" aria-label="Permalink to “Linux 基础”">​</a></h2><h4 id="linux的目录结构" tabindex="-1">Linux的目录结构 <a class="header-anchor" href="#linux的目录结构" aria-label="Permalink to “Linux的目录结构”">​</a></h4>',3)),i("ul",null,[s[2]||(s[2]=i("li",null,[i("p",null,"对比"),i("ul",null,[i("li",null,[i("p",null,[a("windows系统: "),i("span",{"data-type":"text",style:{"background-color":"var(--b3-card-info-background)",color:"var(--b3-card-info-color)"}},"森林结构（森系,）"),a("，有盘符的概念.")])]),i("li",null,[i("p",null,[a("Linux系统: "),i("span",{"data-type":"text",style:{"background-color":"var(--b3-card-info-background)",color:"var(--b3-card-info-color)"}},"树形结构"),a("，没有盘符的概念, 取而代之的是 根目录, 用 "),i("code",null,"/"),a("​ 来表示")])])])],-1)),i("li",null,[s[1]||(s[1]=i("p",null,"Linux的目录结构图解",-1)),i("p",null,[l(t,{class:"route-link nolebase-route-link-invalid",href:"#",target:"_target"},{default:h(()=>[...s[0]||(s[0]=[a("assets/1734055038079-20251228202842-zospmqf.png",-1)])]),_:1})])]),s[3]||(s[3]=n(`<li><p>关于Linux的目录, 我们常用的是:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">/bin</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 目录:</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 存储Linux基础命令的,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 例如:</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> cd,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> mv,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> cp...</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">/sbin目录:</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 存储Linux进阶命令,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 例如:</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ifconfig,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ...</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">/etc</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 目录:</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 存储的是Linux系统的配置信息.</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> </span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">/root目录:</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 超管</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">超级管理员</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">目录,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 也是</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> root账号所在的目录.</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> </span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">/home目录:</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 普通账号的家目录,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 我们创建的账号,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 默认会存储在这里.</span></span></code></pre></div></li>`,1))]),s[6]||(s[6]=n(`<h4 id="命令通用格式" tabindex="-1">命令通用格式 <a class="header-anchor" href="#命令通用格式" aria-label="Permalink to “命令通用格式”">​</a></h4><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">command</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [-options] [parameter]</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">#   command: 命令本身（必写）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">#   options: 命令的选项，控制命令的行为细节</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># parameter: 命令的参数，控制命令的指向目标</span></span></code></pre></div><h4 id="目录操作" tabindex="-1">目录操作 <a class="header-anchor" href="#目录操作" aria-label="Permalink to “目录操作”">​</a></h4><ul><li><p>​<code>ls</code>​ 查看当前目录下的内容</p><blockquote><p>ls（list）：显示所有</p></blockquote><blockquote></blockquote><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ls</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [-a </span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">-l</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -h</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">] [文件夹路径]</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># a(all): 列出全部文件（包含隐藏的文件/文件夹）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># l(line): 以行（竖向排列）的形式展示，显示详细信息</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># h(human): 以人形化的形式展示内容（需与 -l 共用）</span></span></code></pre></div><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">【示例】</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ls</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">			查看当前目录下的内容</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">不包括隐藏</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ls</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ./</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 		查看当前目录下的内容</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">不包括隐藏</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ls</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -a</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">		查看当前目录下的内容</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">包括隐藏</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ls</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -l</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">		以行的方式查看当前目录下的内容</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">不包括隐藏</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ls</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -al</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">		以行的方式查看当前目录下的内容</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">包括隐藏</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ls</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -lh</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">		以行,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 人性化的方式查看当前目录下的内容</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">不包括隐藏</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ls</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -alh</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">		以行,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 人性化的方式查看当前目录下的内容</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">包括隐藏</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ls</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -lh</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> /etc</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 以行,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 人性化的方式查看指定目录下的内容</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">不包括隐藏</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ll</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">			等价于</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ls</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -l</span></span></code></pre></div></li><li><p>​<code>pwd</code>​ 查看当前目录</p><blockquote><p>pwd（print work directory）： 打印工作目录, 即: 当前所在的目录</p></blockquote><blockquote></blockquote><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">pwd</span></span></code></pre></div></li><li><p>​<code>cd</code>​ 目录切换</p><blockquote><p>cd（change directory）：改变目录</p></blockquote><blockquote></blockquote><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 目录路径</span></span></code></pre></div><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">【示例】</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 要切换到的目录</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# 切换路径.</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ./</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">				# 切换到当前目录, 相当于: 啥都没做.</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> /</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">				# 切换到根目录</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ~</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">				# 切换到家目录（等同于直接 cd）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 特殊路径</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">./</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">			# 代表当前目录</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">..</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">			# 代表上级路径</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">.</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">./</span><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">..</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# 代表上上级路径</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;">~</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">			# 代表当前账号的家目录（root账号 -&gt; /root,  其它账号 -&gt; /home）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">-</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">			# 在最近操作过的两个目录之间做 切换</span></span></code></pre></div></li><li><p>​<code>mkdir</code>​ 创建目录</p><blockquote><p>mkdir（make directory）：制作目录</p></blockquote><blockquote></blockquote><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">mkdir</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [-p] 目录路径  </span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 如果是创建多级目录需要加 -p</span></span></code></pre></div></li></ul><h4 id="文件操作" tabindex="-1">文件操作 <a class="header-anchor" href="#文件操作" aria-label="Permalink to “文件操作”">​</a></h4><ul><li><p>​<code>touch</code>​ 创建文件</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">touch</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 文件路径</span></span></code></pre></div></li><li><p>​<code>cat</code>​ 翻页查看文件内容（默认为最后一页）</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">cat</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 文件路径</span></span></code></pre></div></li><li><p>​<code>more</code>​ 分页查看文件内容</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">more</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 文件路径</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># b -&gt; back: 返回上一页</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># d -&gt; down: 下一页</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># q -&gt; quit: 退出</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># enter: 下一行</span></span></code></pre></div></li><li><p>​<code>cp</code>​ 拷贝文件</p><blockquote><p>cp（copy）：拷贝</p></blockquote><blockquote></blockquote><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">cp</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [-r] 源文件(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">夹</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)路径 目的地文件(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">夹</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)路径</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 拷贝文件夹 -r</span></span></code></pre></div></li><li><p>​<code>mv</code>​ 移动文件</p><blockquote><p>mv（move）：移动，剪切</p></blockquote><blockquote></blockquote><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">mv</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 源位置</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 目的地</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 可用于“重命名”</span></span></code></pre></div></li><li><p>​<code>rm</code>​ 删除文件</p><blockquote><p>rm（remove）：删除</p></blockquote><blockquote></blockquote><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">rm</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [-r </span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">-f</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">] 文件夹（文件路径）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -f : force 强制删除，不提示</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -r : recursive 递归删除</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">rm</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -rf</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 文件（夹）</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">  # 直接删除无提示（文件/文件夹）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">rm</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -rf</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> /</span><span style="--shiki-light:#005CC5;--shiki-dark:#E5C07B;">*</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">  # 相当于删盘符，慎重</span></span></code></pre></div></li></ul><h4 id="查找相关" tabindex="-1">查找相关 <a class="header-anchor" href="#查找相关" aria-label="Permalink to “查找相关”">​</a></h4><ul><li><p>​<code>which</code>​ 查找Linux 命令所在的目录</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">which</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> Linux的命令名</span></span></code></pre></div></li><li><p>​<code>find</code>​ 根据文件名 或者 文件大小，查找对应的文件</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">find</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 要查找的路径</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -name</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> &#39;*文件名&#39;</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# *代表 通配符.</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">find</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 要查找的路径</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -size</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> +10M</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">			# 查找大小在10M以上的文件</span></span></code></pre></div></li></ul><h4 id="管道命令和过滤" tabindex="-1">管道命令和过滤 <a class="header-anchor" href="#管道命令和过滤" aria-label="Permalink to “管道命令和过滤”">​</a></h4><ul><li><p>​<code>grep</code>​ 过滤，显示过滤内容的所在行</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">grep</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [-n] 关键字 文件路径</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -n : 在结果中显示匹配关键字的行号</span></span></code></pre></div></li><li><p>​<code>|</code>​ 管道命令，将前边命令的执行结果，作为后边命令的数据源来处理（即：将前边的输出作为后边的输入）</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">命令</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> 命令</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 例：</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">cat</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 1.txt</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> grep</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> python</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> grep</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> pandas</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 从1.txt文件中过滤出python, 在其基础上再过滤出pandas</span></span></code></pre></div></li></ul><h4 id="echo、重定向、tail" tabindex="-1">echo、重定向、tail <a class="header-anchor" href="#echo、重定向、tail" aria-label="Permalink to “echo、重定向、tail”">​</a></h4><ul><li><p>​<code>echo</code>​ 在命令行内输出指定内容</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> &quot;输出的内容&quot;</span></span></code></pre></div></li><li><p>​<code>\`</code>​ 反引号，将字符串当成linux命令执行</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> \`</span><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">pwd</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">\`</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">  # 将pwd作为命令执行并将其结果输出</span></span></code></pre></div></li><li><p>重定向符</p><ul><li><p>​<code>&gt;</code>​ 将左侧命令的结果，<span data-type="text" style="background-color:var(--b3-card-info-background);color:var(--b3-card-info-color);">覆盖</span>写入到符号右侧指定的文件中</p></li><li><p>​<code>&gt;&gt;</code>​ 将左侧命令的结果，<span data-type="text" style="background-color:var(--b3-card-info-background);color:var(--b3-card-info-color);">追加</span>写入到符号右侧指定的文件中</p></li></ul><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> &#39;hello&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 1.txt</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">  # 将&quot;hello&quot;覆盖写入1.txt</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> &#39; world&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> &gt;&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 1.txt</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">  # 将&quot; world&quot;追加写入1.txt</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ls</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> /</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> &gt;&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 2.txt</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">  # 将ls /的返回结果，写入2.txt</span></span></code></pre></div></li><li><p>​<code>tail</code>​ 查看文件尾部内容，跟踪文件的最新更改</p><blockquote><p>使用场景：查看日志文件</p></blockquote><blockquote></blockquote><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">tail</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [-f </span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">-num</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">] 文件路径</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -f : 持续跟踪</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -num : 查看尾部行数（默认10行）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 例：持续跟踪日志文件</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">tail</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -100f</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> python.log</span></span></code></pre></div></li><li><p>​<code>head</code>​ 查看文件头部内容</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">head</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [-num] 文件路径</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -num : 查看头部行数（默认10行）</span></span></code></pre></div></li></ul><h4 id="查看命令的帮助手册" tabindex="-1">查看命令的帮助手册 <a class="header-anchor" href="#查看命令的帮助手册" aria-label="Permalink to “查看命令的帮助手册”">​</a></h4><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># --help 属性</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">命令名</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> --help</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# 例如:   ls --help</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 格式：man 命令名</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">man</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ls</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">			  	# 查看ls命令的使用手册</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">man</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ls</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> &gt;&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ls.txt</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">   	# 把ls命令的使用方式保存到文件中.</span></span></code></pre></div><h2 id="vi、vim-编辑器" tabindex="-1">vi、vim 编辑器 <a class="header-anchor" href="#vi、vim-编辑器" aria-label="Permalink to “vi、vim 编辑器”">​</a></h2><blockquote><p>vi（visual interface），Linux中的文本编辑器</p></blockquote><blockquote></blockquote><blockquote><p>vim 为 vi 的加强版，兼容 vi 的所有指令，且具有 shell 程序编辑的功能，可以通过字体颜色辨别语法的正确性</p></blockquote>`,18)),i("p",null,[l(t,{class:"route-link nolebase-route-link-invalid",href:"#",target:"_target"},{default:h(()=>[...s[4]||(s[4]=[a("assets/image-20251229114422-ale1tu2.png",-1)])]),_:1})]),s[7]||(s[7]=n(`<p>三种工作模式</p><ul><li><p>命令模式（command mode）：此模式以命令驱动执行不同的功能（不能自由进行文本编辑）</p></li><li><p>输入模式（insert mode）：即编辑模式，可对文件内容自由编辑</p></li><li><p>底线命令模式（last line mode）：以 <code>:</code>​ 为前缀，通常用于文件的保存、退出</p></li></ul><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">【简单示例】</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">vim</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 1.txt</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">   # 进入文件</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">----------</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 文件内部</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> ----------</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">按下键盘</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> i，进入编辑模式</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">编辑完成</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">按下</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> Esc，退出编辑模式</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">输入</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> :wq，保存并退出文件</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">----------</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> &quot;1.txt&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> ----------</span></span></code></pre></div><div class="language-vim"><button title="Copy Code" class="copy"></button><span class="lang">vim</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">【命令模式】</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">i		在当前位置插入</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">o		向下插入一行</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">O		向上插入一行</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">gg		回到文件头部（首行）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">G		回到文件末尾（尾行）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">dd		删除当前行</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">ndd		连续向下删除n行（包括当前行）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">yy		复制当前行</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">nyy		连续向下复制n行（包括当前行）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">p		粘贴</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">u		侧销</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">ctrl </span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;">+</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> r  		反撤销</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">shift </span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;">+</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> z </span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;">+</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> z	等同于 :wq</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">/内容			查找内容，找到后高亮显示</span></span></code></pre></div><div class="language-vim"><button title="Copy Code" class="copy"></button><span class="lang">vim</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">【底线（底行）模式】</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">:wq		保存并退出</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">:wq</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;">!</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">	强制保存并退出</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">:q		退出</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">:q</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;">!</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">		强制退出</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">set</span><span style="--shiki-light:#005CC5;--shiki-dark:#ABB2BF;"> nu</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">		设置行号</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#D73A49;--shiki-dark:#C678DD;">set</span><span style="--shiki-light:#005CC5;--shiki-dark:#ABB2BF;"> nonu</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> 	取消行号</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">:nohl		取消高亮</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">:行数		跳转到指定行</span></span></code></pre></div><h2 id="linux-中的用户" tabindex="-1">Linux 中的用户 <a class="header-anchor" href="#linux-中的用户" aria-label="Permalink to “Linux 中的用户”">​</a></h2><ul><li><p>root 用户（超级管理员）拥有最大的系统操作权限，而普通用户在许多地方的权限是受限的</p></li><li><p>创建用户</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">useradd</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 用户名</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">	# 创建用户</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">passwd</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 用户名</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# 为用户指定密码</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">su</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 用户名</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">			# 切换用户</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 其它命令</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# 借用root权限</span></span></code></pre></div></li><li><p>为创建的用户赋予权限</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">vim</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> /etc/sudoers</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">visudo</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> /etc/sudoers</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# 保存时会自动检测，报错则拒绝写入</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 找到“root    ALL=(ALL)       ALL”这一行，照着模样在下面加</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">用户名</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">    ALL=</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ALL</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)       </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">ALL</span></span></code></pre></div></li></ul><h2 id="权限控制-chmod-命令" tabindex="-1">权限控制：chmod 命令 <a class="header-anchor" href="#权限控制-chmod-命令" aria-label="Permalink to “权限控制：chmod 命令”">​</a></h2><blockquote><p>更改权限：修改文件、文件夹的权限信息</p></blockquote><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">chmod</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [-R] 权限 文件(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">文件夹</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -R : 对文件夹内的全部内容应用同样的操作</span></span></code></pre></div><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 例：传统写法</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">chmod</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> u=rwx,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> g=rx,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> o=x</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> text.txt</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"> # 将文件权限修改为：rwxr-x--x</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">chmod</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -R</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> u=rwx,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> g=rx,</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> o=x</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> text</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">  # 将文件夹test及其内全部内容的权限设置为：rwxr-x--x </span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># u： user所属用户权限</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># g：group组权限</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># o：other其它用户权限</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">chmod</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -R</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> +r</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> text</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">	# 为所有用户添加 r权限</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">chmod</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -R</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> g-w</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> text</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">	# 将group组的 w权限 删除</span></span></code></pre></div><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 例：引入数字权限（常用）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">chmod</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 777</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> text.txt</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">  	# 将文件权限修改为：rwxrwxrwx</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">chmod</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -R</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 751</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> text</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# 将文件夹test及其内全部内容的权限设置为：rwxr-x--x</span></span></code></pre></div><ul><li><p>权限符号</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">r</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	只读</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">w</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	只写</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">x</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	可执行</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	无权限</span></span></code></pre></div></li><li><p>权限的数字序号：用3位数字分别代表，<span data-type="text" style="background-color:var(--b3-card-info-background);color:var(--b3-card-info-color);">用户权限、用户组权限、其它用户权限</span></p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">0</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 	无任何权限</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	即</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> ---</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">1</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	仅有x权限</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	即</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> --x</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">2</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	仅有w权限</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	即</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -w-</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">3</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 	有w和x权限</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	即</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -wx</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">4</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	仅有r权限</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	即</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> r--</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">5</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 	有r和x权限</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	即</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> r-x</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">6</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	有r和w权限</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	即</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> rw-</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">7</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	有全部权限</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">	即</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> rwx</span></span></code></pre></div></li></ul><blockquote><p>修改用户和用户组</p></blockquote><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 格式</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">chown</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [-R] [用户][:][用户组] 文件或者文件夹路径</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 例子</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">chown</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> zhangsan</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 1.txt</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		 # 改变 用户</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">chown</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> :zhangsan</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 1.txt</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        # 改变 用户组</span></span></code></pre></div><h2 id="快捷键" tabindex="-1">快捷键 <a class="header-anchor" href="#快捷键" aria-label="Permalink to “快捷键”">​</a></h2><ul><li><p>​<kbd>ctrl + c</kbd>​ 强制停止</p></li><li><p>​<kbd>ctrl + d</kbd>​ 退出或登出</p></li></ul><p>历史命令搜索</p><ul><li><p>​<code>history</code>​ 查看历史命令</p></li><li><p>​<code>!命令前缀</code>​ 自动执行匹配前缀的上一次命令 并执行</p></li><li><p>​<kbd>ctrl + r</kbd>​ 输入内容去匹配历史命令</p><p>键盘 <kbd>←</kbd>​ <kbd>→</kbd>​ 键 选择命令</p><p>若命令是需要的，按<kbd>enter</kbd>​回车直接执行</p></li></ul><p>光标移动快捷键</p><ul><li><p>​<kbd>ctrl + a</kbd>​ 跳到命令开头</p></li><li><p>​<kbd>ctrl + e</kbd>​ 跳到命令结尾</p></li><li><p>​<kbd>ctrl + ←</kbd>​ 向左跳一个单词</p></li><li><p>​<kbd>ctrl + →</kbd>​ 向右跳一个单词</p></li></ul><p>清屏</p><ul><li><p>​<kbd>ctrl + l</kbd>​</p></li><li><p>​<code>clear</code>​</p></li></ul><h2 id="linux的服务控制命令" tabindex="-1">Linux的服务控制命令 <a class="header-anchor" href="#linux的服务控制命令" aria-label="Permalink to “Linux的服务控制命令”">​</a></h2><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 命令格式</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> start</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> stop</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> restart</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> status</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> enable</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> disable</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 服务名</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 如果你的虚拟机的IP突然变成了127.0.0.1这种情况, 解决方案如下:</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> stop</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> NetworkManager</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">			# 关闭主网络服务</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> disable</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> NetworkManager</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# 禁用主网络服务开机自启动</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> restart</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> network</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">			    # 重启副网络服务</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ifconfig</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">							   	# 重新查看IP</span></span></code></pre></div><h2 id="linux-软件安装" tabindex="-1">Linux 软件安装 <a class="header-anchor" href="#linux-软件安装" aria-label="Permalink to “Linux 软件安装”">​</a></h2><ul><li><p>方式一：手动下载安装包，并手动安装</p></li><li><p>方式二：RPM包管理器（RedHat Packet Management, 小红帽的包管理器），会自动下载包，但是不会解决依赖</p></li><li><p>方式三：<code>yum</code>​ 命令安装，自动去Linux的应用商店中搜索并安装，并自动解决依赖问题</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">yum</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [-y] [install </span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;">|</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> remove </span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;">|</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> search] 软件名称</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -y  自动确认，无需手动确认或卸载过程</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># install 安装</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># search  搜索</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">#【注】需要root权限</span></span></code></pre></div></li></ul><h2 id="软连接" tabindex="-1">软连接 <a class="header-anchor" href="#软连接" aria-label="Permalink to “软连接”">​</a></h2><p>在系统中创建软链接，可以将文件、文件夹链接到其它位置（类似win中的快捷方式）</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ln</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 参数1</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 参数2</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -s 	创建软连接</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 参数1	被链接的文件或文件夹</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 参数2	链接的目的地</span></span></code></pre></div><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">【硬链接】</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ln</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 要被链接的文件路径</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 硬链接名</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 作用: 动态备份.</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ln</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 1.txt</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 3.txt</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# 无论是修改1.txt 还是 3.txt, 另一个都会同步改变.</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 删除源文件，链接仍可用</span></span></code></pre></div><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ln</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> /etc/sysconfig/network-scripts/ifcfg-ens33</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ip</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">vim</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ip</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">	# 修改IP，不再需要找要修改的文件</span></span></code></pre></div><p>【扩展】修改IP</p><ul><li><p>打开并编辑文件 /etc/sysconfig/network-scripts/ifcfg-ens33</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">TYPE</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;Ethernet&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">PROXY_METHOD</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;none&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">BROWSER_ONLY</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;no&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">BOOTPROTO</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;none&quot;</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">				# ip分配方式, none, static, dhcp</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">DEFROUTE</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;yes&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">IPV4_FAILURE_FATAL</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;no&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">IPV6INIT</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;yes&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">IPV6_AUTOCONF</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;yes&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">IPV6_DEFROUTE</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;yes&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">IPV6_FAILURE_FATAL</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;no&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">IPV6_ADDR_GEN_MODE</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;stable-privacy&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">NAME</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;ens33&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">UUID</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;df73d9da-f16b-4a80-beac-e4e5602703f7&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">DEVICE</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;ens33&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">ONBOOT</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;yes&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">IPV6_PRIVACY</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;no&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">IPADDR</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;192.168.88.77&quot;</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">			# ip地址，修改ip地址</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">PREFIX</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;24&quot;</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">					   	# 子网掩码, 或者写为 NETMASK=&quot;255.255.255.0&quot;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">GATEWAY</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;192.168.88.1&quot;</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">			# 网关, 要和: Vmware软件的虚拟网络编辑器 和 本地VMNet8网卡保持一致.</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">DNS1</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;8.8.8.8&quot;</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">				   	# DNS服务器1</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E06C75;">DOMAIN</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;114.114.114.114&quot;</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# DNS服务器2</span></span></code></pre></div></li><li><p>重启副网络服务</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> restart</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> network</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# 重启副网络服务</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ifconfig</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">						# 查看IP</span></span></code></pre></div></li></ul><h2 id="linux-网络相关" tabindex="-1">Linux 网络相关 <a class="header-anchor" href="#linux-网络相关" aria-label="Permalink to “Linux 网络相关”">​</a></h2><ul><li><p>查看本机 IP地址</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ifconfig</span></span></code></pre></div></li><li><p>查看本机的主机名</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">hostname</span></span></code></pre></div></li><li><p>修改本机的主机名</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">hostnamectl</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> set-hostname</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 修改后的主机名</span></span></code></pre></div></li><li><p>配置域名解析（主机名映射）</p><blockquote><p>好处：可以通过主机名找到对应计算机的IP地址</p></blockquote><blockquote></blockquote><blockquote><p>先通过系统本地的记录去查找，如果找不到就联网去公开DNS服务器去查找</p></blockquote><blockquote></blockquote><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 配置域名映射</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">vim</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> /etc/hosts</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># ---------- hosts ----------</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">IP地址</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 域名</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [域名2 </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">...]</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"> # 在末尾追加一行</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># ---------------------------</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># :wq 保存退出即可生效</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 修改windows系统的域名映射（使用虚拟机Linux的情况下）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">打开文件</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> c:/Windows/System32/drivers/etc/hosts</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">IP地址</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 域名</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [域名2 </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">...]</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">  # 添加域名映射</span></span></code></pre></div></li><li><p>​<code>wget</code>​ 下载网络资源</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">wget</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> url地址</span></span></code></pre></div></li><li><p>​<code>curl</code>​ Linux向url地址发起请求, 获取响应信息, 模拟爬虫.</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">curl</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> url地址</span></span></code></pre></div></li><li><p>查看端口号</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">netstat</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -anp</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# anp: all network port</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 结合管道符 和 过滤命令一起用</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">netstat</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -anp</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> grep</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 3306</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">	</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">netstat</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -anp</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> grep</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ssh</span></span></code></pre></div></li></ul><h2 id="linux的进程相关" tabindex="-1">Linux的进程相关 <a class="header-anchor" href="#linux的进程相关" aria-label="Permalink to “Linux的进程相关”">​</a></h2><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 查看本机所有的进程</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ps</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -ef</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> </span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 过滤出指定的进程</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ps</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -ef</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> grep</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 进程名</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ps</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -ef</span><span style="--shiki-light:#D73A49;--shiki-dark:#ABB2BF;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;"> grep</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 进程id</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 强制杀死(关闭)进程.</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">kill</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -9</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> pid值</span><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">		# 进程id(pid)</span></span></code></pre></div><h2 id="linux的压缩和解压缩" tabindex="-1">Linux的压缩和解压缩 <a class="header-anchor" href="#linux的压缩和解压缩" aria-label="Permalink to “Linux的压缩和解压缩”">​</a></h2><ul><li><p>方式一：tarball 归档方式</p><blockquote><p>​<code>.tar</code>​ （tarball）归档文件，简单的将文件组装到一个 <code>.tar</code>​ 的文件内，仅仅是简单的封装</p></blockquote><blockquote></blockquote><blockquote><p>​<code>.gz</code>​ （<code>.tar.gz</code>​\\<code>gzip</code>​）使用gzip压缩算法将文件压缩到一个文件内，可以极大的减少压缩后的体积</p></blockquote><blockquote></blockquote><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">tar</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [-c </span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">-v</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -x</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -f</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -z</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -C</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">] 参数1 参数2 ...</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -c	创建压缩文件，用于压缩模式</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -v	显示压缩、解压过程，用于查看进度</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -x	解压模式</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -f	要解压的文件（-f需要在所有选项中处于最后）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -z	gzip模式（默认为普通 tarball模式）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># -C	选择解压的目的地，用于解压模式</span></span></code></pre></div><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 压缩</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">tar</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -zcvf</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 压缩包名.tar.gz</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 要被压缩的文件</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 解压缩</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">tar</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -zxvf</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 压缩包名.tar.gz</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -C</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 要解压到的路径</span></span></code></pre></div></li><li><p>方式二：<code>zip</code>​ 和 <code>unzip</code>​</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 压缩</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">zip</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -r</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 压缩包名.zip</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 文件</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 目录的路径</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 解压</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">unzip</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 压缩包名.zip</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> 解压到的目录</span></span></code></pre></div></li></ul><hr>`,41)),l(e),l(k)])}const B=c(g,[["render",o]]);export{E as __pageData,B as default};
