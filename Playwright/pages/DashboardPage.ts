import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage - Handles dashboard and main application interactions
 */
export class DashboardPage extends BasePage {
    // Header/Navigation Elements
    readonly userProfileButton: Locator;
    readonly userProfileMenu: Locator;
    readonly logoutButton: Locator;
    readonly userNameDisplay: Locator;

    // Dashboard Elements
    readonly dashboardTitle: Locator;
    readonly welcomeMessage: Locator;

    // Navigation Menu Items
    readonly recipientsTab: Locator;
    readonly giftsTab: Locator;
    readonly settingsTab: Locator;

    constructor(page: Page) {
        super(page);

        // Initialize Header/Navigation Elements
        this.userProfileButton = page.locator('[data-testid="user-profile"], .user-profile, button:has-text("Profile")').first();
        this.userProfileMenu = page.locator('[data-testid="user-menu"], .user-menu, .dropdown-menu').first();
        this.logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")').first();
        this.userNameDisplay = page.locator('[data-testid="user-name"], .user-name').first();

        // Initialize Dashboard Elements
        this.dashboardTitle = page.locator('h1, h2').first();
        this.welcomeMessage = page.locator('text=/welcome/i').first();

        // Initialize Navigation Menu
        this.recipientsTab = page.locator('a:has-text("Recipients"), button:has-text("Recipients")').first();
        this.giftsTab = page.locator('a:has-text("Gifts"), button:has-text("Gifts")').first();
        this.settingsTab = page.locator('a:has-text("Settings"), button:has-text("Settings")').first();
    }

    /**
     * Navigate to dashboard
     */
    async navigateToDashboard() {
        await this.goto('/dashboard');
    }

    /**
     * Click user profile button
     */
    async clickUserProfile() {
        await this.click(this.userProfileButton);
        await this.waitForVisible(this.userProfileMenu);
    }

    /**
     * Logout from the application
     */
    async logout() {
        await this.clickUserProfile();
        await this.click(this.logoutButton);
    }

    /**
     * Get displayed user name
     * @returns User name text
     */
    async getUserName(): Promise<string> {
        return await this.getText(this.userNameDisplay);
    }

    /**
     * Check if user is logged in (dashboard is visible)
     * @returns True if logged in
     */
    async isLoggedIn(): Promise<boolean> {
        // Check if we're on dashboard page or if user profile is visible
        const url = this.getCurrentUrl();
        const isDashboardUrl = url.includes('/dashboard') || url.includes('/app');
        const isProfileVisible = await this.isVisible(this.userProfileButton);

        return isDashboardUrl || isProfileVisible;
    }

    /**
     * Navigate to Recipients tab
     */
    async navigateToRecipients() {
        await this.click(this.recipientsTab);
    }

    /**
     * Navigate to Gifts tab
     */
    async navigateToGifts() {
        await this.click(this.giftsTab);
    }

    /**
     * Navigate to Settings tab
     */
    async navigateToSettings() {
        await this.click(this.settingsTab);
    }

    /**
     * Verify dashboard page is loaded
     */
    async verifyDashboardLoaded() {
        await this.waitForPageLoad();

        // Wait for either dashboard title or user profile to be visible
        await this.page.waitForSelector(
            'h1, h2, [data-testid="user-profile"], .user-profile',
            { timeout: 10000 }
        );
    }

    /**
     * Get welcome message
     * @returns Welcome message text
     */
    async getWelcomeMessage(): Promise<string> {
        if (await this.isVisible(this.welcomeMessage)) {
            return await this.getText(this.welcomeMessage);
        }
        return '';
    }

    /**
     * Check if specific tab is visible
     * @param tabName - Name of the tab (recipients, gifts, settings)
     * @returns True if tab is visible
     */
    async isTabVisible(tabName: string): Promise<boolean> {
        const tabMap: { [key: string]: Locator } = {
            'recipients': this.recipientsTab,
            'gifts': this.giftsTab,
            'settings': this.settingsTab
        };

        const tab = tabMap[tabName.toLowerCase()];
        if (!tab) {
            return false;
        }

        return await this.isVisible(tab);
    }
}
