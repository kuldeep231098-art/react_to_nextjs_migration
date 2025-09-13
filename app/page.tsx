"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left mb-8">
          <h1 className="text-4xl font-bold mb-4">{t("pages.home.welcome")}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {t("pages.home.getStarted")}
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            {t("buttons.get_started")}
          </button>
        </div>
        <Image
          className="dark:invert"
          src="/next.svg"
          alt={t("common.logo_alt", { name: "Next.js" })}
          width={180}
          height={38}
          priority
        />

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt={t("common.logo_alt", { name: "Vercel" })}
              width={20}
              height={20}
            />
            {t("buttons.deploy_now")}
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("buttons.read_docs")}
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt={t("common.file_icon")}
            width={16}
            height={16}
          />
          {t("common.learn")}
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/examples"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt={t("common.window_icon")}
            width={16}
            height={16}
          />
          {t("common.examples")}
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt={t("common.globe_icon")}
            width={16}
            height={16}
          />
          {t("common.visit_site")}
        </a>
      </footer>
    </div>
  );
}
