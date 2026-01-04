import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { EmailVerificationPage } from '../pages/EmailVerificationPage';
import { DashboardPage } from '../pages/DashboardPage';
import { generateRandomUserData } from '../utils/testHelpers';
import { saveUserCredentials, getVerifiedUser } from '../utils/credentialManager';
import { createEmailVerificationHelper } from '../utils/emailVerificationHelper';

test.describe('End-to-End User Flow Tests', () => {

    test('Complete first-time user journey: Signup → Verify → SignIn → Dashboard', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const verificationPage = new EmailVerificationPage(page);
        const dashboardPage = new DashboardPage(page);
        const emailHelper = createEmailVerificationHelper(page);

        // Generate random user data
        const userData = generateRandomUserData();

        // Step 1: Sign Up
        await loginPage.completeSignUp(
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.password
        );

        // Wait for signup to complete
        await page.waitForTimeout(3000);

        // Step 2: Email Verification (Mock)
        // In a real scenario, you would fetch the verification link from email service
        const verificationLink = emailHelper.generateMockVerificationLink(userData.email);
        await verificationPage.completeVerification(verificationLink);

        // Wait for verification
        await page.waitForTimeout(2000);

        // Save verified user credentials
        saveUserCredentials({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            isVerified: true,
            createdAt: new Date().toISOString()
        });

        // Step 3: Sign In with verified credentials
        await loginPage.completeSignIn(userData.email, userData.password);

        // Wait for sign in
        await page.waitForTimeout(3000);

        // Step 4: Verify Dashboard Access
        const isLoggedIn = await dashboardPage.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
    });

    test('Existing user journey: SignIn → Dashboard', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        // Get a verified user
        const verifiedUser = getVerifiedUser();

        if (!verifiedUser) {
            console.log('No verified user found. Run the first-time user journey test first.');
            test.skip();
            return;
        }

        // Step 1: Sign In
        await loginPage.completeSignIn(verifiedUser.email, verifiedUser.password);

        // Wait for sign in
        await page.waitForTimeout(3000);

        // Step 2: Verify Dashboard Access
        const isLoggedIn = await dashboardPage.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
    });

    test('Complete user flow with logout', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        const verifiedUser = getVerifiedUser();

        if (!verifiedUser) {
            test.skip();
            return;
        }

        // Sign In
        await loginPage.completeSignIn(verifiedUser.email, verifiedUser.password);
        await page.waitForTimeout(3000);

        // Verify logged in
        expect(await dashboardPage.isLoggedIn()).toBeTruthy();

        // Logout
        await dashboardPage.logout();
        await page.waitForTimeout(2000);

        // Verify logged out (should be back on home page or login page)
        const url = page.url();
        const isLoggedOut = !url.includes('dashboard') || url.includes('login');
        expect(isLoggedOut).toBeTruthy();
    });
});
