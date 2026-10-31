"use client";

import { useEffect, useState } from "react";

/** Live Zagreb time (updates every 15 s). Renders nothing until mounted to avoid a hydration mismatch. */
export function LocalTime({ locale }: { locale: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <span className="inline-block w-[3.2rem]">&nbsp;</span>;
  return (
    <time dateTime={now.toISOString()} className="tabular-nums">
      {new Intl.DateTimeFormat(locale === "hr" ? "hr-HR" : "en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zagreb" }).format(now)}
    </time>
  );
}
