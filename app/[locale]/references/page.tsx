import type { Metadata } from "next";
import { clientCount, clientGroups, countryCount, countryNames, projects } from "@/content/projects";
import { l } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/paths";
import { resolvePage, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { StatsRow } from "@/components/sections/StatsRow";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await resolvePage(params);
  return buildMetadata({ locale, route: "references", title: dict.references.pageTitle, description: dict.references.metaDescription });
}

export default async function ReferencesPage({ params }: LocaleParams) {
  const { locale, dict } = await resolvePage(params);
  const t = dict.references;

  return (
    <>
      <PageHero
        title={t.pageTitle}
        lead={t.pageLead}
        accent="amber"
        breadcrumbLabel={dict.common.breadcrumb}
        crumbs={[{ label: dict.common.home, href: href(locale, "home") }, { label: t.pageTitle }]}
      />

      <section className="container-site pb-24 md:pb-32">
        <StatsRow
          stats={[
            { value: clientCount(), suffix: "+", label: t.stats.clients },
            { value: countryCount(), label: t.stats.countries },
            { value: clientGroups.length, label: t.stats.sectors },
          ]}
        />
      </section>

      <section aria-labelledby="projects-title" className="container-site pb-24 md:pb-32">
        <SectionHeader id="projects-title" title={t.projectsTitle} align="stack" />
        <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2 lg:gap-5">
          {projects.map((p) => (
            <RevealItem as="li" key={p.id}>
              <ProjectCard
                detailed
                labels={{ partner: t.partner, scope: t.scope }}
                p={{ id: p.id, client: p.client, partner: p.partner, title: l(p.title, locale), summary: l(p.summary, locale), sector: l(p.sector, locale), location: l(p.location, locale), accent: p.accent, sites: p.sites, scope: l(p.scope, locale) }}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section aria-labelledby="clients-title" className="border-t border-line py-24 md:py-32">
        <div className="container-site">
          <SectionHeader id="clients-title" title={t.clientsTitle} align="stack" />
          <div className="space-y-16">
            {clientGroups.map((g) => (
              <Reveal key={g.id} className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-16">
                <h3 className="text-h3">{l(g.title, locale)}</h3>
                <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                  {g.clients.map((c) => (
                    <li key={c.name} className="flex items-baseline justify-between gap-4 border-b border-line py-3.5">
                      <span className="text-fg/90">{c.name}</span>
                      <span className="shrink-0 text-xs text-subtle" title={l(countryNames[c.country], locale)}>
                        {l(countryNames[c.country], locale)}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={t.joinTitle} text={t.joinText} primary={{ label: dict.cta.primary, href: href(locale, "contact") }} />
    </>
  );
}
