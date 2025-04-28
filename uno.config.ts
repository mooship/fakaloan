import type { IconifyJSON } from '@iconify/types';
import { defineConfig, presetIcons, presetWind4 } from 'unocss';

export default defineConfig({
  shortcuts: {
    //--------------------------------------------------------------------------
    // Form Elements
    //--------------------------------------------------------------------------
    'form-input-base':
      'w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-0 focus:ring-indigo-500 focus:border-indigo-500',
    'form-input-valid': 'border-gray-300',
    'form-input-invalid': 'border-red-500',
    'form-label': 'block text-sm font-medium text-gray-700',
    'form-error-text': 'mt-1 text-sm text-red-600',

    //--------------------------------------------------------------------------
    // Buttons
    //--------------------------------------------------------------------------
    btn: 'px-4 py-2 rounded-md font-medium focus:outline-0 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
    'btn-primary': 'btn w-full text-white bg-indigo-600 hover:bg-indigo-700',
    'btn-secondary':
      'btn w-full inline-flex items-center justify-center text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50',
    'btn-link':
      'font-medium text-indigo-600 hover:text-indigo-500 focus:outline-0 focus:underline',

    //--------------------------------------------------------------------------
    // Premium Buttons
    //--------------------------------------------------------------------------
    'btn-premium':
      'bg-purple-600 text-white font-extrabold px-6 py-3 rounded-md hover:bg-purple-700 shadow-xl transform hover:scale-105 transition-transform border-2 border-purple-600 text-lg tracking-wide',
    'btn-premium-text': 'drop-shadow-lg text-white',
    'btn-renew-premium':
      'bg-red-500 text-white font-extrabold px-6 py-3 rounded-md hover:bg-red-600 shadow-xl transform hover:scale-105 transition-transform border-2 border-red-500 text-lg tracking-wide',

    //--------------------------------------------------------------------------
    // Alerts / Notifications
    //--------------------------------------------------------------------------
    'alert-error':
      'p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md border border-red-300',
    'alert-success':
      'p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-md border border-green-300',

    //--------------------------------------------------------------------------
    // Auth Layout Specific Styles
    //--------------------------------------------------------------------------
    'auth-page-container':
      'flex items-center justify-center min-h-screen bg-gray-100',
    'auth-card': 'w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md',
    'auth-title': 'text-2xl font-bold text-center',
  },
  presets: [
    //--------------------------------------------------------------------------
    // Presets Configuration
    //--------------------------------------------------------------------------
    presetWind4(), // Tailwind CSS v4 preset
    presetIcons({
      // Iconify integration
      collections: {
        heroicons: () =>
          import('@iconify-json/heroicons/icons.json').then((i) => i.default),
        logos: () =>
          import('@iconify-json/logos/icons.json').then(
            (i) => i.default as IconifyJSON
          ),
      },
      extraProperties: {
        // Default styles for icons
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  //--------------------------------------------------------------------------
  // Safelist
  //--------------------------------------------------------------------------
  // Ensure these classes are always included in the build, even if not directly used in templates
  safelist: ['btn‑premium', 'btn‑premium‑text', 'btn‑renew‑premium'],
});
