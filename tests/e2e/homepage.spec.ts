import { test, expect } from "@playwright/test";

// Smoke test — the homepage loads and renders the brand name.
// Expanded during the relevant roadmap phases (Hero Phase 2, etc.).

test("homepage renders the brand", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
