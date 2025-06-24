import { test, expect } from '@playwright/test';
import { login, logout, ADMIN_USER } from './utils';

test.describe('Admin Panel', () => {

  test.beforeEach(async ({ page }) => {
    // ADMIN_USER로 로그인하고, isAdmin 옵션을 전달
    await login(page, ADMIN_USER, { isAdmin: true });
  });

  // afterEach 훅을 제거하여 테스트 독립성 문제 해결
  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('should redirect unauthenticated users to login page', async ({ page, context }) => {
    // 쿠키를 지워 비인증 상태로 만듦
    await context.clearCookies();
    await page.goto('/admin');
    // /sign-in 페이지로 리디렉션되는지 확인
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test.describe('Critter Management', () => {
    test('should display seeded critters in the table', async ({ page }) => {
      await expect(page.getByRole('cell', { name: '아쿠아핀' })).toBeVisible();
      await expect(page.getByRole('cell', { name: '파이로' })).toBeVisible();
    });

    test('should add, update, and delete a critter', async ({ page }) => {
      // Add
      await page.getByRole('button', { name: '새 크리터 추가' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByLabel('Name').fill('테스트 크리터');
      await page.getByRole('combobox').click();
      await page.getByRole('option', { name: 'Water' }).click();
      await page.getByLabel('Description').fill('테스트용 크리터입니다.');
      let responsePromise = page.waitForResponse(resp => resp.url().includes('/api/critters') && resp.status() === 201);
      await page.getByRole('button', { name: 'Save Changes' }).click();
      await responsePromise;
      await expect(page.getByRole('cell', { name: '테스트 크리터' }).first()).toBeVisible();
      
      // Update
      await page.getByRole('row', { name: /테스트 크리터/ }).first().getByRole('button', { name: '수정' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByLabel('Name').fill('수정된 테스트 크리터');
      responsePromise = page.waitForResponse(resp => resp.url().includes('/api/critters/') && resp.status() === 200);
      await page.getByRole('button', { name: 'Save Changes' }).click();
      await responsePromise;
      await expect(page.getByRole('cell', { name: '수정된 테스트 크리터' }).first()).toBeVisible();

      // Delete (Cleanup)
      page.on('dialog', dialog => dialog.accept()); // 이벤트 리스너를 클릭 직전에 등록
      responsePromise = page.waitForResponse(resp => resp.url().includes('/api/critters/') && resp.status() === 200);
      await page.getByRole('row', { name: /수정된 테스트 크리터/ }).first().getByRole('button', { name: '삭제' }).click();
      await responsePromise;
      await expect(page.getByRole('cell', { name: '수정된 테스트 크리터' })).not.toBeVisible();
    });
  });

  test.describe('Type Matchup Management', () => {
    test('should navigate to type matchups page and save changes', async ({ page }) => {
      await page.goto('/admin/types');
      await expect(page.locator('table > tbody > tr').first()).toBeVisible();

      const firstRow = page.locator('table > tbody > tr').first();
      const valueCell = firstRow.locator('td').nth(2);
      
      // 1. '효과 증가' 버튼 클릭
      await firstRow.getByRole('button', { name: '효과 증가' }).click();
      
      // 2. UI 즉시 변경 확인
      await expect(valueCell).toContainText('효과 증가');
      
      // 3. '변경사항 저장' 버튼 클릭
      const saveButton = page.getByRole('button', { name: '변경사항 저장' });
      const responsePromise = page.waitForResponse(resp => resp.url().includes('/api/admin/type-matchups') && resp.status() === 200);
      await saveButton.click();
      
      // 4. API 응답 대기
      await responsePromise;
      
      // 5. (Cleanup) '보통' 버튼으로 UI 되돌리기
      await firstRow.getByRole('button', { name: '보통' }).click();
      await expect(valueCell).toContainText('보통');

      // 6. (Cleanup) 정리된 상태를 서버에 저장
      const cleanupResponsePromise = page.waitForResponse(resp => resp.url().includes('/api/admin/type-matchups') && resp.status() === 200);
      await saveButton.click();
      await cleanupResponsePromise;
    });
  });
}); 