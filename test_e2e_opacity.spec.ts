import { test, expect } from '@playwright/test';

test('insights page opacity', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'deepdata@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]', { force: true });
  await page.waitForURL('**/dashboard');
  
  await page.goto('http://localhost:3000/insights');
  await page.waitForTimeout(2000);
  
  const cards = await page.$$('.border-l-4');
  console.log('Number of insight cards:', cards.length);
  
  if (cards.length > 0) {
    // Check opacity of the first card's parent motion.div
    const motionDiv = await cards[0].evaluateHandle(el => el.parentElement);
    const opacity = await motionDiv.evaluate(el => window.getComputedStyle(el).opacity);
    console.log('Opacity of card wrapper:', opacity);
  }
});
