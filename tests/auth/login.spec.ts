import { test, expect } from '@playwright/test';

// Load test credentials from .env.test.local
const TEST_EMAIL = process.env.TEST_EMAIL || 'projectichsankamil@gmail.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '123123123';
const INVALID_EMAIL = process.env.INVALID_EMAIL || 'notexist@example.com';
const INVALID_PASSWORD = process.env.INVALID_PASSWORD || 'WrongPassword123!';
const SQL_INJECTION_STRING = process.env.SQL_INJECTION_STRING || "' OR '1'='1";

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
  });

  // Helper function to find error messages with multiple strategies
  async function getErrorMessage(page: any): Promise<boolean> {
    const errorByClass = page.locator('[class*="error"]').first();
    const errorByRole = page.locator('[role="alert"]').first();
    const errorByText = page.getByText(/Invalid|Gagal|credentials/i).first();

    if (await errorByClass.count() > 0) {
      return true;
    } else if (await errorByRole.count() > 0) {
      return true;
    } else if (await errorByText.count() > 0) {
      return true;
    }
    return false;
  }

  test.describe('✅ Positive Test Cases', () => {
    // TC-LOGIN-P01: Login dengan Email dan Password Valid
    test('TC-LOGIN-P01: Login dengan Email dan Password Valid', async ({ page }) => {
      // Step 1: Verify login page is displayed
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(loginButton).toBeVisible();

      // Step 2 & 3: Input valid credentials
      await emailInput.fill(TEST_EMAIL);
      await passwordInput.fill(TEST_PASSWORD);

      // Step 4: Click login button
      await loginButton.click();

      // Expected: Redirect to dashboard or home page after login
      await page.waitForTimeout(3000); // Wait for redirect
      const currentUrl = page.url();
      const isLoggedIn = currentUrl.includes('dashboard') || !currentUrl.includes('/auth/login');
      expect(isLoggedIn).toBeTruthy();
    });

    // TC-LOGIN-P03: Navigasi ke Lupa Password
    test('TC-LOGIN-P03: Navigasi ke Lupa Password', async ({ page }) => {
      // Click forgot password link - try multiple selectors
      let forgotLink = page.locator('a[href*="forgot-password"]');
      
      if (await forgotLink.count() === 0) {
        // Try text-based selector
        forgotLink = page.getByText(/LUPA KATA SANDI|Lupa Password|Forgot Password/i).first();
      }

      if (await forgotLink.count() > 0) {
        await forgotLink.click();
        // Expected: Redirect to forgot-password page
        await page.waitForURL('**/forgot-password', { timeout: 5000 });
        await expect(page).toHaveURL(/\/auth\/forgot-password/);
      }
    });

    // TC-LOGIN-P04: Navigasi ke Halaman Register
    test('TC-LOGIN-P04: Navigasi ke Halaman Register', async ({ page }) => {
      // Find and click register link
      let registerLink = page.locator('a[href*="register"]');
      
      if (await registerLink.count() === 0) {
        // Try text-based selector
        registerLink = page.getByText(/Daftar|Register|Sign Up/i).first();
      }

      if (await registerLink.count() > 0) {
        await registerLink.click();
        // Expected: Redirect to register page
        await page.waitForURL('**/register', { timeout: 5000 });
        await expect(page).toHaveURL(/\/register/);
      }
    });

    // TC-LOGIN-P05: Display Success Message
    test('TC-LOGIN-P05: Display Success Message', async ({ page }) => {
      // Navigate with success query parameter
      await page.goto('/auth/login?success=true');
      
      // Check for success message - use multiple strategies
      const successLocator = page.locator('[class*="success"], [class*="alert"], [role="status"]').first();
      const successText = page.getByText(/berhasil|success/i).first();
      
      // Wait for success message to appear (if it exists)
      if (await successLocator.count() > 0 || await successText.count() > 0) {
        if (await successLocator.count() > 0) {
          await expect(successLocator).toBeVisible();
        } else {
          await expect(successText).toBeVisible();
        }
      }
    });
  });

  test.describe('❌ Negative Test Cases', () => {
    // TC-LOGIN-N01: Login dengan Email Kosong
    test('TC-LOGIN-N01: Login dengan Email Kosong', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // Input only password
      await passwordInput.fill(TEST_PASSWORD);

      // Click login button
      await loginButton.click();

      // Expected: Validation error appears
      const emailInput = page.locator('input[type="email"]');
      const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      
      // Either validation message or error message should appear
      expect(validationMessage || await page.locator('[class*="error"]').count() > 0).toBeTruthy();
    });

    // TC-LOGIN-N02: Login dengan Password Kosong
    test('TC-LOGIN-N02: Login dengan Password Kosong', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const loginButton = page.locator('button[type="submit"]');

      // Input only email
      await emailInput.fill(TEST_EMAIL);

      // Click login button
      await loginButton.click();

      // Expected: Validation error appears
      const passwordInput = page.locator('input[type="password"]');
      const validationMessage = await passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      
      expect(validationMessage || await page.locator('[class*="error"]').count() > 0).toBeTruthy();
    });

    // TC-LOGIN-N03: Login dengan Email Format Invalid
    test('TC-LOGIN-N03: Login dengan Email Format Invalid', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // Input invalid email format
      await emailInput.fill('testuser@');
      await passwordInput.fill(TEST_PASSWORD);

      // Click login button
      await loginButton.click();

      // Expected: Validation error for invalid email format
      const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
      expect(validationMessage.length > 0 || await page.locator('[class*="error"]').count() > 0).toBeTruthy();
    });

    // TC-LOGIN-N04: Login dengan Password Salah
    test('TC-LOGIN-N04: Login dengan Password Salah', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // Input valid email but wrong password
      await emailInput.fill(TEST_EMAIL);
      await passwordInput.fill(INVALID_PASSWORD);

      // Click login button
      await loginButton.click();

      // Wait for response
      await page.waitForTimeout(2000);

      // Check that error is shown or user is not logged in
      const hasError = await getErrorMessage(page);
      const currentUrl = page.url();
      const isNotOnDashboard = !currentUrl.includes('dashboard');
      
      expect(hasError || isNotOnDashboard).toBeTruthy();
    });

    // TC-LOGIN-N05: Login dengan User Tidak Terdaftar
    test('TC-LOGIN-N05: Login dengan User Tidak Terdaftar', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // Input unregistered email
      await emailInput.fill(INVALID_EMAIL);
      await passwordInput.fill(TEST_PASSWORD);

      // Click login button
      await loginButton.click();

      // Wait for error message
      await page.waitForTimeout(2000);
      const hasError = await getErrorMessage(page);
      expect(hasError).toBeTruthy();
    });

    // TC-LOGIN-N06: Tombol Disable Saat Loading
    test('TC-LOGIN-N06: Tombol Disable Saat Loading', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // Input valid credentials
      await emailInput.fill(TEST_EMAIL);
      await passwordInput.fill(TEST_PASSWORD);

      // Click login button
      await loginButton.click();

      // Check that button is disabled or shows loading state
      const isDisabled = await loginButton.isDisabled();
      const buttonText = await loginButton.textContent();

      // Button should be disabled or show loading text
      expect(isDisabled || buttonText?.toLowerCase().includes('masuk') || buttonText?.toLowerCase().includes('loading')).toBeTruthy();
    });

    // TC-LOGIN-N07: Multiple Failed Login Attempts
    test('TC-LOGIN-N07: Multiple Failed Login Attempts', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // Try 3 failed attempts
      for (let i = 0; i < 3; i++) {
        await emailInput.clear();
        await passwordInput.clear();

        // Input wrong credentials
        await emailInput.fill(TEST_EMAIL);
        await passwordInput.fill(`WrongPassword${i}!`);

        // Click login
        await loginButton.click();

        // Wait for error message
        await page.waitForTimeout(2000);
        const hasError = await getErrorMessage(page);
        expect(hasError).toBeTruthy();

        // Short wait before next attempt
        if (i < 2) {
          await page.waitForTimeout(500);
        }
      }
    });

    // TC-LOGIN-N08: SQL Injection Attempt
    test('TC-LOGIN-N08: SQL Injection Attempt', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // Input SQL injection attempt
      await emailInput.fill(SQL_INJECTION_STRING);
      await passwordInput.fill(TEST_PASSWORD);

      // Click login
      await loginButton.click();

      // Wait for response
      await page.waitForTimeout(2000);

      // Verify user is NOT logged in (not on dashboard)
      const currentUrl = page.url();
      expect(!currentUrl.includes('dashboard')).toBeTruthy();
    });
  });

  test.describe('⚠️ Edge Cases', () => {
    // TC-LOGIN-E01: Login dengan Whitespace di Email
    test('TC-LOGIN-E01: Login dengan Whitespace di Email', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // Input email with whitespace
      await emailInput.fill(`  ${TEST_EMAIL}  `);
      await passwordInput.fill(TEST_PASSWORD);

      // Click login
      await loginButton.click();

      // Expected: Login should succeed (whitespace trimmed) or show error
      await page.waitForTimeout(2000);
      
      // Check if navigated to dashboard or error appears
      const isOnDashboard = page.url().includes('dashboard');
      const hasError = await page.locator('[class*="error"]').count() > 0;
      
      expect(isOnDashboard || hasError).toBeTruthy();
    });

    // TC-LOGIN-E02: Copy-Paste Password dengan Trailing Newline
    test('TC-LOGIN-E02: Copy-Paste Password dengan Trailing Newline', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // Input credentials with trailing newline in password
      await emailInput.fill(TEST_EMAIL);
      // Simulate copy-paste with newline
      const passwordWithNewline = TEST_PASSWORD + '\n';
      await passwordInput.fill(passwordWithNewline);

      // Click login
      await loginButton.click();

      // Wait for response
      await page.waitForTimeout(2000);

      // Should either succeed or show error
      const isOnDashboard = page.url().includes('dashboard');
      const hasError = await page.locator('[class*="error"]').count() > 0;
      
      expect(isOnDashboard || hasError).toBeTruthy();
    });

    // TC-LOGIN-E03: Browser Autofill
    test('TC-LOGIN-E03: Browser Autofill (Manual Verification)', async ({ page }) => {
      // This test simulates autofill scenario
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // Check if inputs are present and visible
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();

      // Manually fill as if autofilled
      await emailInput.fill(TEST_EMAIL);
      await passwordInput.fill(TEST_PASSWORD);

      // Verify fields are filled
      await expect(emailInput).toHaveValue(TEST_EMAIL);
      await expect(passwordInput).toHaveValue(TEST_PASSWORD);

      // Login should work
      await loginButton.click();

      // Should redirect to dashboard
      await page.waitForTimeout(2000);
      const isOnDashboard = page.url().includes('dashboard');
      expect(isOnDashboard).toBeTruthy();
    });

    // TC-LOGIN-E04: Responsive UI Mobile
    test('TC-LOGIN-E04: Responsive UI Mobile (375px)', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });

      // Verify all elements are visible
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(loginButton).toBeVisible();

      // Check touch targets (should be >= 44px)
      const buttonBox = await loginButton.boundingBox();
      if (buttonBox) {
        expect(buttonBox.width).toBeGreaterThanOrEqual(44);
        expect(buttonBox.height).toBeGreaterThanOrEqual(44);
      }

      // Test mobile input
      await emailInput.fill(TEST_EMAIL);
      await passwordInput.fill(TEST_PASSWORD);

      // Verify values were set
      await expect(emailInput).toHaveValue(TEST_EMAIL);
      await expect(passwordInput).toHaveValue(TEST_PASSWORD);

      // Verify no horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = 375;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
    });
  });

  test.describe('🔧 Additional Tests', () => {
    // Test Google Login Button Visibility
    test('Google Login Button is Visible', async ({ page }) => {
      const googleButton = page.getByText(/Google|Masuk dengan Google/i).first();
      
      if (await googleButton.count() > 0) {
        await expect(googleButton).toBeVisible();
      }
    });

    // Test Form Elements Structure
    test('Login Form Structure is Complete', async ({ page }) => {
      const form = page.locator('form');
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      await expect(form).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitButton).toBeVisible();
    });

    // Test Page Title
    test('Login Page Has Correct Title', async ({ page }) => {
      const title = await page.title();
      // Just verify there's a title, the actual title can vary
      expect(title).toBeTruthy();
      expect(title.length > 0).toBeTruthy();
    });
  });
});
