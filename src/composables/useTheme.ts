import { useDark, useStorage } from '@vueuse/core';
import { watch } from 'vue';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'fakaloan-theme';

const theme = useStorage<ThemeMode>(THEME_KEY, 'light');

const isDark = useDark({
  selector: 'html',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: THEME_KEY,
});

watch(theme, (mode) => {
  isDark.value = mode === 'dark';
});
watch(isDark, (dark) => {
  theme.value = dark ? 'dark' : 'light';
});

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
