import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, test } from '@playwright/test';
import { E2E_USER_EMAIL } from './global-setup';

const sse = (chunks: Record<string, unknown>[]): string =>
  [{ type: 'start', messageId: 'agent' }, ...chunks, { type: 'finish' }]
    .map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`)
    .concat('data: [DONE]\n\n')
    .join('');

test.beforeEach(async ({ page }) => {
  await setupClerkTestingToken({ page });
  await page.goto('/sign-in');
  await clerk.signIn({ page, emailAddress: E2E_USER_EMAIL });
});

test('the studio plays, edits notes and drums and exports a WAV', async ({ page }) => {
  await page.goto('/music');
  await page.getByRole('link', { name: /Lofi Sunset/ }).click();
  await expect(page.getByRole('heading', { name: 'Lofi Sunset' })).toBeVisible();

  await page.getByRole('button', { name: 'Play' }).click();
  await expect(page.getByRole('button', { name: 'Stop' })).toBeVisible();
  await page.getByRole('button', { name: 'Stop' }).click();

  const kick = page.getByRole('button', { name: 'Kick step 9' });
  await expect(kick).toHaveAttribute('aria-pressed', 'false');
  await kick.click();
  await expect(kick).toHaveAttribute('aria-pressed', 'true');

  const notes = page.locator('[data-note]');
  const before = await notes.count();
  const roll = page.getByRole('presentation').filter({ has: notes.first() });
  const box = await roll.boundingBox();
  if (box === null) {
    throw new Error('The piano roll is not visible.');
  }
  await page.mouse.click(box.x + box.width * 0.97, box.y + 6);
  await expect(notes).toHaveCount(before + 1);

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'WAV' }).click();
  expect((await download).suggestedFilename()).toBe('lofi-sunset.wav');
});

test('the agent rewrites the score as one undoable edit', async ({ page }) => {
  const operations = [
    { op: 'replace', path: '/tempo', value: 96 },
    { op: 'replace', path: '/key', value: 'C' },
  ];
  await page.route('**/api/agent', (route) =>
    route.fulfill({
      status: 200,
      headers: { 'content-type': 'text/event-stream', 'x-vercel-ai-ui-message-stream': 'v1' },
      body: sse([
        { type: 'text-start', id: 'reply' },
        { type: 'text-delta', id: 'reply', delta: 'Moving it to C minor at 96 BPM.' },
        { type: 'text-end', id: 'reply' },
        { type: 'start-step' },
        { type: 'tool-input-start', toolCallId: 'edit', toolName: 'editMedia' },
        {
          type: 'tool-input-available',
          toolCallId: 'edit',
          toolName: 'editMedia',
          input: { summary: 'New key and tempo', operations },
        },
        { type: 'tool-output-available', toolCallId: 'edit', output: { ok: true, operations } },
        { type: 'finish-step' },
      ]),
    }),
  );
  await page.goto('/music/lofi-sunset');
  await page.getByRole('button', { name: 'Edit with AI' }).click();
  const panel = page.getByRole('region', { name: 'AI editor' });
  await panel.getByLabel('Message the AI editor').fill('Make it C minor at 96 BPM');
  await panel.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByText('96 BPM · C minor')).toBeVisible();
  await expect(panel.getByText('Tempo (BPM)')).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByText('82 BPM · A minor')).toBeVisible();
});

test('an AI render lands as a playable, downloadable track', async ({ page }) => {
  let requested: unknown = null;
  await page.route('**/api/music/render', async (route) => {
    requested = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'audio/mpeg', body: Buffer.from('ID3fake') });
  });
  await page.goto('/music/synthwave-drive');
  await page.getByRole('button', { name: '30 s clip' }).click();
  await expect(page.getByRole('link', { name: 'Download render' })).toBeVisible();
  await expect(page.locator('audio')).toHaveCount(1);
  expect(requested).toMatchObject({ length: 'clip', song: { title: 'Synthwave Drive' } });
});
