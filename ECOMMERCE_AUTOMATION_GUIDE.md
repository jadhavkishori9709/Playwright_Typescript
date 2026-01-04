# Complete E-Commerce Automation Guide with Claude AI

## 🎯 Your Project Overview

**Application**: GiftsAI E-Commerce Website  
**Timeline**: 1 Month (4 weeks)  
**Budget**: $5 (FREE credits)  
**Goal**: Automate entire application (except payment page)  

---

## 📋 Complete Page Inventory

### ✅ Already Created (3 pages)
1. `LoginPage.ts` - Sign In/Sign Up
2. `EmailVerificationPage.ts` - Email verification  
3. `DashboardPage.ts` - User dashboard

### 📝 To Be Created (12 pages)

#### **Shopping Flow** (Priority: HIGH)
4. `HomePage.ts` - Landing page, featured products
5. `ProductListingPage.ts` - Browse products, filters, search
6. `ProductDetailPage.ts` - Product details, images, description
7. `CartPage.ts` - Shopping cart, add/remove items

#### **Checkout Flow** (Priority: HIGH)
8. `CheckoutPage.ts` - Shipping, billing (STOP before payment)

#### **Account Management** (Priority: MEDIUM)
9. `ProfilePage.ts` - User profile, settings
10. `RecipientsPage.ts` - Manage gift recipients
11. `OccasionsPage.ts` - Manage occasions/events
12. `OrderHistoryPage.ts` - View past orders

#### **Discovery** (Priority: LOW)
13. `WishlistPage.ts` - Saved/favorite items
14. `SearchResultsPage.ts` - Search results
15. `CategoryPage.ts` - Product categories

**Total**: 15 Page Objects (3 done + 12 to create)

---

## 💰 Complete Cost Breakdown

| Week | Pages | AI Usage | Cost |
|------|-------|----------|------|
| Week 1 | 4 POMs + tests | Generate, test data, debug | $1.50 |
| Week 2 | 3 POMs + tests | Generate, test data, debug | $1.20 |
| Week 3 | 3 POMs + tests | Generate, test data, debug | $1.00 |
| Week 4 | 2 POMs + polish | Generate, mobile, API tests | $1.00 |
| **TOTAL** | **12 POMs** | **Full automation** | **$4.70** |

**Remaining**: $0.30 buffer ✅

---

## 🚀 Week-by-Week Implementation Plan

### **WEEK 1: Core Shopping Flow** 🛒

**Goal**: User can browse and add products to cart

#### Day 1-2: Setup & HomePage
```bash
# 1. Get API key from console.anthropic.com
# 2. Add to .env: ANTHROPIC_API_KEY=your-key
# 3. Generate HomePage
npm run claude:examples  # Test setup
```

**Generate HomePage.ts**:
```typescript
// File: scripts/generate-home-page.ts
import { test } from '@playwright/test';
import { ClaudeHelper } from '../utils/claudeHelper';
import * as fs from 'fs';

test('Generate HomePage POM', async ({ page }) => {
  // Login
  await page.goto('https://dev.giftsai.com/');
  await page.click('text=Sign In');
  await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
  await page.fill('input[type="password"]', 'Pune@12345');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  // Go to home page
  await page.goto('https://dev.giftsai.com/');
  await page.waitForLoadState('networkidle');
  
  // Generate POM
  const claude = new ClaudeHelper();
  const html = await page.content();
  const pom = await claude.generatePageObject(html, 'HomePage');
  
  // Save to file
  fs.writeFileSync('pages/HomePage.ts', pom);
  console.log('✅ HomePage.ts created!');
  console.log(pom);
});
```

**Run it**:
```bash
npx playwright test scripts/generate-home-page.ts --headed
```

**Cost**: ~$0.08

---

#### Day 3-4: ProductListingPage
```typescript
// File: scripts/generate-product-listing-page.ts
import { test } from '@playwright/test';
import { ClaudeHelper } from '../utils/claudeHelper';
import * as fs from 'fs';

test('Generate ProductListingPage POM', async ({ page }) => {
  // Login
  await page.goto('https://dev.giftsai.com/');
  await page.click('text=Sign In');
  await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
  await page.fill('input[type="password"]', 'Pune@12345');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  // Navigate to products page (adjust URL based on your app)
  await page.goto('https://dev.giftsai.com/products');
  // OR click on "Products" or "Shop" link if needed
  // await page.click('text=Products');
  await page.waitForLoadState('networkidle');
  
  // Generate POM
  const claude = new ClaudeHelper();
  const html = await page.content();
  const pom = await claude.generatePageObject(html, 'ProductListingPage');
  
  // Save to file
  fs.writeFileSync('pages/ProductListingPage.ts', pom);
  console.log('✅ ProductListingPage.ts created!');
  console.log(pom);
});
```

