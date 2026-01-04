import { test } from '@playwright/test';
import { generateRandomUserData } from '../utils/testHelpers';

test('Real Email Verification Flow - Check What Happens After Signup', async ({ page }) => {
    console.log('\n🔍 Exploring Real Email Verification Flow...\n');

    const userData = generateRandomUserData();
    console.log('📝 User:', userData.email);

    // Navigate and signup
    console.log('Step 1: Going to homepage...');
    await page.goto('https://dev.giftsai.com/');
    await page.waitForTimeout(2000);

    // Accept cookies
    const acceptButton = page.locator('button:has-text("Accept")').first();
    if (await acceptButton.isVisible({ timeout: 3000 })) {
        await acceptButton.click();
    }
    await page.waitForTimeout(1000);

    // Open Sign In modal
    console.log('Step 2: Opening Sign In modal...');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(2000);

    // Switch to Sign Up
    console.log('Step 3: Switching to Sign Up...');
    await page.click('a:has-text("Sign Up"), button:has-text("Sign Up instead")');
    await page.waitForTimeout(2000);

    // Fill form
    console.log('Step 4: Filling signup form...');
    await page.fill('input[name="firstName"], input[placeholder*="first name" i]', userData.firstName);
    await page.fill('input[name="lastName"], input[placeholder*="last name" i]', userData.lastName);
    await page.fill('input[type="email"]', userData.email);

    const passwordFields = await page.locator('input[type="password"]').count();
    await page.locator('input[type="password"]').first().fill(userData.password);
    if (passwordFields > 1) {
        await page.locator('input[type="password"]').nth(1).fill(userData.password);
    }

    await page.waitForTimeout(2000);

    // Submit
    console.log('Step 5: Submitting signup...');
    await page.click('button[type="submit"]:has-text("Sign Up"), button:has-text("Create Account")');

    // Wait and see what happens
    await page.waitForTimeout(5000);

    // Check current state
    console.log('\n📊 After Signup:');
    console.log('Current URL:', page.url());
    console.log('Page Title:', await page.title());

    // Check for verification message
    const pageContent = await page.content();

    if (pageContent.includes('verify') || pageContent.includes('email') || pageContent.includes('check')) {
        console.log('\n✅ Found verification-related content!');

        // Look for verification message
        const bodyText = await page.locator('body').textContent();
        if (bodyText) {
            const lines = bodyText.split('\n').filter(line =>
                line.toLowerCase().includes('verify') ||
                line.toLowerCase().includes('email') ||
                line.toLowerCase().includes('check')
            );
            console.log('\nVerification messages found:');
            lines.slice(0, 5).forEach(line => console.log('  -', line.trim()));
        }
    }

    // Check if there's a verification link on the page
    const verifyLinks = await page.locator('a[href*="verify"], a:has-text("verify")').count();
    if (verifyLinks > 0) {
        console.log(`\n🔗 Found ${verifyLinks} verification link(s) on page`);
    }

    // Take screenshot
    await page.screenshot({ path: 'after-signup.png', fullPage: true });
    console.log('\n📸 Screenshot saved: after-signup.png');

    await page.waitForTimeout(5000);

    console.log('\n💡 Check the browser and screenshot to see what happens after signup!');
});
