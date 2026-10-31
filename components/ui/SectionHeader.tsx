import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Heading + optional lead + optional action, used to open every section. */
export function SectionHeader({
  title,
  lead,
  action,
  id,
  align = "split",
}: {
  title: string;
  lead?: string;
  action?: ReactNode;
  id?: string;
  align?: "split" | "stack";
}) {
  return (
    <Reveal
      as="header"
      className={
        align === "split"
          ? "mb-12 grid gap-6 md:mb-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end"
          : "mb-12 max-w-3xl md:mb-16"
      }
    >
      <h2 id={id} className="text-h2 max-w-[18ch]">
        {title}
      </h2>
      {(lead || action) && (
        <div className={align === "split" ? "flex flex-col items-start gap-6 md:pb-2" : "mt-6 flex flex-col items-start gap-6"}>
          {lead && <p className="text-lead max-w-[52ch]">{lead}</p>}
          {action}
        </div>
      )}
    </Reveal>
  );
}
