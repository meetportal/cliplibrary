import { devices, expect, type Page, test } from '@playwright/test';

test.use({ ...devices['iPhone 13'], defaultBrowserType: 'chromium' });

const pageWidth = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test('the library fits a phone screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('searchbox', { name: 'Search the library' })).toBeVisible();
  expect(await pageWidth(page)).toBe(0);
  await expect(page.getByRole('banner')).toBeInViewport();
});
