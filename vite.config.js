import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: '/',
        name: 'PWA Supermercado',
        short_name: 'Supermercado',
        description: 'Aplicativo PWA de supermercado feito com Vite + React',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/home.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Tela inicial'
          },
          {
            src: '/screenshots/wide.png',
            sizes: '720x540',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Visualização ampla'
          }
        ]
      }
    })
  ]
})
