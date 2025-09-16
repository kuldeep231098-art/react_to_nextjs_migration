import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  typescript: {
    // ✅ This will skip type errors during build
    ignoreBuildErrors: true,
  },
};

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts");

export default withNextIntl(nextConfig);
