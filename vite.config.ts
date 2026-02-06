import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.PNG'],
  build: {
    sourcemap: false, // Security: Disable source maps in production to prevent code inspection
  }
})