import React from "react";
import { useTranslations } from "next-intl";
import { SidebarContentProps } from "@/app/types/help";

export const SidebarContent: React.FC<SidebarContentProps> = ({ content }) => {
  const t = useTranslations("help");

  return (
    <div className="p-4 overflow-y-auto flex-1">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 dark:text-white">
          {content.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {content.description}
        </p>
      </div>

      {content.sections?.map((section, index) => (
        <div key={index} className="mb-6">
          <h4 className="text-md font-semibold mb-2 dark:text-white">
            {section.title}
          </h4>
          <ul className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <h5 className="font-medium dark:text-white">{item.title}</h5>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {content.features && (
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-2 dark:text-white">
            {t("keyFeatures")}
          </h4>
          <ul className="space-y-2">
            {content.features.map((feature, index) => (
              <li key={index}>
                <h5 className="font-medium dark:text-white">{feature.title}</h5>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