**Cost**: ~$0.12

---

#### Day 5-6: ProductDetailPage & CartPage
```typescript
// File: scripts/generate-product-detail-page.ts
import { test } from '@playwright/test';
import { ClaudeHelper } from '../utils/claudeHelper';
import * as fs from 'fs';

test('Generate ProductDetailPage POM', async ({ page }) => {
  // Login
  await page.goto('https://dev.giftsai.com/');
  await page.click('text=Sign In');
  await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
  await page.fill('input[type="password"]', 'Pune@12345');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  // Navigate to a product detail page
  await page.goto('https://dev.giftsai.com/products');
  await page.click('.product-card:first-child'); // Click first product
  await page.waitForLoadState('networkidle');
  
  // Generate POM
  const claude = new ClaudeHelper();
  const html = await page.content();
  const pom = await claude.generatePageObject(html, 'ProductDetailPage');
  
  fs.writeFileSync('pages/ProductDetailPage.ts', pom);
  console.log('✅ ProductDetailPage.ts created!');
});

test('Generate CartPage POM', async ({ page }) => {
  // Login and add item to cart first
  await page.goto('https://dev.giftsai.com/');
  await page.click('text=Sign In');
  await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
  await page.fill('input[type="password"]', 'Pune@12345');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  // Add product to cart
  await page.goto('https://dev.giftsai.com/products');
  await page.click('.product-card:first-child');
  await page.click('button:has-text("Add to Cart")');
  await page.waitForTimeout(2000);
  
  // Go to cart
  await page.click('a[href*="cart"]'); // Or click cart icon
  await page.waitForLoadState('networkidle');
  
  // Generate POM
  const claude = new ClaudeHelper();
  const html = await page.content();
  const pom = await claude.generatePageObject(html, 'CartPage');
  
  fs.writeFileSync('pages/CartPage.ts', pom);
  console.log('✅ CartPage.ts created!');
});
```

**Cost**: ~$0.18 (both pages)

---

#### Day 7: Write Tests for Week 1
```typescript
// File: tests/shopping-flow.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';

test.describe('Shopping Flow Tests', () => {
  test('Complete shopping flow: Browse → View → Add to Cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productListing = new ProductListingPage(page);
    const productDetail = new ProductDetailPage(page);
    const cart = new CartPage(page);
    
    // Login
    await loginPage.completeSignIn(
      'jadhav.kishori97@gmail.com',
      'Pune@12345'
    );
    
    // Browse products from home
    await homePage.navigateTo();
    await homePage.clickShopNow(); // or however you navigate to products
    
    // View product listing
    expect(await productListing.isProductListVisible()).toBeTruthy();
    await productListing.clickFirstProduct();
    
    // View product details
    expect(await productDetail.isProductTitleVisible()).toBeTruthy();
    await productDetail.addToCart();
    
    // Verify cart
    await cart.navigateTo();
    expect(await cart.getCartItemCount()).toBeGreaterThan(0);
  });
});
```

**Check cost**:
```bash
npm run claude:cost
```

**Week 1 Total**: ~$1.50 ✅

---

### **WEEK 2: Checkout & Account** 💳

#### Day 8-9: CheckoutPage
```typescript
// File: scripts/generate-checkout-page.ts
import { test } from '@playwright/test';
import { ClaudeHelper } from '../utils/claudeHelper';
import * as fs from 'fs';

test('Generate CheckoutPage POM', async ({ page }) => {
  // Login, add item, go to checkout
  await page.goto('https://dev.giftsai.com/');
  await page.click('text=Sign In');
  await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
  await page.fill('input[type="password"]', 'Pune@12345');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  // Add product to cart
  await page.goto('https://dev.giftsai.com/products');
  await page.click('.product-card:first-child');
  await page.click('button:has-text("Add to Cart")');
  await page.waitForTimeout(2000);
  
  // Go to checkout
  await page.click('a[href*="cart"]');
  await page.click('button:has-text("Checkout")'); // or "Proceed to Checkout"
  await page.waitForLoadState('networkidle');
  
  // Generate POM
  const claude = new ClaudeHelper();
  const html = await page.content();
  const pom = await claude.generatePageObject(html, 'CheckoutPage');
  
  fs.writeFileSync('pages/CheckoutPage.ts', pom);
  console.log('✅ CheckoutPage.ts created!');
  console.log('\n⚠️  REMEMBER: Tests should STOP before payment!');
});
```

