"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import { switchLocalePath, type ServiceSlugTable } from "@/lib/i18n/switch";

/** HR / EN toggle that keeps the visitor on the same page in the other language. */
export function LanguageSwitcher({ locale, label, slugTable }: { locale: Locale; label: string; slugTable: ServiceSlugTable }) {
  const pathname = usePathname();
  const index = locales.indexOf(locale);

  return (
    <nav aria-label={label} className="relative flex h-10 items-center rounded-full border border-line bg-white/[0.02] p-1 text-[0.8rem] font-medium">
      <span
        aria-hidden="true"
        className="absolute top-1 h-8 w-10 rounded-full bg-white/[0.09] transition-transform duration-500 ease-[var(--ease-out-expo)]"
        style={{ transform: `translateX(${index * 2.5}rem)` }}
      />
      {locales.map((loc) => (
        <Link
          key={loc}
          href={switchLocalePath(pathname, loc, slugTable)}
          hrefLang={localeMeta[loc].htmlLang}
          lang={localeMeta[loc].htmlLang}
          aria-current={loc === locale ? "true" : undefined}
          aria-label={localeMeta[loc].label}
          onClick={() => {
            document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=31536000; samesite=lax`;
          }}
          className="relative z-10 grid h-8 w-10 place-items-center rounded-full text-muted transition-colors hover:text-fg aria-[current=true]:text-fg"
        >
          {localeMeta[loc].short}
        </Link>
      ))}
    </nav>
  );
}
