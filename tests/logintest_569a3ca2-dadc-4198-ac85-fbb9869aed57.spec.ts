
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('LoginTest_2025-06-24', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:3000');

    // Click element
    await page.click('a[href='/sign-in']');

    // Fill input field
    await page.fill('#username', 'testuser');

    // Fill input field
    await page.fill('#password', 'password123');

    // Click element
    await page.click('button[type='submit']');
});