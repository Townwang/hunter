import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "开源人",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'keywords', content: '开源人,开源项目,原创开源,开源工具,免费开源,开源技术分享' }]
  ],
  lang: 'zh',
  description: "开源人博客，专注分享个人原创开源项目、提供干净免费的开源资源，做纯粹的开源技术分享。",
  themeConfig: {
    logo: { src: '/logo.svg', width: 24, height: 24 },
    nav: [
      { text: '主页', link: '/' }
    ],
    sitemap: {
      hostname: 'https://hunter.wang'
    },
    footer: {
      message: '基于 MIT 协议开源发布',
      copyright: "版权所有 © 2026 <a href='https://beian.miit.gov.cn/'>陕ICP备2026009491号-1</a>"
    }
  }
})