**Cost**: ~$0.12

---

#### Day 10-11: ProfilePage & OrderHistoryPage
```typescript
// File: scripts/generate-account-pages.ts
import { test } from '@playwright/test';
import { ClaudeHelper } from '../utils/claudeHelper';
import * as fs from 'fs';

test('Generate ProfilePage POM', async ({ page }) => {
  // Login
  await page.goto('https://dev.giftsai.com/');
  await page.click('text=Sign In');
  await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
  await page.fill('input[type="password"]', 'Pune@12345');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  // Navigate to profile (adjust based on your app)
  await page.click('a[href*="profile"]'); // or click user menu → Profile
  await page.waitForLoadState('networkidle');
  
  // Generate POM
  const claude = new ClaudeHelper();
  const html = await page.content();
  const pom = await claude.generatePageObject(html, 'ProfilePage');
  
  fs.writeFileSync('pages/ProfilePage.ts', pom);
  console.log('✅ ProfilePage.ts created!');
});

test('Generate OrderHistoryPage POM', async ({ page }) => {
  // Login
  await page.goto('https://dev.giftsai.com/');
  await page.click('text=Sign In');
  await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
  await page.fill('input[type="password"]', 'Pune@12345');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  // Navigate to order history
  await page.click('a[href*="orders"]'); // or "My Orders"
  await page.waitForLoadState('networkidle');
  
  // Generate POM
  const claude = new ClaudeHelper();
  const html = await page.content();
  const pom = await claude.generatePageObject(html, 'OrderHistoryPage');
  
  fs.writeFileSync('pages/OrderHistoryPage.ts', pom);
  console.log('✅ OrderHistoryPage.ts created!');
});
```

**Cost**: ~$0.18

---

#### Day 12-14: Write Checkout Tests
```typescript
// File: tests/checkout-flow.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout Flow Tests', () => {
  test('Complete checkout flow (stop before payment)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productListing = new ProductListingPage(page);
    const productDetail = new ProductDetailPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    
    // Login
    await loginPage.completeSignIn(
      'jadhav.kishori97@gmail.com',
      'Pune@12345'
    );
    
    // Add product to cart
    await productListing.navigateTo();
    await productListing.clickFirstProduct();
    await productDetail.addToCart();
    
    // Go to checkout
    await cart.navigateTo();
    await cart.proceedToCheckout();
    
    // Fill checkout form (STOP before payment)
    await checkout.fillShippingAddress({
      name: 'Test User',
      address: '123 Test St',
      city: 'Test City',
      zip: '12345'
    });
    
    await checkout.fillBillingAddress({
      name: 'Test User',
      address: '123 Test St',
      city: 'Test City',
      zip: '12345'
    });
    
    // Verify we're on checkout page (DO NOT CLICK PAYMENT)
    expect(await checkout.isOnCheckoutPage()).toBeTruthy();
    
    // ⚠️ STOP HERE - DO NOT PROCEED TO PAYMENT
  });
});
```

**Week 2 Total**: ~$1.20 ✅

---

### **WEEK 3: Gift Features** 🎁

#### Day 15-17: Recipients & Occasions Pages
```typescript
// File: scripts/generate-gift-pages.ts
import { test } from '@playwright/test';
import { ClaudeHelper } from '../utils/claudeHelper';
import * as fs from 'fs';

test('Generate RecipientsPage POM', async ({ page }) => {
  // Login
  await page.goto('https://dev.giftsai.com/');
  await page.click('text=Sign In');
  await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
  await page.fill('input[type="password"]', 'Pune@12345');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  // Navigate to recipients
  await page.click('a[href*="recipients"]');
  await page.waitForLoadState('networkidle');
  
  // Generate POM
  const claude = new ClaudeHelper();
  const html = await page.content();
  const pom = await claude.generatePageObject(html, 'RecipientsPage');
  
  fs.writeFileSync('pages/RecipientsPage.ts', pom);
  console.log('✅ RecipientsPage.ts created!');
});

test('Generate OccasionsPage POM', async ({ page }) => {
  // Login
  await page.goto('https://dev.giftsai.com/');
  await page.click('text=Sign In');
  await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
  await page.fill('input[type="password"]', 'Pune@12345');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  // Navigate to occasions
  await page.click('a[href*="occasions"]');
  await page.waitForLoadState('networkidle');
  
  // Generate POM
  const claude = new ClaudeHelper();
  const html = await page.content();
  const pom = await claude.generatePageObject(html, 'OccasionsPage');
  
  fs.writeFileSync('pages/OccasionsPage.ts', pom);
  console.log('✅ OccasionsPage.ts created!');
});

test('Generate WishlistPage POM', async ({ page }) => {
  // Login
  await page.goto('https://dev.giftsai.com/');
  await page.click('text=Sign In');
  await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
  await page.fill('input[type="password"]', 'Pune@12345');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  // Navigate to wishlist
  await page.click('a[href*="wishlist"]'); // or heart icon
  await page.waitForLoadState('networkidle');
  
  // Generate POM
  const claude = new ClaudeHelper();
  const html = await page.content();
  const pom = await claude.generatePageObject(html, 'WishlistPage');
  
  fs.writeFileSync('pages/WishlistPage.ts', pom);
  console.log('✅ WishlistPage.ts created!');
});
```

