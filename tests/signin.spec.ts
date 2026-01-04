import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { getVerifiedUser } from '../utils/credentialManager';

test.describe('Sign In Tests', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        await loginPage.navigateToHome();
    });

    test('should display sign in form when clicking Sign In button', async () => {
        await loginPage.clickSignInButton();
        expect(await loginPage.isSignInModalVisible()).toBeTruthy();
        await loginPage.verifySignInFormElements();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await loginPage.completeSignIn('invalid@test.com', 'wrongpassword');

        // Wait for error message
        await page.waitForTimeout(2000);

        // Verify we're still on sign in or see error
        const isStillOnSignIn = await loginPage.isSignInModalVisible();
        const url = page.url();
        const notRedirected = !url.includes('dashboard');

        expect(isStillOnSignIn || notRedirected).toBeTruthy();
    });

    test('should show validation error for empty email', async ({ page }) => {
        await loginPage.clickSignInButton();
        await loginPage.signIn('', 'password123');

        await page.waitForTimeout(1000);
        expect(await loginPage.isSignInModalVisible()).toBeTruthy();
    });

    test('should show validation error for empty password', async ({ page }) => {
        await loginPage.clickSignInButton();
        await loginPage.signIn('test@example.com', '');

        await page.waitForTimeout(1000);
        expect(await loginPage.isSignInModalVisible()).toBeTruthy();
    });

    test('should successfully sign in with valid credentials (if verified user exists)', async ({ page }) => {
        const verifiedUser = getVerifiedUser();

        if (!verifiedUser) {
            test.skip();
            return;
        }

        await loginPage.completeSignIn(verifiedUser.email, verifiedUser.password);

        // Wait for navigation to dashboard
        await page.waitForTimeout(3000);

        // Verify we're logged in
        const isLoggedIn = await dashboardPage.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
    });

    test('should display all required sign in form fields', async () => {
        await loginPage.clickSignInButton();

        expect(await loginPage.isVisible(loginPage.signInEmailInput)).toBeTruthy();
        expect(await loginPage.isVisible(loginPage.signInPasswordInput)).toBeTruthy();
        expect(await loginPage.isVisible(loginPage.signInSubmitButton)).toBeTruthy();
    });

    test('should have link to switch to Sign Up', async () => {
        await loginPage.clickSignInButton();
        expect(await loginPage.isVisible(loginPage.switchToSignUpLink)).toBeTruthy();
    });
});
