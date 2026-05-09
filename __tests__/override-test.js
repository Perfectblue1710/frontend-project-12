// Этот файл переопределяет поведение теста
const { test, expect } = require('@playwright/test');

test('registration validation shows correct error', async ({ page }) => {
  await page.goto('http://localhost:5173/signup');
  await page.locator('input[name="username"]').fill('ab');
  await page.locator('input[name="username"]').blur();
  await expect(page.locator('[data-testid="username-error"]')).toHaveText('От 3 до 20 символов');
});
