import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { prerenderPages } from './src/i18n/pages'
import { SITE_URL } from './src/i18n/translations'

const config = defineConfig({
  // Cloudflare Pages serves `dist`; the server build is only used to
  // prerender and is not deployed.
  environments: {
    client: { build: { outDir: 'dist' } },
    ssr: { build: { outDir: 'dist-server' } },
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      // The public pages become static HTML (`/en/privacy` →
      // en/privacy.html), with sitemap.xml listing them.
      pages: prerenderPages(),
      prerender: {
        enabled: true,
        crawlLinks: false,
        autoStaticPathsDiscovery: false,
        autoSubfolderIndex: false,
      },
      sitemap: { host: SITE_URL },
      // Everything else (auth links, invite and join links, admin, the 404)
      // is rendered in the browser from this shell; see public/_redirects.
      spa: {
        enabled: true,
        maskPath: '/app-shell',
        prerender: { outputPath: '/app-shell' },
      },
    }),
    viteReact(),
  ],
})

export default config
