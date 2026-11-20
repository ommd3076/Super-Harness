import { expect, test } from '@playwright/test';

const originals = [
  ['loading-state', 'Loading State', ['Drive', 'Dots', 'Orbit', 'Surfer']],
  ['thinking-state', 'Thinking', ['Steps', 'Reasoning', 'Search', 'Coding']],
  ['streaming-text', 'Streaming Text', []],
  ['approval-card', 'Approval Card', []],
  ['tool-chips', 'Tool Chips', []],
  ['task-rows', 'Task Rows', ['Capsules', 'List']],
  ['chat-composer', 'Chat', []],
  ['prompt-bar', 'Prompt Bar', ['Rounded', 'Pill']],
  ['recommendation-card', 'Recommendation Card', []],
  ['context-cards', 'Context Cards', []],
  ['diff-table', 'Diff Table', []],
  ['records-table', 'Records Table', []],
  ['filter-table', 'Filter Table', []],
  ['sidebar-nav', 'Sidebar Nav', []],
  ['search', 'Search', []],
  ['flowchart', 'Flowchart', []],
  ['insight-cards', 'Insight Cards', []],
  ['code-block', 'Code Block', ['Code', 'Diff']],
  ['fine-tune-card', 'Fine-tune Card', []],
  ['selection-actions', 'Selection Actions', []],
  ['agent-screen', 'Agent Screen', ['Working', 'Loading']],
] as const;

test('renders the original component catalog and switches every published demo variant', async ({ page }, testInfo) => {
  test.setTimeout(75_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/dev/components');
  const demos = page.locator('.primitive-showcase');
  await expect(demos).toHaveCount(originals.length);

  for (const [id, title, variants] of originals) {
    const demo = demos.filter({ has: page.getByRole('heading', { name: title, exact: true, level: 3 }) });
    await expect(demo).toHaveAttribute('id', id);
    await expect(demo.locator('.primitive-demo-surface')).toBeVisible();
    for (const variant of variants) {
      await demo.getByRole('button', { name: variant, exact: true }).click();
    }
    if (variants.length > 1) {
      await demo.getByRole('button', { name: variants[0], exact: true }).click();
    }
  }

  await expect(page.getByRole('heading', { name: 'Beautiful UI components' })).toHaveCSS(
    'font-family',
    /Inter Variable/,
  );
  await expect(page.locator('#code-block').getByText('churn.ts', { exact: true })).toHaveCSS(
    'font-family',
    /JetBrains Mono Variable/,
  );

  const approval = page.locator('#approval-card');
  await approval.getByText('Three (core line)', { exact: true }).click();
  await approval.getByRole('button', { name: 'Continue' }).click();
  await expect(approval.getByRole('button', { name: 'Previous question' })).toBeEnabled();

  await page.locator('#prompt-bar').getByRole('textbox', { name: 'Prompt' }).fill('/');
  await expect(page.locator('#prompt-bar').getByRole('textbox', { name: 'Prompt' })).toHaveValue('/');

  await page.locator('#agent-screen').getByRole('button', { name: 'Open', exact: true }).click();
  const viewer = page.getByRole('dialog', { name: /screen/ });
  await expect(viewer).toBeVisible();
  await viewer.getByRole('button', { name: 'Teach a task' }).click();
  await viewer.getByRole('button', { name: 'End', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(viewer).toBeHidden();

  await page.evaluate(() => document.fonts.ready);
  const viewport = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.width + 1);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath('original-component-gallery.png'),
    fullPage: true,
    animations: 'disabled',
  });
});
