import type { IconifyJSON } from '@iconify/types';
import { defineConfig, presetIcons, presetWind4 } from 'unocss';

/**
 * UnoCSS configuration for utility classes and icon presets.
 */
export default defineConfig({
  theme: {
    colors: {
      // Light Theme
      primary: '#2979FF', // Vibrant Blue
      secondary: '#FF1744', // Vivid Red
      tertiary: '#651FFF', // Electric Violet
      error: '#FF3D00', // Bright Orange
      background: '#FAFAFA', // Light Grey
      surface: '#FFFFFF', // White
      'on-primary': '#FFFFFF', // White
      'on-secondary': '#FFFFFF', // White
      'on-tertiary': '#FFFFFF', // White
      'on-background': '#1C1B1F', // Dark Gray
      'on-surface': '#1C1B1F', // Dark Gray
      // Dark Theme
      'primary-dark': '#82B1FF', // Lighter Blue
      'secondary-dark': '#FF8A80', // Light Red
      'tertiary-dark': '#B388FF', // Soft Violet
      'error-dark': '#FF9E80', // Warm Orange
      'background-dark': '#121212', // True Black
      'surface-dark': '#1E1E1E', // Dark Surface
      'on-primary-dark': '#000000', // Black
      'on-secondary-dark': '#000000', // Black
      'on-tertiary-dark': '#000000', // Black
      'on-background-dark': '#EDEDED', // Light Gray
      'on-surface-dark': '#EDEDED', // Light Gray
    },
  },
  shortcuts: {
    'form-input-base':
      'w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-0 focus:ring-primary focus:border-primary',
    'form-input-valid': 'border-primary-variant',
    'form-input-invalid': 'border-error',
    'form-label': 'block text-sm font-medium text-on-surface',
    'form-error-text': 'mt-1 text-sm text-error',
    btn: 'px-4 py-2 rounded-md font-medium focus:outline-0 focus:ring-2 focus:ring-offset-2 focus:ring-primary',
    'btn-primary':
      'btn w-full text-on-primary bg-primary hover:bg-primary-variant',
    'btn-secondary':
      'btn w-full inline-flex items-center justify-center text-on-secondary bg-secondary hover:bg-secondary-variant border border-secondary shadow-sm',
    'btn-link':
      'font-medium text-primary hover:text-primary-variant focus:outline-0 focus:underline',
    'btn-premium':
      'bg-tertiary text-white font-extrabold px-6 py-3 rounded-md hover:bg-tertiary/80 shadow-xl transform hover:scale-105 transition-transform border-2 border-tertiary text-lg tracking-wide',
    'btn-premium-text': 'drop-shadow-lg text-white',
    'btn-renew-premium':
      'bg-tertiary text-white font-extrabold px-6 py-3 rounded-md hover:bg-tertiary/80 shadow-xl transform hover:scale-105 transition-transform border-2 border-tertiary text-lg tracking-wide',
    'alert-error':
      'p-3 mb-4 text-sm text-error bg-error/10 rounded-md border border-error',
    'alert-success':
      'p-3 mb-4 text-sm text-accent bg-accent/10 rounded-md border border-accent',
    'auth-page-container':
      'flex items-center justify-center min-h-screen bg-background',
    'auth-card': 'w-full max-w-md p-8 space-y-6 bg-surface rounded shadow-md',
    'auth-title': 'text-2xl font-bold text-center text-primary',
  },
  presets: [
    presetWind4(),
    presetIcons({
      collections: {
        heroicons: () =>
          import('@iconify-json/heroicons/icons.json').then((i) => i.default),
        logos: () =>
          import('@iconify-json/logos/icons.json').then(
            (i) => i.default as IconifyJSON
          ),
      },
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  safelist: ['btn‑premium', 'btn‑premium‑text', 'btn‑renew‑premium'],
});
