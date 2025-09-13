"use client";

import { ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        const savedLang = localStorage.getItem("preferredLanguage");
        if (savedLang) {
          console.log("Loading saved language:", savedLang);
          await i18n.changeLanguage(savedLang);
        } else {
          console.log("No saved language found, using browser language");
          const browserLang = navigator.language.split("-")[0];
          if (i18n.languages.includes(browserLang)) {
            await i18n.changeLanguage(browserLang);
          }
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing i18n:", error);
        setIsInitialized(true); // Continue with default language
      }
    };

    initializeI18n();
  }, []);

  if (!isInitialized) {
    return <div>Loading translations...</div>;
  }

  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system">
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </ThemeProvider>
  );
}
