import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      'creb-js': '/Users/loganathanev/Documents/vloganathane/daily-apps/2025/09/02/CREB/dist/index.browser.js'
    }
  },
  optimizeDeps: {
    include: ['creb-js', 'creb-pubchem-js'],
    exclude: ['3dmol']
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
