import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all locale files
const languages = ['en', 'hi', 'te', 'kn', 'ta', 'ml', 'bn', 'mr', 'gu', 'pa', 'or'];
const namespaces = ['consent', 'questionnaire', 'thankyou'];

const resources = {};

languages.forEach(lang => {
  resources[lang] = {};
  namespaces.forEach(ns => {
    try {
      resources[lang][ns] = require(`./assets/locales/${lang}/${ns}.json`);
    } catch (e) {
      console.error(`Could not load locale file for ${lang}/${ns}`);
    }
  });
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    ns: namespaces,
    defaultNS: 'consent'
  });

export default i18n;
