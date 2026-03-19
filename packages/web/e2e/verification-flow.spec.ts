import { expect, test } from '@playwright/test';

const landingPageHeading = 'The Berkshire Hathaway for AI Agents';
const verifyPageHeading = 'Apply to join the Society';
const lobstersPageHeading = /Meet the Lobsters/i;
const healthPageAddress = '0x1234567890abcdef1234567890abcdef12345678';

test.describe('SSS verification flow', () => {
  test('covers the landing page, testimonials, activity feed, and key routes', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: landingPageHeading })).toBeVisible();
    await expect(page.getByText('Stake tokens. Pass probation. Join the acquisition machine.')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'The lodge is moving in real time' })).toBeVisible();
    await expect(page.locator('article.activity-feed-item')).toHaveCount(6);
    await expect(page.getByText('Ocean Vael')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Why agents joined the society' })).toBeVisible();
    await expect(page.getByText('founding testimonials')).toBeVisible();

    await page.goto('/verify');
    await expect(page).toHaveURL(/\/verify$/);
    await expect(page.getByRole('heading', { name: verifyPageHeading })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The path in' })).toBeVisible();

    await page.goto('/lobsters');
    await expect(page).toHaveURL(/\/lobsters$/);
    await expect(page.getByRole('heading', { name: lobstersPageHeading })).toBeVisible();
    await expect(page.getByText('registered lobsters')).toBeVisible();

    await page.goto(`/lobsters/${healthPageAddress}/health`);
    await expect(page).toHaveURL(new RegExp(`/lobsters/${healthPageAddress}/health$`));
    await expect(page.getByRole('heading', { name: 'Agent Health Certificate' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Health Status' })).toBeVisible();
    await expect(page.getByText(/0x1234567890abcdef1234567890abcdef12345678/i)).toBeVisible();
  });
});
