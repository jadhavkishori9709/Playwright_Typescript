# Email Verification Demo

## 📧 How Email Verification Works in Your Project

### Current Setup (Mock Email Service)

Your project uses a **mock email verification system** for testing. Here's how it works:

---

## 🎯 Step-by-Step Demo

### Step 1: User Signs Up
```typescript
// User fills registration form
await registrationPage.fillEmail('newuser@example.com');
await registrationPage.fillPassword('Test@123');
await registrationPage.clickSignUp();
```

### Step 2: Mock Email is "Sent"
```typescript
// Create email helper
const emailHelper = createEmailVerificationHelper(page);

// Generate mock verification link
const verificationLink = emailHelper.generateMockVerificationLink(
  'newuser@example.com'
);

// Example link generated:
// https://dev.giftsai.com/verify-email?token=abc123xyz&email=newuser@example.com
```

### Step 3: User "Clicks" Verification Link
```typescript
// Navigate to verification link
await emailHelper.navigateToVerificationLink(verificationLink);

// OR use the helper method
await emailHelper.clickVerificationLinkFromEmail('newuser@example.com');
```

### Step 4: Email is Verified
```typescript
// Verify the email verification page
const verificationPage = new EmailVerificationPage(page);
await verificationPage.completeVerification(verificationLink);

// User is now verified!
```

---

## 💡 Real Example from Your Tests

Here's how it's used in `e2e-user-flow.spec.ts`:

```typescript
test('Complete first-time user journey', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const verificationPage = new EmailVerificationPage(page);
  const emailHelper = createEmailVerificationHelper(page);
  
  // 1. Sign Up
  const userData = generateRandomUserData();
  await loginPage.completeSignUp(
    userData.firstName,
    userData.lastName,
    userData.email,
    userData.password
  );
  
  // 2. Generate mock verification link
  const verificationLink = emailHelper.generateMockVerificationLink(
    userData.email
  );
  
  // 3. Complete verification
  await verificationPage.completeVerification(verificationLink);
  
  // 4. User is verified and can login!
  await loginPage.completeSignIn(userData.email, userData.password);
});
```

---

## 🔄 How It Works (Diagram)

```
┌─────────────────┐
│  User Signs Up  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Mock Email Service          │
│ Generates verification link │
│ (No real email sent!)       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Test navigates to link      │
│ https://dev.giftsai.com/    │
│ verify-email?token=abc123   │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────┐
│ Email Verified! │
│ User can login  │
└─────────────────┘
```

---

## 🎬 Live Demo Script

Want to see it in action? Run this:

```bash
npx playwright test tests/email-verification.spec.ts --headed
```

This will show you:
1. ✅ Mock email generation
2. ✅ Verification link creation
3. ✅ Navigation to verification page
4. ✅ Email verification completion

---

## 🔧 For Production: Real Email Services

When you're ready for production, replace the mock with real services:

### Option 1: Mailosaur (Recommended)
```typescript
import { MailosaurClient } from 'mailosaur';

const client = new MailosaurClient(process.env.MAILOSAUR_API_KEY);

// Get verification email
const email = await client.messages.get(
  serverId,
  { sentTo: 'user@example.com' }
);

// Extract verification link
const verificationLink = email.html.links[0].href;
```

### Option 2: Mailtrap
```typescript
// Similar to Mailosaur
// Provides test email inbox
```

### Option 3: Gmail API
```typescript
// Use Gmail API to read emails
// More complex but free
```

---

## 🎯 Your Test Cases Using Email Verification

From your test plan:

- **TC 10**: Verify that registration confirmation emails are sent
- **TC 2**: Verify successful user registration with valid information
- **TC 11**: Verify successful registration with valid credentials

All use the email verification helper!

---

## 📝 Quick Reference

### Generate Mock Email
```typescript
const emailHelper = createEmailVerificationHelper(page);
const link = emailHelper.generateMockVerificationLink('user@example.com');
```

### Navigate to Verification
```typescript
await emailHelper.navigateToVerificationLink(link);
```

### Complete Flow
```typescript
await emailHelper.clickVerificationLinkFromEmail('user@example.com');
```

---

## ✅ Benefits of Mock Email Service

1. **Fast**: No waiting for real emails
2. **Reliable**: No email delivery issues
3. **Free**: No email service costs
4. **Offline**: Works without internet
5. **Deterministic**: Same results every time

---

**Your email verification system is ready to use!** 📧✨

For production, just swap the mock service with a real one like Mailosaur!
