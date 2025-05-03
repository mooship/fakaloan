import type { Theme } from '@/enums/user.enums';
import { useColorMode } from '@vueuse/core';
import { computed } from 'vue';

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
