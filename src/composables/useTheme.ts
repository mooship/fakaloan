import type { Theme } from '@/enums/user.enums';
import { useColorMode } from '@vueuse/core';
import { computed } from 'vue';

/**
 * Provides theme (color mode) management for the app.
 * @returns An object with colorMode, isDark, setTheme, and toggleTheme.
 */
export function useTheme() {
  const colorMode = useColorMode({
    emitAuto: false,
    modes: {
      dark: 'dark',
      light: 'light',
    },
    storageKey: 'fakaloan-theme',
    selector: 'html',
    attribute: 'class',
  });

  const setHtmlClass = (mode: string) => {
    const html = document.documentElement;
    html.classList.remove('dark', 'light');
    html.classList.add(mode);
  };

  colorMode.value = colorMode.value === 'dark' ? 'dark' : 'light';
  setHtmlClass(colorMode.value);

  const isDark = computed(() => colorMode.value === 'dark');

  const toggleTheme = () => {
    colorMode.value = colorMode.value === 'light' ? 'dark' : 'light';
    setHtmlClass(colorMode.value);
  };

  return {
    colorMode,
    isDark,
    setTheme: (mode: Theme) => {
      colorMode.value = mode;
      setHtmlClass(mode);
    },
    toggleTheme,
  };
}
