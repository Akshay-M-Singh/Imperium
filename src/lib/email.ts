// Email — Resend integration (Architecture §1, Roadmap Phase 4.15).
// Mocks when RESEND_API_KEY is absent (Phase 4 local dev).

import type { ContactFormData } from "@/types/forms";

export interface SendContactEmailOptions {
  data: ContactFormData;
  to: string;
}

export async function sendContactEmail(
  _options: SendContactEmailOptions,
): Promise<{ ok: true } | { ok: false; error: string }> {
  // TODO(Phase 4.15): invoke Resend when RESEND_API_KEY is set, else mock.
  return { ok: false, error: "not_implemented" };
}
