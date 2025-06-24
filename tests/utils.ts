import { expect, Page } from '@playwright/test';

export const TEST_USER = {
  id: 'testuser',
  password: 'password123',
};

export const ADMIN_USER = {
  id: 'admin',
  password: 'admin',
};

export async function login(page: Page, user: { id: string, password: string } = TEST_USER) {
  await page.goto('/sign-in');
  await page.getByLabel('아이디').fill(user.id);
  await page.getByLabel('비밀번호').fill(user.password);

  const responsePromise = page.waitForResponse(resp => resp.url().includes('/api/auth/sign-in') && resp.status() === 200);
  await page.getByRole('button', { name: '로그인' }).click();
  await responsePromise;

  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: '발견된 크리터', level: 2 })).toBeVisible();
}

export async function logout(page: Page) {
  try {
    const logoutButton = page.getByRole('button', { name: '로그아웃' });
    if (await logoutButton.isVisible({ timeout: 5000 })) { // 5초 타임아웃
      await logoutButton.click();
      await page.waitForURL('/sign-in');
    }
  } catch (e) {
    // 버튼이 보이지 않으면 이미 로그아웃된 상태로 간주
    console.log('Logout button not visible, assuming already logged out.');
  }
} 