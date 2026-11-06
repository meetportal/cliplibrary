import { expect, type Page, test } from '@playwright/test';

const VIEWPORTS = [
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'monitor', width: 2560, height: 1440 },
];

const pageOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('the library fills the width without overflowing', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('searchbox', { name: 'Search the library' })).toBeVisible();
      expect(await pageOverflow(page)).toBe(0);
    });
  });
}
