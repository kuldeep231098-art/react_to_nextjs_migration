"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { languages } from "@/app/data/navigation/languages";

interface Language {
  code: string;
  name: string;
}

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const availableLanguages = languages;

  const handleLanguageChange = async (langCode: string) => {
    try {
      console.log("Changing language to:", langCode);
      await i18n.changeLanguage(langCode);
      console.log("Language changed successfully");
      console.log("Current language:", i18n.language);
      console.log("Available languages:", i18n.languages);
      console.log("Current namespace:", i18n.options.defaultNS);
      console.log("Translation test:", t("header.menu.payment_solutions"));

      localStorage.setItem("preferredLanguage", langCode);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        <Globe className="h-4 w-4" />
        <span>{t(`languages.${i18n.language}`) || "English"}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                i18n.language === lang.code
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {t(`languages.${lang.code}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
