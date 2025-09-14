import React from "react";
import { Shield, Globe, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface FeatureCard {
  icon: React.ElementType;
  title: string;
  description: string;
}

export const FeatureCards: React.FC = () => {
  const t = useTranslations("claimsWalletMax.features");

  const features: FeatureCard[] = [
    {
      icon: Shield,
      title: t("secure.title"),
      description: t("secure.description"),
    },
    {
      icon: Globe,
      title: t("global.title"),
      description: t("global.description"),
    },
    {
      icon: Clock,
      title: t("realtime.title"),
      description: t("realtime.description"),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6"
            >
              <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureCards;
