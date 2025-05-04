import type { Theme } from '@/enums/user.enums';
import { useColorMode } from '@vueuse/core';
import { computed } from 'vue';

/**
 * Provides theme (color mode) management for the app.
 * @returns An object with colorMode, isDark, setTheme, and toggleTheme.
 */
export function useTheme() {
  const colorMode = useColorMode({
    emitAuto: true,
    modes: {
      dark: 'dark',
      light: 'light',
      auto: 'auto',
    },
    storageKey: 'fakaloan-theme',
    selector: 'html',
    attribute: 'class',
  });

  return {
    colorMode,
    isDark: computed(() => colorMode.value === 'dark'),
    setTheme: (mode: Theme) => {
      colorMode.value = mode;
    },
    toggleTheme: () => {
      colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark';
    },
  };
}
