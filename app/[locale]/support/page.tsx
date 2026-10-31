import type { Metadata } from "next";
import { site } from "@/content/site";

import { href } from "@/lib/i18n/paths";
import { resolvePage, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ServiceVisual } from "@/components/visuals";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await resolvePage(params);
  return buildMetadata({ locale, route: "support", title: dict.support.pageTitle, description: dict.support.metaDescription });
}

export default async function SupportPage({ params }: LocaleParams) {
  const { locale, dict } = await resolvePage(params);
  const t = dict.support;
  const { contact } = site;

  const channels = [
    { icon: "phone" as IconName, ...t.channels.phone, lines: [contact.phones.main, ...contact.phones.supportMobile].map((p) => ({ label: p.display, href: `tel:${p.href}` })), live: true },
    { icon: "mail" as IconName, ...t.channels.email, lines: [{ label: contact.emails.support, href: `mailto:${contact.emails.support}` }] },
    { icon: "pin" as IconName, ...t.channels.office, lines: [{ label: `${contact.address.street}, ${contact.address.city}`, href: contact.address.mapsUrl }] },
  ];

  return (
    <>
      <PageHero
        title={t.pageTitle}
        lead={t.pageLead}
        accent="ember"
        breadcrumbLabel={dict.common.breadcrumb}
        crumbs={[{ label: dict.common.home, href: href(locale, "home") }, { label: t.pageTitle }]}
        visual={
          <div className="h-[21rem] md:h-[24rem]">
            <ServiceVisual name="support" labels={dict.visuals} size="hero" />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`tel:${contact.phones.main.href}`} icon="phone">{t.callNow}</ButtonLink>
          <ButtonLink href={`mailto:${contact.emails.support}`} variant="secondary">{contact.emails.support}</ButtonLink>
        </div>
      </PageHero>

      <section aria-labelledby="channels-title" className="container-site pb-16 md:pb-32">
        <SectionHeader id="channels-title" title={t.channelsTitle} align="stack" />
        <RevealGroup as="ul" className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {channels.map((c) => (
            <RevealItem as="li" key={c.title}>
              <SpotlightCard accent="ember" className="h-full">
                <div className="p-7">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-[10px] border border-line bg-night-2 text-ember">
                      <Icon name={c.icon} size={20} />
                    </span>
                    {"live" in c && c.live && (
                      <span className="relative flex size-2" aria-hidden="true">
                        <span className="animate-pulse-ring absolute inline-flex size-full rounded-[1px] bg-ember" />
                        <span className="relative inline-flex size-2 rounded-[1px] bg-ember" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-h3 mt-6">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted">{c.text}</p>
                  <ul className="mt-5 space-y-1.5">
                    {c.lines.map((line) => (
                      <li key={line.href}>
                        <a href={line.href} className="text-lg tabular-nums text-fg transition-colors hover:text-ember">{line.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section aria-labelledby="included-title" className="border-y border-line bg-night-2/50 py-16 md:py-32">
        <div className="container-site grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <Reveal>
            <h2 id="included-title" className="text-h2">{t.includedTitle}</h2>
          </Reveal>
          <RevealGroup as="dl" className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {t.included.map((f) => (
              <RevealItem key={f.title} className="border-t border-line-strong pt-6">
                <dt className="flex items-center gap-3 text-lg font-semibold">
                  <Icon name={f.icon as IconName} size={20} className="text-ember" />
                  {f.title}
                </dt>
                <dd className="mt-2 text-muted">{f.text}</dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="covered-title" className="container-site py-16 md:py-32">
        <SectionHeader id="covered-title" title={t.coveredTitle} align="stack" />
        <RevealGroup as="ul" className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {t.covered.map((c) => (
            <RevealItem as="li" key={c.title} className="bg-night-2 p-7">
              <span aria-hidden="true" className="block size-2 rounded-[1px] bg-ember" />
              <h3 className="text-h3 mt-5">{c.title}</h3>
              <p className="mt-2 text-muted">{c.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section aria-labelledby="process-title" className="container-site pb-16 md:pb-32">
        <SectionHeader id="process-title" title={t.processTitle} lead={t.processLead} />
        <ProcessSteps steps={t.steps} />
      </section>

      <section aria-labelledby="faq-title" className="container-site pb-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <Reveal><h2 id="faq-title" className="text-h2">{t.faqTitle}</h2></Reveal>
          <Reveal><Faq items={t.faq} /></Reveal>
        </div>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: t.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      </section>

      <CtaBand
        title={t.ctaTitle}
        text={t.ctaText}
        primary={{ label: `${t.callNow} · ${contact.phones.main.display}`, href: `tel:${contact.phones.main.href}` }}
        secondary={{ label: contact.emails.support, href: `mailto:${contact.emails.support}` }}
      />
    </>
  );
}
