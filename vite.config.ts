import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const base =
  process.env.GITHUB_PAGES === 'true' ? '/ibge-localidades/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icons.svg',
        'pwa-192.png',
        'pwa-512.png',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: 'IBGE Localidades',
        short_name: 'IBGE Local',
        description:
          'Consulta visual da hierarquia geográfica oficial do IBGE (regiões, UFs, municípios e mais).',
        lang: 'pt-BR',
        theme_color: '#1a237e',
        background_color: '#f4f6f8',
        display: 'standalone',
        orientation: 'any',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,json}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
