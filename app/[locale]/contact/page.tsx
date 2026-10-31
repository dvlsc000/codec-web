import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { l } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/paths";
import { resolvePage, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { serviceCards } from "@/lib/view";
import { ContactForm } from "@/components/sections/ContactForm";
import { OfficeMap } from "@/components/contact/OfficeMap";
import { LocalTime } from "@/components/contact/LocalTime";
import { CopyButton } from "@/components/contact/CopyButton";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await resolvePage(params);
  return buildMetadata({ locale, route: "contact", title: dict.contact.pageTitle, description: dict.contact.metaDescription });
}

export default async function ContactPage({ params }: LocaleParams) {
  const { locale, dict } = await resolvePage(params);
  const t = dict.contact;
  const { contact } = site;
  const office = contact.office;
  const officeLine = `${office.street}, ${office.postalCode} ${office.city}`;

  const channels: { key: string; icon: IconName; title: string; text: string; lines: { label: string; href: string }[]; live?: boolean }[] = [
    {
      key: "sales",
      icon: "spark",
      ...t.channels.sales,
      lines: [
        { label: contact.emails.sales, href: `mailto:${contact.emails.sales}` },
        { label: contact.phones.main.display, href: `tel:${contact.phones.main.href}` },
      ],
    },
    {
      key: "support",
      icon: "support",
      live: true,
      ...t.channels.support,
      lines: [
        { label: contact.emails.support, href: `mailto:${contact.emails.support}` },
        ...contact.phones.supportMobile.map((p) => ({ label: p.display, href: `tel:${p.href}` })),
      ],
    },
    {
      key: "general",
      icon: "mail",
      ...t.channels.general,
      lines: [{ label: contact.emails.general, href: `mailto:${contact.emails.general}` }],
    },
  ];

  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <section className="relative isolate overflow-hidden pb-12 pt-28 md:pb-20 md:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-[10%] -top-1/3 size-[55vw] max-w-[760px] rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.2),transparent)] blur-2xl" />
          <div className="pixel-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_70%_20%,#000,transparent)]" />
        </div>
        <div className="container-site">
          <nav aria-label={dict.common.breadcrumb}>
            <ol className="flex items-center gap-2 text-sm text-muted">
              <li>
                <Link href={href(locale, "home")} className="transition-colors hover:text-fg">{dict.common.home}</Link>
              </li>
              <li aria-hidden="true" className="text-subtle">/</li>
              <li aria-current="page" className="text-fg/80">{t.pageTitle}</li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-10 md:mt-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <Reveal>
              <h1 className="text-display">{t.pageTitle}</h1>
              <p className="text-lead mt-6 max-w-[48ch]">{t.pageLead}</p>
            </Reveal>

            {/* Live status + quick actions */}
            <Reveal delay={0.15}>
              <div className="rounded-[var(--radius-card)] border border-line bg-night-2/70 p-5 backdrop-blur md:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
                  <span className="inline-flex items-center gap-2.5 text-sm text-fg">
                    <span className="relative flex size-2" aria-hidden="true">
                      <span className="animate-pulse-ring absolute inline-flex size-full rounded-[1px] bg-ember" />
                      <span className="relative inline-flex size-2 rounded-[1px] bg-ember" />
                    </span>
                    <span>
                      {t.supportLive.split("0–24").map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && <span className="whitespace-nowrap">0–24</span>}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="text-right text-xs text-subtle">
                    <span className="block font-display text-lg font-medium text-fg">
                      <LocalTime locale={locale} />
                    </span>
                    {t.localTime}
                  </span>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <ButtonLink href={`tel:${contact.phones.main.href}`} icon="phone" className="w-full">
                    {t.callUs}
                  </ButtonLink>
                  <ButtonLink href={`mailto:${contact.emails.general}`} variant="secondary" className="w-full">
                    {t.writeUs}
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Form + channels */}
      <section className="container-site pb-16 md:pb-28">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] lg:gap-8">
          <Reveal>
            <div className="mb-5 flex items-end justify-between gap-6 px-1">
              <div>
                <h2 className="text-h3">{t.formTitle}</h2>
                <p className="mt-1.5 text-sm text-muted">{t.formLead}</p>
              </div>
            </div>
            <ContactForm
              labels={t.form}
              locale={locale}
              privacyHref={href(locale, "privacy")}
              fallbackEmail={contact.emails.general}
              services={serviceCards(locale).map(({ id, title, icon, accent }) => ({ id, title, icon, accent }))}
            />
          </Reveal>

          <div>
            <h2 className="text-h3 mb-5 px-1">{t.directTitle}</h2>
            <RevealGroup className="divide-y divide-line overflow-hidden rounded-[var(--radius-panel)] border border-line bg-night-2/60">
              {channels.map((c) => (
                <RevealItem key={c.key} className="group/ch relative p-6 transition-colors hover:bg-white/[0.02] md:p-7">
                  <div className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-[11px] border border-line bg-night-3 text-ember transition-transform duration-500 group-hover/ch:-rotate-6">
                      <Icon name={c.icon} size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="flex items-center gap-2.5 font-sans text-base font-semibold tracking-normal">
                        {c.title}
                        {c.live && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 text-[0.68rem] font-medium text-ember">
                            <span className="size-1.5 rounded-[1px] bg-ember" aria-hidden="true" />
                            0–24
                          </span>
                        )}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{c.text}</p>
                      <ul className="mt-4 space-y-1.5">
                        {c.lines.map((line) => (
                          <li key={line.href}>
                            <a href={line.href} className="group/ln inline-flex items-center gap-2 text-[1.05rem] tabular-nums text-fg transition-colors hover:text-ember">
                              {line.label}
                              <Icon name="arrowUpRight" size={14} className="text-subtle opacity-0 transition-all group-hover/ln:translate-x-0.5 group-hover/ln:text-ember group-hover/ln:opacity-100" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Map */}
      <section aria-labelledby="map-title" className="container-site pb-8">
        <div className="mb-8 grid gap-4 md:mb-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end">
          <Reveal>
            <h2 id="map-title" className="text-h2">{t.mapTitle}</h2>
          </Reveal>
          <Reveal>
            <p className="text-lead max-w-[46ch]">{t.mapLead}</p>
          </Reveal>
        </div>

        <Reveal>
          <div data-accent="ember" className="edge-glow relative overflow-hidden rounded-[var(--radius-panel)] border border-line">
            <div className="h-[26rem] md:h-[36rem]">
              <OfficeMap
                lat={office.lat}
                lng={office.lng}
                title="Codec"
                subtitle={officeLine}
                labels={{
                  zoomIn: t.zoomIn,
                  zoomOut: t.zoomOut,
                  recenter: t.recenter,
                  unavailable: t.mapUnavailable,
                  touch: t.mapGestureTouch,
                  wheel: t.mapGestureWheel,
                  mac: t.mapGestureMac,
                }}
              />
            </div>

            {/* Address card over the map (below it on phones) */}
            <div className="relative border-t border-line bg-night-2 p-5 md:absolute md:bottom-5 md:left-5 md:w-[27rem] md:rounded-[var(--radius-card)] md:border md:border-line-strong md:bg-night-2/90 md:p-6 md:shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)] md:backdrop-blur-md">
              <p className="text-xs font-medium text-ember">{t.officeLabel}</p>
              <address className="mt-2 not-italic">
                <span className="block font-display text-xl font-medium tracking-tight">{office.street}</span>
                <span className="mt-0.5 block text-muted">
                  {office.postalCode} {office.city}, {l(contact.address.country, locale)}
                </span>
              </address>
              <div className="mt-5 grid gap-2 min-[420px]:grid-cols-2">
                <ButtonLink href={office.directionsUrl} icon="arrowUpRight" size="sm" className="h-11 w-full whitespace-nowrap" target="_blank" rel="noopener noreferrer">
                  {t.directions}
                </ButtonLink>
                <CopyButton value={`${site.legalName}, ${officeLine}, ${l(contact.address.country, locale)}`} label={t.copyAddress} copiedLabel={t.copied} className="w-full whitespace-nowrap" />
              </div>
              <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-subtle">
                {t.registeredLabel}: {site.legalName}, {contact.address.street}, {contact.address.postalCode} {contact.address.city}
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
