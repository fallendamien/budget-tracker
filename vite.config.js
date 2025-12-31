import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3000,
  },
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'icon-192x192.png',
        'icon-512x512.png',
        'screenshot-mobile.png',
        'screenshot-desktop.png',
      ],
      manifest: {
        name: 'Budget Tracker',
        short_name: 'Budget',
        description: 'Track your income and expenses offline',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: 'screenshot-mobile.png',
            sizes: '488x749',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: 'screenshot-desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // No runtime caching needed - fonts are now self-hosted and precached
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
