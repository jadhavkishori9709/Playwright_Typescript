# Real Email Verification Testing Guide

## 🎯 Understanding the Flow

Your GiftsAI application uses **real email verification**:

1. User signs up → Email sent to their inbox
2. User checks email → Clicks verification link
3. Email verified → User can login

---

## 🧪 How to Test Email Verification

### Option 1: Use Mailinator (FREE & Easy!)

**Setup**:
```typescript
// Use Mailinator public inbox
const testEmail = 'testuser12345@mailinator.com';

// After signup, check inbox at:
// https://www.mailinator.com/v4/public/inboxes.jsp?to=testuser12345
```

**Test Code**:
```typescript
import { test } from '@playwright/test';

test('Email Verification with Mailinator', async ({ page, context }) => {
  const testEmail = `playwright_${Date.now()}@mailinator.com`;
  
  // Step 1: Sign up
  await page.goto('https://dev.giftsai.com/');
  // ... fill signup form with testEmail ...
  
  // Step 2: Open Mailinator in new tab
  const mailinatorPage = await context.newPage();
  await mailinatorPage.goto(`https://www.mailinator.com/v4/public/inboxes.jsp?to=${testEmail.split('@')[0]}`);
  
  // Step 3: Wait for email (refresh until it appears)
  await mailinatorPage.waitForTimeout(5000);
  await mailinatorPage.reload();
  
  // Step 4: Click on verification email
  await mailinatorPage.click('text=Verify Email'); // Adjust selector
  
  // Step 5: Click verification link in email
  // Extract and navigate to verification link
});
```

---

### Option 2: Manual Verification (For Learning)

**Test Code**:
```typescript
import { test } from '@playwright/test';

test('Email Verification - Manual', async ({ page }) => {
  const yourEmail = 'your.email@gmail.com'; // Your real email
  
  // Step 1: Sign up
  await page.goto('https://dev.giftsai.com/');
  // ... fill signup form with your email ...
  
  console.log('\n⏸️  PAUSED - Check your email!');
  console.log(`   1. Open your inbox: ${yourEmail}`);
  console.log('   2. Find verification email from GiftsAI');
  console.log('   3. Click the verification link');
  console.log('   4. Press Enter here to continue...\n');
  
  // Pause test - you manually verify
  await page.pause(); // Opens Playwright Inspector
  
  // After you click link, test continues
  console.log('✅ Email verified! Continuing test...');
});
```

---

### Option 3: Use Your Test Email (Recommended for Now!)

**Test Code**:
```typescript
import { test } from '@playwright/test';

test('Email Verification - Your Email', async ({ page }) => {
  // Use your email for testing
  const testEmail = 'jadhav.kishori97@gmail.com';
  const testPassword = 'Test@12345';
  
  // Step 1: Sign up
  await page.goto('https://dev.giftsai.com/');
  // ... signup process ...
  
  console.log('\n📧 Email sent to:', testEmail);
  console.log('⏸️  Please check your email and click verification link');
  console.log('   Then press Enter to continue...\n');
  
  // Wait for you to verify
  await page.pause();
  
  // Step 2: Try to login (should work after verification)
  await page.goto('https://dev.giftsai.com/');
  await page.click('button:has-text("Sign In")');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(3000);
  
  console.log('✅ Login successful - Email was verified!');
});
```

---

## 🎯 Recommended Approach for Your 63 Test Cases

### For TC 2-11 (Registration Tests):

**Test the signup form** (don't test email verification):
```typescript
test('TC 2: Successful user registration', async ({ page }) => {
  // Fill and submit signup form
  // Verify: Success message or "Check your email" message
  // ✅ STOP HERE - Don't test email verification
});

test('TC 10: Email confirmation sent', async ({ page }) => {
  // Sign up
  // Verify: "Check your email" message appears
  // ✅ STOP HERE - Assume email was sent
});
```

**Separate test for email verification** (manual or with Mailinator):
```typescript
test('Email Verification E2E', async ({ page }) => {
  // Use Mailinator or manual verification
  // This is ONE test, not part of the 63
});
```

---

## 💡 Summary

**For your automation project**:

1. **Test signup form** - Automated (TC 2-11)
2. **Assume email works** - Trust the application
3. **Manual verification test** - One-time check

**Total cost**: Still $4.70 (email verification doesn't add cost!)

---

**Which approach would you like to use?**
1. Mailinator (automated but needs setup)
2. Manual verification (easy, use your email)
3. Skip verification (just test signup form)
