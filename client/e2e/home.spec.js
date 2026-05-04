import { test, expect } from '@playwright/test';

test('homepage loads and shows navigation', async ({ page }) => {
  await page.goto('/');

  // Expect the navbar logo link
  const navLogo = page.locator('a[href="/"]').first();
  await expect(navLogo).toBeVisible();

  // Expect the hero section heading
  const heroHeading = page.locator('h1');
  await expect(heroHeading).toBeVisible();

  // Expect login button
  const loginBtn = page.locator('a[href="/login"]').first();
  await expect(loginBtn).toBeVisible();
});
