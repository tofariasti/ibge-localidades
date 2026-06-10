import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base =
  process.env.GITHUB_PAGES === 'true' ? '/ibge-localidades/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
