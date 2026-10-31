import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact/schema";
import { services } from "@/content/services";
import { site } from "@/content/site";

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Bots that fill the hidden field get a silent success.
  if (body && typeof body === "object" && "website" in body && (body as { website?: string }).website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation", issues: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  }
  const d = parsed.data;
  const serviceNames = d.services.map((id) => services.find((s) => s.id === id)?.title.hr ?? id);

  const subject = `Novi upit s weba — ${d.name}${d.company ? ` (${d.company})` : ""}`;
  const text = [
    `Ime: ${d.name}`,
    `E-pošta: ${d.email}`,
    d.company && `Tvrtka: ${d.company}`,
    d.phone && `Telefon: ${d.phone}`,
    serviceNames.length && `Interes: ${serviceNames.join(", ")}`,
    `Jezik: ${d.locale}`,
    "",
    d.message,
  ]
    .filter(Boolean)
    .join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info("[contact] RESEND_API_KEY not set — enquiry logged instead of emailed:\n" + text);
    return NextResponse.json({ ok: true, delivered: false });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? `web@${new URL(site.url).hostname}`,
      to: [process.env.CONTACT_TO_EMAIL ?? site.contact.emails.general],
      reply_to: d.email,
      subject,
      text,
      html: `<pre style="font:14px/1.5 system-ui">${escape(text)}</pre>`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] email provider error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
