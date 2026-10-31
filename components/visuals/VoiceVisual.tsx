"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Icon } from "@/components/ui/Icon";
import { VisualFrame, VisualPill } from "./VisualFrame";
import type { VisualProps } from "./types";

type Line = { who: string; text: string };
type VoiceState = { speaking: boolean; who: string };

/** Timing of the scripted call (ms). */
const WORD_MS = 190; // subtitle pace ≈ natural speech
const HOLD_MS = 1300; // line stays fully shown before the next speaker
const GAP_MS = 550; // silence between speakers
const DONE_MS = 2800; // result chip before the call restarts

/**
 * A live call: the pixel meter "speaks" while subtitles appear word by word.
 * The meter goes quiet between lines and shifts colour with the speaker —
 * orange for the AI agent, steel for the caller. Card size shows the current
 * subtitle; hero size keeps the last lines as a short transcript.
 */
export function VoiceVisual({ labels, size }: VisualProps<"voice">) {
  const hero = size === "hero";
  const lines = labels.lines as Line[];
  const voice = useRef<VoiceState>({ speaking: false, who: "agent" });
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ line: 0, words: 0, done: false, run: 0 });
  const [reduce, setReduce] = useState(false);

  useEffect(() => setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  // Script runner — only while on screen.
  useEffect(() => {
    if (reduce) {
      setState({ line: lines.length - 1, words: 999, done: true, run: 0 });
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = false;
    let cur = { line: 0, words: 0, done: false, run: 0 };

    const schedule = (fn: () => void, ms: number) => {
      timer = setTimeout(() => visible && fn(), ms);
    };
    const tick = () => {
      const words = lines[cur.line].text.split(" ").length;
      if (cur.done) {
        cur = { line: 0, words: 0, done: false, run: cur.run + 1 };
        voice.current.who = lines[0].who;
        setState(cur);
        schedule(tick, GAP_MS);
      } else if (cur.words < words) {
        voice.current = { speaking: true, who: lines[cur.line].who };
        cur = { ...cur, words: cur.words + 1 };
        setState(cur);
        schedule(tick, cur.words === words ? HOLD_MS : WORD_MS);
      } else if (cur.line < lines.length - 1) {
        voice.current.speaking = false;
        cur = { ...cur, line: cur.line + 1, words: 0 };
        setState(cur);
        schedule(tick, GAP_MS);
      } else {
        voice.current.speaking = false;
        cur = { ...cur, done: true };
        setState(cur);
        schedule(tick, DONE_MS);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was) schedule(tick, 400);
      if (!visible) {
        clearTimeout(timer);
        voice.current.speaking = false;
      }
    });
    if (box.current) io.observe(box.current);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [lines, reduce]);

  const current = lines[state.line];
  const shown = (l: Line, i: number) => (i < state.line ? l.text : l.text.split(" ").slice(0, state.words).join(" "));
  const speakerLabel = (who: string) => (who === "agent" ? labels.agentLabel : labels.callerLabel);
  const history = lines.slice(Math.max(0, state.line - 2), state.line + 1).map((l, k, arr) => ({ l, i: state.line - (arr.length - 1 - k) }));

  return (
    <VisualFrame accent="ember" className="flex h-full w-full flex-col justify-between gap-4">
      <div ref={box} className="flex items-center justify-between">
        <VisualPill live>{labels.status}</VisualPill>
        <span className="text-[0.72rem] tabular-nums text-subtle">00:42</span>
      </div>

      <div className={`relative ${hero ? "h-32 md:h-40" : "h-24"}`}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-[15%] inset-y-[10%] rounded-full bg-[radial-gradient(closest-side,rgb(255_90_31/0.16),transparent)] blur-xl" />
        <VoiceMeter voice={voice} />
      </div>

      {/* Subtitles */}
      <div className={`relative ${hero ? "h-[8.5rem]" : "h-[3.6rem]"}`} aria-hidden="true">
        {state.done && !hero ? (
          <span key={`done-${state.run}`} className="voice-in inline-flex items-center gap-1.5 rounded-[var(--radius-pixel)] bg-ember px-2.5 py-1 text-xs font-medium text-night">
            <Icon name="check" size={13} strokeWidth={2.4} />
            {labels.done}
          </span>
        ) : hero ? (
          <div className="flex h-full flex-col justify-end gap-2 [mask-image:linear-gradient(to_bottom,transparent,#000_30%)]">
            {history.map(({ l, i }) => (
              <p key={`${state.run}-${i}`} className={`voice-in text-sm leading-snug ${i === state.line ? "text-fg" : "text-fg/45"}`}>
                <span className={`mr-2 text-[0.7rem] font-medium ${l.who === "agent" ? "text-ember" : "text-steel/70"}`}>{speakerLabel(l.who)}</span>
                {shown(l, i)}
                {i === state.line && !state.done && <span className="voice-caret ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.12em] bg-ember" />}
              </p>
            ))}
            {state.done && (
              <span key={`done-${state.run}`} className="voice-in inline-flex items-center gap-1.5 self-start rounded-[var(--radius-pixel)] bg-ember px-2.5 py-1 text-xs font-medium text-night">
                <Icon name="check" size={13} strokeWidth={2.4} />
                {labels.done}
              </span>
            )}
          </div>
        ) : (
          <p key={`${state.run}-${state.line}`} className="voice-in text-[0.86rem] leading-snug text-fg">
            <span className={`mr-2 text-[0.7rem] font-medium ${current.who === "agent" ? "text-ember" : "text-steel/70"}`}>{speakerLabel(current.who)}</span>
            {shown(current, state.line)}
            <span className="voice-caret ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.12em] bg-ember" />
          </p>
        )}
      </div>

      {/* Full transcript for assistive tech */}
      <p className="sr-only">{lines.map((l) => `${speakerLabel(l.who)}: ${l.text}`).join(" ")} {labels.done}.</p>

      <style>{`
        @keyframes voice-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes voice-caret { 50% { opacity: 0; } }
        .voice-in { animation: voice-in .45s cubic-bezier(.16,1,.3,1) both; }
        .voice-caret { animation: voice-caret 1s steps(2, jump-none) infinite; }
      `}</style>
    </VisualFrame>
  );
}

// ------------------------------------------------------------------ meter

/** Smooth 1-D value noise in 0..1 (cosine-interpolated hash), deterministic per seed. */
function noise(x: number, seed: number) {
  const hash = (n: number) => {
    const s = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const i = Math.floor(x);
  const f = x - i;
  const u = (1 - Math.cos(f * Math.PI)) / 2;
  return hash(i) * (1 - u) + hash(i + 1) * u;
}

function mix3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Mix two colours (t = 0 → a, 1 → b). */
function mix(a: [number, number, number], b: [number, number, number], t: number) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)} ${Math.round(a[1] + (b[1] - a[1]) * t)} ${Math.round(a[2] + (b[2] - a[2]) * t)}`;
}

const EMBER: [number, number, number] = [255, 90, 31];
const AMBER: [number, number, number] = [255, 181, 71];
const PEAK: [number, number, number] = [255, 214, 170];
const STEEL_LOW: [number, number, number] = [120, 126, 138];
const STEEL_HIGH: [number, number, number] = [225, 228, 233];

/**
 * A live voice meter drawn on canvas, 60 fps.
 *
 * Built from the logo's square pixel: every column is a stack of crisp pixels
 * mirrored around a centre line (the lower half as a faint reflection). Levels
 * follow a simulated voice — syllable rhythm, phrase pauses and shifting
 * formants — with fast attack / slow release like a real audio meter. The top
 * pixel of each column fades in by its fractional level, so the quantised meter
 * still moves smoothly, and a peak pixel floats above each column and falls back.
 */
function VoiceMeter({ voice }: { voice?: RefObject<VoiceState> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let cols = 0;
    let px = 5; // pixel size (css px)
    let colStep = 8;
    let rowStep = 7;
    let rows = 8; // rows per half
    let levels = new Float32Array(0);
    let peaks = new Float32Array(0);
    let peakVel = new Float32Array(0);
    let rowColors: string[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let t = 0;
    let talk = voice ? 0 : 1; // 0 = silent, 1 = speaking (smoothed)
    let tint = 0; // 0 = agent (orange), 1 = caller (steel)

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      px = w < 360 ? 4 : 5;
      colStep = px + (w < 360 ? 3 : 4);
      rowStep = px + 2;
      cols = Math.max(12, Math.min(36, Math.floor((w * 0.86) / colStep)));
      rows = Math.max(4, Math.floor((h / 2 - 4) / rowStep));
      levels = new Float32Array(cols);
      peaks = new Float32Array(cols);
      peakVel = new Float32Array(cols);
      rowColors = Array.from({ length: rows }, (_, r) => mix(EMBER, AMBER, rows > 1 ? r / (rows - 1) : 0));
    };

    const step = (dt: number) => {
      t += dt;
      // When driven by the conversation, follow who is speaking; otherwise talk with natural pauses.
      if (voice?.current) {
        const v = voice.current;
        talk += ((v.speaking ? 1 : 0.06) - talk) * (1 - Math.exp(-dt * (v.speaking ? 9 : 5)));
        tint += ((v.who === "caller" ? 1 : 0) - tint) * (1 - Math.exp(-dt * 6));
      }
      const phrase = voice
        ? talk * (0.78 + 0.22 * noise(t * 0.6, 1))
        : Math.min(1, Math.max(0.14, (noise(t * 0.45, 1) - 0.12) * 2.4));
      // Syllable rhythm: ~4–6 pulses per second.
      const syllable = 0.45 + 0.55 * Math.pow(noise(t * 5.2, 2), 1.4);
      const energy = phrase * syllable;

      for (let c = 0; c < cols; c++) {
        const x = cols > 1 ? c / (cols - 1) : 0.5;
        // Voice energy concentrates in the middle of the spectrum…
        const centre = Math.exp(-Math.pow((x - 0.5) / 0.3, 2));
        // …with formants that wander across it.
        const formant = 0.5 + 0.5 * noise(c * 0.28 + t * 1.9, 3) * (0.6 + 0.4 * noise(c * 0.11 - t * 0.7, 4));
        // Gain so loud syllables reach the top; soft compression keeps the shape natural.
        const raw = 1.75 * energy * (0.16 + 0.84 * centre) * (0.55 + 0.75 * formant);
        const target = raw / (1 + 0.35 * raw);

        // Meter ballistics: fast attack, slower release.
        const k = target > levels[c] ? 1 - Math.exp(-dt * 26) : 1 - Math.exp(-dt * 6.5);
        levels[c] += (target - levels[c]) * k;

        // Peak hold: jump up, then fall with gentle gravity.
        if (levels[c] >= peaks[c]) {
          peaks[c] = levels[c];
          peakVel[c] = 0;
        } else {
          peakVel[c] += dt * 0.55;
          peaks[c] = Math.max(levels[c], peaks[c] - peakVel[c] * dt);
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      if (voice) {
        rowColors = Array.from({ length: rows }, (_, r) => {
          const u = rows > 1 ? r / (rows - 1) : 0;
          const ag = [EMBER[0] + (AMBER[0] - EMBER[0]) * u, EMBER[1] + (AMBER[1] - EMBER[1]) * u, EMBER[2] + (AMBER[2] - EMBER[2]) * u];
          const ca = [STEEL_LOW[0] + (STEEL_HIGH[0] - STEEL_LOW[0]) * u, STEEL_LOW[1] + (STEEL_HIGH[1] - STEEL_LOW[1]) * u, STEEL_LOW[2] + (STEEL_HIGH[2] - STEEL_LOW[2]) * u];
          return mix(ag as [number, number, number], ca as [number, number, number], tint);
        });
      }
      const cy = Math.round(h / 2);
      const totalW = cols * colStep - (colStep - px);
      const x0 = Math.round((w - totalW) / 2);

      // centre line
      const line = ctx.createLinearGradient(x0, 0, x0 + totalW, 0);
      line.addColorStop(0, "rgba(255,90,31,0)");
      line.addColorStop(0.5, "rgba(255,90,31,0.35)");
      line.addColorStop(1, "rgba(255,90,31,0)");
      ctx.fillStyle = line;
      ctx.fillRect(x0, cy, totalW, 1);

      for (let c = 0; c < cols; c++) {
        const x = x0 + c * colStep;
        const n = levels[c] * rows;
        const full = Math.floor(n);
        const frac = n - full;

        for (let r = 0; r <= Math.min(full, rows - 1); r++) {
          const a = r < full ? 1 : frac; // top pixel fades in by fractional level
          if (a <= 0.01) continue;
          ctx.fillStyle = rowColors[r];
          // upper half
          ctx.globalAlpha = a;
          ctx.fillRect(x, cy - 3 - r * rowStep - px, px, px);
          // reflection: fainter the further it is from the centre line
          ctx.globalAlpha = a * 0.32 * (1 - r / rows);
          ctx.fillRect(x, cy + 3 + r * rowStep, px, px);
        }

        // floating peak pixel
        const pr = Math.min(rows - 1, Math.round(peaks[c] * rows));
        if (pr > full && peaks[c] > 0.08) {
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = mix(mix3(AMBER, PEAK, 0.5), STEEL_HIGH, tint);
          ctx.fillRect(x, cy - 3 - pr * rowStep - px, px, px);
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      if (visible) raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(() => {
      layout();
      if (reduce) {
        // A single, settled frame of speech.
        for (let i = 0; i < 90; i++) step(1 / 60);
        draw();
      }
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);

    layout();
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [voice]);

  return <canvas ref={ref} aria-hidden="true" className="relative block h-full w-full" />;
}
