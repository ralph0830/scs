import { test, expect } from '@playwright/test';
import { login, logout } from './utils';

test.describe('E2E Tests with Auth', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('should display welcome message on the main page', async ({ page }) => {
    await expect(page.getByRole('link', { name: '별빛 크리터 이야기' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '발견된 크리터', level: 2 })).toBeVisible();
  });

  test('should display critterdex page correctly', async ({ page }) => {
    await page.goto('/critterdex');
    await page.screenshot({ path: 'critterdex-result.png', fullPage: true });
    await page.waitForSelector('text=아쿠아핀', { timeout: 10000 });
    await expect(page.getByText('아쿠아핀')).toBeVisible();
  });

  test('should navigate to hatchery and see the hatch button', async ({ page }) => {
    await page.goto('/hatchery');
    await page.screenshot({ path: 'hatchery-result.png', fullPage: true });
    await page.waitForSelector('button:has-text("부화하기")', { timeout: 10000 });
    await expect(page.getByRole('button', { name: '부화하기' })).toBeVisible();
  });

  test('should navigate to the dungeon page', async ({ page }) => {
    await page.goto('/dungeon');
    await page.screenshot({ path: 'dungeon-result.png', fullPage: true });
    await expect(page.getByRole('link', { name: '던전' })).toBeVisible();
  });
}); 