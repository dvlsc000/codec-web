import { site } from "@/content/site";
import { l, type Locale } from "@/lib/i18n/config";

/** Organization + LocalBusiness structured data from content/site.ts. */
export function organizationSchema(locale: Locale, description: string) {
  const { contact } = site;
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${site.url}/#organization`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: `${site.url}/android-chrome-512x512.png`,
    description,
    email: contact.emails.general,
    telephone: contact.phones.main.href,
    vatID: `HR${site.legal.oib}`,
    taxID: site.legal.oib,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      postalCode: contact.address.postalCode,
      addressLocality: contact.address.city,
      addressCountry: contact.address.countryCode,
    },
    contactPoint: [
      { "@type": "ContactPoint", contactType: "sales", email: contact.emails.sales, telephone: contact.phones.main.href, availableLanguage: ["hr", "en"] },
      { "@type": "ContactPoint", contactType: "technical support", email: contact.emails.support, telephone: contact.phones.supportMobile[0].href, hoursAvailable: "Mo-Su 00:00-23:59", availableLanguage: ["hr", "en"] },
    ],
    areaServed: l({ hr: "Hrvatska i Europa", en: "Croatia and Europe" }, locale),
    sameAs: site.social.map((s) => s.href),
  };
}
