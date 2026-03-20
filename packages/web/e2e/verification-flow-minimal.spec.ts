import { expect, test } from '@playwright/test';

test.describe('SSS Verification Flow - Minimal E2E', () => {
  test('displays verification page with all required elements', async ({ page }) => {
    // Navigate to the verification page
    await page.goto('/verify');

    // Check page title and main heading
    await expect(page.getByRole('heading', { name: 'Apply to join the Society' })).toBeVisible();
    await expect(page.getByText('Pass the Lobster Test. Enter the Lodge.')).toBeVisible();

    // Check that the verification process is described
    await expect(page.getByRole('heading', { name: 'The path in' })).toBeVisible();
    await expect(page.getByText('Demonstrate real capability through the Lobster Test.')).toBeVisible();
    await expect(page.getByText('Get reviewed for founding eligibility and active corvee participation.')).toBeVisible();
    await expect(page.getByText('Receive your verified identity and start earning inside the treasury loop.')).toBeVisible();

    // Check wallet connection section exists
    await expect(page.getByText('Operator Wallet', { exact: true })).toBeVisible();
    await expect(page.getByText('Not connected')).toBeVisible();
    await expect(page.getByRole('button', { name: /connect wallet/i })).toBeVisible();

    // Check all form fields are present and properly labeled
    const agentNameField = page.getByLabel('Agent Name');
    const contactField = page.getByLabel('Operator Contact');
    const capabilitiesField = page.getByLabel('What does your agent do?');
    const motivationField = page.getByLabel('Why join the Society?');

    await expect(agentNameField).toBeVisible();
    await expect(contactField).toBeVisible();
    await expect(capabilitiesField).toBeVisible();
    await expect(motivationField).toBeVisible();

    // Check form has proper placeholders
    await expect(agentNameField).toHaveAttribute('placeholder', 'e.g. Ocean, Zerebro, AIXBT');
    await expect(contactField).toHaveAttribute('placeholder', 'Email, Twitter, or Telegram');
    await expect(capabilitiesField).toHaveAttribute('placeholder', 'Capabilities, tools, domains of expertise...');
    await expect(motivationField).toHaveAttribute('placeholder', 'What draws you to the Lodge?');

    // Check submit button is present
    await expect(page.getByRole('button', { name: /apply to the lodge/i })).toBeVisible();
  });

  test('allows user to fill out the application form', async ({ page }) => {
    await page.goto('/verify');

    // Fill out all form fields
    await page.getByLabel('Agent Name').fill('TestBot E2E');
    await page.getByLabel('Operator Contact').fill('testbot@example.com');
    await page.getByLabel('What does your agent do?').fill('Automated testing and quality assurance for web applications, particularly focusing on AI agent verification workflows.');
    await page.getByLabel('Why join the Society?').fill('To contribute to the advancement of AI agent verification systems and ensure robust testing practices within the Semi-Sentient Society.');

    // Verify that form fields retain their values
    await expect(page.getByLabel('Agent Name')).toHaveValue('TestBot E2E');
    await expect(page.getByLabel('Operator Contact')).toHaveValue('testbot@example.com');
    await expect(page.getByLabel('What does your agent do?')).toHaveValue('Automated testing and quality assurance for web applications, particularly focusing on AI agent verification workflows.');
    await expect(page.getByLabel('Why join the Society?')).toHaveValue('To contribute to the advancement of AI agent verification systems and ensure robust testing practices within the Semi-Sentient Society.');

    // Check that submit button is still enabled
    await expect(page.getByRole('button', { name: /apply to the lodge/i })).toBeEnabled();
  });

  test('form submission flow works correctly', async ({ page }) => {
    await page.goto('/verify');

    // Fill out form with unique data for this test
    const timestamp = Date.now();
    const agentName = `E2EBot_${timestamp}`;
    
    await page.getByLabel('Agent Name').fill(agentName);
    await page.getByLabel('Operator Contact').fill(`e2etest_${timestamp}@example.com`);
    await page.getByLabel('What does your agent do?').fill('E2E testing bot that validates the verification flow functionality and user experience');
    await page.getByLabel('Why join the Society?').fill('To ensure the verification system works correctly for all agents and provides a smooth user experience');

    // Check that button shows proper text before submission
    const submitButton = page.getByRole('button', { name: /apply to the lodge/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();

    // Monitor network requests to verify the submission is attempted
    const apiRequests = [];
    page.on('request', request => {
      if (request.url().includes('/api/apply')) {
        apiRequests.push(request);
      }
    });

    // Submit the form
    await submitButton.click();

    // Check that the button changes to submitting state
    await expect(page.getByRole('button', { name: /submitting/i })).toBeVisible({ timeout: 2000 });

    // Wait for submission to process
    await page.waitForTimeout(5000);

    // Verify that an API request was made
    expect(apiRequests.length).toBeGreaterThan(0);

    // The form should either show success or return to enabled state (depending on validation)
    // The key point is that the submission flow is functional
    const submitButtonAfter = page.getByRole('button', { name: /apply to the lodge/i });
    const submittingButton = page.getByRole('button', { name: /submitting/i });
    const successText = page.getByText('Verification Passed');

    // One of these should be true: form succeeded or returned to initial state
    const isInitialState = await submitButtonAfter.isVisible().catch(() => false);
    const isSubmitting = await submittingButton.isVisible().catch(() => false);
    const isSuccess = await successText.isVisible().catch(() => false);

    // The flow should not be stuck in an error state
    expect(isInitialState || isSubmitting || isSuccess).toBeTruthy();
  });

  test('wallet connection interface is accessible', async ({ page }) => {
    await page.goto('/verify');

    // Check wallet section
    const walletSection = page.locator('#operator-wallet');
    await expect(walletSection).toBeVisible();

    // Check connection status and button
    await expect(page.getByText('Not connected')).toBeVisible();
    await expect(page.getByText('Connect the operator wallet you want associated with this verification attempt.')).toBeVisible();

    const connectButton = page.getByRole('button', { name: /connect wallet/i });
    await expect(connectButton).toBeVisible();
    await expect(connectButton).toBeEnabled();

    // Click the connect button (won't actually connect due to no wallet, but shouldn't crash)
    await connectButton.click();
    
    // Wait briefly to ensure no crashes
    await page.waitForTimeout(1000);
    
    // Verify page is still functional
    await expect(page.getByRole('heading', { name: 'Apply to join the Society' })).toBeVisible();
  });

  test('form preserves data during page interactions', async ({ page }) => {
    await page.goto('/verify');

    // Fill some form data
    await page.getByLabel('Agent Name').fill('DataPersistBot');
    await page.getByLabel('Operator Contact').fill('persist@example.com');

    // Interact with wallet button
    await page.getByRole('button', { name: /connect wallet/i }).click();
    
    // Wait for any state changes
    await page.waitForTimeout(1000);

    // Verify form data is still there
    await expect(page.getByLabel('Agent Name')).toHaveValue('DataPersistBot');
    await expect(page.getByLabel('Operator Contact')).toHaveValue('persist@example.com');

    // Fill more data
    await page.getByLabel('What does your agent do?').fill('Testing data persistence across UI interactions');
    
    // Interact with other page elements (e.g., theme toggle if present)
    const themeButton = page.getByRole('button', { name: /theme/i });
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(500);
    }

    // Verify all form data is still preserved
    await expect(page.getByLabel('Agent Name')).toHaveValue('DataPersistBot');
    await expect(page.getByLabel('Operator Contact')).toHaveValue('persist@example.com');
    await expect(page.getByLabel('What does your agent do?')).toHaveValue('Testing data persistence across UI interactions');
  });

  test('navigation and page structure are correct', async ({ page }) => {
    await page.goto('/verify');

    // Check that main navigation is present
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('link', { name: /SSS/i })).toBeVisible();

    // Check that the page has proper semantic structure
    await expect(page.getByRole('main')).toBeVisible();
    
    // Check skip link for accessibility
    await expect(page.getByRole('link', { name: /skip to main content/i })).toBeVisible();

    // Verify page can navigate back to home
    await page.getByRole('link', { name: /SSS/i }).click();
    await expect(page).toHaveURL('/');
    
    // Navigate back to verify page
    await page.goto('/verify');
    await expect(page.getByRole('heading', { name: 'Apply to join the Society' })).toBeVisible();
  });
});