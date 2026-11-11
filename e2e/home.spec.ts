import { expect, test } from '@playwright/test';

const search = (query: string) => `/?${new URLSearchParams({ q: query })}`;

test('lists animations and opens the editor', async ({ page }) => {
  await page.goto(search('chevron mark assemble'));
  await expect(page.getByRole('heading', { name: 'Library' })).toBeAttached();
  await expect(page.getByText('Chevron Mark Assemble')).toBeVisible();

  await expect(async () => {
    await page.getByText('Chevron Mark Assemble').click();
    await expect(page).toHaveURL(/\/clips\/chevron-mark-assemble/, { timeout: 5_000 });
  }).toPass({ timeout: 60_000 });
  await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();
});
