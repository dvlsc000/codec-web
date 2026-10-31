import type { ClientGroup, Project } from "./types";

/**
 * Reference clients, grouped by sector. Names are shown as they were at the
 * time of implementation. The client count and country count on the site are
 * computed from this list.
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

/** Selected implementations shown as project cards. */
export const projects: Project[] = [
  {
    id: "hup-zagreb",
    client: "HUP Zagreb",
    sites: ["Sheraton", "Westin", "Four Points Panorama", "International", "Jadran", "Astarea", "Mlini"],
    sector: { hr: "Hotelijerstvo", en: "Hospitality" },
    location: { hr: "Zagreb i Dubrovnik", en: "Zagreb and Dubrovnik" },
    serviceId: "call-accounting",
    accent: "ember",
    featured: true,
    title: { hr: "Obračun poziva za hotelsku grupu", en: "Call billing for a hotel group" },
    summary: {
      hr: "Hotelska verzija CAM sustava uvedena u hotele grupe HUP Zagreb, s obračunom poziva po sobi i upravljanjem telefonima gostiju.",
      en: "The hotel edition of CAM rolled out across HUP Zagreb hotels, with per-room call billing and guest phone control.",
    },
    scope: {
      hr: ["Prihvat podataka s hotelskih centrala", "Obračun po sobi i prijenos troška gostu", "Zaključavanje i otključavanje telefona u sobama"],
      en: ["Data capture from hotel phone systems", "Per-room billing passed to the guest folio", "Locking and unlocking guest-room phones"],
    },
  },
  {
    id: "etecsa-cuba",
    client: "ETECSA",
    partner: "Ericsson Nikola Tesla",
    sites: ["Atlantico Habana", "Club Karey", "Trinidad del Mar", "Blau Colonial", "Kawama"],
    sector: { hr: "Hotelijerstvo", en: "Hospitality" },
    location: { hr: "Kuba", en: "Cuba" },
    serviceId: "call-accounting",
    accent: "amber",
    featured: true,
    title: { hr: "Hotelski sustavi na Kubi", en: "Hotel systems in Cuba" },
    summary: {
      hr: "U suradnji s tvrtkom Ericsson Nikola Tesla isporučili smo CAM rješenja za hotele operatera ETECSA na Kubi.",
      en: "Together with Ericsson Nikola Tesla we delivered CAM solutions for ETECSA-connected hotels in Cuba.",
    },
    scope: {
      hr: ["Implementacija na više hotelskih lokacija", "Suradnja s međunarodnim partnerom", "Lokalizacija i podrška na daljinu"],
      en: ["Rollout across several hotel sites", "Delivered with an international partner", "Localisation and remote support"],
    },
  },
  {
    id: "agrokor",
    client: "Koncern Agrokor",
    sites: ["Agrokor", "Belje", "Jamnica", "Konzum", "Ledo", "PIK Vrbovec", "Zvijezda", "Frikom"],
    sector: { hr: "Industrija i trgovina", en: "Industry and retail" },
    location: { hr: "Hrvatska, Srbija, BiH", en: "Croatia, Serbia, Bosnia and Herzegovina" },
    serviceId: "call-accounting",
    accent: "steel",
    featured: true,
    title: { hr: "Telefonski troškovi na razini koncerna", en: "Telephone costs across a corporate group" },
    summary: {
      hr: "Implementacija u tvrtkama koncerna Agrokor, s obračunom troškova po tvrtki, odjelu i korisniku.",
      en: "Implementation across Agrokor group companies, with costs billed by company, department and user.",
    },
    scope: {
      hr: ["Mrežna verzija za više tvrtki i lokacija", "Izvještaji po organizacijskim jedinicama", "Dugoročna podrška i održavanje"],
      en: ["Network edition for multiple companies and sites", "Reports by organisational unit", "Long-term support and maintenance"],
    },
  },
  {
    id: "healthcare-public",
    client: "KBC Zagreb, KBC Rijeka, Zračna luka Split",
    sector: { hr: "Zdravstvo i infrastruktura", en: "Healthcare and infrastructure" },
    location: { hr: "Hrvatska", en: "Croatia" },
    serviceId: "call-accounting",
    accent: "amber",
    title: { hr: "Kontrola troškova u velikim ustanovama", en: "Cost control in large institutions" },
    summary: {
      hr: "Obračun telefonskog prometa za kliničke bolničke centre i zračnu luku, ustanove s mnogo odjela, korisnika i lokala.",
      en: "Telephone traffic billing for university hospital centres and an airport, organisations with many departments, users and extensions.",
    },
    scope: {
      hr: ["Velik broj lokala i korisnika", "Izvještaji po odjelima", "Podrška 0–24"],
      en: ["Large numbers of extensions and users", "Department-level reporting", "24/7 support"],
    },
  },
];

export const allClients = () => clientGroups.flatMap((g) => g.clients);
export const clientCount = () => allClients().length;
export const countryCount = () => new Set(allClients().map((c) => c.country)).size;
