import { routes, type RouteKey } from "@/content/routes";
import { services } from "@/content/services";
import { defaultLocale, isLocale, locales, type Locale } from "./config";

/** Build a public, localized URL path. */
export function href(locale: Locale, route: RouteKey, slug?: string): string {
  const seg = routes[route][locale];
  return "/" + [locale, seg, slug].filter(Boolean).join("/");
}

export function serviceHref(locale: Locale, serviceId: string): string {
  const s = services.find((x) => x.id === serviceId);
  return s ? href(locale, "services", s.slug[locale]) : href(locale, "services");
}

/** Every localized version of one page, keyed by locale (used for hreflang). */
export function alternatesFor(route: RouteKey, serviceId?: string): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((loc) => [loc, serviceId ? serviceHref(loc, serviceId) : href(loc, route)]),
  ) as Record<Locale, string>;
}

