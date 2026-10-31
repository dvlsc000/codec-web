import { visibleServices } from "@/content/services";
import { l, type Locale } from "@/lib/i18n/config";
import { serviceHref } from "@/lib/i18n/paths";

/** Services flattened to one language — what cards, menus and grids consume. */
export function serviceCards(locale: Locale) {
  return visibleServices().map((s) => ({
    id: s.id,
    href: serviceHref(locale, s.id),
    icon: s.icon,
    accent: s.accent,
    featured: !!s.featured,
    visual: s.visual,
    title: l(s.title, locale),
    tagline: l(s.tagline, locale),
    summary: l(s.summary, locale),
    features: s.features.slice(0, 3).map((f) => l(f.title, locale)),
  }));
}
export type ServiceCardData = ReturnType<typeof serviceCards>[number];

export const serviceSlugTable = () => visibleServices().map((s) => ({ id: s.id, slug: s.slug }));
