/**
 * uno.config.ts
 *
 * UnoCSS configuration for Fakaloan.
 * Defines color variables, theme, shortcuts, and icon collections for the app.
 *
 * @module uno.config
 */
import type { IconifyJSON } from '@iconify/types';
import { defineConfig, presetIcons, presetWind4 } from 'unocss';

export default defineConfig({
  preflights: [
    {
      getCSS: () => `
        :root {
          --color-primary: #2979FF;
          --color-secondary: #FF1744;
          --color-tertiary: #651FFF;
          --color-lime: #32e043;
          --color-error: #FF3D00;
          --color-background: #FAFAFA;
          --color-surface: #FFFFFF;
          --color-on-primary: #FFFFFF;
          --color-on-secondary: #FFFFFF;
          --color-on-tertiary: #FFFFFF;
          --color-on-background: #1C1B1F;
          --color-on-surface: #1C1B1F;
        }
        .dark {
          --color-primary: #82B1FF;
          --color-secondary: #FF8A80;
          --color-tertiary: #B388FF;
          --color-lime: #32e043;
          --color-error: #FF9E80;
          --color-background: #121212;
          --color-surface: #1E1E1E;
          --color-on-primary: #000000;
          --color-on-secondary: #000000;
          --color-on-tertiary: #000000;
          --color-on-background: #EDEDED;
          --color-on-surface: #EDEDED;
        }
      `,
    },
  ],
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      'primary-variant': '#1565C0',
      secondary: 'var(--color-secondary)',
      'secondary-variant': '#C62828',
      tertiary: 'var(--color-tertiary)',
      lime: 'var(--color-lime)',
      error: 'var(--color-error)',
      background: 'var(--color-background)',
      surface: 'var(--color-surface)',
      'on-primary': 'var(--color-on-primary)',
      'on-secondary': 'var(--color-on-secondary)',
      'on-tertiary': 'var(--color-on-tertiary)',
      'on-background': 'var(--color-on-background)',
      'on-surface': 'var(--color-on-surface)',
    },
    fontFamily: {
      sans: '"Roboto", sans-serif',
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
    'btn-primary-outline':
      'btn w-full text-primary border border-primary bg-transparent hover:bg-primary/10',
    'btn-secondary':
      'btn w-full inline-flex items-center justify-center text-on-secondary bg-secondary hover:bg-secondary-variant border border-secondary shadow-sm',
    'btn-link':
      'font-medium text-primary hover:text-primary-variant focus:outline-0 focus:underline',
    'btn-disabled': 'opacity-50! cursor-not-allowed! pointer-events-none! ',
    'alert-error':
      'p-3 mb-4 text-sm text-error bg-error/10 rounded-md border border-error',
    'alert-success':
      'p-3 mb-4 text-sm text-accent bg-accent/10 rounded-md border border-accent',
    'auth-page-container':
      'flex items-center justify-center min-h-screen bg-background',
    'auth-card': 'w-full max-w-md p-8 space-y-6 bg-surface rounded shadow-md',
    'auth-title': 'text-2xl font-bold text-center text-primary',
    'material-select':
      'form-input-base rounded-lg bg-surface text-on-surface border border-gray-300 shadow-sm pr-10 appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all',
    'card-main': 'bg-surface w-full max-w-2xl space-y-6 rounded p-8 shadow-md',
    'card-md': 'bg-surface mx-auto mt-10 w-full max-w-md rounded p-8 shadow-md',
    'card-lg':
      'bg-surface mx-auto mt-10 w-full max-w-2xl rounded p-8 shadow-md',
    'section-divider': 'border-t border-gray-200 pt-6',
    'icon-btn': 'mr-1 align-middle',
    'text-on-surface-80': 'text-on-surface/80',
    'text-on-surface-70': 'text-on-surface/70',
    'text-on-surface-60': 'text-on-surface/60',
    'text-on-surface-50': 'text-on-surface/50',
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
  safelist: ['btn‑disabled'],
});
