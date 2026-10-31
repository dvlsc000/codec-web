import type { Metadata } from "next";
import { site } from "@/content/site";
import { l } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/paths";
import { resolvePage, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { serviceCards } from "@/lib/view";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
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
      <PageHero
        title={t.pageTitle}
        lead={t.pageLead}
        accent="ember"
        breadcrumbLabel={dict.common.breadcrumb}
        crumbs={[{ label: dict.common.home, href: href(locale, "home") }, { label: t.pageTitle }]}
      />

      <section className="container-site pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] lg:gap-14">
          <Reveal>
            <h2 className="sr-only">{t.formTitle}</h2>
            <ContactForm
              labels={t.form}
              locale={locale}
              privacyHref={href(locale, "privacy")}
              fallbackEmail={contact.emails.general}
              services={serviceCards(locale).map(({ id, title, icon, accent }) => ({ id, title, icon, accent }))}
            />
          </Reveal>

          <div>
            <h2 className="sr-only">{t.directTitle}</h2>
            <RevealGroup className="space-y-4">
              {channels.map((c) => (
                <RevealItem key={c.key} className="rounded-[var(--radius-card)] border border-line p-6 transition-colors hover:border-line-strong">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl border border-line bg-night-2 text-ember">
                      <Icon name={c.icon} size={19} />
                    </span>
                    <h3 className="font-sans text-base font-semibold tracking-normal">{c.title}</h3>
                    {c.live && (
                      <span className="relative ml-auto flex size-2" aria-hidden="true">
                        <span className="animate-pulse-ring absolute inline-flex size-full rounded-full bg-ember" />
                        <span className="relative inline-flex size-2 rounded-full bg-ember" />
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-muted">{c.text}</p>
                  <ul className="mt-4 space-y-1.5">
                    {c.lines.map((line) => (
                      <li key={line.href}>
                        <a href={line.href} className="text-lg text-fg transition-colors hover:text-ember">{line.label}</a>
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              ))}

              <RevealItem className="rounded-[var(--radius-card)] border border-line p-6">
                <h3 className="flex items-center gap-3 font-sans text-base font-semibold tracking-normal">
                  <span className="grid size-10 place-items-center rounded-xl border border-line bg-night-2 text-steel">
                    <Icon name="pin" size={19} />
                  </span>
                  {t.addressTitle}
                </h3>
                <address className="mt-4 text-lg not-italic leading-relaxed">
                  {site.legalName}<br />
                  {contact.address.street}<br />
                  {contact.address.postalCode} {contact.address.city}, {l(contact.address.country, locale)}
                </address>
                <a href={contact.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-ember hover:underline">
                  {t.openMap}
                  <Icon name="arrowUpRight" size={15} />
                </a>
              </RevealItem>
            </RevealGroup>
          </div>
        </div>
      </section>
    </>
  );
}
