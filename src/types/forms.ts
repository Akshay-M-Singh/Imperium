// Contact form types.

export interface ContactFormData {
  name: string;
  company?: string;
  role: string;
  project: string;
  // Honeypot field — must be empty. Filled by bots, not humans.
  [honeypot: string]: string | undefined;
}

export type ContactFormResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ContactFormData, string>> };
