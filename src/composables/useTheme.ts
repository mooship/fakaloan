/**
 * @module composables/useTheme
 * @typedef {'light' | 'dark'} ThemeMode
 *
 * Provides theme management (light/dark mode) for Fakaloan.
 * - Persists user preference in localStorage
 * - Defaults to system preference if unset
 * - Applies appropriate class to <html> (`dark` or `light`)
 */

import { useDark, useStorage } from '@vueuse/core';
import { watch } from 'vue';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'fakaloan-theme';

/**
 * Reactive theme mode, persisted in localStorage.
 * Defaults to system preference using useDark.
 */
const theme = useStorage<ThemeMode>(THEME_KEY, 'light');

/**
 * Reactive computed boolean for dark mode state.
 * Applies appropriate class to `<html>` element.
 */
const isDark = useDark({
  selector: 'html',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: THEME_KEY,
});

/**
 * Keep `theme` and `isDark` in sync reactively.
 */
watch(theme, (mode) => {
  isDark.value = mode === 'dark';
});
watch(isDark, (dark) => {
  theme.value = dark ? 'dark' : 'light';
});

/**
 * Composable for theme management (light/dark mode).
 *
 * @returns {Object} Theme state and methods.
 * @property {Ref<ThemeMode>} theme - Reactive theme mode
 * @property {ComputedRef<boolean>} isDark - Whether dark mode is active
 * @property {(mode: ThemeMode) => void} setTheme - Set the theme explicitly
 * @property {() => void} toggleTheme - Toggle between light and dark modes
 */
export function useTheme() {
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
