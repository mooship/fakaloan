/**
 * useTheme composable
 *
 * Provides theme management (light/dark mode) for Fakaloan.
 * Loads, applies, and persists theme preference using localStorage and system settings.
 *
 * @module composables/useTheme
 * @typedef {'light' | 'dark'} ThemeMode
 * @returns {Object} - { theme: Ref<ThemeMode>, isDark: ComputedRef<boolean>, setTheme: (mode: ThemeMode) => void, toggleTheme: () => void }
 */
import { computed, ref, watchEffect } from 'vue';

const THEME_KEY = 'fakaloan-theme';

export type ThemeMode = 'light' | 'dark';

const theme = ref<ThemeMode>('light');

/**
 * Loads the theme from localStorage or system preference.
 * @private
 */
function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    theme.value = saved;
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.value = 'dark';
  } else {
    theme.value = 'light';
  }
}

/**
 * Applies the theme to the <html> element.
 * @param {ThemeMode} mode - The theme mode to apply.
 * @private
 */
function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark');
  document.documentElement.classList.toggle('light', mode === 'light');
}

// Watch and persist theme
watchEffect(() => {
  applyTheme(theme.value);
  localStorage.setItem(THEME_KEY, theme.value);
});

// Public API
/**
 * Composable for theme management (light/dark mode).
 *
 * Loads, applies, and persists theme preference using localStorage and system settings.
 *
 * @returns {Object} Theme state and methods.
 */
export function useTheme() {
  loadTheme();
  const isDark = computed(() => theme.value === 'dark');
  return {
    theme,
    isDark,
    setTheme: (mode: ThemeMode) => {
      theme.value = mode;
    },
    toggleTheme: () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light';
    },
  };
}
