import type { Localized } from "@/lib/i18n/config";

/**
 * Team members and client testimonials.
 *
 * Both lists start empty on purpose: the sections they feed (team on the About
 * page, testimonials on the Home and References pages) stay hidden until real
 * entries are added here. Never put invented people or quotes on the site.
 *
 * Photos: put square images (min. 600×600 px) in /public/team/ and reference
 * them as "/team/name.jpg". Without a photo, initials are shown.
 */

export interface TeamMember {
  name: string;
  role: Localized;
  photo?: string;
  linkedin?: string;
  email?: string;
}

export interface Testimonial {
  /** The quote exactly as the client approved it, in each language. */
  quote: Localized;
  name: string;
  role: Localized;
  company: string;
  /** Optional service id from content/services.ts, shown as a tag. */
  service?: string;
}

export const team: TeamMember[] = [
  // {
  //   name: "Ime Prezime",
  //   role: { hr: "Direktor", en: "Managing director" },
  //   photo: "/team/ime-prezime.jpg",
  //   linkedin: "https://www.linkedin.com/in/...",
  // },
];

export const testimonials: Testimonial[] = [
  // {
  //   quote: { hr: "…", en: "…" },
  //   name: "Ime Prezime",
  //   role: { hr: "Voditelj IT-a", en: "Head of IT" },
  //   company: "Tvrtka d.d.",
  //   service: "call-accounting",
  // },
];
