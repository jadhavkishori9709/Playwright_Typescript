import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SignUpPage - Dedicated page object for Sign Up functionality
 * Handles all signup-related interactions and validations
 */
export class SignUpPage extends BasePage {
    // Main Sign In button to open modal
    readonly signInButton: Locator;

    // Sign Up Modal
    readonly signUpModal: Locator;
    readonly signUpModalTitle: Locator;

    // Form Fields
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;

    // Buttons
    readonly createAccountButton: Locator;
    readonly switchToSignInLink: Locator;
    readonly closeModalButton: Locator;

    // Error Messages
    readonly errorMessage: Locator;
    readonly firstNameError: Locator;
    readonly lastNameError: Locator;
    readonly emailError: Locator;
    readonly passwordError: Locator;
    readonly confirmPasswordError: Locator;

    // Success Indicators
    readonly successMessage: Locator;

    constructor(page: Page) {
        super(page);

        // Main button
        this.signInButton = page.locator('button:has-text("Sign In")').first();

        // Modal
        this.signUpModal = page.locator('[data-testid="signup-modal"], .signup-modal, div:has(h2:text("Sign Up"))').first();
        this.signUpModalTitle = page.locator('h1:has-text("Sign Up"), h2:has-text("Sign Up")').first();

        // Form fields - using IDs from simple-signup.spec.ts
        this.firstNameInput = page.locator('#Fname');
        this.lastNameInput = page.locator('#LName');
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.confirmPasswordInput = page.locator('#confirmPassword');

        // Buttons
        this.createAccountButton = page.locator('button:has-text("Create Account")');
        this.switchToSignInLink = page.locator('text=Sign In instead, button:has-text("Sign In instead")').first();
        this.closeModalButton = page.locator('button[aria-label="Close"], .modal-close, button:has-text("×")').first();

        // Error messages
        this.errorMessage = page.locator('.error-message, [role="alert"], .alert-error').first();
        this.firstNameError = page.locator('#Fname-error, [data-error-for="Fname"]').first();
        this.lastNameError = page.locator('#LName-error, [data-error-for="LName"]').first();
        this.emailError = page.locator('#email-error, [data-error-for="email"]').first();
        this.passwordError = page.locator('#password-error, [data-error-for="password"]').first();
        this.confirmPasswordError = page.locator('#confirmPassword-error, [data-error-for="confirmPassword"]').first();

        // Success
        this.successMessage = page.locator('.success-message, [role="status"], .alert-success').first();
    }

