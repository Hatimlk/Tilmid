import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.PNG'],
  build: {
    sourcemap: false, // Security: Disable source maps in production to prevent code inspection
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react') || id.includes('i18next')) return 'framework';
          if (id.includes('lucide-react')) return 'icons';
          return 'vendor';
        },
      },
    },
  }
})
