import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';
import { expect, type Page, test } from '@playwright/test';
import { E2E_USER_EMAIL } from './global-setup';

type Chunk = Record<string, unknown>;

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

const renameCall = (id: string, title: string): Chunk[] => [
  { type: 'tool-input-start', toolCallId: id, toolName: 'renameChat' },
  { type: 'tool-input-available', toolCallId: id, toolName: 'renameChat', input: { title } },
  { type: 'tool-output-available', toolCallId: id, output: { title } },
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
  [{ type: 'start', messageId: 'agent' }, ...chunks, { type: 'finish' }]
    .map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`)
    .concat('data: [DONE]\n\n')
    .join('');

interface Seen {
  media: unknown[];
  titles: unknown[];
}

const mockAgent = async (page: Page, body: string): Promise<Seen> => {
  const seen: Seen = { media: [], titles: [] };
  await page.route('**/api/agent', async (route) => {
    const request = route.request().postDataJSON();
    seen.media.push(request.media);
    seen.titles.push(request.chatTitle);
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'text/event-stream', 'x-vercel-ai-ui-message-stream': 'v1' },
      body,
    });
  });
  return seen;
};

test.beforeEach(async ({ page }) => {
  await setupClerkTestingToken({ page });
  await page.goto('/sign-in');
  await clerk.signIn({ page, emailAddress: E2E_USER_EMAIL });
});

const ask = async (page: Page, prompt: string): Promise<void> => {
  await page.getByRole('button', { name: 'Edit with AI' }).click();
  const panel = page.getByRole('region', { name: 'AI editor' });
  await expect(panel).toBeVisible();
  await panel.getByLabel('Message the AI editor').fill(prompt);
  await panel.getByRole('button', { name: 'Send', exact: true }).click();
};

test('the agent edits a clip, names the chat and keeps both after a reload', async ({ page }) => {
  const operations = [
    { op: 'replace', path: '/tracks/0/elements/0/props/companyName', value: 'Agent Studio' },
  ];
  const seen = await mockAgent(
    page,
    sse([
      ...reply('Changing the company name.'),
      { type: 'start-step' },
      ...renameCall('rename-1', 'Agent greeting'),
      { type: 'finish-step' },
      ...editCall('edit-1', 'Rename the company', operations, { ok: true, operations }),
    ]),
  );
  await page.goto('/clips/dot-ring-logo-reveal-a');
  await ask(page, 'Change the name');

  const panel = page.getByRole('region', { name: 'AI editor' });
  await expect(panel.getByText('Changing the company name.')).toBeVisible();
  await expect(panel.getByTestId('agent-thinking')).toHaveAttribute('data-open', 'false');
  const edit = panel.getByTestId('agent-edit');
  await expect(edit).toHaveAttribute('data-state', 'applied');
  await expect(edit).toContainText('Rename the company');
  await expect(panel.getByTestId('agent-operation')).toContainText('Company name');
  await expect(panel.getByTestId('agent-operation')).toContainText('Agent Studio');
  await expect(panel.getByTestId('agent-chat-title')).toHaveText('Agent greeting');
  await expect(panel.getByText('tokens')).toHaveCount(0);
  expect(seen.media[0]).toMatchObject({ kind: 'clip', title: 'Dot Ring Logo Reveal A' });
  expect(seen.titles[0]).toBeNull();

  const logoAndName = page.getByRole('region', { name: 'Logo and name' });
  const editorBox = await page.locator('aside').filter({ has: logoAndName }).boundingBox();
  const panelBox = await panel.boundingBox();
  expect((editorBox?.x ?? 0) + (editorBox?.width ?? 0)).toBeLessThanOrEqual(panelBox?.x ?? 0);

  const line = logoAndName
    .getByText('Company name', { exact: true })
    .locator('..')
    .getByRole('textbox');
  await expect(line).toHaveValue('Agent Studio');
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(line).not.toHaveValue('Agent Studio');
  await page.getByRole('button', { name: 'Redo' }).click();
  await expect(line).toHaveValue('Agent Studio');

  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem('neuclip-clip:dot-ring-logo-reveal-a') ?? ''),
    )
    .toContain('Agent Studio');
  await page.reload();
  await expect(panel.getByTestId('agent-chat-title')).toHaveText('Agent greeting');
  await expect(panel.getByText('Changing the company name.')).toBeVisible();
  await expect(line).toHaveValue('Agent Studio');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(line).not.toHaveValue('Agent Studio');

  await panel.getByRole('button', { name: 'New chat' }).click();
  await expect(panel.getByTestId('agent-chat-title')).toHaveText('New chat');
  await expect(panel.getByText('What should change in this video?')).toBeVisible();
  await panel.getByRole('button', { name: 'Chats' }).click();
  await page.getByRole('menuitem', { name: /Agent greeting/ }).click();
  await expect(panel.getByText('Changing the company name.')).toBeVisible();

  await panel.getByRole('button', { name: 'Chats' }).click();
  await page.getByRole('menuitem', { name: 'Rename chat' }).click();
  await panel.getByLabel('Chat name').fill('Name change');
  await panel.getByLabel('Chat name').press('Enter');
  await expect(panel.getByTestId('agent-chat-title')).toHaveText('Name change');
  await panel.getByLabel('Message the AI editor').fill('Again');
  await panel.getByRole('button', { name: 'Send', exact: true }).click();
  await expect.poll(() => seen.titles.at(-1)).toBe('Name change');
});

test('a rejected clip edit is retried out of sight and applied on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const path = '/tracks/0/elements/0/props/colors/primary';
  const rejected = [{ op: 'replace', path, value: 'teal' }];
  const fixed = [{ op: 'replace', path, value: '#2a9d8f' }];
  await mockAgent(
    page,
    sse([
      ...reply('Recolouring the dot.'),
      ...editCall('edit-1', 'Make the dot teal', rejected, {
        ok: false,
        error: '/tracks/0/elements/0/props/colors/primary: teal is not a valid colour',
      }),
      ...editCall('edit-2', 'Make the dot teal', fixed, { ok: true, operations: fixed }),
    ]),
  );
  await page.goto('/clips/dot-ring-logo-reveal-a');
  await ask(page, 'Make the dot teal');

  const panel = page.getByRole('region', { name: 'AI editor' });
  const edit = panel.getByTestId('agent-edit');
  await expect(edit).toHaveCount(1);
  await expect(edit).toHaveAttribute('data-state', 'applied');
  await expect(panel.getByText('is not a valid colour')).toHaveCount(0);
  await expect(panel.getByTestId('agent-operation').first()).toContainText('Primary color');
  await expect(panel.getByTestId('agent-chat-title')).toHaveText('Make the dot teal');

  const box = await panel.boundingBox();
  expect(box?.width).toBe(390);
  expect((box?.y ?? 0) > 844 / 3).toBe(true);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const saved = JSON.parse(
          localStorage.getItem('neuclip-clip:dot-ring-logo-reveal-a') ?? '{}',
        );
        return saved.tracks?.[0]?.elements?.[0]?.props?.colors?.primary;
      }),
    )
    .toBe('#2a9d8f');
});
