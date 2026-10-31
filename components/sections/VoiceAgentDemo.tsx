"use client";

import { AnimatePresence, m, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

const ease = [0.16, 1, 0.3, 1] as const;
/** Even, unhurried glide for rows growing into the chat. */
const glide = [0.45, 0, 0.2, 1] as const;

export interface VoiceAgentDemoProps {
  title: string;
  lead: string;
  note: string;
  callerLabel: string;
  agentLabel: string;
  live: string;
  replay: string;
  transcript: { who: string; text: string }[];
  events: string[];
}

/** A scripted call that plays when scrolled into view: transcript, then system actions. */
export function VoiceAgentDemo(props: VoiceAgentDemoProps) {
  const { title, lead, note, callerLabel, agentLabel, live, replay, transcript, events } = props;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const reduce = useReducedMotion();
  const total = transcript.length + events.length;
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [run, setRun] = useState(0);

  const done = step >= total;

  const restart = useCallback(() => {
    setStep(0);
    setSeconds(0);
    setRun((r) => r + 1);
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setStep(total);
      return;
    }
    if (step >= total) return;
    const isMessage = step < transcript.length;
    // Brief pause, a "typing" beat proportional to the line length, then show it.
    const pause = step === 0 ? 500 : 350;
    const typingFor = isMessage ? 650 + Math.min(1300, transcript[step].text.length * 14) : 550;
    const t1 = setTimeout(() => setTyping(isMessage), pause);
    const t2 = setTimeout(() => {
      setTyping(false);
      setStep((s) => s + 1);
    }, pause + typingFor);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView, step, total, transcript, reduce, run]);

  useEffect(() => {
    if (!inView || done || reduce) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [inView, done, reduce]);

  const visibleMessages = transcript.slice(0, Math.min(step, transcript.length));
  const visibleEvents = events.slice(0, Math.max(0, step - transcript.length));
  const nextWho = transcript[step]?.who;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
      <div>
        <h2 id="demo-title" className="text-h2 max-w-[16ch]">{title}</h2>
        <p className="text-lead mt-6 max-w-[48ch]">{lead}</p>
        <p className="mt-8 text-sm text-subtle">{note}</p>
      </div>

      <div ref={ref} data-accent="ember" className="edge-glow relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-night-2 p-5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)] md:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.22),transparent)]" />

        {/* Call header */}
        <div className="relative flex items-center justify-between gap-4 border-b border-line pb-5">
          <div className="flex items-center gap-3.5">
            <span className="relative grid size-11 place-items-center rounded-full bg-[conic-gradient(from_180deg,var(--color-ember),var(--color-steel),var(--color-ember))]">
              {!done && <span className="animate-pulse-ring absolute inset-0 rounded-full bg-ember/40" />}
              <span className="relative grid size-9 place-items-center rounded-full bg-night-2 text-ember">
                <Icon name="voice" size={18} />
              </span>
            </span>
            <div>
              <p className="font-medium">{agentLabel}</p>
              <p className="flex items-center gap-2 text-sm text-muted">
                <span className={`size-1.5 rounded-full ${done ? "bg-subtle" : "bg-amber"}`} />
                {live}
              </p>
            </div>
          </div>
          <span className="tabular-nums text-sm text-muted" aria-hidden="true">{mm}:{ss}</span>
        </div>

        {/* Transcript — fixed height, newest message at the bottom.
            New rows grow from 0 to their height, so earlier messages glide upward
            instead of the panel (and the page below it) jumping. */}
        <ol
          aria-live="polite"
          className="relative flex h-[24rem] flex-col justify-end overflow-hidden py-4 [mask-image:linear-gradient(to_bottom,transparent,#000_14%)] md:h-[23rem]"
        >
          <AnimatePresence initial={false}>
            {visibleMessages.map((msg, i) => {
              const agent = msg.who === "agent";
              return (
                <m.li
                  key={`${run}-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { duration: 0.8, ease: glide }, opacity: { duration: 0.6, delay: 0.15 } }}
                  className="shrink-0 overflow-hidden"
                >
                  <m.div
                    initial={{ y: 12 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: glide }}
                    className={`flex flex-col pt-3 ${agent ? "items-start" : "items-end"}`}
                  >
                    <span className="mb-1 px-1 text-xs text-subtle">{agent ? agentLabel : callerLabel}</span>
                    <span
                      className={`max-w-[85%] rounded-[18px] px-4 py-2.5 leading-relaxed ${
                        agent ? "rounded-tl-md border border-ember/25 bg-ember/[0.08] text-fg" : "rounded-tr-md bg-white/[0.07] text-fg/90"
                      }`}
                    >
                      {msg.text}
                    </span>
                  </m.div>
                </m.li>
              );
            })}
            {typing && (
              <m.li
                key={`typing-${run}-${step}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ height: { duration: 0.8, ease: glide }, opacity: { duration: 0.35 } }}
                className={`flex shrink-0 overflow-hidden ${nextWho === "agent" ? "justify-start" : "justify-end"}`}
                aria-hidden="true"
              >
                <span className={`mt-3 flex gap-1 rounded-full px-4 py-3 ${nextWho === "agent" ? "bg-ember/[0.08]" : "bg-white/[0.06]"}`}>
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="size-1.5 animate-bounce rounded-full bg-fg/60" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </span>
              </m.li>
            )}
          </AnimatePresence>
        </ol>

        {/* System actions */}
        <div className="relative flex min-h-[6.5rem] flex-wrap content-start items-start gap-2 border-t border-line pt-5 sm:min-h-[4.25rem]">
          {visibleEvents.map((ev) => (
            <m.span
              key={`${run}-${ev}`}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/[0.07] px-3 py-1.5 text-sm text-ember"
            >
              <Icon name="check" size={14} />
              {ev}
            </m.span>
          ))}
          {done && !reduce && (
            <button type="button" onClick={restart} className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg">
              <Icon name="pulse" size={14} />
              {replay}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
