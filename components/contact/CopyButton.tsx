"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** Small button that copies text and briefly confirms. */
export function CopyButton({ value, label, copiedLabel, className = "" }: { value: string; label: string; copiedLabel: string; className?: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-all duration-300 ${
        done ? "border-ember/50 bg-ember/10 text-ember" : "border-line-strong bg-white/[0.03] text-fg hover:border-ember/50 hover:bg-white/[0.06]"
      } ${className}`}
    >
      <Icon name={done ? "check" : "document"} size={15} strokeWidth={done ? 2.4 : 1.6} />
      <span aria-live="polite">{done ? copiedLabel : label}</span>
    </button>
  );
}
