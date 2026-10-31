import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "@/content/dictionaries/hr";

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  hr: () => import("@/content/dictionaries/hr").then((m) => m.default),
  en: () => import("@/content/dictionaries/en").then((m) => m.default),
};

export const getDictionary = (locale: Locale) => loaders[locale]();
export type { Dictionary };
