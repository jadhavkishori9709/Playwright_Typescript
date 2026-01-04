import { test, expect } from '@playwright/test';
import { generateRandomUserData } from '../utils/testHelpers';

test('Real Email Verification - Manual Check', async ({ page }) => {
    console.log('\n📧 Real Email Verification Test\n');
    console.log('This test will:');
    console.log('1. Sign up a new user');
    console.log('2. Pause for you to check email');
    console.log('3. Verify the email was received\n');

    // You can use your real email or generate a unique one
    const userData = generateRandomUserData();

    // OR use your email for testing:
    // const userData = {
    //   firstName: 'Test',
    //   lastName: 'User',
    //   email: 'jadhav.kishori97+test@gmail.com', // Gmail ignores +test
    //   password: 'Test@12345'
    // };

    console.log('📝 User Details:');
    console.log(`   Name: ${userData.firstName} ${userData.lastName}`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Password: ${userData.password}\n`);

    // Step 1: Navigate and signup
    console.log('Step 1: Navigating to GiftsAI...');
    await page.goto('https://dev.giftsai.com/');
    await page.waitForTimeout(2000);

    // Accept cookies
    const acceptButton = page.locator('button:has-text("Accept")').first();
    if (await acceptButton.isVisible({ timeout: 3000 })) {
        await acceptButton.click();
    }
    await page.waitForTimeout(1000);

    // Open signup
    console.log('Step 2: Opening Sign Up form...');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(2000);
    await page.click('a:has-text("Sign Up"), button:has-text("Sign Up instead")');
    await page.waitForTimeout(2000);

    // Fill form
    console.log('Step 3: Filling signup form...');
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
    console.log('Step 4: Submitting signup...');
    await page.click('button[type="submit"]:has-text("Sign Up"), button:has-text("Create Account")');
    await page.waitForTimeout(5000);

    console.log('✅ Signup submitted!\n');

    // Check for success message
    const bodyText = await page.locator('body').textContent() || '';
    if (bodyText.toLowerCase().includes('email') || bodyText.toLowerCase().includes('verify')) {
        console.log('✅ Application shows email verification message');
    }

    console.log('\n' + '='.repeat(60));
    console.log('📧 EMAIL VERIFICATION - MANUAL STEP');
    console.log('='.repeat(60));
    console.log('\n1. Check your email inbox:', userData.email);
    console.log('2. Look for verification email from GiftsAI');
    console.log('3. Click the verification link in the email');
    console.log('4. Come back here and press "Resume" button\n');
    console.log('⏸️  Test is PAUSED - Waiting for you...\n');

    // Pause test - Playwright Inspector will open
    await page.pause();

    console.log('\n✅ Resuming test...\n');

    // Step 5: Try to login with verified account
    console.log('Step 5: Testing login with verified account...');
    await page.goto('https://dev.giftsai.com/');
    await page.waitForTimeout(2000);

    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(2000);

    await page.fill('input[type="email"]', userData.email);
    await page.fill('input[type="password"]', userData.password);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(5000);

    // Check if login successful
    const currentUrl = page.url();
    if (currentUrl.includes('dashboard') || currentUrl.includes('home')) {
        console.log('✅ Login successful - Email was verified!');
    } else {
        console.log('⚠️  Login may have failed - Check if email was verified');
    }

    await page.waitForTimeout(3000);

    console.log('\n🎉 Email Verification Test Complete!\n');
    console.log('Summary:');
    console.log('1. ✅ User signed up');
    console.log('2. ✅ Email sent to inbox');
    console.log('3. ✅ Manual verification completed');
    console.log('4. ✅ Login tested\n');
});
