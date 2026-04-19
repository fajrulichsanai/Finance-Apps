import { Page, expect } from '@playwright/test';

/**
 * Helper utilities for login automation tests
 */

export const LoginTestHelpers = {
  /**
   * Fill email input with given value
   */
  async fillEmail(page: Page, email: string) {
    const emailInput = page.locator('input[type="email"]');
    await emailInput.clear();
    await emailInput.fill(email);
  },

  /**
   * Fill password input with given value
   */
  async fillPassword(page: Page, password: string) {
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.clear();
    await passwordInput.fill(password);
  },

  /**
   * Click the login/submit button
   */
  async clickLoginButton(page: Page) {
    const loginButton = page.locator('button[type="submit"]');
    await loginButton.click();
  },

  /**
   * Fill email and password then submit
   */
  async loginWithCredentials(page: Page, email: string, password: string) {
    await this.fillEmail(page, email);
    await this.fillPassword(page, password);
    await this.clickLoginButton(page);
  },

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(page: Page): Promise<boolean> {
    const errorMessage = page.locator('[class*="error"], [role="alert"], text=/Invalid|Gagal|Error/i');
    return (await errorMessage.count()) > 0;
  },

  /**
   * Get error message text
   */
  async getErrorMessage(page: Page): Promise<string | null> {
    const errorMessage = page.locator('[class*="error"], [role="alert"]');
    if (await errorMessage.count() > 0) {
      return await errorMessage.textContent();
    }
    return null;
  },

  /**
   * Wait for login to succeed (redirect to dashboard)
   */
  async waitForLoginSuccess(page: Page, timeout: number = 10000) {
    await page.waitForURL('**/dashboard', { timeout });
  },

  /**
   * Verify user is on login page
   */
  async isOnLoginPage(page: Page): Promise<boolean> {
    return page.url().includes('/auth/login');
  },

  /**
   * Check if login button is disabled
   */
  async isLoginButtonDisabled(page: Page): Promise<boolean> {
    const loginButton = page.locator('button[type="submit"]');
    return await loginButton.isDisabled();
  },

  /**
   * Get login button text
   */
  async getLoginButtonText(page: Page): Promise<string | null> {
    const loginButton = page.locator('button[type="submit"]');
    return await loginButton.textContent();
  },

  /**
   * Navigate to forgot password page
   */
  async navigateToForgotPassword(page: Page) {
    const forgotLink = page.locator('a[href*="forgot-password"]');
    if (await forgotLink.count() > 0) {
      await forgotLink.click();
    } else {
      await page.locator('text=/LUPA KATA SANDI|Lupa Password/i').click();
    }
    await page.waitForURL('**/forgot-password', { timeout: 5000 });
  },

  /**
   * Navigate to register page
   */
  async navigateToRegister(page: Page) {
    const registerLink = page.locator('a[href*="register"]');
    if (await registerLink.count() > 0) {
      await registerLink.click();
    } else {
      await page.locator('text=/Daftar|Register/i').click();
    }
    await page.waitForURL('**/register', { timeout: 5000 });
  },

  /**
   * Verify form structure exists
   */
  async verifyFormStructure(page: Page) {
    const form = page.locator('form');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(form).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  },

  /**
   * Check if email field has required attribute
   */
  async isEmailFieldRequired(page: Page): Promise<boolean> {
    const emailInput = page.locator('input[type="email"]');
    const required = await emailInput.evaluate((el: HTMLInputElement) => el.required);
    return required;
  },

  /**
   * Check if password field has required attribute
   */
  async isPasswordFieldRequired(page: Page): Promise<boolean> {
    const passwordInput = page.locator('input[type="password"]');
    const required = await passwordInput.evaluate((el: HTMLInputElement) => el.required);
    return required;
  },

  /**
   * Get validation message for email field
   */
  async getEmailValidationMessage(page: Page): Promise<string> {
    const emailInput = page.locator('input[type="email"]');
    return await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
  },

  /**
   * Get validation message for password field
   */
  async getPasswordValidationMessage(page: Page): Promise<string> {
    const passwordInput = page.locator('input[type="password"]');
    return await passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);
  },

  /**
   * Check for XSS or SQL injection vulnerabilities in page
   */
  async checkForSecurityIssues(page: Page): Promise<string[]> {
    const issues: string[] = [];
    const pageText = await page.textContent();

    if (pageText?.includes('database')) issues.push('Database error exposed');
    if (pageText?.includes('SQL')) issues.push('SQL error exposed');
    if (pageText?.includes('error_code')) issues.push('Error code exposed');
    if (pageText?.includes('stack trace')) issues.push('Stack trace exposed');
    if (pageText?.includes('<script>')) issues.push('XSS vulnerability detected');

    return issues;
  },

  /**
   * Trim whitespace from input value
   */
  async getEmailValue(page: Page): Promise<string> {
    const emailInput = page.locator('input[type="email"]');
    const value = await emailInput.inputValue();
    return value;
  },

  /**
   * Check if page is responsive for mobile
   */
  async checkMobileResponsiveness(page: Page) {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // Check for horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 375;

    if (bodyWidth > viewportWidth) {
      throw new Error(`Horizontal scroll detected: body width ${bodyWidth}px > viewport ${viewportWidth}px`);
    }
  },
};
