import { expect, test } from '@playwright/test';

test('all fixtures mount and the report workbench is interactive', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/dev/examples');
  const examples = page.locator('.gallery > details');
  await expect(examples).toHaveCount(11);
  for (const summary of await examples.locator(':scope > summary').all()) {
    await summary.click();
    await summary.click();
  }
  const mixed = examples.filter({has: page.locator('summary', {hasText:'Thinking in systems'})});
  await mixed.locator(':scope > summary').click();
  await mixed.getByLabel('Who will review the findings?').fill('Sample reviewer');
  await mixed.getByRole('radio', {name:'Peak traffic'}).check();
  await mixed.getByText('Explore the report workbench').click();
  await expect(mixed.getByRole('heading', {name:'Measurement trace'})).toBeVisible();
  const records = mixed.getByLabel(/Companies table/);
  await expect(records.getByRole('link', {name:'Atlas Research'})).toBeVisible();
  await records.locator('label[title="Select Atlas Research"]').click();
  await expect(records.getByRole('checkbox', {name:'Select Atlas Research'})).toBeChecked();
  expect(errors).toEqual([]);
});
