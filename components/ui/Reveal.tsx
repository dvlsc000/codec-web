"use client";
import { m, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

/** Fades and lifts its content in when scrolled into view (once). */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "header";
}) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={revealVariants}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/** Staggers the reveal of direct `RevealItem` children. */
export function RevealGroup({ children, className, stagger = 0.08, as = "div" }: { children: ReactNode; className?: string; stagger?: number; as?: "div" | "ul" | "ol" | "dl" }) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" | "article" }) {
  const Comp = m[as];
  return (
    <Comp className={className} variants={revealVariants}>
      {children}
    </Comp>
  );
}
