import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Add these headers so popups (like Google login) can send messages back
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
  },

  // (optional) If you sometimes run your backend locally
  // and want frontend requests to automatically proxy
  // /api calls to backend
  // proxy: {
  //   '/api': 'http://localhost:5000',
  // },
})
