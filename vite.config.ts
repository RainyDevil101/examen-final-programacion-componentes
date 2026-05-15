import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isCordova = env.VITE_CORDOVA === '1' || mode === 'cordova'

  return {
    plugins: [react()],
    base: isCordova ? './' : '/',
    define: {
      'import.meta.env.VITE_CORDOVA': JSON.stringify(isCordova ? '1' : ''),
    },
  }
})
