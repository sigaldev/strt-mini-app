import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['api.strt-hack.ru'],
    fs: {
      deny: [
        'docker-compose.yml',
        'Dockerfile',
        'README.md',
        'AGENT.md',
        '.env',
        '.env.*',
      ],
    },
  },
})
