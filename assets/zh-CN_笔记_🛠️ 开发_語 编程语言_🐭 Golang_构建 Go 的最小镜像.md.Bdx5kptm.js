import{_ as r,a8 as l,o,c as d,a as e,a3 as a,K as i,au as g,L as t}from"./chunks/framework.39_1D5If.js";import"./chunks/theme.B5YcMCBp.js";const u=JSON.parse('{"title":"构建 Go 的最小镜像","description":"","frontmatter":{"tags":["开发/容器化/Docker","开发/云原生/Docker","软件/云原生/docker","开发/语言/Golang","开发/容器化/Docker/Dockerfile"]},"headers":[],"relativePath":"zh-CN/笔记/🛠️ 开发/語 编程语言/🐭 Golang/构建 Go 的最小镜像.md","filePath":"zh-CN/笔记/🛠️ 开发/語 编程语言/🐭 Golang/构建 Go 的最小镜像.md"}'),c={name:"zh-CN/笔记/🛠️ 开发/語 编程语言/🐭 Golang/构建 Go 的最小镜像.md"};function y(A,s,F,f,E,B){const p=l("NolebasePageProperties"),n=l("VPNolebaseInlineLinkPreview"),h=l("NolebaseGitContributors"),k=l("NolebaseGitChangelog");return o(),d("div",null,[s[7]||(s[7]=e("h1",{id:"构建-go-的最小镜像",tabindex:"-1"},[a("构建 Go 的最小镜像 "),e("a",{class:"header-anchor",href:"#构建-go-的最小镜像","aria-label":"Permalink to “构建 Go 的最小镜像”"},"​")],-1)),i(p),s[8]||(s[8]=g(`<h5 id="文档版本" tabindex="-1">文档版本 <a class="header-anchor" href="#文档版本" aria-label="Permalink to “文档版本”">​</a></h5><table tabindex="0"><thead><tr><th>编辑者</th><th>版本</th><th>变更日期</th><th>变更说明</th></tr></thead><tbody><tr><td>Neko</td><td>v1.0.0</td><td>2022-04-09</td><td>创建</td></tr></tbody></table><p>可以参考下面的案例</p><div class="language-docker"><button title="Copy Code" class="copy"></button><span class="lang">docker</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># syntax=docker/dockerfile:1</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># ------ [ 构建步骤 ] ------</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 设定构建步骤所使用的来源镜像为基于 Alpine 发行版的 Go 1.18 版本镜像</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">FROM</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> golang:1.18-alpine </span><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">as</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> builder</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 安装构建所需要的必要二进制文件，如果你不需要，可以不安装</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> apk add bash git</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 设定 Go 使用 模块化依赖 管理方式：GO111MODULE</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> GO111MODULE=on</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 创建路径 /app</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> mkdir /app</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 复制 &lt;组织旗下的其他依赖仓库&gt; 到 /app 下面方便构建</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">COPY</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ./&lt;组织旗下的其他依赖仓库&gt; /app/&lt;组织旗下的其他依赖仓库&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 复制当前目录下 go-src 到 /app/go-src</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">COPY</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ./go-src /app/go-src</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 切换到 /app/go-src 目录</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">WORKDIR</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> /app/go-src</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 执行编译</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> CGO_ENABLED=0 go build -a -o </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;release/go-src&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># ------ [ 运行步骤 ] ------</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 设定运行步骤所使用的镜像为基于 Alpine 发行版镜像</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">FROM</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> alpine </span><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">as</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> runner</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 创建路径 /app</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> mkdir /app</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 创建路径 /app/go-src/bin</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> mkdir -p /app/go-src/bin</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 创建路径 /app/go-src/bin</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> mkdir -p /app/go-src/logs</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 将编译产物和其他需要的文件放入 /app/go-src 中</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">COPY</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> --from=builder /app/go-src/release/go-src /app/go-src/bin/</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 映射配置文件路径</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">VOLUME</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [ </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;/etc/go-src&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 映射日志文件路径</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">VOLUME</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [ </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;/app/go-src/logs&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 入点是编译好的 neve-service 应用程序</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">ENTRYPOINT</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> [ </span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;/app/go-src/bin/go-src&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-light-font-style:inherit;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 暴露 8080 端口</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#61AFEF;">EXPOSE</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> 8080</span></span></code></pre></div><h2 id="延伸阅读" tabindex="-1">延伸阅读 <a class="header-anchor" href="#延伸阅读" aria-label="Permalink to “延伸阅读”">​</a></h2>`,5)),e("p",null,[i(n,{href:"https://juejin.cn/post/6844904174396637197",target:"_blank",rel:"noreferrer"},{default:t(()=>[...s[0]||(s[0]=[a("构建 Golang 应用最小 Docker 镜像 - 掘金",-1)])]),_:1}),i(n,{href:"https://studygolang.com/articles/24854",target:"_blank",rel:"noreferrer"},{default:t(()=>[...s[1]||(s[1]=[a("使用scratch构建最小化Go程序的docker image - Go语言中文网 - Golang中文社区",-1)])]),_:1}),i(n,{href:"https://blog.csdn.net/danpob13624/article/details/106778642",target:"_blank",rel:"noreferrer"},{default:t(()=>[...s[2]||(s[2]=[a("为Go应用程序构建最小的Docker容器_danpob13624的博客-CSDN博客",-1)])]),_:1}),i(n,{href:"https://blog.csdn.net/Scoful/article/details/120729102",target:"_blank",rel:"noreferrer"},{default:t(()=>[...s[3]||(s[3]=[a("「推荐阅读」- 如何给go项目打最小docker镜像，足足降低99%_Scoful的博客-CSDN博客",-1)])]),_:1}),i(n,{href:"https://zhuanlan.zhihu.com/p/382175578",target:"_blank",rel:"noreferrer"},{default:t(()=>[...s[4]||(s[4]=[a("golang 打包到docker运行，最小镜像 - 知乎",-1)])]),_:1}),i(n,{href:"https://tachingchen.com/tw/blog/building-minimal-docker-image-for-go-applications/",target:"_blank",rel:"noreferrer"},{default:t(()=>[...s[5]||(s[5]=[a("打造最小 Go Docker Image | Container",-1)])]),_:1}),i(n,{href:"https://github.com/hesion3d/slimage",target:"_blank",rel:"noreferrer"},{default:t(()=>[...s[6]||(s[6]=[a("hesion3d/slimage: Make slim docker image for golang applications.",-1)])]),_:1})]),i(h),i(k)])}const _=r(c,[["render",y]]);export{u as __pageData,_ as default};
