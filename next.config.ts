import type { NextConfig } from "next";
import { routes } from "./content/routes";
import { legacyRedirects } from "./content/redirects";

const locales = ["hr", "en"] as const;

/** Public localized segments that differ from the internal folder name. */
function localizedSegments() {
  const out: { locale: string; publicSeg: string; internalSeg: string }[] = [];
  for (const route of Object.values(routes)) {
    if (!route.internal) continue;
    for (const locale of locales) {
      const publicSeg: string = route[locale];
      if (publicSeg !== route.internal) out.push({ locale, publicSeg, internalSeg: route.internal });
    }
  }
  return out;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async rewrites() {
    return localizedSegments().flatMap(({ locale, publicSeg, internalSeg }) => [
      { source: `/${locale}/${publicSeg}`, destination: `/${locale}/${internalSeg}` },
      { source: `/${locale}/${publicSeg}/:path*`, destination: `/${locale}/${internalSeg}/:path*` },
    ]);
  },
  async redirects() {
    // Internal folder paths redirect to their public localized URL (one canonical URL per page).
    const canonical = localizedSegments().flatMap(({ locale, publicSeg, internalSeg }) => [
      { source: `/${locale}/${internalSeg}`, destination: `/${locale}/${publicSeg}`, permanent: true },
      { source: `/${locale}/${internalSeg}/:path*`, destination: `/${locale}/${publicSeg}/:path*`, permanent: true },
    ]);
    const legacy = legacyRedirects.map((r) => ({ ...r, permanent: true }));
    return [...legacy, ...canonical];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
