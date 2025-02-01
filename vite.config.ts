import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/swap-element-lab/',
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'dashes',
    }
  },
})
