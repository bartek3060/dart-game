import { test, expect } from '@playwright/test';

test.describe('Dart Game - Complete E2E Testing', () => {
  test.describe('Game Navigation and Setup', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('should navigate from start to configure game', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Welcome to Dart');

      await page.click('text=Start Playing');
      await expect(page).toHaveURL('/configure-game');
      await expect(
        page.locator('text=Configure Real Players Game')
      ).toBeVisible();
    });

    test('should configure 3-player game', async ({ page }) => {
      await page.goto('/configure-game');

      await page.fill('#player-0', 'Player1');
      await page.click('text=Add Player');
      await page.fill('#player-1', 'Player2');
      await page.click('text=Add Player');
      await page.fill('#player-2', 'Player3');

      await page.click('text=Start Game');
      await expect(page).toHaveURL('/gameplay');

      // Verify all 3 players are present
      await expect(
        page.locator('role=tab').filter({ hasText: 'Player1' })
      ).toBeVisible();
      await expect(
        page.locator('role=tab').filter({ hasText: 'Player2' })
      ).toBeVisible();
      await expect(
        page.locator('role=tab').filter({ hasText: 'Player3' })
      ).toBeVisible();
    });
  });

  test.describe('Core Game Logic', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/configure-game');
      await page.fill('#player-0', 'Alice');
      await page.fill('#player-1', 'Bob');
      await page.click('text=Start Game');
    });

    test('should handle normal scoring correctly', async ({ page }) => {
      await expect(
        page.locator('text=Current Score').locator('..')
      ).toContainText('501');

      await page.fill('input[type="number"]', '60');
      const submitButton = page.getByTestId('keyboard-submit');
      await submitButton.click();

      const playerOneTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'Alice' });

      const playerTwoTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'Bob' });
      await expect(playerOneTab).toContainText('441');
      await expect(playerTwoTab).toContainText('501');
      await expect(playerTwoTab).toContainText('Active');
    });

    test('should handle maximum score (180)', async ({ page }) => {
      await page.fill('input[type="number"]', '180');
      const submitButton = page.getByTestId('keyboard-submit');
      await submitButton.click();

      const playerOneTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'Alice' });
      await expect(playerOneTab).toContainText('321');
    });

    test('should handle zero score', async ({ page }) => {
      await page.fill('input[type="number"]', '0');
      const submitButton = page.getByTestId('keyboard-submit');
      await submitButton.click();

      const playerOneTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'Alice' });
      await expect(playerOneTab).toContainText('501');
    });

    test('should handle busting (score below 0)', async ({ page }) => {
      // Given
      const submitButton = page.getByTestId('keyboard-submit');
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();

      // WHen
      await page.fill('input[type="number"]', '180');
      await submitButton.click();

      // Then
      const playerOneTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'Alice' });
      await expect(playerOneTab).toContainText('141');
    });

    test('should handle exact win condition', async ({ page }) => {
      // Given
      const submitButton = page.getByTestId('keyboard-submit');
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();

      // When
      await page.fill('input[type="number"]', '141');
      await submitButton.click();

      // Then
      await expect(page.locator('text=Game Finished!')).toBeVisible();
      await expect(page.locator('text=Alice wins!')).toBeVisible();
    });
  });

  test.describe('Keyboard and Input Testing', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/configure-game');
      await page.fill('#player-0', 'TestPlayer');
      await page.click('text=Start Game');
    });

    test('should handle virtual keyboard digit input', async ({ page }) => {
      // When
      const digitButtons = page.getByTestId('digit-button');
      await digitButtons.filter({ hasText: '1' }).click();
      await digitButtons.filter({ hasText: '2' }).click();
      await digitButtons.filter({ hasText: '3' }).click();

      await expect(page.locator('input[type="number"]')).toHaveValue('123');
    });

    // Then
    test('should handle backspace functionality', async ({ page }) => {
      // Given
      const digitButtons = page.getByTestId('digit-button');
      await digitButtons.filter({ hasText: '1' }).click();
      await digitButtons.filter({ hasText: '1' }).click();
      await digitButtons.filter({ hasText: '1' }).click();

      // When
      await expect(page.locator('input[type="number"]')).toHaveValue('111');

      // Then
      await page.getByTestId('backspace-button').click();
      await expect(page.locator('input[type="number"]')).toHaveValue('11');
    });

    test('should handle virtual keyboard submit', async ({ page }) => {
      // Given
      const digitButtons = page.getByTestId('digit-button');
      await digitButtons.filter({ hasText: '1' }).click();
      await digitButtons.filter({ hasText: '1' }).click();
      await digitButtons.filter({ hasText: '1' }).click();

      // When
      await page.getByTestId('keyboard-submit').click();

      // Then
      const playerOneTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'TestPlayer' });

      await expect(playerOneTab).toContainText('390');
    });

    test('should handle mixed input methods', async ({ page }) => {
      await page.fill('input[type="number"]', '1');
      const digitButtons = page.getByTestId('digit-button');
      await digitButtons.filter({ hasText: '1' }).click();
      await digitButtons.filter({ hasText: '2' }).click();

      await expect(page.locator('input[type="number"]')).toHaveValue('112');

      // Submit using Enter key
      await page.locator('input[type="number"]').press('Enter');
      const playerOneTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'TestPlayer' });

      await expect(playerOneTab).toContainText('389');
    });

    test('should handle empty input submission', async ({ page }) => {
      // When
      await page.locator('input[type="number"]').press('Enter');

      // Then
      const playerOneTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'TestPlayer' });

      await expect(playerOneTab).toContainText('501');
    });
  });

  test.describe('Game Features and Controls', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/configure-game');
      await page.fill('#player-0', 'Alice');
      await page.fill('#player-1', 'Bob');
      await page.click('text=Start Game');
    });

    test('should handle undo functionality', async ({ page }) => {
      // Given
      await page.fill('input[type="number"]', '100');
      const submitButton = page.getByTestId('keyboard-submit');
      await submitButton.click();
      const playerOneTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'Alice' });
      await expect(playerOneTab).toContainText('401');

      await page.fill('input[type="number"]', '50');
      await submitButton.click();

      const playerTwoTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'Bob' });

      await expect(playerTwoTab).toContainText('451');

      // When
      const undoIcon = page.getByTestId('undo-icon');
      await undoIcon.click();

      // Then
      await expect(playerOneTab).toContainText('401');
      await expect(playerTwoTab).toContainText('501');

      // When
      await undoIcon.click();

      // Then
      await expect(playerOneTab).toContainText('501');
      await expect(playerTwoTab).toContainText('501');
    });
  });

  test.describe('Game Finished Modal', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/configure-game');
      await page.fill('#player-0', 'Winner');
      await page.fill('#player-1', 'Loser');
      await page.click('text=Start Game');
    });

    test('should handle modal undo functionality', async ({ page }) => {
      // Given
      const submitButton = page.getByTestId('keyboard-submit');
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '141');
      await submitButton.click();
      await expect(page.locator('text=Game Finished!')).toBeVisible();

      // When
      const modalUndoButton = page.getByTestId('modal-undo-button');
      await modalUndoButton.click();

      // Then
      await expect(page.locator('text=Game Finished!')).not.toBeVisible();
      const playerOneTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'Winner' });
      const playerTwoTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'Loser' });

      await expect(playerOneTab).toContainText('141');
      await expect(playerTwoTab).toContainText('141');
    });

    test('should handle Start Again functionality', async ({ page }) => {
      // Given
      const submitButton = page.getByTestId('keyboard-submit');
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '141');
      await submitButton.click();
      await expect(page.locator('text=Game Finished!')).toBeVisible();

      // When
      await page.click('text=Start Again');

      // Then
      await expect(page.locator('text=Game Finished!')).not.toBeVisible();
      const playerOneTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'Winner' });
      const playerTwoTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'Loser' });

      await expect(playerOneTab).toContainText('501');
      await expect(playerTwoTab).toContainText('501');
    });

    test('should handle Configure New Game functionality', async ({ page }) => {
      // Given
      const submitButton = page.getByTestId('keyboard-submit');
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '180');
      await submitButton.click();
      await page.fill('input[type="number"]', '141');
      await submitButton.click();
      await expect(page.locator('text=Game Finished!')).toBeVisible();

      // When
      await page.click('text=Configure Game');

      // Should navigate to configure page
      await expect(page).toHaveURL('/configure-game');
      await expect(page.locator('#player-0')).toHaveValue('Player 1');
    });
  });

  test.describe('Edge Cases and Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/configure-game');
      await page.fill('#player-0', 'EdgeTest1');
      await page.fill('#player-1', 'EdgeTest2');
      await page.click('text=Start Game');
    });

    test('should handle invalid scores (>180)', async ({ page }) => {
      // Try to enter score > 180
      await page.type('input[type="number"]', '200\n');

      // Should not change score
      await expect(
        page.locator('text=Current Score').locator('..')
      ).toContainText('501');
    });

    test('should handle negative input', async ({ page }) => {
      // Try negative score
      const input = page.locator('input[type="number"]');
      await input.fill('-50');
      await input.press('Enter');

      // Then
      const playerOneTab = page
        .getByTestId('player-tab-score')
        .filter({ hasText: 'EdgeTest1' });

      await expect(playerOneTab).toContainText('501');
    });
  });
});
