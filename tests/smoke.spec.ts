import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { for (const key of Object.keys(localStorage)) if (key.startsWith('super-harness-')) localStorage.removeItem(key); });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'What’s on your mind?' })).toBeVisible();
});

test('desktop: preferences, persistent sessions and seeded interactive fixture', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.screenshot({ path: testInfo.outputPath('desktop-home.png'), fullPage: true });

  await page.getByRole('button', { name: 'Settings' }).click();
  const settings = page.getByRole('dialog');
  await settings.getByLabel('Appearance').selectOption('Dark');
  await expect(page.locator('.app')).toHaveAttribute('data-theme', 'dark');
  await settings.getByLabel('Composer shape').selectOption('Pill');
  await expect(page.locator('.app')).toHaveAttribute('data-composer', 'pill');
  await settings.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'Collapse sidebar' }).click();
  await expect(page.getByRole('complementary', { name: 'Workspace navigation' })).toHaveClass(/collapsed/);
  await page.getByRole('button', { name: 'Expand sidebar' }).click();

  // Open the bundled DFA fixture from the Recent list, then keep a separate draft.
  await page.getByRole('complementary', { name: 'Workspace navigation' }).getByRole('button', { name: 'Automata and formal languages' }).click();
  await expect(page.getByRole('heading', { name: 'Which strings should this machine accept?' })).toBeVisible();
  await page.getByRole('button', { name: 'aabb' }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText(/Exactly\. The final two b’s/)).toBeVisible();
  await page.getByRole('button', { name: 'New chat' }).last().click();
  await page.getByRole('textbox', { name: 'Message' }).fill('remember this draft');
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue('remember this draft');
  await expect(page.locator('.tab')).toHaveCount(3);

  await page.getByRole('button', { name: 'Toggle inspector' }).click();
  await expect(page.getByRole('complementary', { name: 'Inspector' })).toBeVisible();
  await page.getByRole('button', { name: 'Close inspector' }).click();
  expect(errors).toEqual([]);
});

test('desktop: all five areas have working controls', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.getByRole('button', { name: 'Study', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Which strings should this machine accept?' })).toBeVisible();
  await page.getByRole('button', { name: 'aabb' }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText(/Exactly\. The final two b’s/)).toBeVisible();

  await page.getByRole('button', { name: 'Workspace', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Build a market landscape' })).toBeVisible();
  await page.getByRole('complementary', { name: 'Workspace navigation' }).getByRole('button', { name: 'Platform architecture' }).click();
  await expect(page.getByRole('heading', { name: 'System architecture' })).toBeVisible();
  await page.getByRole('button', { name: /Browser Inspects a product page/ }).click();
  await expect(page.getByText('NODE INSPECTOR')).toBeVisible();

  await page.getByRole('button', { name: 'Research', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Market monitor' })).toBeVisible();
  const evidenceMatrix = page.getByRole('button', { name: /Evidence matrix/ });
  if (await evidenceMatrix.isVisible()) await evidenceMatrix.click();
  await page.getByLabel('Filter evidence').selectOption('Pricing');
  await expect(page.getByText('Team plan starts at $49 / seat')).toBeVisible();
  await page.getByRole('button', { name: 'Export snapshot' }).click();
  await expect(page.getByRole('complementary', { name: 'Inspector' })).toBeVisible();

  await page.getByRole('button', { name: 'Live', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Fluid' })).toBeVisible();
  await page.getByRole('button', { name: 'Pause listening' }).click();
  await expect(page.getByText('PAUSED', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Resume listening' }).click();
  const speak = page.getByRole('button', { name: /Simulate speaking|Hold to speak/ });
  await speak.click();
  await expect(page.getByRole('button', { name: 'Interrupt' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('mobile: navigation, inspector and viewport have no horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.screenshot({ path: testInfo.outputPath('mobile-home.png'), fullPage: true });
  const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const nav = page.getByRole('navigation', { name: 'Experiences' });
  await nav.getByRole('button', { name: 'Research' }).click();
  await expect(page.getByRole('heading', { name: 'Market monitor' })).toBeVisible();
  await page.locator('.market-tile').filter({ hasText: 'Northstar Analytics' }).click();
  await expect(page.getByRole('complementary', { name: 'Inspector' })).toBeVisible();
  await page.getByRole('button', { name: 'Close inspector' }).click();
  expect(errors).toEqual([]);
});
