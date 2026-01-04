import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Home Page & Search Verification (Week 1)', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigateToHome();
    });

    test('TC 1: Verify Homepage loads with essential elements', async () => {
        console.log('✅ Verifying homepage logo and search...');
        await expect(homePage.searchInput).toBeVisible();
        expect(await homePage.isLogoVisible()).toBeTruthy();
    });

    test('TC 12: Verify valid product search results', async ({ page }) => {
        const searchTerm = 'Gift';
        await homePage.searchForProduct(searchTerm);

        console.log('✅ Verifying search results for "Gift"...');
        const count = await homePage.productCards.count();
        expect(count).toBeGreaterThan(0);

        const firstProduct = await homePage.getProductTitle(0);
        console.log(`🎁 Found product: ${firstProduct}`);
        expect(firstProduct.toLowerCase()).toContain(searchTerm.toLowerCase());
    });

    test('TC 13: Verify search with no results', async () => {
        const invalidTerm = 'XYZABC123NonExistent';
        await homePage.searchForProduct(invalidTerm);

        console.log('✅ Verifying empty search results...');
        const bodyText = await homePage.page.locator('body').innerText();
        expect(bodyText.toLowerCase()).toContain('no');
        expect(bodyText.toLowerCase()).toContain('found');
    });

    test('TC 26: Verify category navigation', async () => {
        // Assuming there is a "Jewelry" or "Decor" category based on common e-commerce
        // We'll try to find an available category link
        const categoryLabel = await homePage.categoryLinks.first().innerText();
        console.log(`📂 Testing navigation for category: ${categoryLabel}`);

        await homePage.navigateToCategory(categoryLabel);
        expect(homePage.page.url()).toContain('category');
    });
});
