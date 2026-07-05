import { describe, it, expect, vi } from "vitest";
import { sendContactEmail } from "@/lib/email";

const baseData = {
  name: "Sofia Test",
  email: "sofia@example.com",
  role: "tailor",
  project: "I need linen samples for a summer collection.",
};

describe("sendContactEmail", () => {
  it("mocks success and logs payload when RESEND_API_KEY is absent", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    const result = await sendContactEmail({ data: baseData, to: "hello@example.com" });

    expect(result).toEqual({ ok: true });
    expect(consoleSpy).toHaveBeenCalledWith(
      "[sendContactEmail] RESEND_API_KEY missing — mocking email",
    );

    consoleSpy.mockRestore();
    vi.unstubAllEnvs();
  });

  it("returns an error when RESEND_API_KEY is set but RESEND_FROM or RESEND_TO is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("RESEND_FROM", "");
    vi.stubEnv("RESEND_TO", "");

    const result = await sendContactEmail({ data: baseData, to: "" });

    expect(result).toEqual({ ok: false, error: "Email configuration is incomplete." });

    vi.unstubAllEnvs();
  });
});
