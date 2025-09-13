"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { translations } from "./data/translations";

// Initialize i18next instance
const i18nInstance = i18n.createInstance();

i18nInstance
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: translations,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    load: "languageOnly",
    debug: true, // Enable debug logging
  });

// Add language change listener
i18nInstance.on("languageChanged", (lng) => {
  console.log("Language changed to:", lng);
  console.log(
    "Current translations:",
    i18nInstance.getResourceBundle(lng, "translation")
  );
});

export default i18nInstance;
