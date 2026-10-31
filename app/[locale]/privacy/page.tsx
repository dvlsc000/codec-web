import type { Metadata } from "next";
import { href } from "@/lib/i18n/paths";
import { resolvePage, type LocaleParams } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, dict } = await resolvePage(params);
  return buildMetadata({ locale, route: "privacy", title: dict.privacy.pageTitle, description: dict.privacy.metaDescription });
}

export default async function PrivacyPage({ params }: LocaleParams) {
  const { locale, dict } = await resolvePage(params);
  const t = dict.privacy;
  return (
    <>
      <PageHero title={t.pageTitle} lead={t.pageLead} breadcrumbLabel={dict.common.breadcrumb} crumbs={[{ label: dict.common.home, href: href(locale, "home") }, { label: t.pageTitle }]} />
      <section className="container-site pb-16">
        <div className="max-w-[68ch] space-y-10">
          {t.sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-h3">{s.title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
          <p className="text-sm text-subtle">{t.updated}</p>
        </div>
      </section>
    </>
  );
}
