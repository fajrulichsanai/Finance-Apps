# 🚀 Automation Testing - Quick Reference

## 1️⃣ Install & Setup (First Time Only)

```bash
# Install dependencies
npm install

# Copy test environment file
cp .env.test.local.example .env.test.local

# Update .env.test.local with your credentials
# TEST_EMAIL=projectichsankamil@gmail.com
# TEST_PASSWORD=123123123
```

## 2️⃣ Start Development Server

```bash
# Keep this running in a separate terminal
npm run dev
```
Server will run at http://localhost:3000

## 3️⃣ Run Tests

### All Tests
```bash
npm run test
```

### With Visual UI (Recommended for Development)
```bash
npm run test:ui
```
- Interactive test runner
- Pause, run, and inspect individual tests
- See browser output in real-time

### See Browser Window
```bash
npm run test:headed
```

### Debug Mode (Step-by-Step)
```bash
npm run test:debug
```

### Run Specific Test
```bash
npx playwright test -g "TC-LOGIN-P01"
```

## 📊 Test Coverage

| Category | Count | Status |
|----------|-------|--------|
| Positive Tests | 5 | ✅ Automated |
| Negative Tests | 8 | ✅ Automated |
| Edge Cases | 4 | ✅ Automated |
| Additional Tests | 3 | ✅ Automated |
| **TOTAL** | **20** | ✅ **All Automated** |

## 📝 Test Cases Automated

### ✅ Positive (5)
- TC-LOGIN-P01: Valid Email & Password
- TC-LOGIN-P03: Navigate to Forgot Password
- TC-LOGIN-P04: Navigate to Register
- TC-LOGIN-P05: Success Message Display
- Form Structure Validation

### ❌ Negative (8)
- TC-LOGIN-N01: Empty Email
- TC-LOGIN-N02: Empty Password
- TC-LOGIN-N03: Invalid Email Format
- TC-LOGIN-N04: Wrong Password
- TC-LOGIN-N05: Unregistered User
- TC-LOGIN-N06: Button Disabled During Loading
- TC-LOGIN-N07: Multiple Failed Attempts
- TC-LOGIN-N08: SQL Injection Attempt

### ⚠️ Edge Cases (4)
- TC-LOGIN-E01: Email with Whitespace
- TC-LOGIN-E02: Password with Newline
- TC-LOGIN-E03: Browser Autofill
- TC-LOGIN-E04: Mobile Responsiveness

## 🔍 View Test Results

```bash
# Open HTML report after running tests
npx playwright show-report
```

Results include:
- ✅ Passed/Failed tests
- 📸 Screenshots
- 🎥 Video recordings (on failure)
- 📋 Detailed logs

## 🛠️ File Structure

```
tests/
├── README.md                      # Full documentation
├── auth/
│   └── login.spec.ts             # All login test cases (20 tests)
└── helpers/
    └── loginHelpers.ts           # Reusable test utilities

playwright.config.ts              # Playwright configuration
.env.test.local.example          # Example env template
```

## ✨ Browsers Tested

- ✅ Chromium (Chrome)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (Pixel 5)

## 🔧 Environment Setup

Required in `.env.test.local`:
```env
TEST_EMAIL=projectichsankamil@gmail.com
TEST_PASSWORD=123123123
INVALID_EMAIL=notexist@example.com
INVALID_PASSWORD=WrongPassword123!
```

## 📚 Commands Summary

| Command | Purpose |
|---------|---------|
| `npm run test` | Run all tests headless |
| `npm run test:ui` | Interactive UI mode |
| `npm run test:headed` | Show browser window |
| `npm run test:debug` | Step through tests |
| `npx playwright show-report` | View test report |
| `npx playwright test -g "TC-LOGIN-P01"` | Run specific test |

## 🎯 Next Steps

1. ✅ Copy `.env.test.local.example` → `.env.test.local`
2. ✅ Update credentials in `.env.test.local`
3. ✅ Run `npm install`
4. ✅ Run `npm run dev`
5. ✅ Run `npm run test:ui` in another terminal

## 📞 Troubleshooting

**"ECONNREFUSED" error?**
- Make sure `npm run dev` is running on port 3000

**"Test credentials invalid"?**
- Check `.env.test.local` matches your Supabase test user

**Test fails locally but passes in CI?**
- Run with `npm run test:headed` to see what's happening

## 📖 Full Documentation

See [tests/README.md](../tests/README.md) for comprehensive guide.
