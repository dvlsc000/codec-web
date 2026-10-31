import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Resolve and validate the locale param, then load its dictionary. */
export async function resolvePage(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  return { locale: locale as Locale, dict };
}
