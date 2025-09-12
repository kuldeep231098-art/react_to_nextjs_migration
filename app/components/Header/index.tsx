"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { paymentSolutionsCategories } from "@/app/data/navigation/paymentSolutions";

export function Header() {
  const [isPaymentSolutionsOpen, setIsPaymentSolutionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);

  // Payment solutions categories are imported from data/navigation/paymentSolutions.ts

  const handleMobileCategory = (category: string) => {
    setMobileCategory(mobileCategory === category ? null : category);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 dark:border-gray-700">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/Juice-2024-Logo-2000x800.png"
                alt="Juice Logo"
                width={160}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <div className="hidden sm:flex items-center mx-auto gap-6">
            <div className="relative">
              <button
                onClick={() =>
                  setIsPaymentSolutionsOpen(!isPaymentSolutionsOpen)
                }
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                Payment Solutions
              </button>

              {/* Payment Solutions Dropdown */}
              {isPaymentSolutionsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-screen max-w-6xl bg-white rounded-lg shadow-lg border border-gray-200 grid grid-cols-3 gap-6 p-6 z-20">
                  {paymentSolutionsCategories.map((category, index) => (
                    <div key={index} className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {category.description}
                        </p>
                      </div>
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <Link
                            key={itemIndex}
                            href={item.href}
                            className={`block p-3 hover:bg-gray-50 rounded-lg transition-colors ${
                              item.divider
                                ? "border-b border-gray-200 pb-4"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1">
                                <span className="text-gray-400">
                                  {/* <item.icon width={20} height={20} /> */}
                                </span>
                              </div>
                              <div>
                                <div
                                  className={`font-medium ${
                                    item.isSummary
                                      ? "text-blue-600"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {item.title}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">
              Contact
            </Link>
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div>
              <button
                onClick={() => handleMobileCategory("payment-solutions")}
                className="flex items-center justify-between w-full py-2"
              >
                <span className="text-gray-900 font-medium">
                  Payment Solutions
                </span>
                <span
                  className={`transform transition-transform ${
                    mobileCategory === "payment-solutions" ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {mobileCategory === "payment-solutions" && (
                <div className="mt-2 space-y-4 pl-4">
                  {paymentSolutionsCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-medium text-gray-900">
                        {category.title}
                      </h3>
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <a
                            key={itemIndex}
                            href={item.href}
                            className="block py-2 text-gray-600 hover:text-gray-900"
                          >
                            {item.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/about"
              className="block py-2 text-gray-900 hover:text-gray-600"
            >
              About
            </a>
            <a
              href="/contact"
              className="block py-2 text-gray-900 hover:text-gray-600"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
