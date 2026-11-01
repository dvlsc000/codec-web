import Image from "next/image";
import type { TeamMember } from "@/content/people";
import { l, type Locale } from "@/lib/i18n/config";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const initials = (n: string) => n.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

/** Team cards. Renders nothing when content/people.ts has no team members. */
export function TeamGrid({ members, locale }: { members: TeamMember[]; locale: Locale }) {
  if (!members.length) return null;
  return (
    <RevealGroup as="ul" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {members.map((p) => (
        <RevealItem as="li" key={p.name} className="group">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] border border-line bg-night-2">
            {p.photo ? (
              <Image src={p.photo} alt="" fill sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw" className="object-cover grayscale transition-[filter,transform] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03] group-hover:grayscale-0" />
            ) : (
              <div className="pixel-grid grid size-full place-items-center">
                <span className="font-display text-[clamp(1.6rem,1rem+2vw,2.6rem)] font-medium tracking-[-0.04em] text-fg/25">{initials(p.name)}</span>
              </div>
            )}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgb(17_18_21/0.85),transparent)]" />
          </div>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-[1.02rem] font-medium tracking-[-0.02em]">{p.name}</p>
              <p className="mt-1 text-sm text-muted">{l(p.role, locale)}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              {p.email && (
                <a href={`mailto:${p.email}`} aria-label={`E-mail: ${p.name}`} className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-ember/50 hover:text-ember">
                  <Icon name="mail" size={15} />
                </a>
              )}
              {p.linkedin && (
                <a href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn: ${p.name}`} className="grid size-9 place-items-center rounded-full border border-line text-[0.7rem] font-semibold text-muted transition-colors hover:border-ember/50 hover:text-ember">
                  in
                </a>
              )}
            </div>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
