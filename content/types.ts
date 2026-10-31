import type { Localized } from "@/lib/i18n/config";
import type { IconName } from "@/components/ui/Icon";

/** Brand accent a service or project is tinted with. Defined as tokens in globals.css. */
export type Accent = "ember" | "amber" | "steel";

/** Animated illustration for a service, see components/visuals. */
export type VisualName = "voice" | "automation" | "web" | "callAccounting" | "support";

export interface Feature {
  icon?: IconName;
  title: Localized;
  text: Localized;
}

export interface FaqItem {
  q: Localized;
  a: Localized;
}

/**
 * A service. Every optional block renders only when present, so a new service
 * can be as short or as detailed as needed without touching components.
 */
export interface Service {
  id: string;
  slug: Localized;
  icon: IconName;
  accent: Accent;
  /** Wide tile on the home page grid (alternate wide / narrow rows look best). */
  featured?: boolean;
  /** Animated illustration used in cards and on the service page. */
  visual: VisualName;
  /** Hide without deleting. */
  hidden?: boolean;
  title: Localized;
  /** One line used in cards and the hero of the service page. */
  tagline: Localized;
  /** 1–2 sentences used in cards, menus and meta descriptions. */
  summary: Localized;
  /** Paragraphs for the service page introduction. */
  intro: Localized<string[]>;
  /** Short outcome statements shown as highlights. */
  outcomes?: Localized<string[]>;
  features: Feature[];
  /** Product editions / packages (e.g. CAM basic, hotel, network). */
  editions?: { title: Localized; text: Localized; points?: Localized<string[]> }[];
  useCases?: { title: Localized; text: Localized }[];
  faq?: FaqItem[];
  download?: { label: Localized; href: string };
  seo?: { title?: Localized; description?: Localized; keywords?: Localized<string[]> };
}

export interface ClientGroup {
  id: string;
  title: Localized;
  clients: { name: string; country: string }[];
}

export interface Project {
  id: string;
  client: string;
  /** Client names involved, displayed as tags. */
  sites?: string[];
  sector: Localized;
  location: Localized;
  /** Service id from content/services.ts this project belongs to. */
  serviceId: string;
  accent: Accent;
  title: Localized;
  summary: Localized;
  scope: Localized<string[]>;
  partner?: string;
  featured?: boolean;
}
