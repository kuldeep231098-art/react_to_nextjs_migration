"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/app/utils/utils";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [isChanging, setIsChanging] = useState(false);
  const t = useTranslations("ui");

  const handleThemeChange = () => {
    setIsChanging(true);
    setTheme(theme === "light" ? "dark" : "light");
    setTimeout(() => setIsChanging(false), 300);
  };

  return (
    <button
      type="button"
      onClick={handleThemeChange}
      className={cn(
        "relative w-6 h-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 cursor-pointer",
        isChanging && "pointer-events-none",
        className
      )}
      aria-label={t("switchTheme")}
      disabled={isChanging}
    >
      <Sun className="absolute inset-0 h-full w-full transition-all duration-300 opacity-100 rotate-0 dark:opacity-0 dark:-rotate-90" />
      <Moon className="absolute inset-0 h-full w-full transition-all duration-300 opacity-0 rotate-90 dark:opacity-100 dark:rotate-0" />
    </button>
  );
}
