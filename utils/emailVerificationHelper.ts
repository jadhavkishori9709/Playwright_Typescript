import { Page } from '@playwright/test';

/**
 * Mock email service for testing
 * In a real scenario, you would integrate with services like Mailosaur, Mailtrap, etc.
 */
export class EmailVerificationHelper {
    private page: Page;
    private mockVerificationLinks: Map<string, string> = new Map();

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Mock: Store a verification link for an email
     * In production, this would fetch from an actual email service
     * @param email - User email
     * @param verificationLink - The verification link
     */
    mockStoreVerificationLink(email: string, verificationLink: string): void {
        this.mockVerificationLinks.set(email, verificationLink);
    }

    /**
     * Mock: Get verification link for an email
     * In production, this would fetch from an actual email service API
     * @param email - User email
     * @returns Verification link or null
     */
    getMockVerificationLink(email: string): string | null {
        return this.mockVerificationLinks.get(email) || null;
    }

    /**
     * Navigate to verification link
     * @param verificationLink - The verification link to navigate to
     */
    async navigateToVerificationLink(verificationLink: string): Promise<void> {
        await this.page.goto(verificationLink);
    }

    /**
     * Extract verification link from page content
     * This is useful if the verification link is displayed on the page
     * @returns Verification link or null
     */
    async extractVerificationLinkFromPage(): Promise<string | null> {
        try {
            // Look for common verification link patterns
            const linkLocator = this.page.locator('a[href*="verify"], a[href*="confirmation"], a[href*="activate"]').first();
            const href = await linkLocator.getAttribute('href');
            return href;
        } catch {
            return null;
        }
    }

    /**
     * Mock: Simulate clicking verification link from email
     * In production, this would:
     * 1. Connect to email service API
     * 2. Fetch the latest email for the user
     * 3. Extract the verification link
     * 4. Navigate to it
     * @param email - User email
     */
    async clickVerificationLinkFromEmail(email: string): Promise<boolean> {
        const link = this.getMockVerificationLink(email);

        if (!link) {
            console.log(`No verification link found for ${email}`);
            return false;
        }

        await this.navigateToVerificationLink(link);
        return true;
    }

    /**
     * Wait for verification email (mock)
     * In production, this would poll the email service API
     * @param email - User email
     * @param timeoutMs - Timeout in milliseconds
     * @returns True if email received, false otherwise
     */
    async waitForVerificationEmail(email: string, timeoutMs: number = 30000): Promise<boolean> {
        const startTime = Date.now();

        while (Date.now() - startTime < timeoutMs) {
            if (this.mockVerificationLinks.has(email)) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return false;
    }

    /**
     * Clear mock verification links
     */
    clearMockLinks(): void {
        this.mockVerificationLinks.clear();
    }

    /**
     * Generate a mock verification link
     * @param email - User email
     * @param token - Verification token
     * @returns Mock verification link
     */
    generateMockVerificationLink(email: string, token?: string): string {
        const verificationToken = token || this.generateRandomToken();
        const baseUrl = process.env.BASE_URL || 'https://dev.giftsai.com';
        return `${baseUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    }

    /**
     * Generate a random verification token
     * @returns Random token string
     */
    private generateRandomToken(): string {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }
}

/**
 * Create an instance of EmailVerificationHelper
 * @param page - Playwright page object
 * @returns EmailVerificationHelper instance
 */
export function createEmailVerificationHelper(page: Page): EmailVerificationHelper {
    return new EmailVerificationHelper(page);
}
