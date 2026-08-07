import { test, expect } from '@playwright/test'

test.describe('Button component', () => {
  test('renders homepage buttons with the c-button class', async ({ page }) => {
    await page.goto('/')
    const buttons = page.locator('button.c-button')
    await expect(buttons).toHaveCount(2)
  })

  test('buttons are native and enabled by default', async ({ page }) => {
    await page.goto('/')
    const buttons = page.locator('button.c-button')
    await expect(buttons.first()).toBeEnabled()
    await expect(buttons.nth(1)).toBeEnabled()
  })

  test('buttons receive click events', async ({ page }) => {
    await page.goto('/')
    const firstButton = page.locator('button.c-button').first()
    await firstButton.click()
    await expect(firstButton).toBeVisible()
  })
})
