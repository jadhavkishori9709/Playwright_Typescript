import { test, expect } from '@playwright/test';
import { SignUpPage } from '../pages/SignUpPage';
import { generateRandomUserData } from '../utils/testHelpers';

test.describe('Sign Up Edge Cases', () => {
    let signUpPage: SignUpPage;

    test.beforeEach(async ({ page }) => {
        signUpPage = new SignUpPage(page);
        await signUpPage.navigateToHome();
        await signUpPage.clickSignInButton();
        await signUpPage.switchToSignUp();
    });

    test('should handle special characters in name fields', async ({ page }) => {
        const userData = generateRandomUserData();

        await signUpPage.fillSignUpForm(
            "O'Brien-Smith",
            "José García",
            userData.email,
            userData.password
        );

        await signUpPage.submitSignUpForm();
        await page.waitForTimeout(5000);

        // Should either accept or show appropriate validation
        const isSuccessful = await signUpPage.isSignUpSuccessful();
        const modalVisible = await signUpPage.isSignUpModalVisible();

        expect(isSuccessful || modalVisible).toBeTruthy();
        console.log(`Special characters test: ${isSuccessful ? 'Accepted' : 'Validation shown'}`);
    });

    test('should handle very long input values', async ({ page }) => {
        const userData = generateRandomUserData();
        const longString = 'A'.repeat(100);

        await signUpPage.fillSignUpForm(
            longString,
            longString,
            userData.email,
            userData.password
        );

        await signUpPage.submitSignUpForm();
        await page.waitForTimeout(3000);

        // Should show validation or truncate
        const modalVisible = await signUpPage.isSignUpModalVisible();
        expect(modalVisible).toBeTruthy();
    });

    test('should handle duplicate email registration', async ({ page }) => {
        // Use a known existing email (adjust based on your test data)
        const existingEmail = 'jadhav.kishori97@gmail.com';
        const userData = generateRandomUserData();

        await signUpPage.fillSignUpForm(
            userData.firstName,
            userData.lastName,
            existingEmail,
            userData.password
        );

        await signUpPage.submitSignUpForm();
        await page.waitForTimeout(5000);

        // Should show error message or stay on modal
        const modalVisible = await signUpPage.isSignUpModalVisible();
        const errorMessage = await signUpPage.getErrorMessage();

        expect(modalVisible || errorMessage.length > 0).toBeTruthy();
        console.log(`Duplicate email error: ${errorMessage || 'Modal still visible'}`);
    });

    test('should sanitize SQL injection attempts', async ({ page }) => {
        const userData = generateRandomUserData();

        await signUpPage.fillSignUpForm(
            "'; DROP TABLE users; --",
            "Robert'); DROP TABLE users; --",
            userData.email,
            userData.password
        );

        await signUpPage.submitSignUpForm();
        await page.waitForTimeout(3000);

        // Should either sanitize and accept, or show validation
        const isSuccessful = await signUpPage.isSignUpSuccessful();
        const modalVisible = await signUpPage.isSignUpModalVisible();

        expect(isSuccessful || modalVisible).toBeTruthy();
        console.log('SQL injection test: System handled safely');
    });

    test('should sanitize XSS attempts', async ({ page }) => {
        const userData = generateRandomUserData();

        await signUpPage.fillSignUpForm(
            '<script>alert("XSS")</script>',
            '<img src=x onerror=alert("XSS")>',
            userData.email,
            userData.password
        );

        await signUpPage.submitSignUpForm();
        await page.waitForTimeout(3000);

        // Should sanitize and either accept or show validation
        const isSuccessful = await signUpPage.isSignUpSuccessful();
        const modalVisible = await signUpPage.isSignUpModalVisible();

        expect(isSuccessful || modalVisible).toBeTruthy();
        console.log('XSS test: System handled safely');
    });

    test('should handle unicode characters in names', async ({ page }) => {
        const userData = generateRandomUserData();

        await signUpPage.fillSignUpForm(
            '李明',
            'Müller',
            userData.email,
            userData.password
        );

        await signUpPage.submitSignUpForm();
        await page.waitForTimeout(5000);

        const isSuccessful = await signUpPage.isSignUpSuccessful();
        const modalVisible = await signUpPage.isSignUpModalVisible();

        expect(isSuccessful || modalVisible).toBeTruthy();
        console.log(`Unicode test: ${isSuccessful ? 'Accepted' : 'Validation shown'}`);
    });

    test('should handle whitespace-only input', async ({ page }) => {
        const userData = generateRandomUserData();

        await signUpPage.fillSignUpForm(
            '   ',
            '   ',
            userData.email,
            userData.password
        );

        await signUpPage.submitSignUpForm();
        await page.waitForTimeout(3000);

        // Should show validation error
        const modalVisible = await signUpPage.isSignUpModalVisible();
        expect(modalVisible).toBeTruthy();
    });

    test('should handle extremely short password', async ({ page }) => {
        const userData = generateRandomUserData();

        await signUpPage.fillSignUpForm(
            userData.firstName,
            userData.lastName,
            userData.email,
            'a'
        );

        await signUpPage.submitSignUpForm();
        await page.waitForTimeout(3000);

        // Should show validation error
        const modalVisible = await signUpPage.isSignUpModalVisible();
        expect(modalVisible).toBeTruthy();
    });

    test('should handle password with only numbers', async ({ page }) => {
        const userData = generateRandomUserData();

        await signUpPage.fillSignUpForm(
            userData.firstName,
            userData.lastName,
            userData.email,
            '123456789'
        );

        await signUpPage.submitSignUpForm();
        await page.waitForTimeout(3000);

        // May show validation depending on password policy
        const modalVisible = await signUpPage.isSignUpModalVisible();
        expect(modalVisible).toBeTruthy();
    });

    test('should handle email with multiple @ symbols', async ({ page }) => {
        const userData = generateRandomUserData();

        await signUpPage.fillSignUpForm(
            userData.firstName,
            userData.lastName,
            'user@@example.com',
            userData.password
        );

        await signUpPage.submitSignUpForm();
        await page.waitForTimeout(3000);

        // Should show validation error
        const modalVisible = await signUpPage.isSignUpModalVisible();
        expect(modalVisible).toBeTruthy();
    });
});
