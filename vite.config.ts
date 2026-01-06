import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        // Main process entry file
        entry: 'electron/main.ts',
      },
      preload: {
        // Preload scripts
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      // Enable use of Node.js APIs in the Renderer process
      renderer: {},
    }),
  ],
  // Ensure proper base path for Electron
  base: './',
  build: {
    // Output directory for renderer
    outDir: 'dist',
    emptyOutDir: true,
  },
})
