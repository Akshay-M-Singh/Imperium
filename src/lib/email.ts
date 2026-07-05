// Email — Resend integration (Architecture §1, Roadmap Phase 4.15).
// Mocks when RESEND_API_KEY is absent (Phase 4 local dev).

import { Resend } from "resend";
import type { ContactFormData } from "@/types/forms";

export interface SendContactEmailOptions {
  data: ContactFormData;
  to: string;
}

export async function sendContactEmail({
  data,
  to,
}: SendContactEmailOptions): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey) {
    console.log("[sendContactEmail] RESEND_API_KEY missing — mocking email");
    console.log(JSON.stringify({ to, data }, null, 2));
    return { ok: true };
  }

  if (!to || !from) {
    return { ok: false, error: "Email configuration is incomplete." };
  }

  const resend = new Resend(apiKey);

  const body = [
    `New inquiry from ${data.name}`,
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    data.phone ? `Phone: ${data.phone}` : null,
    `Role: ${data.role}`,
    "",
    "Project:",
    data.project,
    "",
    `Submitted at: ${new Date().toISOString()}`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `New inquiry from ${data.name}`,
      text: body,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email.";
    return { ok: false, error: message };
  }
}
