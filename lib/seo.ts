import type { Metadata } from "next";
import type { RouteKey } from "@/content/routes";
import { site } from "@/content/site";
import { defaultLocale, localeMeta, locales, type Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/i18n/paths";

/** Consistent metadata with canonical URL, hreflang alternates and Open Graph. */
export function buildMetadata(opts: {
  locale: Locale;
  route: RouteKey;
  serviceId?: string;
  title: string;
  description: string;
  keywords?: string[];
  absoluteTitle?: boolean;
}): Metadata {
  const alts = alternatesFor(opts.route, opts.serviceId);
  const path = alts[opts.locale];
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, alts[l]]));
  languages["x-default"] = alts[defaultLocale];

  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: path, languages },
    openGraph: {
      type: "website",
      url: path,
      siteName: site.legalName,
      title: opts.title,
      description: opts.description,
      locale: localeMeta[opts.locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== opts.locale).map((l) => localeMeta[l].ogLocale),
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description },
  };
}
