import { expect, type Page, test } from '@playwright/test';

const streamEdit = (summary: string, reply: string, operations: unknown[]): string =>
  [
    { type: 'start', messageId: 'agent-message' },
    { type: 'start-step' },
    { type: 'text-start', id: 'reply' },
    ...reply.split(' ').map((word) => ({ type: 'text-delta', id: 'reply', delta: `${word} ` })),
    { type: 'text-end', id: 'reply' },
    {
      type: 'tool-input-available',
      toolCallId: 'edit-1',
      toolName: 'editMedia',
      input: { summary, operations },
    },
    { type: 'tool-output-available', toolCallId: 'edit-1', output: { ok: true, operations } },
    { type: 'finish-step' },
    { type: 'finish' },
  ]
    .map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`)
    .concat('data: [DONE]\n\n')
    .join('');

const mockAgent = async (page: Page, body: string): Promise<{ media: unknown[] }> => {
  const seen: { media: unknown[] } = { media: [] };
  await page.route('**/api/agent', async (route) => {
    seen.media.push(route.request().postDataJSON().media);
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'text/event-stream', 'x-vercel-ai-ui-message-stream': 'v1' },
      body,
    });
  });
  return seen;
};

const ask = async (page: Page, prompt: string): Promise<void> => {
  await page.getByRole('button', { name: 'Edit with AI' }).click();
  const panel = page.getByRole('region', { name: 'AI editor' });
  await expect(panel).toBeVisible();
  await panel.getByLabel('Message the AI editor').fill(prompt);
  await panel.getByRole('button', { name: 'Send', exact: true }).click();
};

test('the agent streams an edit into a clip and it can be undone', async ({ page }) => {
  const operations = [
    { op: 'replace', path: '/tracks/0/elements/0/props/text', value: 'HELLO FROM THE AGENT' },
  ];
  const seen = await mockAgent(
    page,
    streamEdit('Rewrite the line', 'Changing the line text.', operations),
  );
  await page.goto('/clips/word-build');
  await ask(page, 'Change the text');

  const panel = page.getByRole('region', { name: 'AI editor' });
  await expect(panel.getByText('Changing the line text.')).toBeVisible();
  await expect(panel.getByTestId('agent-edit')).toHaveAttribute('data-state', 'output-available');
  expect(seen.media[0]).toMatchObject({ kind: 'clip', title: 'Word Build' });

  await panel.getByRole('button', { name: 'Close AI editor' }).click();
  const line = page.locator('aside textarea').first();
  await expect(line).toHaveValue('HELLO FROM THE AGENT');
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(line).not.toHaveValue('HELLO FROM THE AGENT');
});

test('the agent edits a poster and shows on a phone as a bottom sheet', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const operations = [{ op: 'replace', path: '/title', value: 'Agent Poster' }];
  await mockAgent(page, streamEdit('Rename the poster', 'Renaming the poster.', operations));
  await page.goto('/posters/amber-client-reviews-01');
  await expect(page.getByTestId('design-canvas').locator('canvas').first()).toBeVisible();
  await ask(page, 'Rename it');

  const panel = page.getByRole('region', { name: 'AI editor' });
  await expect(panel.getByText('Renaming the poster.')).toBeVisible();
  const box = await panel.boundingBox();
  expect(box?.width).toBe(390);
  expect((box?.y ?? 0) > 844 / 3).toBe(true);
  await panel.getByRole('button', { name: 'Close AI editor' }).click();
  await expect(page.getByLabel('Design title')).toHaveValue('Agent Poster');
});
