import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: '/',
    define: {
      // Polyfill process.env.API_KEY so the @google/genai library works in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
    build: {
      // Ensure consistent output for Vercel
      outDir: 'dist',
      sourcemap: false,
      // Ensure assets have correct paths
      assetsDir: 'assets',
    },
  }
})