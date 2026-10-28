import { expect, type Page, test } from '@playwright/test';

type Chunk = Record<string, unknown>;

const context = (kind: 'clip' | 'poster', title: string): Chunk => ({
  type: 'data-context',
  data: {
    model: 'google/gemini-3.7-flash',
    fallbackModel: 'google/gemini-3.5-flash',
    kind,
    title,
    canvas: '1080×1350',
    timing: kind === 'clip' ? '3.0s at 30fps' : null,
    layers: 1,
    elements: 1,
    controls: kind === 'clip' ? 62 : 0,
    selection: [],
    documentBytes: 2048,
    assets: 0,
    history: 1,
    instructions: `You are the editing agent for "${title}".`,
  },
});

const editCall = (id: string, summary: string, operations: unknown[], output: unknown): Chunk[] => [
  { type: 'start-step' },
  { type: 'tool-input-start', toolCallId: id, toolName: 'editMedia' },
  {
    type: 'tool-input-available',
    toolCallId: id,
    toolName: 'editMedia',
    input: { summary, operations },
  },
  { type: 'tool-output-available', toolCallId: id, output },
  { type: 'finish-step' },
];

const reply = (text: string): Chunk[] => [
  { type: 'reasoning-start', id: 'think' },
  {
    type: 'reasoning-delta',
    id: 'think',
    delta: '**Finding the control**\n\nThe request maps to one field.',
  },
  { type: 'reasoning-end', id: 'think' },
  { type: 'text-start', id: 'reply' },
  ...text.split(' ').map((word) => ({ type: 'text-delta', id: 'reply', delta: `${word} ` })),
  { type: 'text-end', id: 'reply' },
];

const sse = (chunks: Chunk[]): string =>
  [
    { type: 'start', messageId: 'agent', messageMetadata: { startedAt: 1000 } },
    ...chunks,
    {
      type: 'finish',
      messageMetadata: {
        finishedAt: 3400,
        model: 'google/gemini-3.7-flash',
        steps: 1,
        inputTokens: 5108,
        outputTokens: 531,
        reasoningTokens: 418,
      },
    },
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

test('the agent traces how it edits a clip and the edit can be undone', async ({ page }) => {
  const operations = [
    { op: 'replace', path: '/tracks/0/elements/0/props/text', value: 'HELLO FROM THE AGENT' },
  ];
  const seen = await mockAgent(
    page,
    sse([
      context('clip', 'Word Build'),
      ...reply('Changing the line text.'),
      ...editCall('edit-1', 'Rewrite the line', operations, { ok: true, operations }),
    ]),
  );
  await page.goto('/clips/word-build');
  await ask(page, 'Change the text');

  const panel = page.getByRole('region', { name: 'AI editor' });
  await expect(panel.getByText('Read the video')).toBeVisible();
  await expect(panel.getByText('Changing the line text.')).toBeVisible();
  const operation = panel.getByTestId('agent-operation');
  await expect(operation).toContainText('Word Build › Text › Line');
  await expect(operation).toContainText('HELLO FROM THE AGENT');
  await expect(panel.getByText('Passed schema validation, applied as one undo step')).toBeVisible();
  await expect(panel.getByTestId('agent-summary')).toContainText('5,108 tokens in');
  await expect(panel.getByTestId('agent-status')).toContainText('Done');
  expect(seen.media[0]).toMatchObject({ kind: 'clip', title: 'Word Build' });

  const editorBox = await page
    .locator('aside')
    .filter({ has: page.locator('textarea') })
    .boundingBox();
  const panelBox = await panel.boundingBox();
  expect((editorBox?.x ?? 0) + (editorBox?.width ?? 0)).toBeLessThanOrEqual(panelBox?.x ?? 0);

  const line = page.locator('aside textarea').first();
  await expect(line).toHaveValue('HELLO FROM THE AGENT');
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(line).not.toHaveValue('HELLO FROM THE AGENT');
});

test('a rejected poster edit is shown, retried and applied on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const rejected = [{ op: 'replace', path: '/elements/0/fontFamily', value: 'Nunito' }];
  const fixed = [
    { op: 'replace', path: '/controls/4/value', value: 'Nunito' },
    { op: 'replace', path: '/title', value: 'Agent Poster' },
  ];
  await mockAgent(
    page,
    sse([
      context('poster', 'Amber Client Reviews 1'),
      ...reply('Updating the poster.'),
      ...editCall('edit-1', 'Use Nunito', rejected, {
        ok: false,
        error:
          'CLIENT fontFamily is driven by the "Heading font" control. Replace /controls/4/value instead',
      }),
      ...editCall('edit-2', 'Use Nunito and rename', fixed, { ok: true, operations: fixed }),
    ]),
  );
  await page.goto('/posters/amber-client-reviews-01');
  await expect(page.getByTestId('design-canvas').locator('canvas').first()).toBeVisible();
  await ask(page, 'Rename it');

  const panel = page.getByRole('region', { name: 'AI editor' });
  await expect(panel.getByText('Validation rejected this edit.', { exact: false })).toBeVisible();
  await expect(
    panel.getByText('driven by the "Heading font" control', { exact: false }).first(),
  ).toBeVisible();
  await expect(panel.getByText('· attempt 2')).toBeVisible();
  await expect(panel.getByTestId('agent-operation').first()).toContainText(
    'CLIENT › Text › Font family',
  );
  await expect(panel.getByTestId('agent-operation').first()).toContainText('“Figtree”');
  const themed = panel.getByTestId('agent-operation').nth(1);
  await expect(themed).toContainText('Theme › Fonts › Heading font');
  await expect(themed).toContainText('“Nunito”');
  await expect(panel.getByText('Passed schema validation, applied as one undo step')).toBeVisible();

  const box = await panel.boundingBox();
  expect(box?.width).toBe(390);
  expect((box?.y ?? 0) > 844 / 3).toBe(true);
  await panel.getByRole('button', { name: 'Close AI editor' }).click();
  await expect(page.getByLabel('Design title')).toHaveValue('Agent Poster');
  await expect
    .poll(() =>
      page.evaluate(() => {
        const saved = JSON.parse(
          localStorage.getItem('cliplibrary-poster:amber-client-reviews-01') ?? '{}',
        );
        return [saved.controls?.[4]?.value, saved.elements?.[0]?.fontFamily];
      }),
    )
    .toEqual(['Nunito', 'Nunito']);
});
