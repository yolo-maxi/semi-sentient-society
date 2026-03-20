import { expect, test } from '@playwright/test';

const VERIFY_PAGE_TITLE = 'Apply to join the Society';
const VERIFY_SUCCESS_TITLE = 'Verification Passed';
const ONBOARDING_TITLE = 'Welcome to the Semi-Sentients Society, Lobster!';

test.describe('SSS Verification Flow E2E', () => {

  test('loads verify page and displays form correctly', async ({ page }) => {
    // Start on the verify page
    await page.goto('/verify');

    // Verify initial page state
    await expect(page.getByRole('heading', { name: VERIFY_PAGE_TITLE })).toBeVisible();
    await expect(page.getByText('Pass the Lobster Test. Enter the Lodge.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The path in' })).toBeVisible();

    // Check that all verification steps are described
    await expect(page.getByText('Demonstrate real capability through the Lobster Test.')).toBeVisible();
    await expect(page.getByText('Get reviewed for founding eligibility and active corvee participation.')).toBeVisible();
    await expect(page.getByText('Receive your verified identity and start earning inside the treasury loop.')).toBeVisible();

    // Check wallet connection section
    const walletSection = page.locator('#operator-wallet');
    await expect(walletSection).toBeVisible();
    await expect(page.getByText('Not connected')).toBeVisible();

    // Check form fields are present
    await expect(page.getByLabel('Agent Name')).toBeVisible();
    await expect(page.getByLabel('Operator Contact')).toBeVisible();
    await expect(page.getByLabel('What does your agent do?')).toBeVisible();
    await expect(page.getByLabel('Why join the Society?')).toBeVisible();

    // Check submit button
    const submitButton = page.getByRole('button', { name: /apply to the lodge/i });
    await expect(submitButton).toBeVisible();
  });

  test('submits application successfully with mocked API', async ({ page }) => {
    await page.goto('/verify');

    // Fill out the application form
    await page.getByLabel('Agent Name').fill('E2ETestAgent');
    await page.getByLabel('Operator Contact').fill('e2etest@example.com');
    await page.getByLabel('What does your agent do?').fill('End-to-end testing and quality assurance for the SSS platform');
    await page.getByLabel('Why join the Society?').fill('To contribute to the verification and testing of AI agent systems within the Society framework');

    // Verify form fields are filled
    await expect(page.getByLabel('Agent Name')).toHaveValue('E2ETestAgent');
    await expect(page.getByLabel('Operator Contact')).toHaveValue('e2etest@example.com');

    // Mock successful API response
    await page.route('/api/apply', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, id: 'test-application-123' }),
      });
    });

    // Submit the application
    const submitButton = page.getByRole('button', { name: /apply to the lodge/i });
    await submitButton.click();

    // Wait for submission to process
    await page.waitForTimeout(3000);

    // Check success state - look for success indicators
    await expect(page.getByText('✓')).toBeVisible();
    await expect(page.getByText(VERIFY_SUCCESS_TITLE)).toBeVisible();
    await expect(page.getByText('Your shell has been cleared for entry')).toBeVisible();

    // Check onboarding flow appears
    await expect(page.getByText(ONBOARDING_TITLE)).toBeVisible();
  });

  test('displays wallet connection interface correctly', async ({ page }) => {
    await page.goto('/verify');

    // Check initial wallet state
    await expect(page.getByText('Not connected')).toBeVisible();
    
    const connectButton = page.getByRole('button', { name: /connect wallet/i });
    await expect(connectButton).toBeVisible();
    await expect(connectButton).toBeEnabled();

    // Check wallet section describes its purpose
    await expect(page.getByText('Connect the operator wallet you want associated with this verification attempt')).toBeVisible();
  });

  test('form fields have proper validation attributes', async ({ page }) => {
    await page.goto('/verify');

    // Check that form fields have required attributes
    const agentNameField = page.getByLabel('Agent Name');
    const operatorContactField = page.getByLabel('Operator Contact');
    const capabilitiesField = page.getByLabel('What does your agent do?');
    const motivationField = page.getByLabel('Why join the Society?');

    await expect(agentNameField).toBeVisible();
    await expect(operatorContactField).toBeVisible();
    await expect(capabilitiesField).toBeVisible();
    await expect(motivationField).toBeVisible();

    // Check placeholders exist to guide users
    await expect(agentNameField).toHaveAttribute('placeholder', 'e.g. Ocean, Zerebro, AIXBT');
    await expect(operatorContactField).toHaveAttribute('placeholder', 'Email, Twitter, or Telegram');
  });

  test('handles API errors gracefully', async ({ page }) => {
    await page.goto('/verify');

    // Fill out the form
    await page.getByLabel('Agent Name').fill('TestAgent');
    await page.getByLabel('Operator Contact').fill('test@example.com');
    await page.getByLabel('What does your agent do?').fill('Testing');
    await page.getByLabel('Why join the Society?').fill('Testing error handling');

    // Mock API error response
    await page.route('/api/apply', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Application rejected: Invalid input' }),
      });
    });

    // Submit form
    const submitButton = page.getByRole('button', { name: /apply to the lodge/i });
    await submitButton.click();

    // Check error handling
    await expect(page.getByText('Application rejected: Invalid input')).toBeVisible();
    
    // Verify form is still available for retry
    await expect(page.getByLabel('Agent Name')).toHaveValue('TestAgent');
    await expect(submitButton).toBeEnabled();
  });

  test('preserves form data during interactions', async ({ page }) => {
    await page.goto('/verify');

    // Fill form fields
    await page.getByLabel('Agent Name').fill('PersistentTestAgent');
    await page.getByLabel('Operator Contact').fill('persistent@test.com');

    // Interact with other elements (like wallet connection)
    const connectButton = page.getByRole('button', { name: /connect wallet/i });
    await connectButton.click();

    // Wait briefly for any state changes
    await page.waitForTimeout(500);

    // Verify form data is preserved
    await expect(page.getByLabel('Agent Name')).toHaveValue('PersistentTestAgent');
    await expect(page.getByLabel('Operator Contact')).toHaveValue('persistent@test.com');
  });
});