// Env — centralised, typed access to process.env (no scattered reads).
// Never log secrets from here. Validate at the call site where a real
// dependency exists (e.g. the contact action checks RESEND_API_KEY).

const required = <T extends string>(name: string, value: string | undefined): T => {
  if (typeof value === "undefined" || value.length === 0) {
    // In dev, throw early. In production, caller decides whether to fail.
    if (process.env.NODE_ENV !== "production") {
      throw new Error(`Missing required env var: ${name}`);
    }
    return undefined as unknown as T;
  }
  return value as T;
};

export const env = {
  get siteUrl(): string {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  },
  get resendApiKey(): string | undefined {
    return process.env.RESEND_API_KEY;
  },
  get resendFrom(): string | undefined {
    return process.env.RESEND_FROM;
  },
  get resendTo(): string {
    return required("RESEND_TO", process.env.RESEND_TO);
  },
  get whatsappNumber(): string {
    return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  },
  get plausibleDomain(): string | undefined {
    return process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  },
  get honeypotField(): string {
    return process.env.HONEYPOT_FIELD ?? "company_website";
  },
} as const;
