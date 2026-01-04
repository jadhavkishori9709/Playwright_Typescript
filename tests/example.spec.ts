import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://dev.giftsai.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/GIFTS AI - Personalized Gift Recommendations/);

  // Check for the "Sign In" button
  await expect(page.getByRole('button', { name: 'Sign In' }).first()).toBeVisible();
});
/*test('slow test', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes
  // test code
});*/


/*test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});*/
