/**
 * Locale configuration. Croatian is the primary language.
 * To add a language: add it here, add a dictionary in /content/dictionaries,
 * and add its strings to every `Localized` field in /content.
 */
export const locales = ["hr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "hr";

export const localeMeta: Record<Locale, { label: string; short: string; htmlLang: string; ogLocale: string }> = {
  hr: { label: "Hrvatski", short: "HR", htmlLang: "hr", ogLocale: "hr_HR" },
  en: { label: "English", short: "EN", htmlLang: "en", ogLocale: "en_GB" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** A value that exists in every supported language. */
export type Localized<T = string> = Record<Locale, T>;

/** Pick the value for a locale from a localized field. */
export function l<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value[defaultLocale];
}
