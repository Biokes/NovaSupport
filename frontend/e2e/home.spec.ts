import { test, expect } from "@playwright/test";

test("home page loads and renders the creator list", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();

  await page.getByRole("link", { name: /explore creators/i }).click();
  await expect(page).toHaveURL(/\/explore/);
  await expect(page.getByRole("heading", { name: /explore creators/i })).toBeVisible();

  const creatorCards = page.locator('a[href^="/profile/"]');
  await expect(creatorCards.first()).toBeVisible();
});
