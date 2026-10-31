import type { Localized } from "@/lib/i18n/config";
import type { RouteKey } from "./routes";

export interface NavItem {
  route: RouteKey;
  label: Localized;
  /** Show the services list as a dropdown under this item. */
  withServices?: boolean;
}

/**
 * Main navigation — same structure as the original codec-info.hr menu:
 * Početna · O nama · Usluge (dropdown, formerly "Proizvodi") · Podrška · Reference · Kontakt
 */
export const mainNav: NavItem[] = [
  { route: "home", label: { hr: "Početna", en: "Home" } },
  { route: "about", label: { hr: "O nama", en: "About" } },
  { route: "services", label: { hr: "Usluge", en: "Services" }, withServices: true },
  { route: "support", label: { hr: "Podrška", en: "Support" } },
  { route: "references", label: { hr: "Reference", en: "References" } },
  { route: "contact", label: { hr: "Kontakt", en: "Contact" } },
];

/** Footer "Company" column. */
export const footerNav: NavItem[] = [
  { route: "about", label: { hr: "O nama", en: "About us" } },
  { route: "support", label: { hr: "Podrška 0–24", en: "24/7 support" } },
  { route: "references", label: { hr: "Reference", en: "References" } },
  { route: "contact", label: { hr: "Kontakt", en: "Contact" } },
  { route: "privacy", label: { hr: "Zaštita privatnosti", en: "Privacy policy" } },
];
