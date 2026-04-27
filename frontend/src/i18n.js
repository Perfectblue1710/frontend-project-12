import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ruTranslation from './locales/ru/translation.json';
import enTranslation from './locales/en/translation.json';

// Фиксированная локаль - ru, как требуется в задании
const DEFAULT_LOCALE = 'ru';

const resources = {
  ru: {
    translation: ruTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: DEFAULT_LOCALE, // Принудительно устанавливаем русский язык
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Отключаем автоматическое определение языка
      order: [],
      caches: [],
    },
  });

export default i18n;
