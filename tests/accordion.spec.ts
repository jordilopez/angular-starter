import { test, expect } from '@playwright/test'

test.describe('Accordion keyboard navigation', () => {
  test('arrow keys move focus between headers', async ({ page }) => {
    await page.goto('/')
    await page.locator('details.faq summary').click()

    const headers = page.locator('button[aria-expanded]')
    await expect(headers).toHaveCount(3)

    await headers.first().focus()
    await page.keyboard.press('ArrowDown')
    await expect(headers.nth(1)).toBeFocused()

    await page.keyboard.press('ArrowDown')
    await expect(headers.nth(2)).toBeFocused()

    await page.keyboard.press('Home')
    await expect(headers.first()).toBeFocused()

    await page.keyboard.press('ArrowUp')
    await expect(headers.nth(2)).toBeFocused()
  })

  test('Enter toggles a panel from the keyboard', async ({ page }) => {
    await page.goto('/')
    await page.locator('details.faq summary').click()

    const headers = page.locator('button[aria-expanded]')
    await headers.first().focus()
    await page.keyboard.press('Enter')

    await expect(headers.first()).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('.panel[data-open]')).toHaveCount(1)

    await page.keyboard.press('Enter')
    await expect(headers.first()).toHaveAttribute('aria-expanded', 'false')
  })
})
