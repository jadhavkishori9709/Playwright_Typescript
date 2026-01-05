import { Page } from '@playwright/test';

/**
 * Email Verification Helper
 * Provides utilities for handling email verification in tests
 */

export interface VerificationEmailService {
    /**
     * Get verification link from email
     * @param email - Email address to check
     * @returns Verification link or null
     */
    getVerificationLink(email: string): Promise<string | null>;
}

/**
 * Mock Email Service for Testing
 * In production, replace with real email service (Gmail API, Mailinator, etc.)
 */
export class MockEmailService implements VerificationEmailService {
    async getVerificationLink(email: string): Promise<string | null> {
        console.log(`📧 Checking email for: ${email}`);

        // In real implementation, you would:
        // 1. Connect to email service (Gmail API, Mailinator, etc.)
        // 2. Fetch latest email
        // 3. Parse email content
        // 4. Extract verification link

        // For now, return a mock link
        // Replace this with actual email service integration
        return `https://dev.giftsai.com/verify-email?token=mock-token-${Date.now()}&email=${encodeURIComponent(email)}`;
    }
}

/**
 * Complete email verification flow
 * @param page - Playwright page
 * @param email - User email
 */
export async function completeEmailVerification(page: Page, email: string): Promise<boolean> {
    console.log('\n📧 Starting Email Verification Process...');

    const emailService = new MockEmailService();

    // Get verification link from email
    const verificationLink = await emailService.getVerificationLink(email);

    if (!verificationLink) {
        console.log('❌ No verification link found');
        return false;
    }

    console.log(`✅ Verification link found: ${verificationLink}`);

    // Click verification link
    console.log('🔗 Clicking verification link...');
    await page.goto(verificationLink);
    await page.waitForTimeout(3000);

    // Check if verification was successful
    const currentUrl = page.url();
    const isVerified = currentUrl.includes('verified') ||
        currentUrl.includes('success') ||
        !currentUrl.includes('verify');

    if (isVerified) {
        console.log('✅ Email verified successfully!');
        return true;
    } else {
        console.log('⚠️  Verification may have failed');
        return false;
    }
}

/**
 * Solution 3: Use Pre-Verified Test Users
 * Store verified test users for quick testing
 */
export const VERIFIED_TEST_USERS = [
    {
        email: 'test.user1@giftsai.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User1'
    },
    {
        email: 'test.user2@giftsai.com',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User2'
    }
];

/**
 * Get a verified test user
 * @param index - User index (0-based)
 */
export function getVerifiedTestUser(index: number = 0) {
    return VERIFIED_TEST_USERS[index] || VERIFIED_TEST_USERS[0];
}
