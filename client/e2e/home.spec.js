import { test, expect } from '@playwright/test';

test('has title and displays products', async ({ page }) => {
  await page.goto('/');

  // Expect the title to include "Vite + React" or we can just check the header text
  const header = page.locator('h1:has-text("Discover Premium Tech")');
  await expect(header).toBeVisible();

  // Expect the products to load (wait for the grid to populate)
  // By waiting for at least one "Add to Cart" button or a specific product name.
  const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
  await expect(addToCartButton).toBeVisible();
});
