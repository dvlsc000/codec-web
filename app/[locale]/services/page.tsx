import type { Metadata } from "next";
import { visibleServices } from "@/content/services";
import { l } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/paths";
import { serviceCards } from "@/lib/view";
import { ServicesStack } from "@/components/sections/ServicesStack";
import { resolvePage, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await resolvePage(params);
  return buildMetadata({ locale, route: "services", title: dict.services.pageTitle, description: dict.services.metaDescription });
}

export default async function ServicesPage({ params }: LocaleParams) {
  const { locale, dict } = await resolvePage(params);
  const t = dict.services;

  return (
    <>
      <PageHero
        title={t.pageTitle}
        lead={t.pageLead}
        breadcrumbLabel={dict.common.breadcrumb}
        crumbs={[{ label: dict.common.home, href: href(locale, "home") }, { label: t.pageTitle }]}
      />

      <section className="container-site pb-24">
        <ServicesStack
          items={serviceCards(locale).map((c) => ({ ...c, allFeatures: visibleServices().find((x) => x.id === c.id)!.features.map((f) => l(f.title, locale)) }))}
          visuals={dict.visuals}
          learnMore={dict.common.learnMore}
        />
      </section>

      <CtaBand title={dict.cta.title} text={dict.cta.text} primary={{ label: dict.cta.primary, href: href(locale, "contact") }} />
    </>
  );
}
