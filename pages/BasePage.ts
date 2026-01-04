import { Page, Locator } from '@playwright/test';

/**
 * BasePage class - Foundation for all page objects
 * Provides common methods and utilities for page interactions
 */
export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific path
     * @param path - The path to navigate to (relative to base URL)
     */
    async goto(path: string = '') {
        await this.page.goto(path);
    }

    /**
     * Wait for a specific locator to be visible
     * @param locator - The locator to wait for
     * @param timeout - Optional timeout in milliseconds
     */
    async waitForVisible(locator: Locator, timeout?: number) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    /**
     * Wait for a specific locator to be hidden
     * @param locator - The locator to wait for
     * @param timeout - Optional timeout in milliseconds
     */
    async waitForHidden(locator: Locator, timeout?: number) {
        await locator.waitFor({ state: 'hidden', timeout });
    }

    /**
     * Click an element with optional wait
     * @param locator - The locator to click
     */
    async click(locator: Locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    /**
     * Fill an input field
     * @param locator - The input locator
     * @param value - The value to fill
     */
    async fill(locator: Locator, value: string) {
        await locator.waitFor({ state: 'visible' });
        await locator.fill(value);
    }

    /**
     * Get text content from an element
     * @param locator - The locator to get text from
     * @returns The text content
     */
    async getText(locator: Locator): Promise<string> {
        await locator.waitFor({ state: 'visible' });
        return await locator.textContent() || '';
    }

    /**
     * Check if an element is visible
     * @param locator - The locator to check
     * @returns True if visible, false otherwise
     */
    async isVisible(locator: Locator): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Wait for page to load completely
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Take a screenshot
     * @param name - Name for the screenshot
     */
    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    }

    /**
     * Get current URL
     * @returns Current page URL
     */
    getCurrentUrl(): string {
        return this.page.url();
    }

    /**
     * Wait for navigation
     */
    async waitForNavigation() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Reload the current page
     */
    async reload() {
        await this.page.reload();
    }

    /**
     * Accept cookies banner if present
     * Handles common cookie consent patterns
     */
    async acceptCookies() {
        try {
            console.log('🍪 Checking for cookie banner...');

            // Common cookie accept button selectors - expanded list
            const cookieSelectors = [
                'button:has-text("Accept")',
                'button:has-text("Accept All")',
                'button:has-text("Accept Cookies")',
                'button:has-text("I Accept")',
                'button:has-text("OK")',
                'button:has-text("Got it")',
                'button:has-text("Agree")',
                'button[id*="accept" i]',
                'button[class*="accept" i]',
                'button[id*="cookie" i]',
                'button[class*="cookie" i]',
                '.cookie-accept',
                '#cookie-accept',
                '[data-testid="cookie-accept"]',
                'a:has-text("Accept")',
                'a:has-text("Accept All")'
            ];

            // Try each selector with a longer timeout
            for (const selector of cookieSelectors) {
                try {
                    const button = this.page.locator(selector).first();
                    if (await button.isVisible({ timeout: 3000 })) {
                        console.log(`✅ Found cookie button with selector: ${selector}`);
                        await button.click();
                        console.log('✅ Clicked cookie accept button');

                        // Wait for the banner to disappear
                        await this.page.waitForTimeout(2000);
                        console.log('✅ Cookie banner dismissed');
                        return;
                    }
                } catch {
                    // Continue to next selector
                }
            }

            console.log('ℹ️  No cookie banner detected');
        } catch (error) {
            // No cookie banner found, continue
            console.log('ℹ️  No cookie banner found or error accepting cookies');
        }
    }
}
