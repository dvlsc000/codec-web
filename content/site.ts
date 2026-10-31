/**
 * Company identity, contact and legal data. Single source of truth used by the
 * header, footer, contact page, About page and structured data (JSON-LD).
 */
export const site = {
  name: "Codec",
  legalName: "Codec informatika d.o.o.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://codec-info.hr",

  contact: {
    emails: {
      general: "info@codec-info.hr",
      sales: "prodaja@codec-info.hr",
      support: "support@codec-info.hr",
    },
    phones: {
      main: { display: "+385 1 7898 069", href: "+38517898069" },
      supportMobile: [
        { display: "+385 98 204 2188", href: "+385982042188" },
        { display: "+385 91 204 2188", href: "+385912042188" },
      ],
      fax: { display: "+385 1 7898 369" },
    },
    address: {
      street: "Viktora Kovačića 3",
      postalCode: "10000",
      city: "Zagreb",
      country: { hr: "Hrvatska", en: "Croatia" },
      countryCode: "HR",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Viktora+Kova%C4%8Di%C4%87a+3%2C+10000+Zagreb",
    },
    office: { street: "Kalinovica 5", city: "Zagreb" },
  },

  legal: {
    registry: { hr: "MBS 080702017, Trgovački sud u Zagrebu", en: "Court registry no. 080702017, Commercial Court in Zagreb" },
    mb: "2537281",
    oib: "46034330972",
    bank: "Zagrebačka banka d.d.",
    iban: "HR0423600001102094025",
    swift: "ZABAHR2X",
  },

  /** Add profile URLs here to show them in the footer and structured data. */
  social: [] as { label: string; href: string }[],
} as const;

export type Site = typeof site;
