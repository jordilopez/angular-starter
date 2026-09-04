import { test, expect } from '@playwright/test'

test.describe('Link component', () => {
  test('renders homepage links with the c-link class', async ({ page }) => {
    await page.goto('/')
    const links = page.locator('a.c-link')
    await expect(links).toHaveCount(2)
  })

  test('enabled link navigates to its href', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('a.c-link:not([aria-disabled="true"])')
    await expect(link).toHaveAttribute('href', '/docs')
    await link.click()
    await expect(page).toHaveURL(/\/docs$/)
  })

  test('disabled link does not navigate', async ({ page }) => {
    await page.goto('/')
    const disabled = page.locator('a.c-link[aria-disabled="true"]')
    await expect(disabled).toBeVisible()
    await disabled.click()
    await expect(page).toHaveURL(/\/$/)
  })
})
