import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * EmailVerificationPage - Handles email verification flow
 */
export class EmailVerificationPage extends BasePage {
    // Email Verification Page Elements
    readonly verificationMessage: Locator;
    readonly verificationSuccessMessage: Locator;
    readonly verificationErrorMessage: Locator;
    readonly resendEmailButton: Locator;
    readonly continueButton: Locator;
    readonly backToSignInLink: Locator;
    readonly emailSentMessage: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize Email Verification Elements
        this.verificationMessage = page.locator('text=/verify.*email/i, text=/check.*email/i').first();
        this.verificationSuccessMessage = page.locator('text=/email.*verified/i, text=/verification.*successful/i, .success-message').first();
        this.verificationErrorMessage = page.locator('text=/verification.*failed/i, text=/invalid.*link/i, .error-message').first();
        this.resendEmailButton = page.locator('button:has-text("Resend"), button:has-text("Send Again")').first();
        this.continueButton = page.locator('button:has-text("Continue"), button:has-text("Proceed"), a:has-text("Continue")').first();
        this.backToSignInLink = page.locator('a:has-text("Sign In"), a:has-text("Back to Sign In")').first();
        this.emailSentMessage = page.locator('text=/email.*sent/i, text=/check.*inbox/i').first();
    }

    /**
     * Navigate to verification page with token
     * @param token - Verification token
     * @param email - User email (optional)
     */
    async navigateToVerificationPage(token: string, email?: string) {
        let url = `/verify-email?token=${token}`;
        if (email) {
            url += `&email=${encodeURIComponent(email)}`;
        }
        await this.goto(url);
    }

    /**
     * Click resend verification email button
     */
    async clickResendEmail() {
        await this.click(this.resendEmailButton);
    }

    /**
     * Click continue button after successful verification
     */
    async clickContinue() {
        await this.click(this.continueButton);
    }

    /**
     * Click back to sign in link
     */
    async clickBackToSignIn() {
        await this.click(this.backToSignInLink);
    }

    /**
     * Check if verification was successful
     * @returns True if verification successful
     */
    async isVerificationSuccessful(): Promise<boolean> {
        return await this.isVisible(this.verificationSuccessMessage);
    }

    /**
     * Check if verification failed
     * @returns True if verification failed
     */
    async isVerificationFailed(): Promise<boolean> {
        return await this.isVisible(this.verificationErrorMessage);
    }

    /**
     * Get verification success message
     * @returns Success message text
     */
    async getSuccessMessage(): Promise<string> {
        return await this.getText(this.verificationSuccessMessage);
    }

    /**
     * Get verification error message
     * @returns Error message text
     */
    async getErrorMessage(): Promise<string> {
        return await this.getText(this.verificationErrorMessage);
    }

    /**
     * Check if email sent message is visible
     * @returns True if message is visible
     */
    async isEmailSentMessageVisible(): Promise<boolean> {
        return await this.isVisible(this.emailSentMessage);
    }

    /**
     * Wait for verification to complete
     * @param timeout - Timeout in milliseconds
     */
    async waitForVerificationComplete(timeout: number = 10000) {
        await this.page.waitForSelector(
            'text=/email.*verified/i, text=/verification.*failed/i',
            { timeout }
        );
    }

    /**
     * Verify email verification page elements
     */
    async verifyPageElements() {
        const hasMessage = await this.isVisible(this.verificationMessage);
        const hasResendButton = await this.isVisible(this.resendEmailButton);

        return hasMessage || hasResendButton;
    }

    /**
     * Complete verification flow
     * @param verificationLink - Full verification link
     */
    async completeVerification(verificationLink: string) {
        await this.page.goto(verificationLink);
        await this.waitForVerificationComplete();
    }
}