**Cost**: ~$0.22

---

#### Day 18-21: Write Gift Feature Tests
```typescript
// File: tests/gift-features.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RecipientsPage } from '../pages/RecipientsPage';
import { OccasionsPage } from '../pages/OccasionsPage';
import { WishlistPage } from '../pages/WishlistPage';
import { ClaudeHelper } from '../utils/claudeHelper';

test.describe('Gift Features Tests', () => {
  test('Manage recipients', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const recipients = new RecipientsPage(page);
    
    // Generate test data with AI
    const claude = new ClaudeHelper();
    const recipientData = await claude.generateTestData(
      'gift recipient with name, email, birthday, relationship',
      1
    );
    
    await loginPage.completeSignIn(
      'jadhav.kishori97@gmail.com',
      'Pune@12345'
    );
    
    await recipients.navigateTo();
    await recipients.addRecipient(recipientData[0]);
    
    expect(await recipients.isRecipientAdded(recipientData[0].name)).toBeTruthy();
  });
  
  test('Manage occasions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const occasions = new OccasionsPage(page);
    
    await loginPage.completeSignIn(
      'jadhav.kishori97@gmail.com',
      'Pune@12345'
    );
    
    await occasions.navigateTo();
    await occasions.addOccasion({
      name: 'Birthday',
      date: '2026-06-15',
      recipient: 'Test Recipient'
    });
    
    expect(await occasions.isOccasionAdded('Birthday')).toBeTruthy();
  });
});
```

**Week 3 Total**: ~$1.00 ✅

---

### **WEEK 4: Search & Polish** 🔍

#### Day 22-24: Search & Category Pages
```typescript
// File: scripts/generate-discovery-pages.ts
import { test } from '@playwright/test';
import { ClaudeHelper } from '../utils/claudeHelper';
import * as fs from 'fs';

test('Generate SearchResultsPage POM', async ({ page }) => {
  // Login
  await page.goto('https://dev.giftsai.com/');
  await page.click('text=Sign In');
  await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
  await page.fill('input[type="password"]', 'Pune@12345');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  // Perform search
  await page.fill('input[placeholder*="Search"]', 'gift');
  await page.press('input[placeholder*="Search"]', 'Enter');
  await page.waitForLoadState('networkidle');
  
  // Generate POM
  const claude = new ClaudeHelper();
  const html = await page.content();
  const pom = await claude.generatePageObject(html, 'SearchResultsPage');
  
  fs.writeFileSync('pages/SearchResultsPage.ts', pom);
  console.log('✅ SearchResultsPage.ts created!');
});

test('Generate CategoryPage POM', async ({ page }) => {
  // Login
  await page.goto('https://dev.giftsai.com/');
  await page.click('text=Sign In');
  await page.fill('input[type="email"]', 'jadhav.kishori97@gmail.com');
  await page.fill('input[type="password"]', 'Pune@12345');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  
  // Click on a category
  await page.click('a[href*="category"]'); // or specific category link
  await page.waitForLoadState('networkidle');
  
  // Generate POM
  const claude = new ClaudeHelper();
  const html = await page.content();
  const pom = await claude.generatePageObject(html, 'CategoryPage');
  
  fs.writeFileSync('pages/CategoryPage.ts', pom);
  console.log('✅ CategoryPage.ts created!');
});
```

**Cost**: ~$0.16

---

