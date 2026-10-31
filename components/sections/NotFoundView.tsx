"use client";

import { usePathname } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { ButtonLink } from "@/components/ui/Button";

type Copy = { title: string; text: string; back: string };

/** Picks the 404 language from the URL, since not-found pages receive no params. */
export function NotFoundView({ copy }: { copy: Record<Locale, Copy> }) {
  const seg = usePathname()?.split("/")[1];
  const locale: Locale = isLocale(seg) ? seg : defaultLocale;
  const t = copy[locale];
  return (
    <section className="container-site flex min-h-[80svh] flex-col items-start justify-center pt-32">
      <p aria-hidden="true" className="bg-[linear-gradient(120deg,var(--color-ember),var(--color-steel))] bg-clip-text font-display text-[clamp(6rem,22vw,16rem)] font-semibold leading-none tracking-[-0.06em] text-transparent">
        404
      </p>
      <h1 className="text-h2 mt-4">{t.title}</h1>
      <p className="text-lead mt-4">{t.text}</p>
      <ButtonLink href={`/${locale}`} icon="arrowRight" className="mt-10">{t.back}</ButtonLink>
    </section>
  );
}
