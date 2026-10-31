import type { ClientGroup, Project } from "./types";

/**
 * Reference clients, grouped by sector. Names are shown as they were at the
 * time of implementation. The client count and country count on the site are
 * computed from this list.
 *
 * Optional: add `logo: "/clients/<file>.svg"` to a client to show an official
 * logo (file in /public/clients). Without it, the name is shown.
 */
export const clientGroups: ClientGroup[] = [
  {
    id: "hospitality",
    title: { hr: "Hoteli i turizam", en: "Hotels and tourism" },
    clients: [
      { name: "Sheraton Zagreb", country: "HR" },
      { name: "Westin Zagreb", country: "HR" },
      { name: "Four Points Panorama", country: "HR" },
      { name: "Hotel International", country: "HR" },
      { name: "Hotel Jadran", country: "HR" },
      { name: "Hotel Astarea", country: "HR" },
      { name: "Hotel Mlini", country: "HR" },
      { name: "Regent Esplanade Zagreb", country: "HR" },
      { name: "Hotel Dubrovnik Zagreb", country: "HR" },
      { name: "Hoteli Sunčani Hvar", country: "HR" },
      { name: "Hotel Crystal Beograd", country: "RS" },
      { name: "Hotel Evropa Beograd", country: "RS" },
      { name: "Hotel Atlantico Habana", country: "CU" },
      { name: "Club Karey", country: "CU" },
      { name: "Hotel Trinidad del Mar", country: "CU" },
      { name: "Hotel Blau Colonial", country: "CU" },
      { name: "Hotel Kawama", country: "CU" },
      { name: "Complejo Hotelero Atlántico", country: "CU" },
    ],
  },
  {
    id: "enterprise",
    title: { hr: "Industrija i trgovina", en: "Industry and retail" },
    clients: [
      { name: "Agrokor", country: "HR" },
      { name: "Agroprerada", country: "HR" },
      { name: "Belje", country: "HR" },
      { name: "Frikom Beograd", country: "RS" },
      { name: "Jamnica", country: "HR" },
      { name: "Konzum", country: "HR" },
      { name: "Konzum Sarajevo", country: "BA" },
      { name: "Ledo", country: "HR" },
      { name: "PIK Vrbovec", country: "HR" },
      { name: "Sojara Zadar", country: "HR" },
      { name: "Zvijezda", country: "HR" },
      { name: "PharmaS", country: "HR" },
    ],
  },
  {
    id: "public",
    title: { hr: "Zdravstvo, financije i javni sektor", en: "Healthcare, finance and public sector" },
    clients: [
      { name: "KBC Zagreb", country: "HR" },
      { name: "KBC Rijeka", country: "HR" },
      { name: "Zračna luka Split", country: "HR" },
      { name: "Splitska banka", country: "HR" },
      { name: "HBOR", country: "HR" },
      { name: "VipNet", country: "HR" },
      { name: "Vatrogasna postaja Zagreb", country: "HR" },
    ],
  },
];

export const countryNames: Record<string, { hr: string; en: string }> = {
  HR: { hr: "Hrvatska", en: "Croatia" },
  RS: { hr: "Srbija", en: "Serbia" },
  BA: { hr: "Bosna i Hercegovina", en: "Bosnia and Herzegovina" },
  CU: { hr: "Kuba", en: "Cuba" },
};

/**
 * Selected implementations shown as project cards. Wording follows the original
 * codec-info.hr references page; add `serviceId` only when you know which product
 * was delivered, and `scope` only with confirmed details.
 */
export const projects: Project[] = [
  {
    id: "hup-zagreb",
    client: "HUP Zagreb",
    sites: ["Sheraton", "Westin", "Four Points Panorama", "International", "Jadran", "Astarea", "Mlini"],
    sector: { hr: "Hotelijerstvo", en: "Hospitality" },
    location: { hr: "Hrvatska", en: "Croatia" },
    accent: "ember",
    featured: true,
    title: { hr: "Hotelska grupa HUP Zagreb", en: "HUP Zagreb hotel group" },
    summary: {
      hr: "Hotelsko poduzeće HUP Zagreb s implementacijom u svojim hotelima.",
      en: "The HUP Zagreb hotel company, with implementation across its hotels.",
    },
  },
  {
    id: "etecsa-cuba",
    client: "ETECSA",
    partner: "Ericsson Nikola Tesla",
    sites: ["Atlantico Habana", "Club Karey", "Trinidad del Mar", "Blau Colonial", "Kawama", "Complejo Hotelero Atlántico"],
    sector: { hr: "Hotelijerstvo", en: "Hospitality" },
    location: { hr: "Kuba", en: "Cuba" },
    accent: "amber",
    featured: true,
    title: { hr: "Hoteli na Kubi", en: "Hotels in Cuba" },
    summary: {
      hr: "U suradnji s tvrtkom Ericsson Nikola Tesla, implementacija u ETECSA hotelima na Kubi.",
      en: "Together with Ericsson Nikola Tesla, implementation in ETECSA hotels in Cuba.",
    },
  },
  {
    id: "agrokor",
    client: "Koncern Agrokor",
    sites: ["Agrokor", "Agroprerada", "Belje", "Jamnica", "Konzum", "Ledo", "PIK Vrbovec", "Zvijezda", "Frikom"],
    sector: { hr: "Industrija i trgovina", en: "Industry and retail" },
    location: { hr: "Hrvatska, Srbija, BiH", en: "Croatia, Serbia, Bosnia and Herzegovina" },
    accent: "steel",
    featured: true,
    title: { hr: "Koncern Agrokor", en: "Agrokor group" },
    summary: {
      hr: "Koncern Agrokor s implementacijom u svojim tvrtkama.",
      en: "The Agrokor group, with implementation across its companies.",
    },
  },
];

export const allClients = () => clientGroups.flatMap((g) => g.clients);
export const clientCount = () => allClients().length;
export const countryCount = () => new Set(allClients().map((c) => c.country)).size;
