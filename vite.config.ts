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
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Group Firebase and Vuefire together
          if (id.includes('firebase') || id.includes('vuefire')) {
            return 'vendor-firebase';
          }
          // Group core Vue libraries (Vue, Router, Pinia)
          if (
            id.includes('@vue') ||
            id.includes('vue-router') ||
            id.includes('pinia')
          ) {
            return 'vendor-vue';
          }
          // Group form validation libraries
          if (id.includes('vee-validate') || id.includes('yup')) {
            return 'vendor-forms';
          }
          // Separate vue-i18n
          if (id.includes('vue-i18n')) {
            return 'vendor-i18n';
          }
          // Separate vue-toastification
          if (id.includes('vue-toastification')) {
            return 'vendor-toast';
          }
          // Catch-all for other node_modules dependencies
          // This ensures other smaller dependencies are also grouped
          if (id.includes('node_modules')) {
            return 'vendor-others';
          }
        },
      },
    },
  },
});
