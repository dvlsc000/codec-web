import type { Service } from "./types";

/**
 * All services. Order in this array is the display order everywhere.
 * Add, remove or edit an entry and every page (home grid, menus, service page,
 * contact form options, sitemap, structured data) updates automatically.
 */
export const services: Service[] = [
  {
    id: "call-accounting",
    slug: { hr: "obracun-telefonskih-troskova", en: "call-accounting" },
    icon: "callStats",
    accent: "ember",
    featured: true,
    visual: "callAccounting",
    title: { hr: "Call Accounting Manager", en: "Call Accounting Manager" },
    tagline: {
      hr: "Potpun pregled i kontrola telefonskih troškova, po korisniku, odjelu ili sobi.",
      en: "Full visibility and control of telephone costs, per user, department or room.",
    },
    summary: {
      hr: "CAM prikuplja podatke s telefonskih centrala i pretvara ih u jasne obračune, povećavajući produktivnost uz smanjenje operativnih troškova.",
      en: "CAM collects data from phone systems and turns it into clear billing, raising productivity while cutting operating costs.",
    },
    intro: {
      hr: [
        "Call Accounting Manager (CAM) naš je dugogodišnji aplikacijski sustav za obračun telefonskog prometa, implementiran u tvrtkama, hotelima i bolnicama u Hrvatskoj i inozemstvu.",
        "CAM prihvaća podatke s telefonskih centrala, obračunava svaki poziv i omogućuje izvještaje po korisniku, odjelu, lokaciji ili hotelskoj sobi.",
      ],
      en: [
        "Call Accounting Manager (CAM) is our long-standing application for telephone traffic billing, deployed in companies, hotels and hospitals in Croatia and abroad.",
        "CAM receives data from phone systems, prices every call and reports by user, department, location or hotel room.",
      ],
    },
    features: [
      { icon: "server", title: { hr: "Prihvat podataka s centrala", en: "Data capture from phone systems" }, text: { hr: "Podržava podatke o pozivima s različitih telefonskih centrala.", en: "Supports call data from a range of phone systems." } },
      { icon: "chart", title: { hr: "Obračun i izvještaji", en: "Billing and reports" }, text: { hr: "Troškovi po korisniku, odjelu ili lokaciji, s detaljnim i zbirnim izvještajima.", en: "Costs by user, department or location, with detailed and summary reports." } },
      { icon: "lock", title: { hr: "Upravljanje lokalima", en: "Extension management" }, text: { hr: "Otključavanje i zaključavanje telefona izravno iz aplikacije.", en: "Lock and unlock phones directly from the application." } },
      { icon: "coins", title: { hr: "Manji operativni troškovi", en: "Lower operating costs" }, text: { hr: "Uvid u promet otkriva neopravdane troškove i potiče odgovorno korištenje.", en: "Visibility of traffic exposes unjustified costs and encourages responsible use." } },
    ],
    editions: [
      {
        title: { hr: "Osnovna verzija", en: "Standard edition" },
        text: { hr: "Za tvrtke koje žele jasan obračun telefonskih troškova na jednoj lokaciji.", en: "For companies that want clear telephone cost billing at one site." },
      },
      {
        title: { hr: "Hotelska verzija", en: "Hotel edition" },
        text: { hr: "Obračun poziva po sobi i upravljanje telefonima u sobama gostiju.", en: "Per-room call billing and control of phones in guest rooms." },
      },
      {
        title: { hr: "Mrežna verzija", en: "Network edition" },
        text: { hr: "Centralni obračun za više lokacija i centrala unutar grupe tvrtki.", en: "Central billing across multiple sites and phone systems within a group." },
      },
    ],
    download: {
      label: { hr: "Preuzmite prospekt (PDF)", en: "Download brochure (PDF)" },
      href: "https://codec-info.hr/Resources/Call%20Accounting%20Manager.pdf",
    },
    seo: {
      title: { hr: "Call Accounting Manager — obračun telefonskih troškova", en: "Call Accounting Manager — telephone cost billing" },
      keywords: {
        hr: ["call accounting", "obračun telefonskih troškova", "hotelski obračun poziva", "CAM"],
        en: ["call accounting", "telephone cost billing", "hotel call accounting", "CAM"],
      },
    },
  },

  {
    id: "business-automation",
    slug: { hr: "automatizacija-poslovanja", en: "business-automation" },
    icon: "automation",
    accent: "amber",
    visual: "automation",
    title: { hr: "Automatizacija poslovanja", en: "Business automation" },
    tagline: {
      hr: "Procesi koji se odvijaju sami, bez ručnog prepisivanja i čekanja.",
      en: "Processes that run themselves, without manual copying and waiting.",
    },
    summary: {
      hr: "Prilagođeni tijekovi rada, baze podataka, integracije sustava i optimizacija procesa — izrađeni prema načinu na koji vaša tvrtka stvarno radi.",
      en: "Custom workflows, databases, system integrations and process optimisation — built around how your company actually works.",
    },
    intro: {
      hr: [
        "Svaka tvrtka ima posao koji se ponavlja: podaci se prepisuju iz jednog sustava u drugi, odobrenja čekaju u e-pošti, izvještaji se slažu ručno na kraju mjeseca.",
        "Najprije mapiramo kako posao danas teče, a zatim gradimo automatizaciju točno za vaš proces — od jednostavnih integracija do složenih tijekova s AI obradom dokumenata.",
      ],
      en: [
        "Every company has repetitive work: data copied from one system to another, approvals waiting in email, reports assembled by hand at month end.",
        "We first map how work flows today, then build automation for your exact process — from simple integrations to complex workflows with AI document processing.",
      ],
    },
    outcomes: {
      hr: ["Manje ručnog rada i pogrešaka", "Sustavi koji međusobno razgovaraju", "Podaci dostupni u stvarnom vremenu"],
      en: ["Less manual work and fewer errors", "Systems that talk to each other", "Data available in real time"],
    },
    features: [
      {
        icon: "map",
        title: { hr: "Analiza i optimizacija procesa", en: "Process analysis and optimisation" },
        text: { hr: "Zajedno s vašim timom pronalazimo uska grla i najisplativije točke za automatizaciju.", en: "Together with your team we find bottlenecks and the most valuable places to automate." },
      },
      {
        icon: "link",
        title: { hr: "Integracije sustava", en: "System integrations" },
        text: { hr: "Povezujemo baze podataka, ERP, računovodstvo, web trgovinu, e-poštu i druge alate putem API-ja.", en: "We connect databases, ERP, accounting, e-commerce, email and other tools through APIs." },
      },
      {
        icon: "database",
        title: { hr: "Baze podataka", en: "Databases" },
        text: {
          hr: "Projektiranje, migracija i optimizacija SQL baza podataka te sigurna razmjena podataka između sustava.",
          en: "Design, migration and tuning of SQL databases, plus secure data exchange between systems.",
        },
      },
      {
        icon: "flow",
        title: { hr: "Automatizirani tijekovi rada", en: "Automated workflows" },
        text: { hr: "Odobrenja, obavijesti, generiranje dokumenata i zadaci koji se pokreću sami.", en: "Approvals, notifications, document generation and tasks that trigger themselves." },
      },
      {
        icon: "document",
        title: { hr: "AI obrada dokumenata", en: "AI document processing" },
        text: { hr: "Automatsko čitanje računa, ponuda i ugovora te unos podataka u vaše sustave.", en: "Automatic reading of invoices, quotes and contracts with data entry into your systems." },
      },
      {
        icon: "chart",
        title: { hr: "Izvještaji i nadzorne ploče", en: "Reports and dashboards" },
        text: { hr: "Ključni pokazatelji poslovanja na jednom mjestu, ažurirani bez ručnog rada.", en: "Key business metrics in one place, updated without manual work." },
      },
      {
        icon: "shield",
        title: { hr: "Sigurnost i GDPR", en: "Security and GDPR" },
        text: { hr: "Kontrola pristupa, zapisi aktivnosti i obrada podataka usklađena s propisima.", en: "Access control, audit logs and data handling that complies with regulations." },
      },
    ],
    useCases: [
      { title: { hr: "Financije i računovodstvo", en: "Finance and accounting" }, text: { hr: "Ulazni računi, usklađivanje plaćanja i mjesečni izvještaji.", en: "Incoming invoices, payment reconciliation and monthly reports." } },
      { title: { hr: "Prodaja", en: "Sales" }, text: { hr: "Upiti s weba izravno u bazu podataka, automatske ponude i praćenje.", en: "Web enquiries straight into your database, automatic quotes and follow-ups." } },
      { title: { hr: "Operativa", en: "Operations" }, text: { hr: "Narudžbe, zalihe i logistika povezani u jedan tijek.", en: "Orders, inventory and logistics connected in one flow." } },
    ],
    faq: [
      {
        q: { hr: "Moramo li mijenjati postojeći softver?", en: "Do we need to replace our existing software?" },
        a: { hr: "U pravilu ne. Automatizaciju gradimo oko alata koje već koristite i povezujemo ih.", en: "Usually not. We build automation around the tools you already use and connect them." },
      },
      {
        q: { hr: "Kako započinjemo?", en: "How do we start?" },
        a: { hr: "Kratkom radionicom na kojoj mapiramo jedan proces i procjenjujemo uštedu prije bilo kakve obveze.", en: "With a short workshop where we map one process and estimate the savings before any commitment." },
      },
    ],
    seo: {
      keywords: {
        hr: ["automatizacija poslovanja", "baze podataka", "integracija sustava", "automatizacija procesa", "AI obrada dokumenata"],
        en: ["business automation", "databases", "system integration", "workflow automation", "process optimisation"],
      },
    },
  },
  
  {
    id: "ai-voice-agents",
    slug: { hr: "ai-glasovni-agenti", en: "ai-voice-agents" },
    icon: "voice",
    accent: "ember",
    featured: true,
    visual: "voice",
    title: { hr: "AI glasovni agenti", en: "AI voice agents" },
    tagline: {
      hr: "Glasovni asistent koji se javlja na svaki poziv, u bilo koje doba dana.",
      en: "A voice assistant that answers every call, at any hour.",
    },
    summary: {
      hr: "Inteligentni glasovni agenti za korisničku podršku, rezervaciju termina te dolazne i odlazne pozive, povezani s vašim sustavima.",
      en: "Intelligent voice agents for customer support, appointment booking and inbound and outbound calls, connected to your systems.",
    },
    intro: {
      hr: [
        "Godinama smo tvrtkama i hotelima pomagali da razumiju i kontroliraju svoj telefonski promet. Danas idemo korak dalje: telefon se javlja sam.",
        "Naši AI glasovni agenti vode prirodan razgovor na hrvatskom i engleskom, razumiju namjeru sugovornika i obavljaju stvarni posao — rezerviraju termin, provjere status narudžbe, odgovore na pitanje ili prebace poziv pravoj osobi uz sažetak razgovora.",
      ],
      en: [
        "For years we helped companies and hotels understand and control their telephone traffic. Today we go a step further: the phone answers itself.",
        "Our AI voice agents hold natural conversations in Croatian and English, understand what the caller needs and get real work done — booking an appointment, checking an order status, answering a question, or transferring the call to the right person with a summary.",
      ],
    },
    outcomes: {
      hr: ["Nijedan propušten poziv", "Dostupnost 0–24, i vikendom", "Tim rasterećen rutinskih upita"],
      en: ["No missed calls", "Available 24/7, weekends included", "A team freed from routine questions"],
    },
    features: [
      {
        icon: "chat",
        title: { hr: "Prirodan razgovor", en: "Natural conversation" },
        text: {
          hr: "Agent razumije hrvatski i engleski, prepoznaje namjeru i prilagođava ton vašem brendu.",
          en: "The agent understands Croatian and English, recognises intent and adapts its tone to your brand.",
        },
      },
      {
        icon: "calendar",
        title: { hr: "Rezervacija termina", en: "Appointment booking" },
        text: {
          hr: "Provjerava slobodne termine u vašem kalendaru i potvrđuje rezervaciju u stvarnom vremenu.",
          en: "Checks free slots in your calendar and confirms bookings in real time.",
        },
      },
      {
        icon: "phone",
        title: { hr: "Dolazni i odlazni pozivi", en: "Inbound and outbound calls" },
        text: {
          hr: "Prima pozive, ali i sam zove — podsjetnici, potvrde dolaska, ankete zadovoljstva.",
          en: "Takes calls and makes them too — reminders, confirmations, satisfaction surveys.",
        },
      },
      {
        icon: "link",
        title: { hr: "Povezan s vašim sustavima", en: "Connected to your systems" },
        text: {
          hr: "Čita i upisuje podatke u vaše baze podataka, ERP, hotelski i ordinacijski softver te telefonsku centralu.",
          en: "Reads and writes data in your databases, ERP, hotel or practice software and phone system.",
        },
      },
      {
        icon: "handoff",
        title: { hr: "Prijenos na djelatnika", en: "Handoff to a person" },
        text: {
          hr: "Kad je potreban čovjek, agent prebacuje poziv i šalje sažetak, pa se nitko ne mora ponavljati.",
          en: "When a person is needed, the agent transfers the call with a summary, so nobody has to repeat themselves.",
        },
      },
      {
        icon: "chart",
        title: { hr: "Transkripti i analitika", en: "Transcripts and analytics" },
        text: {
          hr: "Svaki razgovor zapisan je i pretraživ, uz pregled najčešćih upita i trendova.",
          en: "Every conversation is transcribed and searchable, with an overview of common requests and trends.",
        },
      },
    ],
    useCases: [
      {
        title: { hr: "Hoteli i turizam", en: "Hotels and tourism" },
        text: { hr: "Rezervacije, upiti gostiju i informacije o smještaju na više jezika.", en: "Reservations, guest enquiries and stay information in several languages." },
      },
      {
        title: { hr: "Zdravstvo i ordinacije", en: "Clinics and practices" },
        text: { hr: "Naručivanje pacijenata, podsjetnici i otkazivanje termina.", en: "Patient scheduling, reminders and cancellations." },
      },
      {
        title: { hr: "Servisi i prodaja", en: "Service and sales" },
        text: { hr: "Kvalifikacija upita, status narudžbe i dogovaranje servisa.", en: "Lead qualification, order status and service scheduling." },
      },
      {
        title: { hr: "Korisnička podrška", en: "Customer support" },
        text: { hr: "Prva linija podrške koja rješava česta pitanja i otvara zahtjeve.", en: "A first line of support that resolves common questions and opens tickets." },
      },
    ],
    faq: [
      {
        q: { hr: "Hoće li sugovornici znati da razgovaraju s AI agentom?", en: "Will callers know they are talking to an AI agent?" },
        a: {
          hr: "Da. Preporučujemo da se agent na početku razgovora predstavi kao virtualni asistent, u skladu s propisima o umjetnoj inteligenciji i zaštiti podataka.",
          en: "Yes. We recommend the agent introduces itself as a virtual assistant at the start of the call, in line with AI and data-protection regulations.",
        },
      },
      {
        q: { hr: "Može li agent raditi s našim postojećim telefonskim brojem?", en: "Can the agent work with our existing phone number?" },
        a: {
          hr: "Može. Agenta povezujemo s vašom centralom ili SIP linijom, pa broj ostaje isti.",
          en: "Yes. We connect the agent to your phone system or SIP trunk, so your number stays the same.",
        },
      },
      {
        q: { hr: "Koliko traje uvođenje?", en: "How long does implementation take?" },
        a: {
          hr: "Pilot za jedan scenarij, primjerice rezervaciju termina, obično je spreman za nekoliko tjedana. Opseg i rok dogovaramo nakon prvog razgovora.",
          en: "A pilot for one scenario, such as appointment booking, is typically ready within a few weeks. We agree scope and timeline after the first call.",
        },
      },
    ],
    seo: {
      title: { hr: "AI glasovni agenti za tvrtke", en: "AI voice agents for business" },
      keywords: {
        hr: ["AI glasovni agent", "virtualni asistent", "automatizacija poziva", "AI recepcija", "glasovni bot hrvatski"],
        en: ["AI voice agent", "virtual receptionist", "call automation", "voice AI Croatia"],
      },
    },
  },

  

  {
    id: "web-development",
    slug: { hr: "web-razvoj", en: "web-development" },
    icon: "code",
    accent: "steel",
    visual: "web",
    title: { hr: "Web razvoj", en: "Web development" },
    tagline: {
      hr: "Brze, pristupačne web stranice i aplikacije koje donose upite.",
      en: "Fast, accessible websites and applications that bring in enquiries.",
    },
    summary: {
      hr: "Moderne web stranice, web aplikacije i prilagođena digitalna rješenja, od prvog koncepta do održavanja.",
      en: "Modern websites, web applications and custom digital solutions, from first concept to maintenance.",
    },
    intro: {
      hr: [
        "Web stranica je često prvi razgovor s klijentom. Gradimo je tako da se brzo učitava, jasno govori što radite i vodi posjetitelja prema upitu.",
        "Osim prezentacijskih stranica razvijamo web aplikacije, korisničke portale i interne alate, povezane s ostatkom vašeg poslovanja.",
      ],
      en: [
        "A website is often your first conversation with a client. We build it to load fast, say clearly what you do and lead visitors towards an enquiry.",
        "Beyond marketing sites we develop web applications, customer portals and internal tools, connected to the rest of your business.",
      ],
    },
    features: [
      { icon: "layout", title: { hr: "Korporativne web stranice", en: "Corporate websites" }, text: { hr: "Dizajn i izrada stranica koje predstavljaju vaš brend i jednostavno se uređuju.", en: "Design and build of sites that represent your brand and are easy to edit." } },
      { icon: "app", title: { hr: "Web aplikacije i portali", en: "Web apps and portals" }, text: { hr: "Korisnički portali, rezervacijski sustavi i interni alati po mjeri.", en: "Customer portals, booking systems and custom internal tools." } },
      { icon: "cart", title: { hr: "Web trgovine i B2B", en: "E-commerce and B2B" }, text: { hr: "Online prodaja povezana sa zalihama, plaćanjem i računovodstvom.", en: "Online sales connected to inventory, payments and accounting." } },
      { icon: "speed", title: { hr: "Brzina i SEO", en: "Speed and SEO" }, text: { hr: "Tehnička optimizacija za tražilice i izvrsne Core Web Vitals rezultate.", en: "Technical search optimisation and excellent Core Web Vitals." } },
      { icon: "access", title: { hr: "Pristupačnost", en: "Accessibility" }, text: { hr: "Stranice upotrebljive svima, usklađene sa smjernicama WCAG.", en: "Sites usable by everyone, aligned with WCAG guidelines." } },
      { icon: "server", title: { hr: "Hosting i održavanje", en: "Hosting and maintenance" }, text: { hr: "Sigurnosna ažuriranja, sigurnosne kopije i nadzor dostupnosti.", en: "Security updates, backups and uptime monitoring." } },
    ],
    faq: [
      {
        q: { hr: "Možemo li sami uređivati sadržaj?", en: "Can we edit the content ourselves?" },
        a: { hr: "Da. Ovisno o potrebama, sadržaj uređujete kroz CMS ili jednostavne konfiguracijske datoteke.", en: "Yes. Depending on your needs, you edit content through a CMS or simple configuration files." },
      },
      {
        q: { hr: "Izrađujete li višejezične stranice?", en: "Do you build multilingual sites?" },
        a: { hr: "Da, s ispravnim SEO postavkama za svaki jezik.", en: "Yes, with correct SEO settings for each language." },
      },
    ],
    seo: {
      keywords: {
        hr: ["izrada web stranica", "web razvoj Zagreb", "web aplikacije", "izrada web trgovine"],
        en: ["web development Croatia", "website design Zagreb", "web applications"],
      },
    },
  }
];

export const visibleServices = () => services.filter((s) => !s.hidden);
export const getService = (id: string) => services.find((s) => s.id === id);
