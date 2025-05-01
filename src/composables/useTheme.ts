import { ref, watchEffect } from 'vue';

const THEME_KEY = 'fakaloan-theme';

export type ThemeMode = 'light' | 'dark';

const theme = ref<ThemeMode>('light');

// Load theme from localStorage or system
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

// Apply theme to <html>
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
export function useTheme() {
  loadTheme();
  return {
    theme,
    setTheme: (mode: ThemeMode) => {
      theme.value = mode;
    },
    toggleTheme: () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light';
    },
  };
}
