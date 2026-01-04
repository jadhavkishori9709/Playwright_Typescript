import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { createEmailVerificationHelper } from '../utils/emailVerificationHelper';
import { generateRandomUserData } from '../utils/testHelpers';

/**
 * VISUAL DEMO: Email Verification Flow
 * This test demonstrates the complete email verification process
 * Run with: npx playwright test tests/email-verification-demo.spec.ts --headed
 */

test('DEMO: Complete Email Verification Flow', async ({ page }) => {
    console.log('🎬 Starting Email Verification Demo...\n');

    // Step 1: Generate test user data
    console.log('📝 Step 1: Generating random user data...');
    const userData = generateRandomUserData();
    console.log(`   Email: ${userData.email}`);
    console.log(`   Name: ${userData.firstName} ${userData.lastName}\n`);

    await page.waitForTimeout(2000); // Pause to see

    // Step 2: Navigate to homepage
    console.log('🏠 Step 2: Navigating to homepage...');
    const loginPage = new LoginPage(page);
    await loginPage.navigateToHome();
    await page.waitForTimeout(2000);

    // Step 3: Click Sign In button
    console.log('🔘 Step 3: Clicking Sign In button...');
    await loginPage.clickSignInButton();
    await page.waitForTimeout(2000);

    // Step 4: Switch to Sign Up
    console.log('🔄 Step 4: Switching to Sign Up form...');
    await loginPage.switchToSignUp();
    await page.waitForTimeout(2000);

    // Step 5: Fill registration form
    console.log('✍️  Step 5: Filling registration form...');
    await loginPage.signUp(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password
    );
    await page.waitForTimeout(3000);

    // Step 6: Create email verification helper
    console.log('\n📧 Step 6: Creating email verification helper...');
    const emailHelper = createEmailVerificationHelper(page);

    // Step 7: Generate mock verification link
    console.log('🔗 Step 7: Generating mock verification link...');
    const verificationLink = emailHelper.generateMockVerificationLink(userData.email);
    console.log(`   Link: ${verificationLink}\n`);
    await page.waitForTimeout(2000);

    // Step 8: Simulate clicking verification link from email
    console.log('📬 Step 8: Simulating user clicking verification link from email...');
    console.log('   (In real scenario, user would receive email and click link)');
    await page.goto(verificationLink);
    await page.waitForTimeout(3000);

    // Step 9: Show current page
    console.log(`\n✅ Step 9: Navigated to verification page!`);
    console.log(`   Current URL: ${page.url()}`);
    await page.waitForTimeout(2000);

    // Step 10: Verify URL contains verification parameters
    console.log('\n🔍 Step 10: Verifying URL parameters...');
    const url = page.url();
    const hasToken = url.includes('token=');
    const hasEmail = url.includes('email=');

    console.log(`   ✓ Has token parameter: ${hasToken}`);
    console.log(`   ✓ Has email parameter: ${hasEmail}`);

    expect(hasToken).toBeTruthy();
    expect(hasEmail).toBeTruthy();

    await page.waitForTimeout(2000);

    console.log('\n🎉 Email Verification Demo Complete!');
    console.log('═══════════════════════════════════════\n');
    console.log('Summary:');
    console.log('1. ✅ User signed up');
    console.log('2. ✅ Mock verification link generated');
    console.log('3. ✅ Navigated to verification page');
    console.log('4. ✅ Email verification flow demonstrated!');
    console.log('\n💡 In production, replace mock with real email service (Mailosaur, etc.)');

    await page.waitForTimeout(3000); // Final pause to see results
});

test('DEMO: Show Mock vs Real Email Comparison', async ({ page }) => {
    console.log('\n📊 Comparison: Mock vs Real Email Service\n');
    console.log('═══════════════════════════════════════\n');

    const emailHelper = createEmailVerificationHelper(page);
    const testEmail = 'demo@example.com';

    // Mock approach (current)
    console.log('🔷 MOCK EMAIL SERVICE (Current Setup):');
    console.log('   1. User signs up');
    console.log('   2. System generates verification link');
    console.log('   3. Test navigates directly to link');
    console.log('   4. No real email sent!');
    console.log('   ✅ Fast, reliable, free\n');

    const mockLink = emailHelper.generateMockVerificationLink(testEmail);
    console.log(`   Example link: ${mockLink}\n`);

    await page.waitForTimeout(3000);

    // Real approach (production)
    console.log('🔶 REAL EMAIL SERVICE (Production):');
    console.log('   1. User signs up');
    console.log('   2. Real email sent via SendGrid/Mailgun');
    console.log('   3. Test fetches email from Mailosaur');
    console.log('   4. Extract link from email');
    console.log('   5. Navigate to link');
    console.log('   ✅ Realistic, end-to-end testing\n');

    await page.waitForTimeout(3000);

    console.log('💡 For your 63 test cases, mock is perfect for learning!');
    console.log('   Switch to real service when deploying to production.\n');
});