    /**
     * Navigate to the home page
     */
    async navigateToHome() {
        console.log('🏠 Navigating to home page');
        await this.page.goto('https://dev.giftsai.com/', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await this.acceptCookies();
    }

    /**
     * Click the Sign In button to open the modal
     */
    async clickSignInButton() {
        console.log('🔘 Clicking Sign In button');
        await this.signInButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.signInButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Switch to Sign Up form from Sign In modal
     */
    async switchToSignUp() {
        console.log('🔄 Switching to Sign Up form');
        const signUpButton = this.page.locator('button:has-text("Sign Up instead")').first();
        await signUpButton.waitFor({ state: 'visible', timeout: 10000 });
        await signUpButton.click();
        await this.page.waitForTimeout(2000);
        await this.firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
        console.log('✅ Switched to Sign Up form');
    }

    /**
     * Fill the signup form
     * @param firstName - User's first name
     * @param lastName - User's last name
     * @param email - User's email
     * @param password - User's password
     */
    async fillSignUpForm(firstName: string, lastName: string, email: string, password: string) {
        console.log('📝 Filling signup form');
        await this.fill(this.firstNameInput, firstName);
        await this.fill(this.lastNameInput, lastName);
        await this.fill(this.emailInput, email);
        await this.fill(this.passwordInput, password);
        await this.fill(this.confirmPasswordInput, password);
        console.log('✅ Form filled');
    }

    /**
     * Submit the signup form
     */
    async submitSignUpForm() {
        console.log('📤 Submitting signup form');
        await this.createAccountButton.click();
        await this.page.waitForTimeout(3000);
    }

    /**
     * Complete signup flow from home page
     * @param firstName - User's first name
     * @param lastName - User's last name
     * @param email - User's email
     * @param password - User's password
     */
    async completeSignUp(firstName: string, lastName: string, email: string, password: string) {
        await this.navigateToHome();
        await this.clickSignInButton();
        await this.switchToSignUp();
        await this.fillSignUpForm(firstName, lastName, email, password);
        await this.submitSignUpForm();
    }

    /**
     * Verify signup was successful by checking URL redirect
     * @returns True if redirected to verify/dashboard/email page
     */
    async isSignUpSuccessful(): Promise<boolean> {
        const currentUrl = this.getCurrentUrl();
        console.log(`📍 Current URL: ${currentUrl}`);
        const hasRedirected = currentUrl.includes('verify') ||
            currentUrl.includes('dashboard') ||
            currentUrl.includes('email');
        console.log(`✅ Signup successful: ${hasRedirected}`);
        return hasRedirected;
    }

    /**
     * Check if Sign Up modal is visible
     */
    async isSignUpModalVisible(): Promise<boolean> {
        try {
            await this.firstNameInput.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verify all signup form elements are visible
     */
    async verifySignUpFormElements() {
        console.log('🔍 Verifying signup form elements');
        await this.waitForVisible(this.firstNameInput);
        await this.waitForVisible(this.lastNameInput);
        await this.waitForVisible(this.emailInput);
        await this.waitForVisible(this.passwordInput);
        await this.waitForVisible(this.confirmPasswordInput);
        await this.waitForVisible(this.createAccountButton);
        console.log('✅ All form elements visible');
    }

    /**
     * Get error message text
     */
    async getErrorMessage(): Promise<string> {
        if (await this.isVisible(this.errorMessage)) {
            return await this.getText(this.errorMessage);
        }
        return '';
    }

    /**
     * Get field-specific error message
     */
    async getFieldError(field: 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword'): Promise<string> {
        const errorLocators = {
            firstName: this.firstNameError,
            lastName: this.lastNameError,
            email: this.emailError,
            password: this.passwordError,
            confirmPassword: this.confirmPasswordError
        };

        const locator = errorLocators[field];
        if (await this.isVisible(locator)) {
            return await this.getText(locator);
        }
        return '';
    }

    /**
     * Switch to Sign In modal
     */
    async switchToSignIn() {
        console.log('🔄 Switching to Sign In');
        await this.click(this.switchToSignInLink);
        await this.page.waitForTimeout(2000);
    }

    /**
     * Close the modal
     */
    async closeModal() {
        if (await this.isVisible(this.closeModalButton)) {
            await this.click(this.closeModalButton);
        }
    }

    /**
     * Fill only specific fields (for validation testing)
     */
    async fillPartialForm(fields: {
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }) {
        if (fields.firstName !== undefined) {
            await this.fill(this.firstNameInput, fields.firstName);
        }
        if (fields.lastName !== undefined) {
            await this.fill(this.lastNameInput, fields.lastName);
        }
        if (fields.email !== undefined) {
            await this.fill(this.emailInput, fields.email);
        }
        if (fields.password !== undefined) {
            await this.fill(this.passwordInput, fields.password);
        }
        if (fields.confirmPassword !== undefined) {
            await this.fill(this.confirmPasswordInput, fields.confirmPassword);
        }
    }

    /**
     * Check if a specific field is visible
     */
    async isFieldVisible(field: 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword'): Promise<boolean> {
        const fieldLocators = {
            firstName: this.firstNameInput,
            lastName: this.lastNameInput,
            email: this.emailInput,
            password: this.passwordInput,
            confirmPassword: this.confirmPasswordInput
        };

        return await this.isVisible(fieldLocators[field]);
    }
}
