import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage - Handles Sign In and Sign Up modal interactions
 */
export class LoginPage extends BasePage {
    // Sign In Button on main page
    readonly signInButton: Locator;

    // Sign In Modal Elements
    readonly signInModal: Locator;
    readonly signInEmailInput: Locator;
    readonly signInPasswordInput: Locator;
    readonly signInSubmitButton: Locator;
    readonly signInErrorMessage: Locator;
    readonly switchToSignUpLink: Locator;

    // Sign Up Modal Elements
    readonly signUpModal: Locator;
    readonly signUpFirstNameInput: Locator;
    readonly signUpLastNameInput: Locator;
    readonly signUpEmailInput: Locator;
    readonly signUpPasswordInput: Locator;
    readonly signUpConfirmPasswordInput: Locator;
    readonly signUpSubmitButton: Locator;
    readonly signUpErrorMessage: Locator;
    readonly switchToSignInLink: Locator;

    // Common Modal Elements
    readonly modalCloseButton: Locator;
    readonly modalTitle: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize Sign In Button
        this.signInButton = page.locator('button:has-text("Sign In"), a:has-text("Sign In")').first();

        // Initialize Sign In Modal Elements
        this.signInModal = page.locator('[data-testid="signin-modal"], .signin-modal, div:has(h2:text("Sign In"))').first();
        this.signInEmailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
        this.signInPasswordInput = page.locator('input[type="password"], input[name="password"]').first();
        this.signInSubmitButton = page.locator('button[type="submit"]:has-text("Sign In"), button:has-text("Log In")').first();
        this.signInErrorMessage = page.locator('.error-message, [role="alert"], .alert-error').first();
        this.switchToSignUpLink = page.locator('a:has-text("Sign Up"), button:has-text("Sign Up instead")').first();

        // Initialize Sign Up Modal Elements
        this.signUpModal = page.locator('[data-testid="signup-modal"], .signup-modal, div:has(h2:text("Sign Up"))').first();
        this.signUpFirstNameInput = page.locator('input[name="firstName"], input[placeholder*="first name" i]').first();
        this.signUpLastNameInput = page.locator('input[name="lastName"], input[placeholder*="last name" i]').first();
        this.signUpEmailInput = page.locator('input[type="email"], input[name="email"]').first();
        this.signUpPasswordInput = page.locator('input[type="password"], input[name="password"]').first();
        this.signUpConfirmPasswordInput = page.locator('input[name="confirmPassword"], input[placeholder*="confirm password" i]').first();
        this.signUpSubmitButton = page.locator('button[type="submit"]:has-text("Sign Up"), button:has-text("Create Account")').first();
        this.signUpErrorMessage = page.locator('.error-message, [role="alert"], .alert-error').first();
        this.switchToSignInLink = page.locator('a:has-text("Sign In"), button:has-text("Sign In instead")').first();

        // Common Modal Elements
        this.modalCloseButton = page.locator('button[aria-label="Close"], .modal-close, button:has-text("×")').first();
        this.modalTitle = page.locator('h1, h2, h3').first();
    }

    /**
     * Navigate to the home page
     */
    async navigateToHome() {
        await this.goto('/');
        await this.page.waitForLoadState('networkidle');
        // Automatically accept cookies if banner appears
        await this.acceptCookies();
    }

    /**
     * Click the Sign In button to open the modal
     */
    async clickSignInButton() {
        await this.click(this.signInButton);
        await this.waitForVisible(this.signInModal);
    }

    /**
     * Perform sign in
     * @param email - User email
     * @param password - User password
     */
    async signIn(email: string, password: string) {
        await this.fill(this.signInEmailInput, email);
        await this.fill(this.signInPasswordInput, password);
        await this.click(this.signInSubmitButton);
    }

    /**
     * Complete sign in flow from home page
     * @param email - User email
     * @param password - User password
     */
    async completeSignIn(email: string, password: string) {
        await this.navigateToHome();
        await this.page.waitForTimeout(1000); // Wait for cookie banner
        await this.clickSignInButton();
        await this.signIn(email, password);
    }

    /**
     * Switch from Sign In to Sign Up modal
     */
    async switchToSignUp() {
        await this.click(this.switchToSignUpLink);
        await this.waitForVisible(this.signUpModal);
    }

    /**
     * Switch from Sign Up to Sign In modal
     */
    async switchToSignIn() {
        await this.click(this.switchToSignInLink);
        await this.waitForVisible(this.signInModal);
    }

    /**
     * Perform sign up
     * @param firstName - User first name
     * @param lastName - User last name
     * @param email - User email
     * @param password - User password
     */
    async signUp(firstName: string, lastName: string, email: string, password: string) {
        await this.fill(this.signUpFirstNameInput, firstName);
        await this.fill(this.signUpLastNameInput, lastName);
        await this.fill(this.signUpEmailInput, email);
        await this.fill(this.signUpPasswordInput, password);

        // Fill confirm password if it exists
        if (await this.isVisible(this.signUpConfirmPasswordInput)) {
            await this.fill(this.signUpConfirmPasswordInput, password);
        }

        await this.click(this.signUpSubmitButton);
    }

    /**
     * Complete sign up flow from home page
     * @param firstName - User first name
     * @param lastName - User last name
     * @param email - User email
     * @param password - User password
     */
    async completeSignUp(firstName: string, lastName: string, email: string, password: string) {
        await this.navigateToHome();
        await this.clickSignInButton();
        await this.switchToSignUp();
        await this.signUp(firstName, lastName, email, password);
    }

    /**
     * Get sign in error message
     * @returns Error message text
     */
    async getSignInErrorMessage(): Promise<string> {
        return await this.getText(this.signInErrorMessage);
    }

    /**
     * Get sign up error message
     * @returns Error message text
     */
    async getSignUpErrorMessage(): Promise<string> {
        return await this.getText(this.signUpErrorMessage);
    }

    /**
     * Check if Sign In modal is visible
     * @returns True if visible
     */
    async isSignInModalVisible(): Promise<boolean> {
        return await this.isVisible(this.signInModal);
    }

    /**
     * Check if Sign Up modal is visible
     * @returns True if visible
     */
    async isSignUpModalVisible(): Promise<boolean> {
        return await this.isVisible(this.signUpModal);
    }

    /**
     * Close the modal
     */
    async closeModal() {
        if (await this.isVisible(this.modalCloseButton)) {
            await this.click(this.modalCloseButton);
        }
    }

    /**
     * Verify Sign In form elements are visible
     */
    async verifySignInFormElements() {
        await this.waitForVisible(this.signInEmailInput);
        await this.waitForVisible(this.signInPasswordInput);
        await this.waitForVisible(this.signInSubmitButton);
    }

    /**
     * Verify Sign Up form elements are visible
     */
    async verifySignUpFormElements() {
        await this.waitForVisible(this.signUpFirstNameInput);
        await this.waitForVisible(this.signUpLastNameInput);
        await this.waitForVisible(this.signUpEmailInput);
        await this.waitForVisible(this.signUpPasswordInput);
        await this.waitForVisible(this.signUpSubmitButton);
    }
}
