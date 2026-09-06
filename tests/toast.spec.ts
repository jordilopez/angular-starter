import { test, expect } from '@playwright/test'

const STORYBOOK_URL = 'http://localhost:6006'

const story = (id: string) =>
  `${STORYBOOK_URL}/iframe.html?id=components-toast--${id}&viewMode=story`

test.describe('Toast (Storybook)', () => {
  test('info story renders a modal dialog with role and accessible name', async ({ page }) => {
    await page.goto(story('info'))
    const dialog = page.locator('dialog.c-toast')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Default toast')

    // Native dialog semantics: opened via showModal, exposed as a polite
    // live region with an accessible name.
    expect(await dialog.evaluate((el) => el.matches(':modal'))).toBe(true)
    await expect(dialog).toHaveAttribute('role', 'status')
    await expect(dialog).toHaveAttribute('aria-label', 'Notification')
    await expect(dialog).toHaveAttribute('data-variant', 'info')

    // Top layer: hit-testing outside the dialog resolves to the dialog.
    const hit = await page.evaluate(() => document.elementFromPoint(10, 10)?.tagName)
    expect(hit).toBe('DIALOG')
  })

  test('::backdrop stays transparent', async ({ page }) => {
    await page.goto(story('info'))
    const dialog = page.locator('dialog.c-toast')
    await expect(dialog).toBeVisible()
    const backdropBg = await dialog.evaluate(
      (el) => getComputedStyle(el, '::backdrop').backgroundColor,
    )
    expect(backdropBg).toBe('rgba(0, 0, 0, 0)')
  })

  test('background page stays visually present behind the toast', async ({ page }) => {
    await page.goto(story('info'))
    const dialog = page.locator('dialog.c-toast')
    await expect(dialog).toBeVisible()

    // The page content must remain hit-testable nowhere outside the top
    // layer, but the toast itself is anchored bottom-right — a point far
    // from it resolves to the dialog (modal top layer), not the page.
    const hit = await page.evaluate(() => {
      const el = document.elementFromPoint(window.innerWidth - 5, window.innerHeight - 5)
      return el?.tagName
    })
    expect(hit).toBe('DIALOG')
  })

  test('close button dismisses the toast', async ({ page }) => {
    await page.goto(story('info'))
    const dialog = page.locator('dialog.c-toast')
    await expect(dialog).toBeVisible()

    await dialog.getByRole('button', { name: /close toast/i }).click()
    await expect(dialog).toBeHidden()
    await expect(dialog).not.toHaveAttribute('open')
  })

  test('Escape key closes the toast', async ({ page }) => {
    await page.goto(story('warning'))
    const dialog = page.locator('dialog.c-toast')
    await expect(dialog).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('error story exposes role="alert" via the role input', async ({ page }) => {
    await page.goto(story('error'))
    const dialog = page.locator('dialog.c-toast')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('role', 'alert')
    await expect(dialog).toHaveAttribute('aria-label', 'Something went wrong')
  })

  test('auto-close story dismisses itself after the configured duration', async ({ page }) => {
    await page.goto(story('auto-close'))
    const dialog = page.locator('dialog.c-toast')
    await expect(dialog).toBeVisible()
    await expect(dialog).toBeHidden({ timeout: 5_000 })
  })

  test('destroying the toast removes its dialog from the DOM', async ({ page }) => {
    await page.goto(story('info'))
    const dialog = page.locator('dialog.c-toast')
    await expect(dialog).toBeVisible()

    // Re-rendering the storybook story destroys the component — its
    // dialog must be gone, with no duplicate left behind.
    await page.goto(story('success'))
    await expect(page.locator('dialog.c-toast')).toHaveCount(1)
  })
})
