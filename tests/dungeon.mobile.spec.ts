import { test, expect } from '@playwright/test';
import { login } from './utils';

test.describe('Dungeon Exploration on Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1' });

  test('should allow an existing user to login, enter the first dungeon, and start exploration', async ({ page }) => {
    // 1. 로그인
    await login(page, { id: 'testuser', password: 'password123' });
    await page.waitForURL('/');

    // 2. 던전 페이지로 이동
    await page.getByRole('link', { name: 'Dungeon' }).click();
    await page.waitForURL('/dungeon');

    // 3. 첫 번째 던전 선택
    await page.getByText('D1. 마법의 숲').first().click();

    // 4. "파티 구성" 화면이 나타나는지 확인
    await expect(page.getByRole('heading', { name: '파티 구성' })).toBeVisible();

    // 5. 사용 가능한 크리터 목록이 보이는지 확인
    const availableCritters = page.locator('[data-testid="available-critter-list"]');
    await expect(availableCritters).toBeVisible();
    const critterItems = availableCritters.locator('[data-testid^="critter-"]');
    await expect(critterItems.first()).toBeVisible();

    // 6. 파티에 크리터 추가 및 상태 직접 확인
    await critterItems.nth(0).click();
    await expect(async () => {
      const party = await page.evaluate(() => (window as any).dungeonStore.getState().party);
      expect(party.filter(Boolean).length).toBe(1);
    }).toPass();

    await critterItems.nth(1).click();
    await expect(async () => {
      const party = await page.evaluate(() => (window as any).dungeonStore.getState().party);
      expect(party.filter(Boolean).length).toBe(2);
    }).toPass();
    
    await critterItems.nth(2).click();
    await expect(async () => {
      const party = await page.evaluate(() => (window as any).dungeonStore.getState().party);
      expect(party.filter(Boolean).length).toBe(3);
    }).toPass();

    // 7. 파티가 채워졌는지 UI로 최종 확인
    const partySlots = page.locator('[data-testid="party-formation"] [data-testid^="critter-"]');
    await expect(partySlots).toHaveCount(3);
    
    // 8. 탐험 시작 버튼 클릭
    const startButton = page.getByRole('button', { name: '탐험 시작' });
    await expect(startButton).toBeEnabled();
    await startButton.click();

    // 9. 탐험 진행 중 화면으로 변경되었는지 확인
    await expect(page.getByText('탐험 진행 중...')).toBeVisible();
    await expect(page.getByRole('button', { name: '탐험 중단' })).toBeVisible();
  });
}); 