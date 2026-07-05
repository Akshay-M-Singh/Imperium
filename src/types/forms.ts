// Contact form types.

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  role: string;
  project: string;
  // Render timestamp used for minimum-fill-time check (milliseconds since epoch).
  formTimestamp?: string;
  // Honeypot field — must be empty. Filled by bots, not humans.
  [honeypot: string]: string | undefined;
}

export type ContactFormResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ContactFormData, string>> };
