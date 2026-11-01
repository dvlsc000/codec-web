"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** A label/value row; values marked copyable get a one-click copy button with confirmation. */
export function CopyField({ label, value, copyable = false, copyLabel, copiedLabel }: { label: string; value: string; copyable?: boolean; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      // Fallback for browsers that block the async clipboard API.
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      ok = document.execCommand("copy");
      ta.remove();
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="group grid gap-1 border-b border-line py-4 last:border-b-0 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-6">
      <dt className="text-sm text-subtle">{label}</dt>
      <dd className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <span className={`min-w-0 break-words text-fg/90 ${copyable ? "font-medium tabular-nums tracking-wide" : ""}`}>{value}</span>
        {copyable && (
          <button
            type="button"
            onClick={copy}
            aria-label={`${copyLabel}: ${label}`}
            className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs transition-all duration-300 ${
              copied ? "border-ember/50 bg-ember/10 text-ember" : "border-line text-muted hover:border-line-strong hover:text-fg"
            }`}
          >
            <Icon name={copied ? "check" : "document"} size={13} strokeWidth={copied ? 2.4 : 1.6} />
            <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
          </button>
        )}
      </dd>
    </div>
  );
}
