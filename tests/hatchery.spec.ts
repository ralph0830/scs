import { test, expect } from '@playwright/test';
import { login, logout } from './utils';

test.describe('Hatchery Page Authentication Flow', () => {

  test('should redirect to sign-in when logged out', async ({ page }) => {
    await page.goto('/hatchery');
    // The server component should redirect to /sign-in
    await expect(page).toHaveURL('/sign-in');
  });
  
  test('should show hatch button when logged in', async ({ page }) => {
    // 1. Log in first
    await login(page);

    // 2. Navigate to the hatchery directly
    await page.goto('/hatchery');

    // 3. Wait for the hatchery page to load by checking for its main heading (h1)
    await expect(page.getByRole('heading', { name: '부화장', level: 1 })).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'hatchery-result.png', fullPage: true });

    // 4. Check for the "부화하기" button
    const hatchButton = page.getByRole('button', { name: '부화하기' });
    await expect(hatchButton).toBeVisible();

    // 5. Clean up by logging out
    await logout(page);
  });
}); 