import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig({
      plugins: [react()],
      server: {
        host: '0.0.0.0', // Naslouchá na všech síťových rozhraních
        port: 3000,     // (volitelně) nastavení portu
    },
    // Polyfill for libraries expecting Node's global variable
    define: {
  global: 'globalThis',
},
})
