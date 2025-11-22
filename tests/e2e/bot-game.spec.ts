import { test, expect } from '@playwright/test';

test.describe('Bot Game - E2E Testing', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should navigate and configure bot game', async ({ page }) => {
        // Navigate to configure game
        await page.click('text=Start Playing');
        await expect(page).toHaveURL('/configure-game');

        // Switch to Play vs Bot tab
        await page.click('text=Play vs Bot');
        await expect(page.locator('text=Configure Bot Game')).toBeVisible();

        // Configure game
        await page.fill('#player-0', 'HumanPlayer');

        // Select difficulty (Medium is default, let's select Hard)
        await page.click('text=Hard');

        // Start Game
        await page.click('text=Start Game');
        await expect(page).toHaveURL('/bot-gameplay');

        // Verify game start
        await expect(page.locator('text=Dart Game vs Bot - 501')).toBeVisible();
        await expect(page.locator('text=Playing against Hard bot')).toBeVisible();
    });

    test('should play a full turn cycle', async ({ page }) => {
        // Setup game
        await page.goto('/configure-game');
        await page.click('text=Play vs Bot');
        await page.fill('#player-0', 'HumanPlayer');
        await page.click('text=Start Game');

        // Check initial state
        await expect(page.locator("text=HumanPlayer's Turn")).toBeVisible();
        await expect(page.locator('text=Current Score').locator('..')).toContainText('501');

        // Human turn
        const input = page.locator('input[type="number"]');
        await input.fill('60');
        await page.getByTestId('keyboard-submit').click();

        // Verify score update
        const playerTab = page.getByTestId('player-tab-score').filter({ hasText: 'HumanPlayer' });
        await expect(playerTab).toContainText('441');

        // Verify Bot turn starts
        await expect(page.locator("text=Bot's Turn")).toBeVisible();
        await expect(page.locator('text=Bot is thinking...')).toBeVisible();

        // Wait for Bot to finish (it has a delay)
        // We wait for the turn to switch back to HumanPlayer
        await expect(page.locator("text=HumanPlayer's Turn")).toBeVisible({ timeout: 10000 });

        // Verify Bot score updated (Bot starts at 501)
        const botTab = page.getByTestId('player-tab-score').filter({ hasText: 'Bot' });
        // Bot score should be less than 501
        const botScoreText = await botTab.locator('span.text-muted-foreground').textContent();
        const botScore = parseInt(botScoreText || '501');
        expect(botScore).toBeLessThan(501);
    });
});
