import { test, expect } from '@playwright/test';
import { SignUpPage } from '../pages/SignUpPage';
import { generateRandomUserData } from '../utils/testHelpers';

test.describe('Simple Sign Up Test', () => {
    test('should successfully sign up with new user', async ({ page }) => {
        // Increase test timeout to 2 minutes for slow dev environment
        test.setTimeout(120000);

        const signUpPage = new SignUpPage(page);
        const userData = generateRandomUserData();

        console.log(`🎬 Starting Sign Up test for: ${userData.email}`);

        // Complete signup using page object
        await signUpPage.completeSignUp(
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.password
        );

        // Wait for navigation
        await page.waitForTimeout(10000);

        // Verify signup was successful
        const isSuccessful = await signUpPage.isSignUpSuccessful();
        expect(isSuccessful).toBeTruthy();

        console.log('✅ Sign Up successful!');
    });
});
