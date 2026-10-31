"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { DecodeText } from "@/components/ui/DecodeText";
import { SignalCanvas } from "./SignalCanvas";

const ease = [0.16, 1, 0.3, 1] as const;

export interface HeroProps {
  status: string;
  titleLines: string[];
  lead: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  signalLabel: string;
}

export function Hero({ status, titleLines, lead, primary, secondary, signalLabel }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const signalY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const pixelsY = useTransform(scrollYProgress, [0, 1], [0, -140]);

  const firstLen = titleLines[0]?.length ?? 0;

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-36">
      {/* Atmosphere */}
      <m.div aria-hidden="true" style={{ y: glowY }} className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[12%] -top-[25%] size-[62vw] max-w-[920px] rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.2),transparent)] blur-2xl" />
        <div className="absolute -left-[15%] top-[40%] size-[50vw] max-w-[760px] rounded-full bg-[radial-gradient(closest-side,rgb(211_214_220/0.07),transparent)] blur-2xl" />
        <div className="pixel-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_35%,#000,transparent)]" />
      </m.div>

      {/* The logo's pixel trail, enlarged and drifting out of frame */}
      <m.div aria-hidden="true" style={{ y: pixelsY }} className="pointer-events-none absolute right-[6%] top-[18%] -z-10 hidden md:block">
        {[
          { s: 54, x: 0, y: 0, d: 0.9 },
          { s: 32, x: -70, y: 70, d: 1.05 },
          { s: 19, x: -112, y: 112, d: 1.2 },
        ].map((p, i) => (
          <m.span
            key={i}
            className="absolute rounded-[3px] bg-ember"
            style={{ width: p.s, height: p.s, left: p.x, top: p.y, opacity: 0.9 - i * 0.18 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 - i * 0.18 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: p.d }}
          />
        ))}
      </m.div>

      <m.div style={{ y: contentY, opacity: contentOpacity }} className="container-site relative">
        <m.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.15 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] py-1.5 pl-2.5 pr-4 text-sm text-muted backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="animate-pulse-ring absolute inline-flex size-full rounded-[1px] bg-ember" />
            <span className="relative inline-flex size-2 rounded-[1px] bg-ember" />
          </span>
          {status}
        </m.p>

        <h1 id="hero-title" className="text-display mt-7 md:mt-9">
          {titleLines.map((line, li) => (
            <DecodeText
              key={li}
              text={line}
              delay={0.35 + (li === 0 ? 0 : firstLen * 0.045)}
              speed={45}
              className={`block ${li === 1 ? "text-fg/45" : ""}`}
            />
          ))}
        </h1>
      </m.div>

      <m.div
        style={{ y: signalY }}
        className="relative my-6 h-[clamp(170px,27vh,290px)] w-full md:my-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <SignalCanvas label={signalLabel} />
      </m.div>

      <m.div style={{ opacity: contentOpacity }} className="container-site relative mt-auto pb-14 md:pb-20">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <m.p className="text-lead max-w-[56ch]" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 1.05 }}>
            {lead}
          </m.p>
          <m.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 1.2 }}>
            <ButtonLink href={primary.href} icon="arrowRight">{primary.label}</ButtonLink>
            <ButtonLink href={secondary.href} variant="secondary">{secondary.label}</ButtonLink>
          </m.div>
        </div>
      </m.div>
    </section>
  );
}
