import { useTranslations } from "next-intl";

export const SidebarFooter = () => {
  const t = useTranslations("help");

  return (
    <div className="p-4 border-t border-gray-300 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {t("footerText")}
      </p>
    </div>
  );
};
