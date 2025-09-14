import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface PageHelpButtonProps {
  onClick: () => void;
  isOpen: boolean;
  className?: string;
}

export function PageHelpButton({
  onClick,
  isOpen,
  className = "",
}: PageHelpButtonProps) {
  const t = useTranslations("ui");

  return (
    <motion.button
      onClick={onClick}
      className={`help-toggle-button flex items-center justify-center h-[90px] w-[40px] 
      bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
      shadow-md hover:shadow-lg overflow-hidden relative z-50
      ${isOpen ? "bg-blue-50 dark:bg-blue-900/20" : ""} ${className}`}
      aria-label="Toggle help sidebar"
      layout
      animate={{
        width: isOpen ? 40 : 40,
        height: isOpen ? 90 : 90,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 30,
        },
      }}
      initial={false}
    >
      <motion.span
        className={`font-medium tracking-wider text-lg transform -rotate-90 ${
          isOpen
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400"
        }`}
        animate={{
          opacity: isOpen ? 0 : 1,
          transition: {
            duration: 0.2,
          },
        }}
      >
        {t("info")}
      </motion.span>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: isOpen ? 1 : 0,
          transition: {
            duration: 0.2,
          },
        }}
        initial={{ opacity: 0 }}
      >
        <X
          className={`h-5 w-5 ${
            isOpen
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
        />
      </motion.div>
    </motion.button>
  );
}
