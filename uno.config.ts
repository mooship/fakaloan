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
          --color-on-primary: #FFFFFF;
          --color-on-secondary: #000000;
          --color-on-tertiary: #000000;
          --color-on-background: #EDEDED;
          --color-on-surface: #FFFFFF;
        }
      `,
    },
  ],
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      'primary-variant': '#1565C0',
      'primary-light': '#90caf9',
      'primary-dark': '#1565C0',
      secondary: 'var(--color-secondary)',
      'secondary-variant': '#C62828',
      'secondary-light': '#ff8a80',
      'secondary-dark': '#b71c1c',
      tertiary: 'var(--color-tertiary)',
      'tertiary-light': '#b388ff',
      'tertiary-dark': '#320b86',
      lime: 'var(--color-lime)',
      error: 'var(--color-error)',
      background: 'var(--color-background)',
      surface: 'var(--color-surface)',
      'surface-variant': '#f5f5f5',
      'on-primary': 'var(--color-on-primary)',
      'on-secondary': 'var(--color-on-secondary)',
      'on-tertiary': 'var(--color-on-tertiary)',
      'on-background': 'var(--color-on-background)',
      'on-surface': 'var(--color-on-surface)',
    },
    fontFamily: {
      sans: '"Roboto", sans-serif',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '28px',
      full: '9999px',
    },
    boxShadow: {
      md: '0 2px 8px 0 rgba(60,60,60,0.10)',
      lg: '0 4px 20px 0 rgba(60,60,60,0.15)',
      xl: '0 8px 32px 0 rgba(60,60,60,0.18)',
    },
    spacing: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
    },
  },
  shortcuts: {
    'form-input-base':
      'w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-0 focus:ring-primary focus:border-primary bg-surface text-on-surface transition-all',
    'form-input-valid': 'border-primary-variant',
    'form-input-invalid': 'border-error',
    'form-label': 'block text-sm font-medium text-on-surface mb-1',
    'form-error-text': 'mt-1 text-xs text-error',
    btn: 'px-4 py-2 rounded-lg font-medium focus:outline-0 focus:ring-2 focus:ring-offset-2 focus:ring-primary relative overflow-hidden transition-all',
    'btn-primary':
      'btn w-full text-on-primary bg-primary hover:bg-primary-variant active:bg-primary-dark shadow-md ripple',
    'btn-primary-outline':
      'btn w-full text-primary border border-primary bg-transparent hover:bg-primary/10',
    'btn-secondary':
      'btn w-full inline-flex items-center justify-center text-on-secondary bg-secondary hover:bg-secondary-variant active:bg-secondary-dark border border-secondary shadow-md ripple',
    'btn-link':
      'font-medium text-primary hover:text-primary-variant focus:outline-0 focus:underline',
    'btn-disabled': 'opacity-50! cursor-not-allowed! pointer-events-none! ',
    'btn-tertiary':
      'btn w-full text-on-tertiary bg-tertiary hover:bg-tertiary-light active:bg-tertiary-dark shadow-md ripple',
    'alert-error':
      'p-3 mb-4 text-sm text-error bg-error/10 rounded-lg border border-error flex items-center gap-2',
    'alert-success':
      'p-3 mb-4 text-sm text-accent bg-accent/10 rounded-lg border border-accent flex items-center gap-2',
    'auth-page-container':
      'flex items-center justify-center min-h-screen bg-background',
    'auth-card':
      'w-full max-w-md p-8 space-y-6 bg-surface rounded-xl shadow-lg',
    'auth-title': 'text-2xl font-bold text-center text-primary',
    'material-select':
      'form-input-base rounded-lg bg-surface text-on-surface border border-gray-300 shadow-sm pr-10 appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all',
    'card-main':
      'bg-surface w-full max-w-2xl space-y-6 rounded-xl p-8 shadow-lg',
    'card-md':
      'bg-surface mx-auto mt-10 w-full max-w-md rounded-lg p-8 shadow-md',
    'card-lg':
      'bg-surface mx-auto mt-10 w-full max-w-2xl rounded-xl p-8 shadow-xl',
    'section-divider': 'border-t border-gray-200 pt-6',
    'icon-btn':
      'mr-1 align-middle rounded-full p-2 hover:bg-surface-variant transition',
    'text-on-surface-80': 'text-on-surface/80',
    'text-on-surface-70': 'text-on-surface/70',
    'text-on-surface-60': 'text-on-surface/60',
    'text-on-surface-50': 'text-on-surface/50',
    'input-material':
      'form-input-base rounded-lg bg-surface text-on-surface border border-gray-300 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all',
    'elevation-1': 'shadow-md',
    'elevation-2': 'shadow-lg',
    'elevation-3': 'shadow-xl',
    ripple: 'relative overflow-hidden',
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
