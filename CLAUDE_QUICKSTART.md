# Claude AI Integration - Quick Start Guide for Students

## 🎓 Student Setup (FREE for 2-3 Weeks!)

### Step 1: Get Your Free API Key
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up with your email
3. Get **$5 in free credits** (no payment required!)
4. Copy your API key

### Step 2: Configure Your Project
1. Create `.env` file:
   ```bash
   copy .env.example .env
   ```

2. Add your API key to `.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ```

### Step 3: Try It Out!
```bash
npm run claude:examples
```

---

## 💰 Cost Tracking (Stay Within $5!)

### Check Your Spending
```bash
npm run claude:cost
```

**Output Example**:
```
📊 Claude AI Cost Report
==================================================
Total Spent: $1.2345 / $5.0000
Remaining: $3.7655

Breakdown by Feature:
  Page Object Generation: $0.4500
  Failure Analysis: $0.5845
  Test Data Generation: $0.2000

Total API Calls: 15
==================================================
```

---

## 🚀 What You Can Do

### 1. Generate Page Objects
```typescript
import { ClaudeHelper } from './utils/claudeHelper';

const claude = new ClaudeHelper();
const pageHtml = await page.content();
const pageObject = await claude.generatePageObject(pageHtml, 'RecipientPage');
console.log(pageObject);
```

### 2. Analyze Test Failures
```typescript
const analysis = await claude.analyzeTestFailure(
  'Timeout waiting for selector',
  testCode
);
console.log(analysis);
```

### 3. Generate Test Data
```typescript
const users = await claude.generateTestData('user profiles', 10);
console.log(users);
```

### 4. Generate API Tests
```typescript
const apiTests = await claude.generateApiTests(openApiSpec, '/api/users');
console.log(apiTests);
```

### 5. Generate Mobile Tests
```typescript
const mobileTests = await claude.generateMobileTests(
  pageContent,
  ['iPhone 12', 'Pixel 5']
);
console.log(mobileTests);
```

---

## 💡 Tips to Make $5 Last 2-3 Weeks

### ✅ DO:
- Use caching (automatic - responses cached for 24 hours)
- Generate page objects once, reuse them
- Use test data generation (very cheap)
- Check cost regularly: `npm run claude:cost`

### ❌ DON'T:
- Generate the same page object multiple times
- Analyze every single test (only failures)
- Send huge HTML files (auto-compressed to 8KB)

---

## 🎁 Get More Free Credits

### GitHub Student Pack
- Visit [education.github.com/pack](https://education.github.com/pack)
- Get free developer tools + potential AI credits

### AWS Educate
- Visit [aws.amazon.com/education/awseducate](https://aws.amazon.com/education/awseducate)
- Get $100-200 in AWS credits
- Use Claude through AWS Bedrock

### Google Cloud for Students
- Visit [cloud.google.com/edu](https://cloud.google.com/edu)
- Get $300 in GCP credits
- Use Claude through Vertex AI

---

## 📊 Expected Usage (2-3 Weeks with $5)

| Week | Activities | Cost | Remaining |
|------|-----------|------|-----------|
| **Week 1** | Learning, 5 POMs, 10 failures | $1.80 | $3.20 |
| **Week 2** | 3 API tests, 2 mobile tests, 15 failures | $1.70 | $1.50 |
| **Week 3** | Test data, coverage analysis | $1.20 | $0.30 |

---

## ⚠️ Budget Alerts

The system will automatically warn you:
- When you have **< $0.50** remaining
- When you **exceed $5.00** (will stop making calls)

---

## 🆘 Troubleshooting

### Error: "Invalid API Key"
- Check `.env` file has correct key
- Ensure no extra spaces
- Key should start with `sk-ant-api03-`

### Error: "Budget limit exceeded"
- You've used all $5
- Check cost: `npm run claude:cost`
- Apply for student credits (see above)

### Responses are slow
- Normal for first call
- Subsequent calls use cache (instant!)

---

## 📚 Learn More

- [Implementation Plan](./implementation_plan.md) - Full technical details
- [Pricing Guide](./pricing-and-discounts.md) - Cost optimization
- [Examples](../examples/claude-usage-example.ts) - Code samples

---

## 🎯 Next Steps

1. ✅ Get your free $5 credits
2. ✅ Add API key to `.env`
3. ✅ Run examples: `npm run claude:examples`
4. ✅ Check costs: `npm run claude:cost`
5. ✅ Start building!

**Happy Testing! 🚀**
