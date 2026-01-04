import { test } from '@playwright/test';

test('Quick Login Demo - Headed Mode', async ({ page }) => {
    console.log('🎬 Starting Headed Mode Demo...\n');

    // Navigate to homepage
    console.log('Step 1: Going to GiftsAI...');
    await page.goto('https://dev.giftsai.com/');
    await page.waitForTimeout(3000);

    // Accept cookies
    console.log('Step 2: Accepting cookies...');
    const acceptButton = page.locator('button:has-text("Accept")').first();
    if (await acceptButton.isVisible({ timeout: 3000 })) {
        await acceptButton.click();
        console.log('✅ Cookies accepted!');
    }
    await page.waitForTimeout(2000);

    // Click Sign In
    console.log('Step 3: Opening Sign In modal...');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(2000);

    // Fill credentials
    console.log('Step 4: Entering credentials...');
    await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
    await page.waitForTimeout(1000);
    await page.fill('input[type="password"]', 'Pune@12345');
    await page.waitForTimeout(1000);

    // Submit
    console.log('Step 5: Logging in...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    console.log('\n✅ Demo Complete!\n');
});
