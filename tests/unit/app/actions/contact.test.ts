import { describe, it, expect, vi, beforeEach } from "vitest";
import { contact } from "@/data/contact";

// The server action reads the caller's IP via next/headers' headers() to key
// its in-memory rate limiter. jsdom/vitest has no real request context, so
// stub the module; each test supplies a distinct fake IP (via beforeEach
// below) so the shared, module-level rate-limit Map in contact.ts can't leak
// state between tests in this file.
const headersMock = vi.fn();
vi.mock("next/headers", () => ({
  headers: () => headersMock(),
}));

// The action ultimately calls sendContactEmail (src/lib/email.ts), which
// itself mocks out to a console.log when RESEND_API_KEY is unset (see
// tests/unit/lib/email.test.ts) — no network call happens as long as that
// env var stays unset, so no extra mocking is required here beyond silencing
// the console noise.

import { submitContactForm } from "@/app/actions/contact";

function fakeHeaders(ip: string) {
  return {
    get: (name: string) => (name === "x-forwarded-for" ? ip : null),
  } as unknown as Awaited<ReturnType<typeof headersMock>>;
}

let ipCounter = 0;

/** Builds a FormData that passes every check except whatever is overridden. */
function buildFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  const defaults: Record<string, string> = {
    formTimestamp: String(Date.now() - 10_000), // well past MIN_FILL_MS (3s)
    name: "Test Visitor",
    email: "visitor@example.com",
    role: "tailor",
    project: "This project description is long enough to pass the length check.",
  };
  const merged = { ...defaults, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    fd.set(key, value);
  }
  return fd;
}

describe("submitContactForm — locale-aware validation", () => {
  beforeEach(() => {
    ipCounter += 1;
    // Distinct IP per test keeps each test under its own rate-limit bucket.
    headersMock.mockResolvedValue(fakeHeaders(`203.0.113.${ipCounter}`));
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  it("returns Arabic validation messages when locale=ar and the name is missing", async () => {
    const fd = buildFormData({ locale: "ar", name: "" });

    const result = await submitContactForm(undefined, fd);

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.fieldErrors?.name).toBe(contact.ar.validation.name);
    expect(result.fieldErrors?.name).not.toBe(contact.en.validation.name);
    expect(result.error).toBe(contact.ar.validation.checkFields);
  });

  it("returns Arabic validation messages when locale=ar and the email is invalid", async () => {
    const fd = buildFormData({ locale: "ar", email: "not-an-email" });

    const result = await submitContactForm(undefined, fd);

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.fieldErrors?.email).toBe(contact.ar.validation.emailInvalid);
    expect(result.fieldErrors?.email).not.toBe(contact.en.validation.emailInvalid);
  });

  it("returns English validation messages when locale=en and the name is missing", async () => {
    const fd = buildFormData({ locale: "en", name: "" });

    const result = await submitContactForm(undefined, fd);

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.fieldErrors?.name).toBe(contact.en.validation.name);
    expect(result.fieldErrors?.name).not.toBe(contact.ar.validation.name);
  });

  it("falls back to English (DEFAULT_LOCALE) validation messages when no locale field is submitted", async () => {
    const fd = buildFormData({ name: "" });
    fd.delete("locale");

    const result = await submitContactForm(undefined, fd);

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.fieldErrors?.name).toBe(contact.en.validation.name);
  });

  it("falls back to English validation messages for an unrecognized locale value", async () => {
    const fd = buildFormData({ locale: "fr", name: "" });

    const result = await submitContactForm(undefined, fd);

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.fieldErrors?.name).toBe(contact.en.validation.name);
    expect(result.fieldErrors?.name).not.toBe(contact.ar.validation.name);
  });

  it("succeeds with locale=ar when every field is valid (mocked email send)", async () => {
    const fd = buildFormData({ locale: "ar" });

    const result = await submitContactForm(undefined, fd);

    expect(result).toEqual({ ok: true });
  });
});
