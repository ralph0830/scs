import { test, expect } from '@playwright/test';

test.describe('Login functionality', () => {
  test('should allow a user to log in and be redirected to the home page', async ({ page }) => {
    await page.goto('/sign-in');

    // Fill in the login form
    await page.getByLabel('아이디').fill('testuser');
    await page.getByLabel('비밀번호').fill('password123');

    // Click the login button
    await page.getByRole('button', { name: '로그인' }).click();

    // Wait for navigation to the home page
    await page.waitForURL('/');

    // Check if the user is logged in
    // For example, check for a logout button or a user-specific element
    await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible();
  });
}); 