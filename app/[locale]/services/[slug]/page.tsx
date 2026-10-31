import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { visibleServices } from "@/content/services";
import { site } from "@/content/site";
import { isLocale, l, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { href, serviceHref } from "@/lib/i18n/paths";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceVisual } from "@/components/visuals";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => visibleServices().map((s) => ({ locale, slug: s.slug[locale] })));
}

async function load(params: Props["params"]) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const service = visibleServices().find((s) => s.slug[locale] === slug);
  if (!service) notFound();
  return { locale: locale as Locale, service, dict: await getDictionary(locale) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, service } = await load(params);
  return buildMetadata({
    locale,
    route: "services",
    serviceId: service.id,
    title: l(service.seo?.title ?? service.title, locale),
    description: l(service.seo?.description ?? service.summary, locale),
    keywords: service.seo?.keywords ? l(service.seo.keywords, locale) : undefined,
  });
}

export default async function ServicePage({ params }: Props) {
  const { locale, service: s, dict } = await load(params);
  const t = dict.services;
  const title = l(s.title, locale);
  const contactHref = `${href(locale, "contact")}?service=${s.id}`;
  const related = projects.filter((p) => p.serviceId === s.id);
  const others = visibleServices().filter((x) => x.id !== s.id);
  const faq = s.faq?.map((f) => ({ q: l(f.q, locale), a: l(f.a, locale) }));

  return (
    <>
      <PageHero
        title={title}
        lead={l(s.summary, locale)}
        accent={s.accent}
        visual={
          <div className="h-[21rem] md:h-[25rem]">
            <ServiceVisual name={s.visual} labels={dict.visuals} size="hero" />
          </div>
        }
        breadcrumbLabel={dict.common.breadcrumb}
        crumbs={[
          { label: dict.common.home, href: href(locale, "home") },
          { label: t.pageTitle, href: href(locale, "services") },
          { label: title },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={contactHref} icon="arrowRight">{dict.common.bookCall}</ButtonLink>
          {s.download && (
            <ButtonLink href={s.download.href} variant="secondary" icon="download" target="_blank" rel="noopener">
              {l(s.download.label, locale)}
            </ButtonLink>
          )}
        </div>
      </PageHero>

      {/* Intro + outcomes */}
      <section className="container-site pb-24 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-20">
          <RevealGroup className="space-y-6">
            <RevealItem><p className="text-h3 max-w-[30ch] font-medium text-fg">{l(s.tagline, locale)}</p></RevealItem>
            {l(s.intro, locale).map((p) => (
              <RevealItem key={p}><p className="max-w-[62ch] text-lg leading-relaxed text-muted">{p}</p></RevealItem>
            ))}
          </RevealGroup>
          {s.outcomes && (
            <Reveal>
              <div data-accent={s.accent} className="glass edge-glow rounded-[var(--radius-card)] p-7 md:p-8">
                <h2 className="font-sans text-sm font-medium tracking-normal text-subtle">{t.outcomesTitle}</h2>
                <ul className="mt-5 space-y-4">
                  {l(s.outcomes, locale).map((o) => (
                    <li key={o} className="flex items-start gap-3 text-lg">
                      <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-[rgb(var(--accent-rgb)/0.15)] text-[var(--accent)]">
                        <Icon name="check" size={14} />
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Features */}
      <section aria-labelledby="features-title" className="container-site pb-24 md:pb-32">
        <SectionHeader id="features-title" title={t.featuresTitle} align="stack" />
        <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {s.features.map((f) => (
            <RevealItem as="li" key={f.title.en}>
              <SpotlightCard accent={s.accent} className="h-full">
                <div className="p-7">
                  <span className="grid size-11 place-items-center rounded-xl border border-line bg-night-2 text-[var(--accent)]">
                    <Icon name={f.icon ?? s.icon} size={21} />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold">{l(f.title, locale)}</h3>
                  <p className="mt-2 text-muted">{l(f.text, locale)}</p>
                </div>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Editions */}
      {s.editions && (
        <section aria-labelledby="editions-title" className="container-site pb-24 md:pb-32">
          <SectionHeader id="editions-title" title={t.editionsTitle} align="stack" />
          <RevealGroup as="ul" className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-3">
            {s.editions.map((e) => (
              <RevealItem as="li" key={e.title.en} className="bg-night-2 p-8">
                <h3 className="text-h3">{l(e.title, locale)}</h3>
                <p className="mt-3 text-muted">{l(e.text, locale)}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {/* Use cases */}
      {s.useCases && (
        <section aria-labelledby="usecases-title" className="border-y border-line bg-night-2/50 py-24 md:py-32">
          <div className="container-site grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <Reveal><h2 id="usecases-title" className="text-h2">{t.useCasesTitle}</h2></Reveal>
            <RevealGroup as="dl" className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {s.useCases.map((u) => (
                <RevealItem key={u.title.en} className="border-t border-line-strong pt-5">
                  <dt className="text-lg font-semibold">{l(u.title, locale)}</dt>
                  <dd className="mt-2 text-muted">{l(u.text, locale)}</dd>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* Related projects */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container-site py-24 md:py-32">
          <SectionHeader id="related-title" title={t.projectsTitle} action={<ButtonLink href={href(locale, "references")} variant="secondary" icon="arrowRight">{dict.home.references.all}</ButtonLink>} />
          <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2 lg:gap-5">
            {related.slice(0, 4).map((p) => (
              <RevealItem as="li" key={p.id}>
                <ProjectCard p={{ id: p.id, client: p.client, partner: p.partner, title: l(p.title, locale), summary: l(p.summary, locale), sector: l(p.sector, locale), location: l(p.location, locale), accent: p.accent, sites: p.sites }} labels={{ partner: dict.references.partner, scope: dict.references.scope }} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {/* FAQ */}
      {faq && (
        <section aria-labelledby="faq-title" className="container-site py-24 md:py-32">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <Reveal><h2 id="faq-title" className="text-h2">{t.faqTitle}</h2></Reveal>
            <Reveal><Faq items={faq} /></Reveal>
          </div>
          <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
        </section>
      )}

      {/* Other services */}
      <section aria-labelledby="others-title" className="container-site pb-24 pt-8">
        <h2 id="others-title" className="text-h3 mb-6 text-muted">{t.otherServices}</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => (
            <li key={o.id}>
              <Link href={serviceHref(locale, o.id)} data-accent={o.accent} className="group flex h-full items-center gap-4 rounded-[var(--radius-control)] border border-line p-4 transition-colors hover:border-line-strong hover:bg-white/[0.03]">
                <Icon name={o.icon} size={20} className="shrink-0 text-[var(--accent)]" />
                <span className="font-medium">{l(o.title, locale)}</span>
                <Icon name="arrowRight" size={16} className="ml-auto shrink-0 text-muted transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand title={t.ctaTitle} text={t.ctaText} primary={{ label: dict.common.bookCall, href: contactHref }} secondary={{ label: site.contact.emails.sales, href: `mailto:${site.contact.emails.sales}` }} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: title,
          description: l(s.summary, locale),
          serviceType: title,
          provider: { "@id": `${site.url}/#organization` },
          areaServed: "HR",
          url: `${site.url}${serviceHref(locale, s.id)}`,
        }}
      />
    </>
  );
}
