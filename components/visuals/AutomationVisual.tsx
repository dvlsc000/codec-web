import { VisualFrame, VisualPill } from "./VisualFrame";
import type { VisualProps } from "./types";

type Node = { x: number; y: number; label: string; kind: "in" | "ai" | "db" | "out" };

/**
 * A live workflow: an enquiry flows through AI processing into the database,
 * then fans out to the ERP and a notification. Orange data packets travel the edges.
 */
export function AutomationVisual({ labels, size }: VisualProps<"automation">) {
  if (size === "card") return <Flow labels={labels} hero={false} />;
  // Full five-node flow on wider screens; the compact three-node flow on phones keeps labels legible.
  return (
    <>
      <div className="hidden h-full md:block"><Flow labels={labels} hero /></div>
      <div className="h-full md:hidden"><Flow labels={labels} hero={false} /></div>
    </>
  );
}

function Flow({ labels, hero }: { labels: VisualProps<"automation">["labels"]; hero: boolean }) {
  const size = hero ? "hero" : "card";
  const [inLabel, aiLabel, dbLabel, erpLabel, notifyLabel] = labels.nodes;

  const W = hero ? 600 : 420;
  const H = hero ? 340 : 230;
  const nw = hero ? 132 : 116;
  const nh = 46;

  const nodes: Node[] = hero
    ? [
        { x: 10, y: 147, label: inLabel, kind: "in" },
        { x: 164, y: 147, label: aiLabel, kind: "ai" },
        { x: 318, y: 147, label: dbLabel, kind: "db" },
        { x: 466, y: 52, label: erpLabel, kind: "out" },
        { x: 466, y: 242, label: notifyLabel, kind: "out" },
      ]
    : [
        { x: 8, y: 40, label: inLabel, kind: "in" },
        { x: 152, y: 100, label: aiLabel, kind: "ai" },
        { x: 296, y: 156, label: dbLabel, kind: "db" },
      ];

  const right = (n: Node) => ({ x: n.x + nw, y: n.y + nh / 2 });
  const left = (n: Node) => ({ x: n.x, y: n.y + nh / 2 });
  const bottom = (n: Node) => ({ x: n.x + nw / 2, y: n.y + nh });
  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const mx = (a.x + b.x) / 2;
    return `M${a.x} ${a.y} C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`;
  };
  const edges = hero
    ? [curve(right(nodes[0]), left(nodes[1])), curve(right(nodes[1]), left(nodes[2])), curve(right(nodes[2]), left(nodes[3])), curve(right(nodes[2]), left(nodes[4]))]
    : [curve(bottom(nodes[0]), left(nodes[1])), curve(bottom(nodes[1]), left(nodes[2]))];

  const cycle = hero ? 4 : 3;

  return (
    <VisualFrame accent="amber" className="relative h-full w-full">
      <div className="absolute left-0 top-0 z-10">
        <VisualPill live>{labels.status}</VisualPill>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full overflow-visible" style={{ fontFamily: "var(--font-sans)" }}>
        <defs>
          <pattern id={`auto-grid-${size}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="rgb(211 214 220 / 0.05)" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill={`url(#auto-grid-${size})`} />

        {edges.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="rgb(211 214 220 / 0.16)" strokeWidth="1.5" />
            <path d={d} fill="none" stroke="var(--color-amber)" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 6" style={{ animation: "v-dash 1.4s linear infinite" }} />
            <rect width="8" height="8" x="-4" y="-4" rx="1.5" fill="var(--color-ember)">
              <animateMotion dur={`${cycle / 2}s`} repeatCount="indefinite" path={d} begin={`${(i % 2) * (cycle / 4) + Math.floor(i / 2) * 0.5}s`} rotate="0" />
            </rect>
          </g>
        ))}

        {nodes.map((n, i) => (
          <g key={n.label} transform={`translate(${n.x} ${n.y})`}>
            <rect
              width={nw}
              height={nh}
              rx="10"
              fill="var(--color-night-3)"
              stroke="rgb(211 214 220 / 0.14)"
              style={{ animation: `v-node ${cycle}s ease-in-out ${i * 0.45}s infinite` }}
            />
            <NodeGlyph kind={n.kind} />
            <text x="40" y={nh / 2 + 4.5} fontSize="12.5" fill="var(--color-fg)" fillOpacity="0.9">
              {n.label}
            </text>
          </g>
        ))}

        {/* records counter on the database node */}
        {(() => {
          const db = nodes.find((n) => n.kind === "db")!;
          return (
            <g transform={hero ? `translate(${db.x + 2} ${db.y + nh + 12})` : `translate(${db.x - 126} ${db.y + 11})`}>
            <g style={{ animation: "v-float 3s ease-in-out infinite" }}>
              <rect width={hero ? 128 : 112} height="24" rx="4" fill="rgb(255 181 71 / 0.12)" stroke="rgb(255 181 71 / 0.4)" />
              <text x="10" y="16" fontSize="11" fill="var(--color-amber)">
                +128 {labels.records}
              </text>
            </g>
            </g>
          );
        })()}
      </svg>
    </VisualFrame>
  );
}

function NodeGlyph({ kind }: { kind: Node["kind"] }) {
  const common = { fill: "none", stroke: "var(--color-amber)", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <g transform="translate(12 13)">
      <rect width="20" height="20" rx="5" fill="rgb(255 181 71 / 0.1)" />
      <g transform="translate(3 3) scale(0.583)">
        {kind === "in" && <path d="M4 5h16v11H9l-5 4V5Z" {...common} />}
        {kind === "ai" && <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" {...common} />}
        {kind === "db" && <path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" {...common} />}
        {kind === "out" && <path d="M5 12h14m-6-6 6 6-6 6" {...common} />}
      </g>
    </g>
  );
}
