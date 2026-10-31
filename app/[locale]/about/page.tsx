import type { Metadata } from "next";
import { clientCount, countryCount } from "@/content/projects";
import { site } from "@/content/site";
import { l } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/paths";
import { resolvePage, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { StatsRow } from "@/components/sections/StatsRow";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await resolvePage(params);
  return buildMetadata({ locale, route: "about", title: dict.about.pageTitle, description: dict.about.metaDescription });
}

export default async function AboutPage({ params }: LocaleParams) {
  const { locale, dict } = await resolvePage(params);
  const t = dict.about;
  const c = t.company;
  const { contact, legal } = site;

  const companyRows: [string, string][] = [
    [c.legalName, site.legalName],
    [c.address, `${contact.address.street}, ${contact.address.postalCode} ${contact.address.city}`],
    [c.office, `${contact.office.street}, ${contact.office.city}`],
    [c.registry, l(legal.registry, locale)],
    [c.mb, legal.mb],
    [c.oib, legal.oib],
    [c.bank, legal.bank],
    [c.iban, legal.iban],
    [c.swift, legal.swift],
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

      <section aria-labelledby="story-title" className="container-site pb-24 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <Reveal><h2 id="story-title" className="text-h2">{t.storyTitle}</h2></Reveal>
          <RevealGroup className="space-y-6">
            {t.story.map((p) => (
              <RevealItem key={p}><p className="text-lead">{p}</p></RevealItem>
            ))}
          </RevealGroup>
        </div>
        <div className="mt-16">
          <StatsRow
            stats={[
              { value: clientCount(), suffix: "+", label: dict.home.heritage.stats.clients },
              { value: countryCount(), label: dict.home.heritage.stats.countries },
              { value: "0–24", label: dict.home.heritage.stats.support },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="phases-title" className="border-y border-line bg-night-2/50 py-24 md:py-32">
        <div className="container-site">
          <SectionHeader id="phases-title" title={t.phasesTitle} align="stack" />
          <RevealGroup as="ol" className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {t.phases.map((p, i) => (
              <RevealItem as="li" key={p.title} className="relative bg-night p-7 md:p-8">
                <span className="font-display text-sm text-subtle">{String(i + 1).padStart(2, "0")}</span>
                <div aria-hidden="true" className="mt-5 h-px w-full bg-[linear-gradient(90deg,var(--color-ember),transparent)]" style={{ opacity: 0.35 + i * 0.2 }} />
                <h3 className="text-h3 mt-6">{p.title}</h3>
                <p className="mt-3 text-muted">{p.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-labelledby="values-title" className="container-site py-24 md:py-32">
        <SectionHeader id="values-title" title={t.valuesTitle} align="stack" />
        <RevealGroup as="dl" className="grid gap-10 md:grid-cols-3">
          {t.values.map((v) => (
            <RevealItem key={v.title} className="border-t border-line-strong pt-6">
              <dt className="text-h3">{v.title}</dt>
              <dd className="mt-3 text-lg text-muted">{v.text}</dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section aria-labelledby="company-title" className="container-site pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <Reveal><h2 id="company-title" className="text-h2">{t.companyTitle}</h2></Reveal>
          <Reveal>
            <dl className="divide-y divide-line border-y border-line">
              {companyRows.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="text-subtle">{k}</dt>
                  <dd className="break-words text-fg/90">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <CtaBand title={dict.cta.title} text={dict.cta.text} primary={{ label: dict.cta.primary, href: href(locale, "contact") }} />
    </>
  );
}
