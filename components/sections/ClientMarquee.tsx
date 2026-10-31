/** Infinite, pausable ticker of reference client names (pure CSS animation). */
export function ClientMarquee({ title, names }: { title: string; names: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {names.map((n) => (
        <li key={n} className="flex items-center whitespace-nowrap px-6 font-display text-xl tracking-tight text-fg/45 transition-colors hover:text-fg md:px-9 md:text-2xl">
          {n}
<span aria-hidden="true" className="ml-12 inline-block size-[7px] rounded-[1px] bg-ember/60 md:ml-[4.5rem]" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={title} className="relative border-y border-line py-8 md:py-10">
      <h2 className="sr-only">{title}</h2>
      <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="animate-marquee flex group-hover:[animation-play-state:paused]" style={{ animationDuration: `${names.length * 2.4}s` }}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
