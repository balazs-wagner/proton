import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is set at build time so GitHub Pages serves assets from /<repo>/
// for local dev it stays '/'
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/proton/' : '/',
}))
