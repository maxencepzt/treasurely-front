import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon.png', 'icons/android-chrome-512x512.png'],
      devOptions: {
        enabled: true
      },
      manifest: {
        "short_name": "Treasurely",
        "name": "Treasurely",
        "icons": [
          {
            "src": "/icons/android-chrome-192x192.png",
            "type": "image/png",
            "sizes": "192x192"
          },
          {
            "src": "/icons/android-chrome-512x512.png",
            "type": "image/png",
            "sizes": "512x512",
            "purpose": "any"
          },
          {
            "src": "/icons/maskable-icon-512x512.png",
            "type": "image/png",
            "sizes": "512x512",
            "purpose": "maskable"
          },
          {
            "src": "/icons/pwa-64x64.png",
            "type": "image/png",
            "sizes": "64x64"
          }
        ],
        "description": "An app to create and play treasure hunts",
        "start_url": "/",
        "display": "standalone",
        "theme_color": "#008235",
        "background_color": "#ffffff"
      }
    }),
  ],
})
