import { test, expect } from '@playwright/test'

test.describe('Carbon Tracker', () => {
  test('full user journey: sign up → log action → view dashboard', async ({ page }) => {
    // Sign up
    await page.goto('/signup')
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*\/dashboard/)

    // Log a transport action
    await page.goto('/actions')
    await page.click('button:has-text("Transport")')
    await page.fill('input[name="distance_km"]', '100')
    await page.selectOption('select[name="subcategory"]', 'car')
    await page.click('button:has-text("Log Action")')
    await expect(page.locator('[role="status"]')).toContainText('Action logged')

    // View dashboard
    await page.goto('/dashboard')
    await expect(page.locator('text=kg CO₂')).toBeVisible()
  })

  test('keyboard navigation works throughout app', async ({ page }) => {
    await page.goto('/login')
    // Tab through all interactive elements
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('name', 'email')
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('name', 'password')
  })
})
