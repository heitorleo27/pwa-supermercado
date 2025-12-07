import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({

  base: '/pwa-supermercado/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: '/pwa-supermercado/',
        name: 'PWA Supermercado',
        short_name: 'Supermercado',
        description: 'Aplicativo PWA de supermercado feito com Vite + React',

        start_url: '/pwa-supermercado/',
        scope: '/pwa-supermercado/',

        theme_color: '#121212',
        background_color: '#121212',
        display: 'standalone',

        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],

        screenshots: [
          {
            src: 'screenshots/home.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Tela inicial'
          },
          {
            src: 'screenshots/wide.png',
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
