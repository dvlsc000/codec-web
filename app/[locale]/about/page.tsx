import type { Metadata } from "next";
import { allClients, clientCount, countryCount, countryNames } from "@/content/projects";
import { site } from "@/content/site";
import { l } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/paths";
import { resolvePage, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { TeamGrid } from "@/components/people/TeamGrid";
import { team } from "@/content/people";
import { MarkConstruction } from "@/components/about/MarkConstruction";
import { ScrollManifesto } from "@/components/about/ScrollManifesto";
import { Footprint, type FootprintRow } from "@/components/about/Footprint";
import { Timeline } from "@/components/about/Timeline";
import { CopyField } from "@/components/about/CopyField";
import { CountUp } from "@/components/ui/CountUp";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { SwipeRail } from "@/components/ui/SwipeRail";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await resolvePage(params);
  return buildMetadata({ locale, route: "about", title: dict.about.pageTitle, description: dict.about.metaDescription });
}

export default async function AboutPage({ params }: LocaleParams) {
  const { locale, dict } = await resolvePage(params);
  const t = dict.about;
  const c = t.company;
  const { contact, legal } = site;

  // Footprint: one pixel per reference client, grouped by country (largest first).
  const byCountry = new Map<string, string[]>();
  for (const cl of allClients()) byCountry.set(cl.country, [...(byCountry.get(cl.country) ?? []), cl.name]);
  const footprint: FootprintRow[] = [...byCountry.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([code, clients]) => ({ country: l(countryNames[code], locale), count: clients.length, clients }));

  const stats = [
    { value: clientCount(), suffix: "+", label: dict.home.heritage.stats.clients },
    { value: countryCount(), suffix: "", label: dict.home.heritage.stats.countries },
    { text: "0–24", label: dict.home.heritage.stats.support },
  ];

  const companyRows: { label: string; value: string; copy?: boolean }[] = [
    { label: c.legalName, value: site.legalName, copy: true },
    { label: c.address, value: `${contact.address.street}, ${contact.address.postalCode} ${contact.address.city}`, copy: true },
    { label: c.office, value: `${contact.office.street}, ${contact.office.city}` },
    { label: c.registry, value: l(legal.registry, locale) },
    { label: c.mb, value: legal.mb, copy: true },
    { label: c.oib, value: legal.oib, copy: true },
    { label: c.bank, value: legal.bank },
    { label: c.iban, value: legal.iban, copy: true },
    { label: c.swift, value: legal.swift, copy: true },
  ];

  return (
    <>
      {/* 1. Opening — the mark assembles on its construction grid */}
      <PageHero
        title={t.pageTitle}
        lead={t.pageLead}
        accent="ember"
        breadcrumbLabel={dict.common.breadcrumb}
        crumbs={[{ label: dict.common.home, href: href(locale, "home") }, { label: t.pageTitle }]}
        visualBare
        visual={<MarkConstruction />}
      />

      {/* 2. Story — statement pinned on the left, the story on the right */}
      <section aria-labelledby="story-title" className="relative pb-16 md:pb-32">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 size-[32rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.08),transparent)]" />
        <div className="container-site relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2 id="story-title" className="mb-7 flex items-center gap-3 text-sm text-subtle">
              <span aria-hidden="true" className="size-2 rounded-[1.5px] bg-ember" />
              {t.storyTitle}
            </h2>
            <ScrollManifesto text={t.manifesto} className="max-w-[20ch] text-[clamp(1.65rem,1rem+2.2vw,2.75rem)]" />
          </div>

          <div className="lg:pt-12">
            <RevealGroup className="space-y-6">
              <RevealItem>
                <p className="text-[clamp(1.2rem,1.05rem+0.6vw,1.5rem)] font-medium leading-snug text-fg">{t.storyLead}</p>
              </RevealItem>
              {t.story.map((p) => (
                <RevealItem key={p}>
                  <p className="text-lg leading-relaxed text-fg/65">{p}</p>
                </RevealItem>
              ))}
            </RevealGroup>

            {/* Then → Now */}
            <RevealGroup as="ol" className="relative mt-12 grid gap-3 sm:grid-cols-2">
              {t.journey.map((j, i) => (
                <RevealItem as="li" key={j.label} className="relative">
                  <div
                    data-accent={i === 0 ? "steel" : "ember"}
                    className={`relative h-full overflow-hidden rounded-[var(--radius-card)] border p-6 ${
                      i === 0 ? "border-line bg-night-2" : "edge-glow border-ember/30 bg-[linear-gradient(160deg,rgb(255_90_31/0.12),rgb(255_90_31/0.02)_60%)]"
                    }`}
                  >
                    <span className={`inline-flex items-center gap-2 text-xs font-medium ${i === 0 ? "text-subtle" : "text-ember"}`}>
                      <span aria-hidden="true" className={`size-1.5 rounded-[1px] ${i === 0 ? "bg-subtle" : "bg-ember"}`} />
                      {j.label}
                    </span>
                    <h3 className="text-h3 mt-4">{j.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{j.text}</p>
                  </div>
                  {i === 0 && (
                    <span aria-hidden="true" className="absolute -right-6 top-1/2 z-10 hidden size-9 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-night text-ember sm:grid">
                      <Icon name="arrowRight" size={16} />
                    </span>
                  )}
                </RevealItem>
              ))}
            </RevealGroup>

            {/* Clients + partner */}
            <Reveal>
              <div className="mt-12 border-t border-line pt-8">
                <p className="text-sm text-subtle">{t.notableTitle}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {t.notable.map((n) => (
                    <li key={n} className="rounded-full border border-line bg-white/[0.025] px-3.5 py-1.5 text-[0.9rem] text-fg/85">{n}</li>
                  ))}
                </ul>
                <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-subtle">
                  {t.partnerLabel}
                  <span className="inline-flex items-center gap-2 font-medium text-fg">
                    <span aria-hidden="true" className="size-1.5 rounded-[1px] bg-ember" />
                    {t.partner}
                  </span>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Numbers */}
      <section aria-label={t.numbersLabel} className="relative overflow-hidden border-y border-line bg-night-2/60">
        <div aria-hidden="true" className="pixel-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_100%_at_50%_100%,#000,transparent)]" />
        <RevealGroup as="dl" className="container-site relative grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((s) => (
            <RevealItem key={s.label} className="flex flex-row-reverse items-center justify-end gap-5 py-6 sm:flex-col-reverse sm:items-start sm:gap-3 sm:px-6 sm:py-12 sm:first:pl-0 md:px-10 md:py-16">
              <dt className="text-[0.95rem] leading-snug text-muted md:text-base">{s.label}</dt>
              <dd className="font-display w-[7.25rem] shrink-0 whitespace-nowrap text-[2.4rem] sm:w-auto sm:text-[clamp(2.6rem,1.4rem+3.6vw,5.5rem)] font-medium leading-none tracking-[-0.05em]">
                {"text" in s ? s.text : <CountUp to={s.value} suffix={s.suffix} />}
              </dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 4. Footprint — one pixel per client */}
      <section aria-labelledby="footprint-title" className="container-site py-16 md:py-36">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end">
          <Reveal>
            <h2 id="footprint-title" className="text-h2 max-w-[16ch]">{t.footprintTitle}</h2>
          </Reveal>
          <Reveal>
            <p className="text-lead max-w-[46ch]">{t.footprintLead}</p>
          </Reveal>
        </div>
        <Footprint rows={footprint} total={clientCount()} />
      </section>

      {/* 5. Timeline */}
      <section aria-labelledby="phases-title" className="border-y border-line bg-night-2/50 py-16 md:py-36">
        <div className="container-site grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <h2 id="phases-title" className="text-h2">{t.phasesTitle}</h2>
              <p className="text-lead mt-5 max-w-[40ch]">{t.phasesLead}</p>
            </Reveal>
          </div>
          <Timeline items={t.phases} />
        </div>
      </section>

      {/* Team — hidden until content/people.ts has members */}
      {team.length > 0 && (
        <section aria-labelledby="team-title" className="container-site pt-16 md:pt-36">
          <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end">
            <Reveal>
              <h2 id="team-title" className="text-h2 max-w-[16ch]">{t.teamTitle}</h2>
            </Reveal>
            <Reveal>
              <p className="text-lead max-w-[46ch]">{t.teamLead}</p>
            </Reveal>
          </div>
          <TeamGrid members={team} locale={locale} />
        </section>
      )}

      {/* 6. Values */}
      <section aria-labelledby="values-title" className="container-site py-16 md:py-36">
        <Reveal>
          <h2 id="values-title" className="text-h2 mb-12 md:mb-16">{t.valuesTitle}</h2>
        </Reveal>
        <Reveal>
        <SwipeRail label={t.valuesTitle} gridClassName="md:grid md:grid-cols-3 md:gap-4 lg:gap-5">
          {t.values.map((v) => (
              <SpotlightCard key={v.title} accent="ember" className="h-full">
                <div className="flex h-full flex-col p-6 md:p-9">
                  <span className="grid size-12 place-items-center rounded-[13px] md:size-14 border border-line bg-night-2 text-ember transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/card:-rotate-6 group-hover/card:scale-110">
                    <Icon name={v.icon as IconName} size={26} />
                  </span>
                  <h3 className="text-h3 mt-6 md:mt-10 md:text-[1.5rem]">{v.title}</h3>
                  <p className="mt-3 text-lg leading-relaxed text-muted">{v.text}</p>
                </div>
              </SpotlightCard>
          ))}
        </SwipeRail>
        </Reveal>
      </section>

      {/* 7. Company details */}
      <section aria-labelledby="company-title" className="container-site pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <Reveal>
            <h2 id="company-title" className="text-h2">{t.companyTitle}</h2>
            <p className="text-lead mt-5 max-w-[36ch]">{t.companyLead}</p>
          </Reveal>
          <Reveal>
            <div data-accent="ember" className="edge-glow relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-night-2 px-6 py-3 md:px-9 md:py-5">
              <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.12),transparent)]" />
              <dl className="relative">
                {companyRows.map((r) => (
                  <CopyField key={r.label} label={r.label} value={r.value} copyable={r.copy} copyLabel={t.copy} copiedLabel={t.copied} />
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand title={dict.cta.title} text={dict.cta.text} primary={{ label: dict.cta.primary, href: href(locale, "contact") }} />
    </>
  );
}
