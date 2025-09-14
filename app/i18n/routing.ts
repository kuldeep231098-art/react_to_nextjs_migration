import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "fr", "ja", "pt", "zh"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/pathnames": {
      es: "/nombres-de-ruta",
    },
  },
});
