import type { Testimonial } from "@/content/people";
import { services } from "@/content/services";
import { l, type Locale } from "@/lib/i18n/config";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Client quotes. Renders nothing until content/people.ts has testimonials,
 * so the site never shows placeholder or invented quotes.
 */
export function Testimonials({ items, locale, title, className = "" }: { items: Testimonial[]; locale: Locale; title: string; className?: string }) {
  if (!items.length) return null;
  const [lead, ...rest] = items;
  const tag = (id?: string) => (id ? services.find((s) => s.id === id) : undefined);

  return (
    <section aria-labelledby="testimonials-title" className={`container-site ${className}`}>
      <Reveal>
        <h2 id="testimonials-title" className="text-h2 mb-10 md:mb-14">{title}</h2>
      </Reveal>

      <Reveal>
        <figure data-accent="ember" className="edge-glow relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-night-2 p-7 md:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.14),transparent)]" />
          <span aria-hidden="true" className="font-display block text-[4rem] leading-[0.6] text-ember">“</span>
          <blockquote className="relative mt-4 max-w-[48ch] text-[clamp(1.2rem,1rem+1vw,1.85rem)] font-medium leading-snug tracking-[-0.015em] text-fg">
            {l(lead.quote, locale)}
          </blockquote>
          <figcaption className="relative mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="font-medium text-fg">{lead.name}</span>
            <span className="text-muted">{l(lead.role, locale)}, {lead.company}</span>
            {tag(lead.service) && <span className="rounded-full border border-line px-3 py-1 text-xs text-subtle">{l(tag(lead.service)!.title, locale)}</span>}
          </figcaption>
        </figure>
      </Reveal>

      {rest.length > 0 && (
        <RevealGroup as="ul" className="mt-4 grid gap-4 md:grid-cols-2 lg:gap-5">
          {rest.map((t) => (
            <RevealItem as="li" key={t.name + t.company}>
              <figure className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-night-2/60 p-6 md:p-8">
                <blockquote className="flex-1 text-lg leading-relaxed text-fg/85">“{l(t.quote, locale)}”</blockquote>
                <figcaption className="mt-6 border-t border-line pt-5 text-sm">
                  <span className="font-medium text-fg">{t.name}</span>
                  <span className="mt-1 block text-muted">{l(t.role, locale)}, {t.company}</span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </section>
  );
}
