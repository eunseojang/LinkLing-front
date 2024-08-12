// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/en-US.json";
import ko from "./ko/ko.json";
import zh from "./zh/zh.json";
import ja from "./ja/ja.json";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

const LANGUAGES = {
  KO: "ko",
  EN: "en",
  ZH: "zh",
  JA: "ja",
};

const resources = {
  en: {
    translation: en,
  },
  ko: {
    translation: ko,
  },
  zh: {
    translation: zh,
  },
  ja: {
    translation: ja,
  },
};

i18n
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .init({
    resources,
    debug: true,
    lng: LANGUAGES.KO,
    fallbackLng: LANGUAGES.EN,
    interpolation: {
      escapeValue: false,
    },
  });

export { i18n, LANGUAGES };
