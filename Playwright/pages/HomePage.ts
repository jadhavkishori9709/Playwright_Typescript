import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly cartIcon: Locator;
    readonly signInButton: Locator;
    readonly categoriesMenu: Locator;
    readonly productCards: Locator;
    readonly categoryLinks: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.locator('input[placeholder*="Search" i]');
        this.searchButton = page.locator('button:has(.fa-search), .search-icon');
        this.cartIcon = page.locator('a[href*="cart"]');
        this.signInButton = page.locator('button:has-text("Sign In")');
        this.categoriesMenu = page.locator('.nav-link:has-text("Categories")');
        this.productCards = page.locator('.product-card, .gift-card');
        this.categoryLinks = page.locator('.category-item, a[href*="category"]');
    }

    async navigateToHome() {
        console.log('🏠 Navigating to Home Page');
        await this.goto('/');
        await this.acceptCookies();
        await this.waitForPageLoad();
    }

    async searchForProduct(productName: string) {
        console.log(`🔍 Searching for: ${productName}`);
        await this.searchInput.fill(productName);
        await this.searchInput.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    async clickProduct(index: number = 0) {
        console.log(`📦 Clicking product index: ${index}`);
        await this.productCards.nth(index).click();
    }

    async getProductTitle(index: number = 0): Promise<string> {
        return await this.productCards.nth(index).locator('h3, .product-title').innerText();
    }

    async navigateToCategory(categoryName: string) {
        console.log(`📂 Navigating to category: ${categoryName}`);
        await this.categoryLinks.filter({ hasText: categoryName }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async isLogoVisible(): Promise<boolean> {
        return await this.page.locator('img[alt*="Logo" i], .navbar-brand').isVisible();
    }
}
