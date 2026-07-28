import { test, expect } from "@playwright/test";

// Stub: full create-profile → connect-wallet → send-support is a wallet-signed
// on-chain flow (Freighter/Albedo popup) that isn't automatable without a
// mocked wallet provider. This scaffolds the page-load step only; wallet
// connection and submission are skipped/mocked in a follow-up.
test.skip("create profile page loads its form (wallet steps skipped/mocked)", async ({ page }) => {
  await page.goto("/create");
  await expect(page.locator("form")).toBeVisible();
});
