import type { Metadata } from "next";
import { allClients, clientCount, countryCount, projects } from "@/content/projects";
import { site } from "@/content/site";
import { l } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/paths";
import { resolvePage, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { serviceCards } from "@/lib/view";
import { Hero } from "@/components/sections/Hero";
import { ClientMarquee } from "@/components/sections/ClientMarquee";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { VoiceAgentDemo } from "@/components/sections/VoiceAgentDemo";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { StatsRow } from "@/components/sections/StatsRow";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { Testimonials } from "@/components/people/Testimonials";
import { testimonials } from "@/content/people";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SwipeRail } from "@/components/ui/SwipeRail";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await resolvePage(params);
  return buildMetadata({ locale, route: "home", title: dict.meta.siteTitle, description: dict.meta.siteDescription, keywords: dict.meta.keywords, absoluteTitle: true });
}

export default async function HomePage({ params }: LocaleParams) {
  const { locale, dict } = await resolvePage(params);
  const t = dict.home;
  const contactHref = href(locale, "contact");
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      <Hero
        status={t.hero.status}
        titleLines={t.hero.titleLines}
        lead={t.hero.lead}
        primary={{ label: t.hero.primaryCta, href: contactHref }}
        secondary={{ label: t.hero.secondaryCta, href: href(locale, "services") }}
        signalLabel={t.hero.signalLabel}
      />

      <ClientMarquee title={t.clients.title} clients={allClients()} />

      <section aria-labelledby="services-title" className="section-y container-site">
        <SectionHeader id="services-title" title={t.services.title} lead={t.services.lead} />
        <ServicesGrid services={serviceCards(locale)} learnMore={dict.common.learnMore} visuals={dict.visuals} label={t.services.title} />
      </section>

      <section aria-labelledby="demo-title" className="section-y relative overflow-hidden border-y border-line bg-night-2/60">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgb(255_90_31/0.07),transparent)]" />
        <div className="container-site relative">
          <VoiceAgentDemo {...t.demo} />
        </div>
      </section>

      <section aria-labelledby="process-title" className="section-y container-site">
        <SectionHeader id="process-title" title={t.process.title} lead={t.process.lead} />
        <ProcessSteps steps={t.process.steps} icons={["chat", "document", "code", "support"]} />
      </section>

      <section aria-labelledby="heritage-title" className="container-site pb-[clamp(3.75rem,2rem+8vw,10rem)]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <h2 id="heritage-title" className="text-h2 max-w-[16ch]">{t.heritage.title}</h2>
          </Reveal>
          <RevealGroup className="space-y-5 lg:pt-3">
            {t.heritage.body.map((p) => (
              <RevealItem key={p}><p className="text-lead">{p}</p></RevealItem>
            ))}
          </RevealGroup>
        </div>
        <div className="mt-14">
          <StatsRow
            stats={[
              { value: clientCount(), suffix: "+", label: t.heritage.stats.clients },
              { value: countryCount(), label: t.heritage.stats.countries },
              { value: "0–24", label: t.heritage.stats.support },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="refs-title" className="container-site pb-[clamp(3.75rem,2rem+8vw,10rem)]">
        <SectionHeader
          id="refs-title"
          title={t.references.title}
          action={<ButtonLink href={href(locale, "references")} variant="secondary" icon="arrowRight">{t.references.all}</ButtonLink>}
        />
        <Reveal>
          <SwipeRail label={t.references.title} gridClassName="md:grid md:grid-cols-3 md:gap-4 lg:gap-5">
            {featuredProjects.map((p) => (
              <ProjectCard
                key={p.id}
                p={{ id: p.id, client: p.client, title: l(p.title, locale), summary: l(p.summary, locale), sector: l(p.sector, locale), location: l(p.location, locale), accent: p.accent, sites: p.sites?.slice(0, 5) }}
              />
            ))}
          </SwipeRail>
        </Reveal>
      </section>

      <Testimonials items={testimonials} locale={locale} title={dict.common.testimonials} className="pb-[clamp(3.75rem,2rem+8vw,10rem)]" />

      <CtaBand
        title={dict.cta.title}
        text={dict.cta.text}
        primary={{ label: dict.cta.primary, href: contactHref }}
        secondary={{ label: dict.cta.secondary, href: `mailto:${site.contact.emails.sales}` }}
      />
    </>
  );
}
