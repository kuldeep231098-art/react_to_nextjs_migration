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

  const availableLanguages = languages.map((lang: Language) => ({
    code: lang.code,
    name: t(`languages.${lang.code}`),
  }));

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    localStorage.setItem("preferredLanguage", langCode);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
      >
        <Globe className="h-4 w-4" />
        <span>
          {availableLanguages.find((lang) => lang.code === i18n.language)
            ?.name || t("languages.en")}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-2">
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
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
