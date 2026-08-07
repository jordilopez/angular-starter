import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('renders the page title and subtitle', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveText('Angular Starter')
    await expect(page.locator('main p')).toContainText('headless components')
  })

  test('clicking a button is safe', async ({ page }) => {
    await page.goto('/')
    const firstButton = page.locator('button.c-button').first()

    await expect(firstButton).toBeVisible()
    await firstButton.click()
    await expect(firstButton).toBeVisible()
  })

  test('accordion opens and closes panels', async ({ page }) => {
    await page.goto('/')
    const details = page.locator('details.faq')
    await details.locator('summary').click()

    // Click first accordion header
    const headers = page.locator('button[aria-expanded]')
    await headers.first().click()
    await expect(headers.first()).toHaveAttribute('aria-expanded', 'true')

    // Click again to close
    await headers.first().click()
    await expect(headers.first()).toHaveAttribute('aria-expanded', 'false')
  })
})
