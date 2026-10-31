import type { SVGProps } from "react";

/**
 * Icon registry. Services and features reference icons by name, so content
 * files never contain markup. Add a new entry here to make it available.
 */
const paths = {
  voice: "M12 3v18M8 7v10M4 10v4M16 6v12M20 9v6",
  automation: "M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  code: "m8 8-4 4 4 4m8-8 4 4-4 4M14 4l-4 16",
  callStats: "M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Zm11-1v5m3-3v3m3-6v6",
  support: "M4 13v-1a8 8 0 0 1 16 0v1M4 13a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2Zm16 0a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2Zm-3 4v1a3 3 0 0 1-3 3h-2",
  chat: "M4 5h16v11H9l-5 4V5Zm4 5h8M8 13h5",
  calendar: "M4 6h16v14H4V6Zm0 4h16M8 3v4m8-4v4m-6 7 2 2 4-4",
  phone: "M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1m2 3.7a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  handoff: "M3 12h11m0 0-4-4m4 4-4 4M17 5h4v14h-4",
  chart: "M4 20V4m0 16h16M8 16v-5m4 5V8m4 8v-3m4 3V6",
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14",
  flow: "M5 4h5v5H5V4Zm9 11h5v5h-5v-5ZM7.5 9v3.5a2 2 0 0 0 2 2H14",
  document: "M6 3h8l4 4v14H6V3Zm8 0v4h4M9 12h6m-6 4h6",
  shield: "M12 3 5 6v6c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6l-7-3Zm-3 9 2 2 4-4",
  layout: "M3 5h18v14H3V5Zm0 4h18M9 9v10",
  app: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 3.5h7M16.5 13v7",
  cart: "M3 4h2l2.4 11h10.2L20 8H6.2M9 20h.01M17 20h.01",
  speed: "M12 13l4-4M4.5 18a9 9 0 1 1 15 0",
  access: "M12 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM5 8l7 1 7-1m-7 1v5l-3 7m3-7 3 7",
  database: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  server: "M4 4h16v6H4V4Zm0 10h16v6H4v-6Zm3-7h.01M7 17h.01",
  lock: "M6 11h12v10H6V11Zm2 0V8a4 4 0 0 1 8 0v3",
  coins: "M8 8c0-1.7 2.7-3 6-3s6 1.3 6 3-2.7 3-6 3-6-1.3-6-3Zm0 0v4c0 1.7 2.7 3 6 3s6-1.3 6-3V8M4 12c0 1.7 2.7 3 6 3m-6-3v4c0 1.7 2.7 3 6 3s6-1.3 6-3",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2",
  pulse: "M3 12h4l2-5 4 10 2-5h6",
  spark: "M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M6 18l2.5-2.5m7-7L18 6",
  arrowRight: "M5 12h14m-6-6 6 6-6 6",
  arrowUpRight: "M7 17 17 7M8 7h9v9",
  mail: "M3 5h18v14H3V5Zm0 1 9 7 9-7",
  pin: "M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  menu: "M4 8h16M4 16h16",
  close: "M6 6l12 12M18 6 6 18",
  check: "m5 12 5 5 9-10",
  download: "M12 4v12m0 0-5-5m5 5 5-5M5 20h14",
  plus: "M12 5v14M5 12h14",
  chevronDown: "m6 9 6 6 6-6",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 22, ...props }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
