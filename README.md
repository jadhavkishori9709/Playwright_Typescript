# Playwright Test Automation Framework

A comprehensive Playwright test automation framework with Page Object Model for testing [dev.giftsai.com](https://dev.giftsai.com/).

## 🚀 Features

- **Page Object Model (POM)** architecture for maintainable tests
- **Multi-browser support** (Chrome, Firefox, WebKit)
- **Email verification workflow** testing
- **Credential management** for test users
- **Comprehensive test coverage** for authentication flows
- **TypeScript** for type safety
- **Flexible selectors** for robust element location
- **🤖 AI-Powered Testing** with Claude AI (NEW!)
  - Automatic page object generation
  - Intelligent test failure analysis
  - API & mobile test generation
  - Smart test data generation
  - Cost tracking for students ($5 free credits!)

## 🤖 Claude AI Integration (For Students!)

**Get started with FREE $5 credits - lasts 2-3 weeks!**

### Quick Start
1. Get your free API key at [console.anthropic.com](https://console.anthropic.com)
2. Add to `.env`: `ANTHROPIC_API_KEY=your-key-here`
3. Run examples: `npm run claude:examples`
4. Check costs: `npm run claude:cost`

### What You Can Do
- ✨ Generate page objects from live pages
- 🔍 Analyze test failures with AI suggestions
- 📱 Create mobile-specific tests
- 🔌 Generate API tests from OpenAPI specs
- 📊 Generate realistic test data

### 🛒 Complete E-Commerce Automation
**Want to automate the ENTIRE application?**
- See [ECOMMERCE_AUTOMATION_GUIDE.md](./ECOMMERCE_AUTOMATION_GUIDE.md) for complete 4-week plan
- Generate all 12 page objects with AI
- Build 50+ tests for full e-commerce flow
- All within $5 budget!

**Also see**: [CLAUDE_QUICKSTART.md](./CLAUDE_QUICKSTART.md) for basic setup

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository or navigate to the project directory:
```bash
cd d:\Playwright
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Create a `.env` file (optional):
```bash
cp .env.example .env
```

## 📁 Project Structure

```
d:\Playwright\
├── pages/                      # Page Object classes
│   ├── BasePage.ts            # Base class for all pages
│   ├── LoginPage.ts           # Sign In/Sign Up modals
│   ├── EmailVerificationPage.ts
│   └── DashboardPage.ts
├── tests/                      # Test specifications
│   ├── signup.spec.ts
│   ├── signin.spec.ts
│   ├── email-verification.spec.ts
│   └── e2e-user-flow.spec.ts
├── utils/                      # Utility functions
│   ├── testHelpers.ts         # Test data generators
│   ├── credentialManager.ts   # User credential storage
│   └── emailVerificationHelper.ts
├── test-data/                  # Test data storage
│   └── credentials.json       # Saved user credentials
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in specific browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests in UI mode
```bash
npm run test:ui
```

### Run specific test file
```bash
npx playwright test tests/signup.spec.ts
```

### Run tests with specific tag
```bash
npx playwright test --grep @smoke
```

### Claude AI Commands
```bash
npm run claude:examples  # Run Claude AI examples
npm run claude:cost      # Check AI usage costs
```

## 📊 View Test Reports

After running tests, view the HTML report:
```bash
npm run report
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
BASE_URL=https://dev.giftsai.com/
TEST_USER_EMAIL=your-test-email@example.com
TEST_USER_PASSWORD=your-test-password
EMAIL_SERVICE=mock
HEADLESS=true
TIMEOUT=30000
```

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Browsers to test
- Base URL
- Timeouts
- Reporters
- Retries

## 📝 Writing Tests

### Example Test

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('should sign in successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigateToHome();
  await loginPage.completeSignIn('user@example.com', 'password123');
  
  // Add assertions
  expect(page.url()).toContain('dashboard');
});
```

### Using Page Objects

```typescript
// Initialize page object
const loginPage = new LoginPage(page);

// Use page object methods
await loginPage.completeSignUp(firstName, lastName, email, password);
await loginPage.switchToSignIn();
```

## 🎯 Test Coverage

### Authentication Tests
- ✅ Sign Up form validation
- ✅ Sign In form validation
- ✅ Email verification workflow
- ✅ Modal switching
- ✅ Error handling

### End-to-End Tests
- ✅ Complete first-time user journey (Signup → Verify → SignIn → Dashboard)
- ✅ Existing user journey (SignIn → Dashboard)
- ✅ Logout flow

## 🐛 Debugging

### Take screenshots
```typescript
await page.screenshot({ path: 'screenshot.png' });
```

### Use Playwright Inspector
```bash
npm run test:debug
```

### View trace
```bash
npx playwright show-trace trace.zip
```

## 📚 Utilities

### Generate Test Data
```typescript
import { generateRandomUserData } from '../utils/testHelpers';

const userData = generateRandomUserData();
// { firstName, lastName, email, password, fullName }
```

### Manage Credentials
```typescript
import { saveUserCredentials, getVerifiedUser } from '../utils/credentialManager';

// Save user
saveUserCredentials({ email, password, isVerified: true, ... });

// Get verified user
const user = getVerifiedUser();
```

## 🤝 Contributing

1. Create a new branch for your feature
2. Write tests following the existing patterns
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

ISC

## 🔗 Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
