import { VisualFrame, VisualPill } from "./VisualFrame";
import type { VisualProps } from "./types";

/** A 24-segment clock swept by a light that never stops, with a steady heartbeat. */
export function SupportVisual({ labels, size }: VisualProps<"support">) {
  const hero = size === "hero";
  const ring = hero ? 220 : 150;
  const seg = hero ? 12 : 9;
  const r = ring / 2 - seg;
  const period = 4.8;

  return (
    <VisualFrame accent="ember" className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="relative" style={{ width: ring, height: ring }}>
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-[2px]"
            style={{
              width: seg,
              height: seg,
              marginLeft: -seg / 2,
              marginTop: -seg / 2,
              transform: `rotate(${i * 15}deg) translateY(-${r}px)`,
              background: "rgb(211 214 220 / 0.12)",
              animation: `v-segment ${period}s linear ${(i / 24) * period - period}s infinite`,
            }}
          />
        ))}
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className={`font-display font-medium tracking-tight ${hero ? "text-4xl" : "text-2xl"}`}>{labels.hours}</p>
            <p className="mt-1 text-[0.72rem] text-subtle">{labels.duty}</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <svg viewBox="0 0 300 48" className="h-10 w-full" preserveAspectRatio="none">
          <path d="M0 24H90l8-14 10 30 10-34 8 18h174" fill="none" stroke="rgb(211 214 220 / 0.12)" strokeWidth="1.5" />
          <path
            d="M0 24H90l8-14 10 30 10-34 8 18h174"
            fill="none"
            stroke="var(--color-ember)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeDasharray="60 400"
            strokeDashoffset="460"
            style={{ animation: "v-heartbeat 2.4s linear infinite" }}
          />
        </svg>
        <div className="mt-3 flex items-center justify-between gap-3">
          <VisualPill live>{labels.status}</VisualPill>
          {hero && <span className="text-[0.72rem] text-subtle">{labels.check}</span>}
        </div>
      </div>
    </VisualFrame>
  );
}
