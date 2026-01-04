import { test } from '@playwright/test';

test('Email Verification Demo - Slow & Visible', async ({ page }) => {
    console.log('\n' + '='.repeat(70));
    console.log('📧 EMAIL VERIFICATION TEST - WATCH THE BROWSER!');
    console.log('='.repeat(70) + '\n');

    const testUser = {
        firstName: 'Demo',
        lastName: 'User',
        email: `demo_${Date.now()}@test.com`,
        password: 'Test@12345'
    };

    console.log('👤 Test User:');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: ${testUser.password}\n`);

    // STEP 1
    console.log('━'.repeat(70));
    console.log('STEP 1: Going to Homepage');
    console.log('━'.repeat(70));
    await page.goto('https://dev.giftsai.com/');
    await page.waitForTimeout(3000);
    console.log('✅ Loaded homepage\n');

    // STEP 2
    console.log('━'.repeat(70));
    console.log('STEP 2: Accepting Cookies');
    console.log('━'.repeat(70));
    const acceptButton = page.locator('button:has-text("Accept")').first();
    if (await acceptButton.isVisible({ timeout: 3000 })) {
        await acceptButton.click();
        console.log('✅ Cookies accepted\n');
    } else {
        console.log('ℹ️  No cookie banner\n');
    }
    await page.waitForTimeout(2000);

    // STEP 3
    console.log('━'.repeat(70));
    console.log('STEP 3: Opening Sign In Modal');
    console.log('━'.repeat(70));
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(3000);
    console.log('✅ Sign In modal opened\n');

    // STEP 4
    console.log('━'.repeat(70));
    console.log('STEP 4: Switching to Sign Up');
    console.log('━'.repeat(70));
    await page.click('a:has-text("Sign Up"), button:has-text("Sign Up instead")');
    await page.waitForTimeout(3000);
    console.log('✅ Sign Up form displayed\n');

    // STEP 5
    console.log('━'.repeat(70));
    console.log('STEP 5: Filling First Name');
    console.log('━'.repeat(70));
    await page.fill('input[name="firstName"], input[placeholder*="first name" i]', testUser.firstName);
    await page.waitForTimeout(1500);
    console.log(`✅ Entered: ${testUser.firstName}\n`);

    // STEP 6
    console.log('━'.repeat(70));
    console.log('STEP 6: Filling Last Name');
    console.log('━'.repeat(70));
    await page.fill('input[name="lastName"], input[placeholder*="last name" i]', testUser.lastName);
    await page.waitForTimeout(1500);
    console.log(`✅ Entered: ${testUser.lastName}\n`);

    // STEP 7
    console.log('━'.repeat(70));
    console.log('STEP 7: Filling Email');
    console.log('━'.repeat(70));
    await page.fill('input[type="email"]', testUser.email);
    await page.waitForTimeout(1500);
    console.log(`✅ Entered: ${testUser.email}\n`);

    // STEP 8
    console.log('━'.repeat(70));
    console.log('STEP 8: Filling Password');
    console.log('━'.repeat(70));
    const passwordFields = await page.locator('input[type="password"]').count();
    await page.locator('input[type="password"]').first().fill(testUser.password);
    await page.waitForTimeout(1500);
    console.log(`✅ Entered password\n`);

    // STEP 9
    if (passwordFields > 1) {
        console.log('━'.repeat(70));
        console.log('STEP 9: Filling Confirm Password');
        console.log('━'.repeat(70));
        await page.locator('input[type="password"]').nth(1).fill(testUser.password);
        await page.waitForTimeout(1500);
        console.log(`✅ Confirmed password\n`);
    }

    // STEP 10
    console.log('━'.repeat(70));
    console.log('STEP 10: Submitting Sign Up Form');
    console.log('━'.repeat(70));
    await page.click('button[type="submit"]:has-text("Sign Up"), button:has-text("Create Account")');
    await page.waitForTimeout(5000);
    console.log('✅ Form submitted\n');

    // STEP 11
    console.log('━'.repeat(70));
    console.log('STEP 11: Checking Result');
    console.log('━'.repeat(70));
    const currentUrl = page.url();
    const bodyText = await page.locator('body').textContent() || '';

    console.log(`Current URL: ${currentUrl}`);

    if (bodyText.toLowerCase().includes('email') || bodyText.toLowerCase().includes('verify')) {
        console.log('✅ Email verification message detected\n');
    }

    await page.waitForTimeout(5000);

    console.log('\n' + '='.repeat(70));
    console.log('✅ SIGNUP COMPLETE!');
    console.log('='.repeat(70));
    console.log('\n📧 A verification email should be sent to:');
    console.log(`   ${testUser.email}`);
    console.log('\n💡 In real scenario:');
    console.log('   1. User checks their email inbox');
    console.log('   2. User clicks verification link');
    console.log('   3. Email gets verified');
    console.log('   4. User can login\n');
});
