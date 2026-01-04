import { test, expect } from '@playwright/test';
import { ClaudeHelper } from '../utils/claudeHelper';

/**
 * Example: Using Claude AI to generate Page Object Model
 */
test('Example: Generate Page Object with Claude', async ({ page }) => {
    const claude = new ClaudeHelper();

    // Navigate to a page
    await page.goto('https://dev.giftsai.com');

    // Get page HTML
    const pageHtml = await page.content();

    // Generate Page Object Model using Claude
    const pageObjectCode = await claude.generatePageObject(pageHtml, 'HomePage');

    console.log('Generated Page Object Model:');
    console.log(pageObjectCode);
});

/**
 * Example: Generate test scenarios using Claude
 */
test('Example: Generate Test Scenarios', async ({ page }) => {
    const claude = new ClaudeHelper();

    await page.goto('https://dev.giftsai.com/dashboard');

    const pageContent = await page.content();

    // Ask Claude to suggest test scenarios
    const scenarios = await claude.generateTestScenarios(pageContent, 'Dashboard');

    console.log('Suggested Test Scenarios:');
    console.log(scenarios);
});

/**
 * Example: Analyze test failure with Claude
 */
test('Example: Analyze Test Failure', async () => {
    const claude = new ClaudeHelper();

    const errorMessage = 'Timeout 30000ms exceeded waiting for element to be visible';
    const testCode = `
    await page.click('#submit-button');
    await expect(page.locator('.success-message')).toBeVisible();
  `;

    const analysis = await claude.analyzeTestFailure(errorMessage, testCode);

    console.log('Claude Analysis:');
    console.log(analysis);
});

/**
 * Example: Generate test data
 */
test('Example: Generate Test Data', async () => {
    const claude = new ClaudeHelper();

    const testUsers = await claude.generateTestData('user profiles with name, email, age', 3);

    console.log('Generated Test Data:');
    console.log(JSON.stringify(testUsers, null, 2));
});
