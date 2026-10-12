import { expect, type Page } from '@playwright/test';

// ประกาศให้ TypeScript ทราบว่า process.env มีอยู่จริงใน Node runtime
declare const process: {
  env: Record<string, string | undefined>;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const USER = getRequiredEnv('TEST_USER');
export const PASS = getRequiredEnv('TEST_PASS');

export async function signIn(page: Page, email = USER, password = PASS): Promise<void> {
  await page.goto('/signin');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

export async function signInAndExpectBooks(page: Page): Promise<void> {
  await signIn(page);
  await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();
}

export function book(page: Page, title: string) {
  return page.getByRole('article', { name: title, exact: true });
}

export async function addToCart(page: Page, title: string): Promise<void> {
  await book(page, title).getByRole('button', { name: 'Add to cart' }).click();
}