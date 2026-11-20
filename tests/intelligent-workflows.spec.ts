import { expect, test, type Page } from '@playwright/test';

async function send(page: Page, text: string) {
  const composer = page.getByRole('textbox', { name:'Message', exact:true });
  await composer.fill(text);
  await composer.press('Enter');
}

test('completes a 12-question brief and updates a local chart, table and isolated preview', async ({ page }, testInfo) => {
  test.setTimeout(45_000);
  const errors: string[] = [];
  page.on('pageerror', error=>errors.push(error.message));
  await page.goto('/');
  await send(page, 'Build a decision brief');
  const form = page.getByRole('form', { name:'Clarify the scope' });
  await form.getByRole('radio', { name:'One question' }).check();
  await expect(form.getByRole('textbox')).toHaveCount(1);
  await form.getByRole('radio', { name:'Five questions' }).check();
  await expect(form.getByRole('textbox')).toHaveCount(5);
  await form.getByRole('radio', { name:'Twelve questions' }).check();
  await expect(form.getByRole('textbox')).toHaveCount(12);
  await form.getByRole('button', { name:'Save answers' }).click();
  await expect(form.getByText('Answers saved in this session.')).toHaveCount(0);
  for (const [index, input] of (await form.getByRole('textbox').all()).entries()) {
    await input.fill('Note ' + (index+1));
  }
  await form.getByRole('button', { name:'Save answers' }).click();
  await expect(form.getByText('Answers saved in this session.')).toBeVisible();
  await expect(form.getByText('Note 12', { exact:true })).toBeVisible();
  await page.reload();
  await expect(form.getByText('Note 12', { exact:true })).toBeVisible();
  await form.getByRole('button', { name:'Edit answers' }).click();
  await expect(form.getByRole('textbox').last()).toHaveValue('Note 12');
  await form.getByRole('button', { name:'Save answers' }).click();

  await page.getByRole('button', { name:'Explore the decision' }).click();
  const slider = page.getByRole('slider', { name:'Demand scenario (%)' });
  const chart = page.getByRole('img', { name:/Requests per week/ });
  const baseline = await chart.locator('polyline').getAttribute('points');
  await slider.press('End');
  await expect(chart).toHaveAccessibleName('Requests per week at 150 percent of baseline');
  await expect(chart.locator('polyline')).not.toHaveAttribute('points', baseline!);
  await page.getByRole('textbox', { name:'Threshold, row 1' }).fill('Under 10%');
  await expect(page.getByRole('region', { name:'Decision path' })).toContainText('Collect a baseline');
  await chart.scrollIntoViewIfNeeded();
  await page.screenshot({ path:testInfo.outputPath('decision-chart.png') });

  await page.getByRole('button', { name:'Draft and preview the artifact' }).click();
  await page.getByRole('textbox', { name:'Decision note' }).fill('<b>Pilot first</b>');
  const frame = page.locator('iframe[title="Isolated draft preview"]');
  await expect(frame).toHaveAttribute('sandbox', '');
  await expect(frame.contentFrame().locator('body')).toHaveText('<b>Pilot first</b>');
  await expect(frame.contentFrame().locator('b')).toHaveCount(0);
  await page.getByRole('button', { name:'Save version' }).click();
  await page.getByRole('textbox', { name:'Decision note' }).fill('A different draft');
  await page.getByText('Saved versions (1)').click();
  await page.getByRole('button', { name:'Restore this version' }).click();
  await expect(page.getByRole('textbox', { name:'Decision note' })).toHaveValue('<b>Pilot first</b>');
  await page.getByRole('button', { name:'Read draft' }).click();
  const reader = page.getByRole('dialog', { name:'Isolated draft preview' });
  await expect(reader).toContainText('<b>Pilot first</b>');
  await reader.getByRole('button', { name:'Close reader' }).click();
  const approval = page.getByRole('region', { name:'Local approval' });
  await approval.getByRole('button', { name:'Approve local change' }).click();
  await approval.getByRole('button', { name:'Record decision' }).click();
  await expect(approval.getByRole('status')).toHaveText('Local change approved.');
  await page.reload();
  await expect(page.getByRole('textbox', { name:'Threshold, row 1' })).toHaveValue('Under 10%');
  await expect(page.getByText('Saved versions (1)')).toBeVisible();
  await expect(approval.getByRole('status')).toHaveText('Local change approved.');
  expect(errors).toEqual([]);
});

test('steps an NFA, checks an RSA calculation and evaluates a concealed-reference coding exercise', async ({ page }, testInfo) => {
  test.setTimeout(45_000);
  await page.goto('/');
  await send(page, 'Step an NFA');
  const nfa = page.locator('.nfa-machine');
  await nfa.getByLabel('Try a string').fill('abb');
  await nfa.getByRole('button', { name:'Step NFA' }).click();
  await expect(nfa.getByRole('status')).toHaveText('Step 1 of 3 · Active: A, A₁, B');
  await nfa.getByRole('button', { name:'Run to end' }).click();
  await expect(nfa.getByRole('status')).toContainText('Accepted');
  await nfa.getByLabel('Try a string').fill('aaa');
  await nfa.getByRole('button', { name:'Run to end' }).click();
  await expect(nfa.getByRole('status')).toContainText('Rejected');
  await nfa.scrollIntoViewIfNeeded();
  await page.screenshot({ path:testInfo.outputPath('nfa-trace.png') });

  await send(page, 'Walk me through a numerical RSA example.');
  await page.getByPlaceholder('n, φ(n)').fill('55,40');
  await page.getByPlaceholder('e, e.g. 3 or 7').fill('3');
  await page.getByPlaceholder('d', { exact:true }).fill('27');
  await page.getByRole('button', { name:'Check key' }).click();
  await expect(page.getByText(/Correct\. 3 × 27/)).toBeVisible();

  await send(page, 'Help me practice an Express and Mongoose update.');
  await expect(page.getByText('REFERENCE IMPLEMENTATION', { exact:true })).toHaveCount(0);
  await page.getByRole('button', { name:'Show reference implementation' }).click();
  const reference = page.locator('.reference-code pre');
  const draft = await reference.innerText();
  await page.getByRole('button', { name:'Hide reference implementation' }).click();
  await page.getByLabel('Write the route').fill(draft);
  await page.getByRole('button', { name:'Check route' }).click();
  await expect(page.getByText(/Correct\. The validator flag/)).toBeVisible();
});

test('a rejected simulated run stays paused until a new approval', async ({ page }, testInfo) => {
  test.setTimeout(30_000);
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.goto('/');
  await send(page, 'Show me a simulated parallel agent run.');
  await expect(page.getByText('Browser access needs approval')).toBeVisible({ timeout:10_000 });
  await page.getByRole('button', { name:'Reject', exact:true }).click();
  await expect(page.getByText('Browser step rejected')).toBeVisible();
  await expect(page.getByText('Local sample run complete')).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('Browser step rejected')).toBeVisible();
  await page.getByRole('button', { name:'Try again', exact:true }).click();
  await page.getByRole('button', { name:'Approve', exact:true }).click();
  await expect(page.getByText('Local sample run complete')).toBeVisible();
  await page.getByText('Local sample run complete').scrollIntoViewIfNeeded();
  await page.screenshot({ path:testInfo.outputPath('approval-playback.png') });
});
