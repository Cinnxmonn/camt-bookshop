import { test, expect } from '@playwright/test';
import { signInAndExpectBooks, addToCart } from './helpers';

test.describe('Currency conversion', () => {
  test(
    'the cart shows the total in USD',
    {
      tag: '@quarantine',
      annotation: [
        { type: 'issue', description: 'https://github.com/Cinnxmonn/camt-bookshop/issues/1' },
        { type: 'expiry', description: '2026-10-26' },
      ],
    },
    async ({ page }) => {
      await signInAndExpectBooks(page);
      await addToCart(page, 'Test-Driven Development: By Example'); // 720 THB
      await page.getByRole('link', { name: /Cart/ }).click();

      await expect(page.getByTestId('fx')).toHaveText('≈ 19.73 USD');
    }
  );
});