import type { Accent, VisualName } from "@/content/types";
import { AutomationVisual } from "./AutomationVisual";
import { CallVisual } from "./CallVisual";
import { SupportVisual } from "./SupportVisual";
import { VoiceVisual } from "./VoiceVisual";
import { WebVisual } from "./WebVisual";
import type { VisualLabels } from "./types";

/**
 * Registry of service illustrations. A service picks one with `visual` in
 * content/services.ts; labels come from the dictionaries (`visuals`).
 */
export function ServiceVisual({ name, labels, size }: { name: VisualName; labels: VisualLabels; size: "card" | "hero" }) {
  switch (name) {
    case "voice":
      return <VoiceVisual labels={labels.voice} size={size} />;
    case "automation":
      return <AutomationVisual labels={labels.automation} size={size} />;
    case "web":
      return <WebVisual labels={labels.web} size={size} />;
    case "callAccounting":
      return <CallVisual labels={labels.callAccounting} size={size} />;
    case "support":
      return <SupportVisual labels={labels.support} size={size} />;
  }
}

export type { Accent };
