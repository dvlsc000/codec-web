import { z } from "zod";

/** Shared by the form (client) and the API route (server). */
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  services: z.array(z.string().max(60)).max(20).optional().default([]),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  locale: z.enum(["hr", "en"]).optional().default("hr"),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional().default(""),
  /** Milliseconds the form was open before submitting (time trap). */
  elapsed: z.number().int().nonnegative().optional(),
  /** Cloudflare Turnstile token, when enabled. */
  turnstile: z.string().max(4096).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
