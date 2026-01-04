# E-Commerce Automation - Quick Start

## 🎯 Your Mission
Automate the entire GiftsAI e-commerce website in 1 month using Claude AI with just $5!

## 📋 What You're Building
- **15 Page Objects** (3 done + 12 to create)
- **50+ Tests** covering all user flows
- **Budget**: $5 (FREE credits)
- **Timeline**: 4 weeks

## 🚀 Start Here (5 Minutes)

### Step 1: Get API Key
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up → Get $5 FREE credits
3. Copy your API key

### Step 2: Configure
```bash
copy .env.example .env
# Add: ANTHROPIC_API_KEY=your-key-here
```

### Step 3: Test Setup
```bash
npm run claude:examples
npm run claude:cost
```

## 📅 Your 4-Week Plan

### Week 1: Shopping Flow ($1.50)
Generate: HomePage, ProductListingPage, ProductDetailPage, CartPage

### Week 2: Checkout & Account ($1.20)
Generate: CheckoutPage, ProfilePage, OrderHistoryPage

### Week 3: Gift Features ($1.00)
Generate: RecipientsPage, OccasionsPage, WishlistPage

### Week 4: Discovery & Polish ($1.00)
Generate: SearchResultsPage, CategoryPage + Mobile tests

## 📖 Full Guide
See [ECOMMERCE_AUTOMATION_GUIDE.md](./ECOMMERCE_AUTOMATION_GUIDE.md) for complete step-by-step instructions!

## 💰 Track Your Spending
```bash
npm run claude:cost
```

**Target**: Stay under $0.35/day to last full month!

## ✅ Daily Routine
1. Generate 1 page object
2. Write tests for that page
3. Check cost: `npm run claude:cost`
4. Commit your work

**Let's build! 🚀**
