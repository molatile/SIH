import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      'import.meta.env.VITE_ANTHROPIC_API_KEY': JSON.stringify(env.ANTHROPIC_API_KEY || env.VITE_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY || '')
    }
  }
})
