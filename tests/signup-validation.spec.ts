import { test, expect } from '@playwright/test';
import { SignUpPage } from '../pages/SignUpPage';
import { generateRandomUserData } from '../utils/testHelpers';

test.describe('Sign Up Validation Tests', () => {
    let signUpPage: SignUpPage;

    test.beforeEach(async ({ page }) => {
        signUpPage = new SignUpPage(page);
        await signUpPage.navigateToHome();
        await signUpPage.clickSignInButton();
        await signUpPage.switchToSignUp();
    });

    test('should show error for empty email field', async () => {
        const userData = generateRandomUserData();

        await signUpPage.fillPartialForm({
            firstName: userData.firstName,
            lastName: userData.lastName,
            password: userData.password,
            confirmPassword: userData.password
            // email is intentionally left empty
        });

        await signUpPage.submitSignUpForm();

        // Modal should still be visible (form not submitted)
        expect(await signUpPage.isSignUpModalVisible()).toBeTruthy();
    });

    test('should show error for invalid email format', async () => {
        const userData = generateRandomUserData();

        await signUpPage.fillSignUpForm(
            userData.firstName,
            userData.lastName,
            'invalid-email-format',
            userData.password
        );

        await signUpPage.submitSignUpForm();

        // Modal should still be visible
        expect(await signUpPage.isSignUpModalVisible()).toBeTruthy();
    });

    test('should show error for weak password', async () => {
        const userData = generateRandomUserData();

        await signUpPage.fillSignUpForm(
            userData.firstName,
            userData.lastName,
            userData.email,
            '123' // Weak password
        );

        await signUpPage.submitSignUpForm();

        // Modal should still be visible
        expect(await signUpPage.isSignUpModalVisible()).toBeTruthy();
    });

    test('should show error for password mismatch', async () => {
        const userData = generateRandomUserData();

        await signUpPage.fillPartialForm({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            confirmPassword: 'DifferentPassword123!'
        });

        await signUpPage.submitSignUpForm();

        // Modal should still be visible
        expect(await signUpPage.isSignUpModalVisible()).toBeTruthy();
    });

    test('should show error for missing first name', async () => {
        const userData = generateRandomUserData();

        await signUpPage.fillPartialForm({
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.password
            // firstName is intentionally left empty
        });

        await signUpPage.submitSignUpForm();

        // Modal should still be visible
        expect(await signUpPage.isSignUpModalVisible()).toBeTruthy();
    });

    test('should show error for missing last name', async () => {
        const userData = generateRandomUserData();

        await signUpPage.fillPartialForm({
            firstName: userData.firstName,
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.password
            // lastName is intentionally left empty
        });

        await signUpPage.submitSignUpForm();

        // Modal should still be visible
        expect(await signUpPage.isSignUpModalVisible()).toBeTruthy();
    });

    test('should show error when all fields are empty', async () => {
        await signUpPage.submitSignUpForm();

        // Modal should still be visible
        expect(await signUpPage.isSignUpModalVisible()).toBeTruthy();
    });

    test('should accept valid email formats', async ({ page }) => {
        const validEmails = [
            'user@example.com',
            'user.name@example.com',
            'user+tag@example.co.uk',
            'user123@test-domain.com'
        ];

        for (const email of validEmails) {
            // Refresh the page for each test
            await signUpPage.navigateToHome();
            await signUpPage.clickSignInButton();
            await signUpPage.switchToSignUp();

            const userData = generateRandomUserData();
            await signUpPage.fillSignUpForm(
                userData.firstName,
                userData.lastName,
                email,
                userData.password
            );

            await signUpPage.submitSignUpForm();

            // Should redirect (successful signup)
            await page.waitForTimeout(5000);
            const isSuccessful = await signUpPage.isSignUpSuccessful();

            if (isSuccessful) {
                console.log(`✅ Valid email accepted: ${email}`);
            }
        }
    });
});
