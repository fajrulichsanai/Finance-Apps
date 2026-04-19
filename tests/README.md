# Automation Testing Setup

## Overview
Complete Playwright automation testing suite for the Finance App login functionality. All test cases from [test-case/login.md](../test-case/login.md) are automated.

## ✅ Test Coverage

### Positive Test Cases (5 tests)
- **TC-LOGIN-P01**: Login dengan Email dan Password Valid
- **TC-LOGIN-P02**: Login dengan Google *(navigasi link)*
- **TC-LOGIN-P03**: Navigasi ke Lupa Password
- **TC-LOGIN-P04**: Navigasi ke Halaman Register
- **TC-LOGIN-P05**: Display Success Message

### Negative Test Cases (8 tests)
- **TC-LOGIN-N01**: Login dengan Email Kosong
- **TC-LOGIN-N02**: Login dengan Password Kosong
- **TC-LOGIN-N03**: Login dengan Email Format Invalid
- **TC-LOGIN-N04**: Login dengan Password Salah
- **TC-LOGIN-N05**: Login dengan User Tidak Terdaftar
- **TC-LOGIN-N06**: Tombol Disable Saat Loading
- **TC-LOGIN-N07**: Multiple Failed Login Attempts
- **TC-LOGIN-N08**: SQL Injection Attempt

### Edge Cases (4 tests)
- **TC-LOGIN-E01**: Login dengan Whitespace di Email
- **TC-LOGIN-E02**: Copy-Paste Password dengan Trailing Newline
- **TC-LOGIN-E03**: Browser Autofill
- **TC-LOGIN-E04**: Responsive UI Mobile (375px)

### Additional Tests
- Google Login Button Visibility
- Login Form Structure Validation
- Page Title Verification

**Total: 23 Test Cases**

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

This will install Playwright and all required dependencies.

### 2. Setup Environment
```bash
# Copy example env file
cp .env.test.local.example .env.test.local

# Edit .env.test.local with your test credentials
nano .env.test.local
```

**Required Credentials:**
```
TEST_EMAIL=projectichsankamil@gmail.com
TEST_PASSWORD=123123123
```

### 3. Run Development Server
```bash
# In one terminal, keep dev server running
npm run dev
```

The app will be available at http://localhost:3000

### 4. Run Tests

```bash
# Run all tests (headless)
npm run test

# Run with UI (recommended for development)
npm run test:ui

# Run with visible browser
npm run test:headed

# Debug mode (step through each test)
npm run test:debug

# Run specific test file
npx playwright test tests/auth/login.spec.ts

# Run specific test
npx playwright test -g "TC-LOGIN-P01"

# Run tests for specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📊 Test Reports

After running tests, Playwright generates an HTML report:

```bash
# View last test report
npx playwright show-report
```

Reports include:
- Test execution logs
- Screenshots on failure
- Video recordings on failure
- Detailed error messages

## 🔍 Debugging

### View Test in UI Mode
```bash
npm run test:ui
```
Interactive UI to run, pause, and debug tests line by line.

### Debug Single Test
```bash
npx playwright test -g "TC-LOGIN-P01" --debug
```

### Enable Trace Viewer
Traces are automatically captured on first retry. View them:
```bash
npx playwright show-trace trace.zip
```

## 📝 Test Structure

```
tests/
├── auth/
│   └── login.spec.ts          # Main login test suite
└── helpers/                    # Helper utilities (future)
```

## 🛠️ Environment Variables

Create `.env.test.local` with:

```env
# Test User Credentials (Valid)
TEST_EMAIL=projectichsankamil@gmail.com
TEST_PASSWORD=123123123

# Invalid Credentials (for negative tests)
INVALID_EMAIL=notexist@example.com
INVALID_PASSWORD=WrongPassword123!

# Test Data
SQL_INJECTION_STRING=' OR '1'='1
TEST_EMAIL_WITH_SPACES=  projectichsankamil@gmail.com  

# Execution Mode
HEADLESS=false
```

## 🎯 Playwright Config

Configuration file: `playwright.config.ts`

### Browsers Tested
- ✅ Chromium
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (Pixel 5)

### Key Settings
- **Base URL**: http://localhost:3000
- **Timeout**: 30 seconds per test
- **Retries**: 0 (dev), 2 (CI)
- **Screenshots**: On failure
- **Video**: On failure
- **Trace**: On first retry

## 📋 CI/CD Integration

For GitHub Actions or other CI systems:

```bash
# CI mode (headless, with retries)
npm run test
```

CI will:
- Run tests in headless mode
- Retry failed tests 2 times
- Generate HTML report
- Save screenshots/videos on failure

## 🚨 Common Issues

### Issue: "Error: ECONNREFUSED"
**Solution**: Make sure dev server is running on port 3000
```bash
npm run dev
```

### Issue: "Timeout waiting for selector"
**Solution**: Selectors may have changed. Update in `login.spec.ts`:
```typescript
// Find correct selector:
await page.locator('your-selector').click();
```

### Issue: "Test credentials invalid"
**Solution**: Verify credentials in `.env.test.local` match Supabase test user

### Issue: Tests pass locally but fail in CI
**Solution**: Check viewport size (headless mode may differ) and use `--headed` for debugging

## 📚 Resources

- [Playwright Docs](https://playwright.dev/)
- [Test Case Specifications](../test-case/login.md)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)

## ✨ Best Practices

1. **Keep tests independent** - Each test should be able to run alone
2. **Use meaningful selectors** - Prefer `role` selectors over generic classes
3. **Avoid hardcoded waits** - Use proper locator waits
4. **Capture failures** - Screenshots and videos help debugging
5. **Run locally first** - Before pushing to CI
6. **Update .env.test.local** - Keep credentials in local file (not in git)

## 🔐 Security

- ⚠️ **Never commit `.env.test.local`** - Add to `.gitignore`
- ⚠️ **Test credentials should be different from production**
- ⚠️ **Use test user account, not admin account**

## 📞 Support

For issues or questions:
1. Check Playwright documentation
2. Review test output and screenshots
3. Run with `--debug` flag for step-by-step execution
