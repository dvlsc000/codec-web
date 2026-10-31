"use client";

import Link from "next/link";
import { m } from "framer-motion";
import type { ReactNode } from "react";
import type { Accent } from "@/content/types";

const ease = [0.16, 1, 0.3, 1] as const;

/** Opening block for inner pages: breadcrumb, title, lead and an optional slot. */
export function PageHero({
  title,
  lead,
  crumbs,
  breadcrumbLabel,
  accent = "ember",
  children,
  visual,
  visualBare = false,
}: {
  title: string;
  lead?: string;
  crumbs: { label: string; href?: string }[];
  breadcrumbLabel: string;
  accent?: Accent;
  children?: ReactNode;
  /** Optional illustration shown beside the title on large screens. */
  visual?: ReactNode;
  /** Show the visual without the glass panel around it. */
  visualBare?: boolean;
}) {
  return (
    <section data-accent={accent} className="relative isolate overflow-hidden pb-12 pt-28 md:pb-24 md:pt-48">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/3 right-[-10%] size-[55vw] max-w-[760px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.24),transparent)] blur-2xl" />
        <div className="pixel-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_70%_20%,#000,transparent)]" />
      </div>
      <div className={`container-site ${visual ? "grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16" : ""}`}>
        <div>
        <m.nav aria-label={breadcrumbLabel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="text-subtle">/</span>}
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-fg">{c.label}</Link>
                ) : (
                  <span aria-current="page" className="text-fg/80">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </m.nav>
        <m.h1
          className="text-h1 mt-6 max-w-[18ch] md:mt-8"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease, delay: 0.15 }}
        >
          {title}
        </m.h1>
        {lead && (
          <m.p
            className="text-lead mt-7 max-w-[60ch]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.35 }}
          >
            {lead}
          </m.p>
        )}
        {children && (
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.5 }} className="mt-10">
            {children}
          </m.div>
        )}
        </div>
        {visual && (
          <m.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.35 }}
            className={visualBare ? "relative" : "glass edge-glow relative rounded-[var(--radius-panel)] p-5 md:p-7"}
          >
            {visual}
          </m.div>
        )}
      </div>
    </section>
  );
}
