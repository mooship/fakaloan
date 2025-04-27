import { createI18n } from 'vue-i18n';
import enMessages from './locales/en.json';
import xhMessages from './locales/xh.json';
import zuMessages from './locales/zu.json';

const messages = {
  en: enMessages,
  zu: zuMessages,
  xh: xhMessages,
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
