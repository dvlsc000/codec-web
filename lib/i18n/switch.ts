import { routes, type RouteKey } from "@/content/routes";
import { defaultLocale, isLocale, type Locale, type Localized } from "./config";

export type ServiceSlugTable = { id: string; slug: Localized }[];

function build(locale: Locale, route: RouteKey, slug?: string) {
  return "/" + [locale, routes[route][locale], slug].filter(Boolean).join("/");
}

/**
 * Translate the current public path into the same page in another language.
 * Client-safe: takes only the routes config and a compact service slug table.
 */
export function switchLocalePath(pathname: string, target: Locale, serviceSlugs: ServiceSlugTable): string {
  const [first, seg, slug] = pathname.split("/").filter(Boolean);
  const current: Locale = isLocale(first) ? first : defaultLocale;
  if (!seg) return build(target, "home");

  const routeKey = (Object.keys(routes) as RouteKey[]).find(
    (k) => routes[k][current] === seg || routes[k].internal === seg,
  );
  if (!routeKey) return build(target, "home");

  if (routeKey === "services" && slug) {
    const s = serviceSlugs.find((x) => x.slug[current] === slug);
    return s ? build(target, "services", s.slug[target]) : build(target, "services");
  }
  return build(target, routeKey);
}
