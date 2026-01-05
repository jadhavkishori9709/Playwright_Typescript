import { test, expect } from '@playwright/test';

test.describe('Specified User Sign In', () => {
    test('should successfully sign in with provided credentials', async ({ page }) => {
        const email = 'jadhav.kishori97@gmail.com';
        const password = 'Pune@12345';

        console.log(`🎬 Starting Sign In test for: ${email}`);

        await page.goto('https://dev.giftsai.com/', { timeout: 60000, waitUntil: 'domcontentloaded' });
        console.log('✅ Page loaded');

        await page.waitForTimeout(2000);

        // Accept cookies if present
        try {
            const cookieButton = page.locator('button:has-text("Accept")').first();
            if (await cookieButton.isVisible({ timeout: 2000 })) {
                await cookieButton.click();
                await page.waitForTimeout(1000);
            }
        } catch { }

        const signInButton = page.locator('button:has-text("Sign In"), a:has-text("Sign In")').first();
        await signInButton.waitFor({ state: 'visible', timeout: 10000 });
        await signInButton.click();

        await page.waitForTimeout(2000);

        await page.fill('input[type="email"]', email);
        await page.fill('input[type="password"]', password);
        await page.click('button[type="submit"]');

        await page.waitForTimeout(5000);

        const currentUrl = page.url();
        expect(currentUrl.includes('dashboard') || currentUrl.includes('app')).toBeTruthy();

        console.log('✅ Sign In successful!');
    });
});
