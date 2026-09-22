import type { Meta, StoryObj } from '@storybook/angular'
import { ToastComponent } from './Toast.component'

const meta: Meta<ToastComponent> = {
  title: 'Components/Toast',
  component: ToastComponent,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<ToastComponent>

/**
 * Default toast (info variant). The dialog must get an accessible name
 * from the consumer (its content is arbitrary projected text), so every
 * story passes `ariaLabel` — the dialog is the single owner of the
 * toast's accessibility semantics.
 */
export const Info: Story = {
  args: { variant: 'info', autoCloseSeconds: 0, ariaLabel: 'Notification' },
  render: (args) => ({
    props: args,
    template:
      '<c-toast [variant]="variant" [autoCloseSeconds]="autoCloseSeconds" [ariaLabel]="ariaLabel">Default toast</c-toast>',
  }),
}

/** Success toast for confirmations like saved changes. */
export const Success: Story = {
  args: { variant: 'success', autoCloseSeconds: 0, ariaLabel: 'Changes saved' },
  render: (args) => ({
    props: args,
    template:
      '<c-toast [variant]="variant" [autoCloseSeconds]="autoCloseSeconds" [ariaLabel]="ariaLabel">Changes saved</c-toast>',
  }),
}

/** Error toast for failures; exposed as an assertive live region (`role="alert"`). */
export const Error: Story = {
  args: { variant: 'error', autoCloseSeconds: 0, role: 'alert', ariaLabel: 'Something went wrong' },
  render: (args) => ({
    props: args,
    template:
      '<c-toast [variant]="variant" [autoCloseSeconds]="autoCloseSeconds" [role]="role" [ariaLabel]="ariaLabel">Something went wrong</c-toast>',
  }),
}

/** Warning toast for cautions like low storage. */
export const Warning: Story = {
  args: { variant: 'warning', autoCloseSeconds: 0, ariaLabel: 'Storage almost full' },
  render: (args) => ({
    props: args,
    template:
      '<c-toast [variant]="variant" [autoCloseSeconds]="autoCloseSeconds" [ariaLabel]="ariaLabel">Storage almost full</c-toast>',
  }),
}

/** Auto-dismissing toast — closes itself after 1 second. */
export const AutoClose: Story = {
  args: { variant: 'info', autoCloseSeconds: 1, ariaLabel: 'Auto-closing toast' },
  render: (args) => ({
    props: args,
    template:
      '<c-toast [variant]="variant" [autoCloseSeconds]="autoCloseSeconds" [ariaLabel]="ariaLabel">This toast closes itself after 1 second</c-toast>',
  }),
}