#### Day 25-28: Mobile & API Tests
```typescript
// File: tests/mobile-responsive.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ClaudeHelper } from '../utils/claudeHelper';

test.describe('Mobile Responsive Tests', () => {
  test('Generate mobile tests for iPhone', async ({ page }) => {
    // Set iPhone viewport
    await page.setViewportSize({ width: 390, height: 844 });
    
    const loginPage = new LoginPage(page);
    await loginPage.completeSignIn(
      'jadhav.kishori97@gmail.com',
      'Pune@12345'
    );
    
    await page.goto('https://dev.giftsai.com/');
    
    // Generate mobile-specific tests with AI
    const claude = new ClaudeHelper();
    const html = await page.content();
    const mobileTests = await claude.generateMobileTests(
      html,
      ['iPhone 12', 'iPhone 14 Pro']
    );
    
    console.log('Mobile test suggestions:');
    console.log(mobileTests);
  });
});
```

**Cost**: ~$0.36

---

#### Day 29-30: Final Polish & Documentation
```bash
# Check final cost
npm run claude:cost

# Run all tests
npm test

# Generate final report
npm run report
```

**Week 4 Total**: ~$1.00 ✅

---

## 📊 Cost Tracking Commands

### Daily Cost Check
```bash
npm run claude:cost
```

### Expected Output
```
📊 Claude AI Cost Report
==================================================
Total Spent: $2.3456 / $5.0000
Remaining: $2.6544

Breakdown by Feature:
  Page Object Generation: $1.0600
  Test Scenarios: $0.6000
  Test Data Generation: $0.4856
  Failure Analysis: $0.2000

Total API Calls: 45
==================================================
```

---

## 🎯 Complete Test Suite Structure

```
tests/
├── auth/
│   ├── signin.spec.ts
│   ├── signup.spec.ts
│   └── email-verification.spec.ts
├── shopping/
│   ├── browse-products.spec.ts
│   ├── product-details.spec.ts
│   ├── add-to-cart.spec.ts
│   └── shopping-flow.spec.ts
├── checkout/
│   ├── checkout-flow.spec.ts (STOP before payment!)
│   └── checkout-validation.spec.ts
├── account/
│   ├── profile.spec.ts
│   └── order-history.spec.ts
├── gifts/
│   ├── recipients.spec.ts
│   ├── occasions.spec.ts
│   └── wishlist.spec.ts
├── discovery/
│   ├── search.spec.ts
│   └── categories.spec.ts
└── mobile/
    └── responsive.spec.ts
```

---

## ✅ Daily Checklist Template

```markdown
# Day X Progress

## Today's Goal
- [ ] Generate [PageName] POM
- [ ] Write tests for [Feature]
- [ ] Check cost: `npm run claude:cost`

## What I Did
- Generated: 
- Tests written:
- Cost spent today: $X.XX
- Total spent: $X.XX / $5.00

## Tomorrow
- Generate [NextPage]
- Write [NextTest]

## Notes
- Any issues or learnings
```

---

## 🆘 Troubleshooting

### Issue: "Cannot find selector"
**Solution**: Use Claude AI to analyze the failure
```typescript
const claude = new ClaudeHelper();
const analysis = await claude.analyzeTestFailure(
  error.message,
  testCode
);
console.log(analysis);
```

### Issue: "Budget exceeded"
**Solution**: Apply for student credits
- GitHub Student Pack
- AWS Educate
- Google Cloud Education

### Issue: "Page object not working"
**Solution**: Regenerate with more specific prompts
```typescript
const pom = await claude.generatePageObject(
  html,
  'ProductListingPage with filters, sorting, and pagination'
);
```

---

## 🎉 Success Criteria

By end of 1 month, you should have:
- ✅ 15 complete page objects
- ✅ 50+ test cases
- ✅ Full e-commerce flow automated (except payment)
- ✅ Mobile responsive tests
- ✅ API tests (if applicable)
- ✅ Cost: ~$4.70 of $5 budget
- ✅ Complete automation framework

---

## 📚 Quick Reference

### Generate Any Page Object
```bash
npx playwright test scripts/generate-[page-name].ts --headed
```

### Run Specific Test Suite
```bash
npx playwright test tests/shopping/ --headed
```

### Check Costs
```bash
npm run claude:cost
```

### View Report
```bash
npm run report
```

---

**You're all set! Start with Week 1, Day 1 and follow this guide step-by-step.** 🚀

**Questions? Check [CLAUDE_QUICKSTART.md](../CLAUDE_QUICKSTART.md) for setup help!**
