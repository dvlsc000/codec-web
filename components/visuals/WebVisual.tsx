import { Icon } from "@/components/ui/Icon";
import { VisualFrame, VisualPill } from "./VisualFrame";
import type { VisualProps } from "./types";

const CYCLE = "8s";

/*
 * Score badge timing, on the same 8s loop as the page build (badge appears at 1.6s):
 * ring + counter fill over ~2.4s, hold at 100%, then reset with the loop.
 * @property makes --web-score a real number so the counter can animate.
 */
const SCORE_CSS = `
@property --web-score { syntax: "<integer>"; inherits: false; initial-value: 0; }
@keyframes web-score-fill {
  0%, 6% { --web-score: 0; stroke-dashoffset: 100; }
  36%, 86% { --web-score: 100; stroke-dashoffset: 0; }
  100% { --web-score: 100; stroke-dashoffset: 0; }
}
@keyframes web-score-glow {
  0%, 34% { box-shadow: 0 0 0 0 rgb(255 90 31 / 0); }
  40% { box-shadow: 0 0 0 6px rgb(255 90 31 / 0.25); }
  52%, 100% { box-shadow: 0 0 0 10px rgb(255 90 31 / 0); }
}
.web-score-ring { animation: web-score-fill ${CYCLE} cubic-bezier(0.33, 1, 0.68, 1) 1.6s infinite both; }
.web-score-num { counter-reset: web-score var(--web-score); animation: web-score-fill ${CYCLE} cubic-bezier(0.33, 1, 0.68, 1) 1.6s infinite both; }
.web-score-num::after { content: counter(web-score) "%"; }
.web-score-dot { animation: web-score-glow ${CYCLE} ease-out 1.6s infinite both; }
@media (prefers-reduced-motion: reduce) {
  .web-score-ring { stroke-dashoffset: 0; }
  .web-score-num { --web-score: 100; }
}
`;
const build = (delay: number) => ({ animation: `v-build ${CYCLE} var(--ease-out-expo) ${delay}s infinite both` });

/** A page assembling itself in a browser, scored and published; the hero size adds the code being written. */
export function WebVisual({ labels, size }: VisualProps<"web">) {
  const hero = size === "hero";
  return (
    <VisualFrame accent="steel" className="relative flex h-full w-full items-center">
      <style>{SCORE_CSS}</style>
      <div className={`grid w-full gap-4 ${hero ? "md:grid-cols-[0.8fr_1.2fr]" : ""}`}>
        {hero && <CodePanel />}

        <div className="relative">
          {/* Browser */}
          <div className="overflow-hidden rounded-[14px] border border-line-strong bg-night-2 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]">
            <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
              <span className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-2 rounded-full bg-white/15" />
                ))}
              </span>
              <span className="ml-2 flex flex-1 items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 py-1 text-[0.68rem] text-subtle">
                <Icon name="lock" size={10} />
                {labels.url}
              </span>
            </div>

            <div className={`space-y-3 p-4 ${hero ? "md:p-5" : ""}`}>
              <div className="flex items-center justify-between" style={build(0)}>
                <span className="size-4 rounded-[3px] bg-ember" />
                <span className="flex gap-2">
                  {[18, 22, 16].map((w, i) => (
                    <span key={i} className="h-1.5 rounded-full bg-white/20" style={{ width: w }} />
                  ))}
                </span>
              </div>
              <div className="space-y-2 pt-2">
                <span className="block h-3.5 w-[72%] rounded-[3px] bg-fg/80" style={build(0.25)} />
                <span className="block h-3.5 w-[48%] rounded-[3px] bg-fg/80" style={build(0.4)} />
                <span className="block h-1.5 w-[64%] rounded-full bg-white/15" style={build(0.6)} />
                <span className="block h-1.5 w-[52%] rounded-full bg-white/15" style={build(0.7)} />
              </div>
              <span className="inline-block h-5 w-20 rounded-full bg-ember" style={build(0.9)} />
              <div className={`grid-cols-3 gap-2 pt-1 ${hero ? "grid" : "hidden"}`}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-12 rounded-md border border-line bg-white/[0.03] p-1.5" style={build(1.1 + i * 0.15)}>
                    <span className="block size-2.5 rounded-[2px] bg-steel/40" />
                    <span className="mt-2 block h-1 w-3/4 rounded-full bg-white/15" />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Performance score: the ring fills and the number counts 0 → 100% in sync */}
          <div
            className="absolute -right-2 -top-5 flex items-center gap-2.5 rounded-xl border border-line-strong bg-night-3 py-2 pl-2 pr-3 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.8)] md:-right-5"
            style={build(1.6)}
          >
            <span className="relative grid size-10 place-items-center">
              <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90" aria-hidden="true">
                <defs>
                  <linearGradient id="web-score" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="var(--color-amber)" />
                    <stop offset="1" stopColor="var(--color-ember)" />
                  </linearGradient>
                </defs>
                <circle cx="20" cy="20" r="16" fill="none" stroke="rgb(211 214 220 / 0.1)" strokeWidth="3.5" />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="url(#web-score)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray="100"
                  className="web-score-ring"
                />
              </svg>
              <span className="web-score-dot absolute size-10 rounded-full" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="web-score-num block font-display text-[0.95rem] font-medium tabular-nums text-fg" />
              <span className="block text-[0.62rem] text-subtle">{labels.score}</span>
            </span>
          </div>

          {/* Published */}
          <div className="absolute -bottom-3 left-3" style={build(2.2)}>
            <VisualPill live>{labels.published}</VisualPill>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

const CODE: { w: number; c: string; indent?: number }[][] = [
  [{ w: 22, c: "ember" }, { w: 40, c: "steel" }],
  [{ w: 14, c: "amber", indent: 1 }, { w: 54, c: "fg" }],
  [{ w: 30, c: "steel", indent: 1 }, { w: 22, c: "ember" }],
  [{ w: 46, c: "fg", indent: 2 }],
  [{ w: 18, c: "amber", indent: 2 }, { w: 34, c: "steel" }],
  [{ w: 36, c: "fg", indent: 1 }],
  [{ w: 12, c: "ember" }],
  [{ w: 26, c: "steel" }, { w: 30, c: "amber" }],
  [{ w: 40, c: "fg", indent: 1 }],
];
const tone: Record<string, string> = { ember: "bg-ember/80", amber: "bg-amber/70", steel: "bg-steel/40", fg: "bg-fg/25" };

function CodePanel() {
  return (
    <div className="hidden rounded-[14px] border border-line bg-night/70 p-4 md:block">
      <div className="mb-3 flex gap-1.5">
        <span className="h-1.5 w-10 rounded-full bg-ember/70" />
        <span className="h-1.5 w-8 rounded-full bg-white/10" />
      </div>
      <div className="space-y-2.5">
        {CODE.map((line, i) => (
          <div key={i} className="flex items-center gap-2" style={{ paddingLeft: (line[0].indent ?? 0) * 14, animation: `v-type ${CYCLE} steps(8) ${i * 0.18}s infinite both` }}>
            <span className="w-4 text-right text-[0.6rem] tabular-nums text-subtle/60">{i + 1}</span>
            {line.map((tok, j) => (
              <span key={j} className={`h-1.5 rounded-full ${tone[tok.c]}`} style={{ width: `${tok.w}%` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
