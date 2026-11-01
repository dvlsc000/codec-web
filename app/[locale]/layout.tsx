import "@fontsource-variable/inter";
import "@fontsource-variable/unbounded";
import "../globals.css";

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { mainNav } from "@/content/navigation";
import { site } from "@/content/site";
import { isLocale, l, localeMeta, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { href } from "@/lib/i18n/paths";
import { organizationSchema } from "@/lib/schema";
import { serviceCards, serviceSlugTable } from "@/lib/view";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { MobileActionBar } from "@/components/mobile/MobileActionBar";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#111215",
  viewportFit: "cover",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.siteTitle, template: `%s · Codec` },
    description: dict.meta.siteDescription,
    keywords: dict.meta.keywords,
    applicationName: site.name,
    authors: [{ name: site.legalName }],
    formatDetection: { telephone: false },
    icons: {
      icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/icon.svg", type: "image/svg+xml" }],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = await getDictionary(locale);

  return (
    <html lang={localeMeta[locale].htmlLang}>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-ember px-5 py-3 font-medium text-night transition-transform focus:translate-y-0"
        >
          {dict.common.skipToContent}
        </a>
        <MotionProvider>
          <SmoothScroll />
          <Header
            locale={locale}
            homeHref={href(locale, "home")}
            contactHref={href(locale, "contact")}
            servicesHref={href(locale, "services")}
            labels={{
              menu: dict.common.menu,
              closeMenu: dict.common.closeMenu,
              language: dict.common.language,
              bookCall: dict.common.bookCall,
              allServices: dict.common.allServices,
              home: dict.common.home,
            }}
            nav={mainNav.map((n) => ({ label: l(n.label, locale), href: href(locale, n.route), withServices: n.withServices }))}
            services={serviceCards(locale).map(({ id, title, tagline, href, icon, accent }) => ({ id, title, summary: tagline, href, icon, accent }))}
            slugTable={serviceSlugTable()}
          />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer locale={locale} dict={dict} />
          <MobileActionBar
            bookLabel={dict.common.bookCall}
            bookHref={href(locale, "contact")}
            callLabel={dict.contact.callUs}
            phoneHref={`tel:${site.contact.phones.main.href}`}
            hideOn={[href(locale, "contact")]}
          />
        </MotionProvider>
        <JsonLd data={organizationSchema(locale, dict.meta.siteDescription)} />
      </body>
    </html>
  );
}
