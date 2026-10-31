/* eslint-disable @next/next/no-img-element */
/**
 * Infinite, pausable ticker of reference clients (pure CSS animation).
 * Each client shows its name, with its icon (content/projects.ts `logo`) in front when set.
 */
export function ClientMarquee({ title, clients }: { title: string; clients: { name: string; logo?: string }[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {clients.map((c) => (
        <li key={c.name} className="flex items-center whitespace-nowrap px-6 md:px-9">
          <span className="group/client flex items-center gap-3.5">
            {c.logo && (
              <img
                src={c.logo}
                alt=""
                loading="lazy"
                decoding="async"
                className="size-9 shrink-0 object-contain opacity-70 transition-opacity duration-300 group-hover/client:opacity-100 md:size-10"
              />
            )}
            <span className="font-display text-xl tracking-tight text-fg/45 transition-colors group-hover/client:text-fg md:text-2xl">{c.name}</span>
          </span>
          <span aria-hidden="true" className="ml-12 inline-block size-[7px] rounded-[1px] bg-ember/60 md:ml-[4.5rem]" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={title} className="relative border-y border-line py-8 md:py-10">
      <h2 className="sr-only">{title}</h2>
      <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="animate-marquee flex group-hover:[animation-play-state:paused]" style={{ animationDuration: `${clients.length * 2.4}s` }}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
