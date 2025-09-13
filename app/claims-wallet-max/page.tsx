"use client";

import { Suspense } from "react";
import { ClaimsWalletMax } from "@/app/components/ClaimsWalletMax";
import { Header } from "../components/layouts/Header";
import { Footer } from "../components/layouts/Footer";

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
        <Header />
        <main className="pt-16">
          <ClaimsWalletMax />
        </main>

        <Footer />
      </div>
    </Suspense>
  );
}
