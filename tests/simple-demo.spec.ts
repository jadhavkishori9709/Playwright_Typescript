import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * SIMPLE HEADED DEMO
 * Run with: npx playwright test tests/simple-demo.spec.ts --headed
 */

test('Simple Login Demo - Watch in Browser', async ({ page }) => {
    console.log('\n🎬 Starting Simple Demo in Headed Mode...\n');

    const loginPage = new LoginPage(page);

    // Step 1: Go to homepage
    console.log('Step 1: Navigating to GiftsAI homepage...');
    await page.goto('https://dev.giftsai.com/');
    await page.waitForTimeout(3000); // Pause to see

    // Step 2: Accept cookies
    console.log('Step 2: Accepting cookies...');
    await loginPage.acceptCookies();
    await page.waitForTimeout(2000);

    // Step 3: Click Sign In
    console.log('Step 3: Clicking Sign In button...');
    await loginPage.clickSignInButton();
    await page.waitForTimeout(3000);

    // Step 4: Fill login form
    console.log('Step 4: Filling login credentials...');
    await loginPage.signIn('jadhav.kishori97@gmail.com', 'Pune@12345');
    await page.waitForTimeout(5000); // Pause to see result

    console.log('\n✅ Demo Complete! You should now be logged in.\n');
});
