import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  plugins: [vue(), vueDevTools(), UnoCSS()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/',
  cacheDir: 'node_modules/.vite_cache',
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'vue-i18n'],
          pinia: ['pinia'],
          firebase: [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'vuefire',
          ],
          validation: ['vee-validate', 'yup'],
          toast: ['vue-toastification'],
          vueuse: ['@vueuse/core', '@vueuse/head'],
        },
      },
    },
  },
});
