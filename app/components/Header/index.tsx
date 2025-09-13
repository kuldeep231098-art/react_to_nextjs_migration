"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { paymentSolutionsCategories } from "@/app/data/navigation/paymentSolutions";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeToggle from "../ThemeToggle";
import { useTranslation } from "react-i18next";

export function Header() {
  const { t } = useTranslation();
  const [isPaymentSolutionsOpen, setIsPaymentSolutionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);

  const handleMobileCategory = (category: string) => {
    setMobileCategory(mobileCategory === category ? null : category);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-[#f9fafb]/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-none">
            <Link href="/" className="block">
              <Image
                src="/Juice-2024-Logo-2000x800.png"
                alt="Juice"
                width={200}
                height={80}
                className="h-8 w-auto hidden dark:block"
              />
              <Image
                src="/Juice-2024-Logo-2000x800.png"
                alt="Juice"
                width={200}
                height={80}
                className="h-8 w-auto block dark:hidden"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center flex-grow gap-8">
            <div className="flex items-center gap-8">
              <div className="relative">
                <button
                  onClick={() =>
                    setIsPaymentSolutionsOpen(!isPaymentSolutionsOpen)
                  }
                  onBlur={() =>
                    setTimeout(() => setIsPaymentSolutionsOpen(false), 200)
                  }
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 flex items-center gap-1"
                >
                  {t("header.menu.payment_solutions")}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isPaymentSolutionsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[900px] max-w-[90vw] bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-6 max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-3 gap-8">
                      {paymentSolutionsCategories.map((category, idx) => (
                        <div key={idx} className="space-y-4">
                          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {category.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {category.description}
                            </p>
                          </div>
                          <div className="grid gap-3">
                            {category.items.map((item, itemIdx) => {
                              const Icon = item.icon;
                              return (
                                <React.Fragment key={itemIdx}>
                                  <Link
                                    href={item.href}
                                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                  >
                                    <div className="flex-none">
                                      <div
                                        className={`p-2 rounded-lg ${
                                          item.isSummary
                                            ? "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400"
                                            : "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                                        }`}
                                      >
                                        <Icon className="h-5 w-5" />
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                        {item.title}
                                      </h4>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.description}
                                      </p>
                                    </div>
                                  </Link>
                                  {item.divider && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/rfp"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                FAQs
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-[#f9fafb] dark:bg-gray-950"
            >
              <div className="p-4 space-y-6">
                <div className="space-y-2">
                  <div className="font-medium text-sm text-gray-600 dark:text-gray-400">
                    PAYMENT SOLUTIONS
                  </div>

                  {paymentSolutionsCategories.map((category, idx) => (
                    <div key={idx} className="mb-3">
                      <button
                        onClick={() => handleMobileCategory(category.title)}
                        className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                      >
                        <span className="font-medium">{category.title}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            mobileCategory === category.title
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      {mobileCategory === category.title && (
                        <div className="mt-2 ml-4 space-y-2">
                          {category.items.map((item, itemIdx) => {
                            const Icon = item.icon;
                            return (
                              <React.Fragment key={itemIdx}>
                                <Link
                                  href={item.href}
                                  className="block px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`p-1.5 rounded-md ${
                                        item.isSummary
                                          ? "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400"
                                          : "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                                      }`}
                                    >
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="font-medium">
                                      {item.title}
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {item.description}
                                  </div>
                                </Link>
                                {item.divider && (
                                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Link
                    href="/rfp"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="font-medium">FAQs</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Frequently Asked Questions
                    </div>
                  </Link>
                </div>

                <div className="block lg:hidden">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
