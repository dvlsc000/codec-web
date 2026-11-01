import Link from "next/link";
import { footerNav } from "@/content/navigation";
import { site } from "@/content/site";
import { l, type Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/paths";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { serviceCards } from "@/lib/view";
import { Logo } from "./Logo";
import { WORDMARK, WORDMARK_DOT, WORDMARK_HEIGHT, WORDMARK_WIDTH } from "@/components/brand/logo-paths";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.footer;
  const { contact, legal } = site;
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="relative mt-16 overflow-hidden border-t border-line md:mt-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-ember),var(--color-steel),transparent)] opacity-50" />
      <div className="container-site grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:gap-12 md:py-20">
        <div className="col-span-2 max-w-xs md:col-span-1">
          <Link href={href(locale, "home")} aria-label="Codec" className="inline-block rounded-lg">
            <Logo className="h-8" />
          </Link>
          <p className="mt-5 text-muted">{t.tagline}</p>
          <a href={`tel:${contact.phones.main.href}`} className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-line px-4 py-2 text-sm text-fg transition-colors hover:border-ember/60">
            <span className="relative flex size-2">
              <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-ember" />
              <span className="relative inline-flex size-2 rounded-full bg-ember" />
            </span>
            {t.support} · {contact.phones.main.display}
          </a>
        </div>

        <FooterCol title={t.servicesTitle}>
          {serviceCards(locale).map((s) => (
            <li key={s.id}><FooterLink href={s.href}>{s.title}</FooterLink></li>
          ))}
        </FooterCol>

        <FooterCol title={t.companyTitle}>
          {footerNav.map((n) => (
            <li key={n.route}><FooterLink href={href(locale, n.route)}>{l(n.label, locale)}</FooterLink></li>
          ))}
        </FooterCol>

        <FooterCol title={t.contactTitle} className="col-span-2 md:col-span-1">
          <li><FooterLink href={`mailto:${contact.emails.general}`}>{contact.emails.general}</FooterLink></li>
          <li><FooterLink href={`mailto:${contact.emails.support}`}>{contact.emails.support}</FooterLink></li>
          <li><FooterLink href={`tel:${contact.phones.main.href}`}>{contact.phones.main.display}</FooterLink></li>
          <li className="pt-2 text-muted">
            <address className="not-italic">
              {contact.address.street}<br />
              {contact.address.postalCode} {contact.address.city}, {l(contact.address.country, locale)}
            </address>
          </li>
        </FooterCol>
      </div>

      <div className="container-site overflow-hidden" aria-hidden="true">
        <svg viewBox={`0 0 ${WORDMARK_WIDTH} ${WORDMARK_HEIGHT}`} className="block h-auto w-full translate-y-[18%]">
          <defs>
            <linearGradient id="footer-word" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d3d6dc" stopOpacity="0.16" />
              <stop offset="0.85" stopColor="#d3d6dc" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={WORDMARK} fill="url(#footer-word)" />
          <rect x={WORDMARK_DOT.x} y={WORDMARK_DOT.y} width={WORDMARK_DOT.s} height={WORDMARK_DOT.s} fill="#ff5a1f" fillOpacity="0.8" />
        </svg>
      </div>

      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-subtle md:flex-row md:items-center md:justify-between">
          <p>© {year} {site.legalName}. {t.rights}</p>
          <p>{l(legal.registry, locale)} · OIB {legal.oib}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h2 className="font-sans text-sm font-medium tracking-normal text-subtle">{title}</h2>
      <ul className="mt-5 space-y-3 text-[0.95rem]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("mailto:") || href.startsWith("tel:");
  const cls = "text-fg/85 transition-colors hover:text-ember";
  return external ? <a href={href} className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>;
}
