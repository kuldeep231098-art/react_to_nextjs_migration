"use client";

import { Suspense } from "react";
import { ClaimsWalletMax } from "@/app/components/ClaimsWalletMax";
import { Footer } from "../components/Footer";

export default function ClaimsWalletMaxPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <div className="min-h-screen bg-[#F7F9FF] dark:bg-gray-950">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-blue-600">JUICE</div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-900">
                  PAYMENT SOLUTIONS
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  FAQs
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-16">
          <ClaimsWalletMax />
        </main>

        <Footer />
      </div>
    </Suspense>
  );
}
