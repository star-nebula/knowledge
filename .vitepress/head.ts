import type { HeadConfig } from 'vitepress'
import { creatorNames, creatorUsernames, siteDescription, siteName, targetDomain } from '../metadata'

export default [
  // Redirect root path to zh-CN locale
  ['script', {}, `if (typeof window !== 'undefined' && (window.location.pathname === '/knowledge/' || window.location.pathname === '/knowledge') && !window.location.pathname.startsWith('/knowledge/zh-CN')) { window.location.href = '/knowledge/zh-CN/' + window.location.hash; }`],
  // 51LA v6 访问统计（后台 https://v6.51.la ）：注册站点后把 ck 值填到下面 LA_CK。
  // ck 为空字符串时脚本不注入，零副作用。注意 ${"LA_CK"} 是刻意转义，运行时由浏览器侧模板拼接。
  ['script', {}, `(function(){var LA_CK="";if(!LA_CK)return;var s=document.createElement("script");s.src="https://js.51.la/v6/"+LA_CK+".js";s.async=true;document.head.appendChild(s)})()`],
  ['meta', {
    name: 'theme-color',
    content: '#ffffff',
  }],
  [
    'link',
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  ],
  [
    'link',
    {
      rel: 'icon',
      href: '/logo.svg',
      type: 'image/svg+xml',
    },
  ],
  [
    'link',
    {
      rel: 'alternate icon',
      href: '/favicon.ico',
      type: 'image/png',
      sizes: '16x16',
    },
  ],
  ['meta', {
    name: 'author',
    content: creatorNames.join(', '),
  }],
  [
    'meta',
    {
      name: 'keywords',
      content:
          ['markdown', 'knowledge-base', '知识库', 'vitepress', 'obsidian', 'notebook', 'notes', ...creatorUsernames].join(', '),
    },
  ],

  ['meta', {
    property: 'og:title',
    content: siteName,
  }],
  [
    'meta',
    {
      property: 'og:image',
      content: `${targetDomain}/og.png`,
    },
  ],
  ['meta', {
    property: 'og:description',
    content: siteDescription,
  }],
  ['meta', {
    property: 'og:site_name',
    content: siteName,
  }],

  ['meta', {
    name: 'twitter:card',
    content: 'summary_large_image',
  }],
  ['meta', {
    name: 'twitter:creator',
    content: creatorUsernames.join(', '),
  }],
  [
    'meta',
    {
      name: 'twitter:image',
      content: `${targetDomain}/og.png`,
    },
  ],

  [
    'link',
    {
      rel: 'mask-icon',
      href: '/safari-pinned-tab.svg',
      color: '#927baf',
    },
  ],
  ['link', {
    rel: 'manifest',
    href: '/site.webmanifest',
  }],
  ['meta', {
    name: 'msapplication-TileColor',
    content: '#603cba',
  }],
] satisfies HeadConfig[]
