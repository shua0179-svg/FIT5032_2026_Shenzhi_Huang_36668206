import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // Cloudflare serves this app from the domain root, while GitHub Pages serves
  // a project site below /FIT5032_2026_Shenzhi_Huang_36668206/.
  base:
    process.env.GITHUB_ACTIONS === 'true'
      ? '/FIT5032_2026_Shenzhi_Huang_36668206/'
      : '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
