import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import arTranslations from './locales/ar.json';
import frTranslations from './locales/fr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: arTranslations },
      fr: { translation: frTranslations },
    },
    fallbackLng: 'fr',
    detection: {
      order: ['localStorage', 'cookie'],
      caches: ['localStorage', 'cookie']
    },
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

// Automatically update the document direction based on the current language
const updateDirection = (lng: string) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
};

// Set initial direction
updateDirection(i18n.language || 'fr');

i18n.on('languageChanged', updateDirection);

export default i18n;
