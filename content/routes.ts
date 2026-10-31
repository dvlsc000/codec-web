/**
 * Localized URL segments for every page.
 *
 * `internal` is the folder name under /app/[locale]; `hr` / `en` are the public
 * URL segments. Public URLs are mapped to the internal folders via rewrites
 * generated in next.config.ts, so changing a public URL here needs no other edits.
 *
 * Kept free of path aliases because next.config.ts imports it.
 */
export const routes = {
  home: { internal: "", hr: "", en: "" },
  services: { internal: "services", hr: "usluge", en: "services" },
  about: { internal: "about", hr: "o-nama", en: "about" },
  support: { internal: "support", hr: "podrska", en: "support" },
  references: { internal: "references", hr: "reference", en: "references" },
  contact: { internal: "contact", hr: "kontakt", en: "contact" },
  privacy: { internal: "privacy", hr: "privatnost", en: "privacy" },
} as const;

export type RouteKey = keyof typeof routes;
