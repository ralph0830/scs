
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('SignUpAndLoginTest_2025-06-24', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:3000/sign-up');

    // Fill input field
    await page.fill('#userId', 'testuser123');

    // Fill input field
    await page.fill('#password', 'pwtest123');

    // Fill input field
    await page.fill('#confirmPassword', 'pwtest123');

    // Click element
    await page.click('button[type='submit']');

    // Navigate to URL
    await page.goto('http://localhost:3000/sign-in');

    // Fill input field
    await page.fill('#username', 'testuser123');

    // Fill input field
    await page.fill('#password', 'pwtest123');

    // Click element
    await page.click('button[type='submit']');
});