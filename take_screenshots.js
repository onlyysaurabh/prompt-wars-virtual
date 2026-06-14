const { chromium } = require('@playwright/test');

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');
  // Wait a bit more for animations to settle
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/skylap/prompt-wars-virtual/public/screenshot-homepage.png', fullPage: false });

  await page.goto('http://localhost:3000/signup');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/skylap/prompt-wars-virtual/public/screenshot-signup.png', fullPage: false });
  
  await browser.close();
}

takeScreenshots();
