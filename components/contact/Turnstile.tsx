"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window { turnstile?: TurnstileApi }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let loader: Promise<void> | null = null;
function load() {
  if (window.turnstile) return Promise.resolve();
  loader ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { loader = null; reject(); };
    document.head.appendChild(s);
  });
  return loader;
}

export const turnstileEnabled = Boolean(SITE_KEY);

/**
 * Cloudflare Turnstile — renders only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 * Usually invisible ("managed" mode); shows a small check only when needed.
 */
export function Turnstile({ onToken, language, resetKey }: { onToken: (t: string) => void; language: string; resetKey?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  const cb = useRef(onToken);
  cb.current = onToken;

  useEffect(() => {
    if (!SITE_KEY || !box.current) return;
    let alive = true;
    load()
      .then(() => {
        if (!alive || !box.current || !window.turnstile) return;
        id.current = window.turnstile.render(box.current, {
          sitekey: SITE_KEY,
          theme: "dark",
          language,
          appearance: "interaction-only",
          callback: (t: string) => cb.current(t),
          "expired-callback": () => cb.current(""),
          "error-callback": () => cb.current(""),
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
      if (id.current && window.turnstile) window.turnstile.remove(id.current);
      id.current = null;
    };
  }, [language, resetKey]);

  if (!SITE_KEY) return null;
  return <div ref={box} className="min-h-0 [&:has(iframe)]:min-h-[65px]" />;
}
