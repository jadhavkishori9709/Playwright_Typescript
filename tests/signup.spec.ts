import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { generateRandomUserData } from '../utils/testHelpers';

test.describe('Sign Up Tests', () => {
    let loginPage: LoginPage;
    let userData: ReturnType<typeof generateRandomUserData>;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        userData = generateRandomUserData();
        await loginPage.navigateToHome();
    });

    test('should display sign up form when clicking Sign In button and switching to Sign Up', async () => {
        await loginPage.clickSignInButton();
        expect(await loginPage.isSignInModalVisible()).toBeTruthy();

        await loginPage.switchToSignUp();
        expect(await loginPage.isSignUpModalVisible()).toBeTruthy();

        await loginPage.verifySignUpFormElements();
    });

    test('should successfully sign up with valid credentials', async ({ page }) => {
        await loginPage.completeSignUp(
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.password
        );

        // Wait for navigation or success message
        // This will depend on your application's behavior after signup
        await page.waitForTimeout(2000);

        // Verify we're redirected or see a success message
        const url = page.url();
        const hasRedirected = url.includes('verify') || url.includes('dashboard') || url.includes('email');
        expect(hasRedirected).toBeTruthy();
    });

    test('should show validation error for invalid email', async ({ page }) => {
        await loginPage.clickSignInButton();
        await loginPage.switchToSignUp();

        await loginPage.signUp(
            userData.firstName,
            userData.lastName,
            'invalid-email',
            userData.password
        );

        // Check for error message or that form is still visible
        await page.waitForTimeout(1000);
        expect(await loginPage.isSignUpModalVisible()).toBeTruthy();
    });

    test('should show validation error for weak password', async ({ page }) => {
        await loginPage.clickSignInButton();
        await loginPage.switchToSignUp();

        await loginPage.signUp(
            userData.firstName,
            userData.lastName,
            userData.email,
            '123' // Weak password
        );

        // Check for error message or that form is still visible
        await page.waitForTimeout(1000);
        expect(await loginPage.isSignUpModalVisible()).toBeTruthy();
    });

    test('should switch between Sign In and Sign Up modals', async () => {
        await loginPage.clickSignInButton();
        expect(await loginPage.isSignInModalVisible()).toBeTruthy();

        await loginPage.switchToSignUp();
        expect(await loginPage.isSignUpModalVisible()).toBeTruthy();
        expect(await loginPage.isSignInModalVisible()).toBeFalsy();

        await loginPage.switchToSignIn();
        expect(await loginPage.isSignInModalVisible()).toBeTruthy();
        expect(await loginPage.isSignUpModalVisible()).toBeFalsy();
    });

    test('should display all required form fields', async () => {
        await loginPage.clickSignInButton();
        await loginPage.switchToSignUp();

        await loginPage.verifySignUpFormElements();

        // Verify all fields are visible
        expect(await loginPage.isVisible(loginPage.signUpFirstNameInput)).toBeTruthy();
        expect(await loginPage.isVisible(loginPage.signUpLastNameInput)).toBeTruthy();
        expect(await loginPage.isVisible(loginPage.signUpEmailInput)).toBeTruthy();
        expect(await loginPage.isVisible(loginPage.signUpPasswordInput)).toBeTruthy();
        expect(await loginPage.isVisible(loginPage.signUpSubmitButton)).toBeTruthy();
    });
});
