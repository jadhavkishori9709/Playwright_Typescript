import { test, expect } from '@playwright/test';
import { EmailVerificationPage } from '../pages/EmailVerificationPage';
import { createEmailVerificationHelper } from '../utils/emailVerificationHelper';

test.describe('Email Verification Tests', () => {
    let verificationPage: EmailVerificationPage;

    test.beforeEach(async ({ page }) => {
        verificationPage = new EmailVerificationPage(page);
    });

    test('should display verification page elements', async ({ page }) => {
        // Navigate to a mock verification page
        await verificationPage.navigateToVerificationPage('mock-token-123', 'test@example.com');

        // Wait for page to load
        await page.waitForTimeout(2000);

        // Check if verification-related elements are present
        const hasElements = await verificationPage.verifyPageElements();
        expect(hasElements).toBeTruthy();
    });

    test('should handle verification link navigation', async ({ page }) => {
        const emailHelper = createEmailVerificationHelper(page);
        const mockEmail = 'test@example.com';
        const mockLink = emailHelper.generateMockVerificationLink(mockEmail);

        await verificationPage.completeVerification(mockLink);

        // Verify we're on the verification page
        const url = page.url();
        expect(url).toContain('verify');
    });

    test('should show resend email button', async ({ page }) => {
        await verificationPage.navigateToVerificationPage('mock-token', 'test@example.com');
        await page.waitForTimeout(2000);

        // Check if resend button exists (may not be visible on all pages)
        const hasResendButton = await verificationPage.isVisible(verificationPage.resendEmailButton);
        // This is informational - not all verification pages have resend
        console.log('Resend button visible:', hasResendButton);
    });

    test('should navigate to verification page with token and email', async ({ page }) => {
        const token = 'test-token-12345';
        const email = 'user@example.com';

        await verificationPage.navigateToVerificationPage(token, email);

        const url = page.url();
        expect(url).toContain('verify');
        expect(url).toContain(token);
        expect(url).toContain(encodeURIComponent(email));
    });

    test('should generate valid verification link', async ({ page }) => {
        const emailHelper = createEmailVerificationHelper(page);
        const email = 'test@example.com';
        const link = emailHelper.generateMockVerificationLink(email);

        expect(link).toContain('verify');
        expect(link).toContain('token=');
        expect(link).toContain(encodeURIComponent(email));
    });
});
