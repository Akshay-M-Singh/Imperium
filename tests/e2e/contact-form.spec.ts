import { test, expect } from "@playwright/test";

// Contact form e2e — full validation + mocked success flow.
// On localhost without RESEND_API_KEY the action mocks success
// (Roadmap Phase 4.13). Expand once the form is implemented.

test("contact form page is reachable", async ({ page }) => {
  await page.goto("/");
  // Until the standalone /contact route ships, the form lives at #contact.
  await expect(page).toHaveTitle(/Imperium Italian Textile/);
});
