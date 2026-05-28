import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 1. Critical for Docker: Allows the container to accept external requests
    host: '0.0.0.0', 
    port: 5173,
    
    // 2. Fixes the "Blank Screen" on some Ubuntu/Docker setups
    strictPort: true, 
    
    // 3. Enables Hot Module Replacement (HMR) to work through the Docker bridge
    hmr: {
      clientPort: 5173,
    },

    // 4. Forces Vite to watch for file changes inside the Docker Volume
    watch: {
      usePolling: true,
      interval: 100, // Checks every 100ms for faster updates
    },
  },
  // 5. Build optimization for your eventual production deployment
  build: {
    outDir: 'dist',
    sourcemap: true, // Helps with debugging "Blank Page" errors
  }
})
