import { test, expect } from '@playwright/test';

test('api insights works', async ({ page, request }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'deepdata@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]', { force: true });
  await page.waitForURL('**/dashboard');
  
  // Also hit the API endpoint
  const cookies = await page.context().cookies();
  const apiRes = await request.get('http://localhost:3000/api/insights', {
    headers: {
      Cookie: cookies.map(c => `${c.name}=${c.value}`).join(';')
    }
  });
  
  const json = await apiRes.json();
  console.log('API response:', JSON.stringify(json, null, 2));
});
