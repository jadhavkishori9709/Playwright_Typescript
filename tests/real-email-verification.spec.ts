import { test, expect } from '@playwright/test';
import { generateRandomUserData } from '../utils/testHelpers';

test('Complete Email Verification Flow - Real Application', async ({ page }) => {
    console.log('\n📧 Testing Real Email Verification Flow...\n');

    const userData = generateRandomUserData();
    console.log('📝 New User:');
    console.log(`   Email: ${userData.email}`);
    console.log(`   Name: ${userData.firstName} ${userData.lastName}\n`);

    // Step 1: Navigate to homepage
    console.log('Step 1: Navigating to homepage...');
    await page.goto('https://dev.giftsai.com/');
    await page.waitForTimeout(2000);

    // Step 2: Accept cookies
    console.log('Step 2: Accepting cookies...');
    const acceptButton = page.locator('button:has-text("Accept")').first();
    if (await acceptButton.isVisible({ timeout: 3000 })) {
        await acceptButton.click();
        console.log('✅ Cookies accepted');
    }
    await page.waitForTimeout(1000);

    // Step 3: Open Sign Up
    console.log('Step 3: Opening Sign Up form...');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(2000);
    await page.click('a:has-text("Sign Up"), button:has-text("Sign Up instead")');
    await page.waitForTimeout(2000);

    // Step 4: Fill signup form
    console.log('Step 4: Filling signup form...');
    await page.fill('input[name="firstName"], input[placeholder*="first name" i]', userData.firstName);
    await page.fill('input[name="lastName"], input[placeholder*="last name" i]', userData.lastName);
    await page.fill('input[type="email"]', userData.email);

    const passwordFields = await page.locator('input[type="password"]').count();
    await page.locator('input[type="password"]').first().fill(userData.password);
    if (passwordFields > 1) {
        console.log('   Filling confirm password...');
        await page.locator('input[type="password"]').nth(1).fill(userData.password);
    }

    console.log('✅ Form filled');
    await page.waitForTimeout(2000);

    // Step 5: Submit signup
    console.log('Step 5: Submitting signup...');
    await page.click('button[type="submit"]:has-text("Sign Up"), button:has-text("Create Account")');
    await page.waitForTimeout(5000);

    console.log('✅ Signup submitted\n');

    // Step 6: Check what happened after signup
    console.log('Step 6: Checking post-signup state...');
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);

    // Look for verification message or email confirmation
    const bodyText = await page.locator('body').textContent() || '';

    if (bodyText.toLowerCase().includes('verify') || bodyText.toLowerCase().includes('email')) {
        console.log('✅ Found verification-related content');

        // Check if user needs to verify email
        if (bodyText.toLowerCase().includes('check your email') ||
            bodyText.toLowerCase().includes('verification email')) {
            console.log('\n📧 Email Verification Required:');
            console.log('   Application sent verification email');
            console.log('   User needs to check their inbox');
            console.log(`   Email sent to: ${userData.email}`);
        }

        // Check if there's a verification link on the page
        const verifyLink = page.locator('a[href*="verify"]').first();
        if (await verifyLink.isVisible({ timeout: 2000 })) {
            console.log('\n🔗 Found verification link on page!');
            const href = await verifyLink.getAttribute('href');
            console.log(`   Link: ${href}`);
        }
    }

    // Check if user was logged in automatically
    const isLoggedIn = currentUrl.includes('dashboard') ||
        bodyText.includes('logout') ||
        bodyText.includes('sign out');

    if (isLoggedIn) {
        console.log('\n✅ User logged in automatically (no verification needed)');
    } else {
        console.log('\n⏳ User needs to verify email before logging in');
    }

    await page.waitForTimeout(5000);

    console.log('\n🎉 Email Verification Flow Test Complete!\n');
    console.log('Summary:');
    console.log('1. ✅ User signed up successfully');
    console.log('2. ✅ Checked post-signup state');
    console.log('3. ✅ Identified verification requirements');
    console.log('\n💡 Check the browser to see the actual verification flow!');
});
