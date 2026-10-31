import { ImageResponse } from "next/og";
import { MARK_C, MARK_PIXELS, WORDMARK, WORDMARK_DOT, WORDMARK_WIDTH } from "@/components/brand/logo-paths";
import { isLocale } from "@/lib/i18n/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Codec";

const copy = {
  hr: { title: "Svaki poziv odgovoren. Svaki proces automatiziran.", sub: "AI glasovni agenti  ·  Automatizacija i baze podataka  ·  Web razvoj" },
  en: { title: "Every call answered. Every process automated.", sub: "AI voice agents  ·  Automation and databases  ·  Web development" },
};

export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = copy[isLocale(locale) ? locale : "hr"];
  const logoW = 120 + 44 + WORDMARK_WIDTH;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 88% 8%, rgba(255,90,31,0.32), transparent 48%), #111215",
          color: "#f1f2f4",
        }}
      >
        <svg width={logoW * 0.42} height={120 * 0.42} viewBox={`0 0 ${logoW} 120`}>
          <path d={MARK_C} fill="#D3D6DC" />
          {MARK_PIXELS.map((p, i) => (
            <rect key={i} x={p.x} y={p.y} width={p.s} height={p.s} fill="#FF5A1F" />
          ))}
          <g transform="translate(164 35)">
            <path d={WORDMARK} fill="#D3D6DC" />
            <rect x={WORDMARK_DOT.x} y={WORDMARK_DOT.y} width={WORDMARK_DOT.s} height={WORDMARK_DOT.s} fill="#FF5A1F" />
          </g>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontSize: 70, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2.5, maxWidth: 980 }}>{t.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#a3a7b0" }}>
            <div style={{ width: 14, height: 14, background: "#FF5A1F", borderRadius: 2 }} />
            {t.sub}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
