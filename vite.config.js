import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Normativa Trasporto NCC',
        short_name: 'NCC Lex',
        description: 'Sistema normativo trasporto persone non di linea',
        theme_color: '#0d1b2a',
        background_color: '#0d1b2a',
        display: 'standalone',
        icons: [
          {
            src: 'https://placehold.co/192x192/0d1b2a/ffffff?text=NCC',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
