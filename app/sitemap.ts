import type { MetadataRoute } from "next";
import { routes, type RouteKey } from "@/content/routes";
import { visibleServices } from "@/content/services";
import { site } from "@/content/site";
import { locales } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/i18n/paths";

/** Generated from the routes and services config — every page in every language. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  const add = (alts: Record<string, string>, priority: number) => {
    for (const locale of locales) {
      entries.push({
        url: site.url + alts[locale],
        lastModified: now,
        changeFrequency: "monthly",
        priority,
        alternates: { languages: Object.fromEntries(locales.map((l) => [l, site.url + alts[l]])) },
      });
    }
  };
  for (const key of Object.keys(routes) as RouteKey[]) add(alternatesFor(key), key === "home" ? 1 : key === "privacy" ? 0.2 : 0.8);
  for (const s of visibleServices()) add(alternatesFor("services", s.id), 0.9);
  return entries;
}
