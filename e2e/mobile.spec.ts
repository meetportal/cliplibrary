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

test('the clip editor switches between properties and timeline on a phone', async ({ page }) => {
  await page.goto('/clips/chevron-mark-assemble-a');
  await expect(page.getByRole('tab', { name: 'Properties' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(await pageWidth(page)).toBe(0);
  await page.getByRole('tab', { name: 'Timeline' }).click();
  await expect(page.getByRole('button', { name: 'Clip element' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export' })).toBeAttached();
});
