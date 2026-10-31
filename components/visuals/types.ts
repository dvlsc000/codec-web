import type { Dictionary } from "@/content/dictionaries/hr";

export type VisualLabels = Dictionary["visuals"];
export type VisualProps<K extends keyof VisualLabels> = {
  labels: VisualLabels[K];
  /** "card": compact tile illustration; "hero": the large version on service pages. */
  size: "card" | "hero";
};
