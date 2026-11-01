/**
 * Server-side spam protection for the contact form. Every layer is optional
 * and switches on only when its environment variables are set:
 *
 *   TURNSTILE_SECRET_KEY (+ NEXT_PUBLIC_TURNSTILE_SITE_KEY)  Cloudflare Turnstile
 *   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN        shared rate limit
 *
 * Without them the form still has the honeypot, the time trap and a
 * per-instance rate limit.
 */

const WINDOW_S = 10 * 60;
const MAX_PER_WINDOW = 5;
/** Real people need more than this to fill the form. */
export const MIN_FILL_MS = 3000;

const local = new Map<string, number[]>();
function localLimited(ip: string) {
  const now = Date.now();
  const recent = (local.get(ip) ?? []).filter((t) => now - t < WINDOW_S * 1000);
  recent.push(now);
  local.set(ip, recent);
  if (local.size > 5000) local.clear();
  return recent.length > MAX_PER_WINDOW;
}

/** Shared limit across all serverless instances (Upstash REST, no SDK needed). */
export async function rateLimited(ip: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return localLimited(ip);
  try {
    const key = `contact:${ip}`;
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", key], ["EXPIRE", key, String(WINDOW_S), "NX"]]),
      cache: "no-store",
    });
    if (!res.ok) return localLimited(ip);
    const [incr] = (await res.json()) as { result: number }[];
    return Number(incr?.result) > MAX_PER_WINDOW;
  } catch {
    return localLimited(ip);
  }
}

/** True when Turnstile is not configured, or the token checks out. */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, cache: "no-store" });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
