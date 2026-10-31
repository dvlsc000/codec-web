import { Icon } from "./Icon";

/** Accessible accordion built on <details>, no client JS needed. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it) => (
        <details key={it.q} className="group py-2 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-4 text-lg font-medium transition-colors hover:text-ember">
            {it.q}
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition-transform duration-500 ease-[var(--ease-out-expo)] group-open:rotate-45 group-open:border-ember/50 group-open:text-ember">
              <Icon name="plus" size={16} />
            </span>
          </summary>
          <p className="max-w-[70ch] pb-5 pr-14 leading-relaxed text-muted">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
