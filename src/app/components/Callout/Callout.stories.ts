import type { Meta, StoryObj } from '@storybook/angular'
import { CalloutComponent } from './Callout.component'

const meta: Meta<CalloutComponent> = {
  title: 'Components/Callout',
  component: CalloutComponent,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<CalloutComponent>

export const Info: Story = {
  args: { tone: 'info', title: 'Heads up' },
  render: (args) => ({
    props: args,
    template:
      '<c-callout [tone]="tone" [title]="title">A neutral informational callout.</c-callout>',
  }),
}

export const Success: Story = {
  args: { tone: 'success', title: 'Saved' },
  render: (args) => ({
    props: args,
    template: '<c-callout [tone]="tone" [title]="title">Your changes have been saved.</c-callout>',
  }),
}

export const Warning: Story = {
  args: { tone: 'warning', title: 'Safari only' },
  render: (args) => ({
    props: args,
    template:
      '<c-callout [tone]="tone" [title]="title">This demo requires Safari to see the real thing.</c-callout>',
  }),
}

export const Error: Story = {
  args: { tone: 'error', role: 'alert', title: 'Something went wrong' },
  render: (args) => ({
    props: args,
    template:
      '<c-callout [tone]="tone" [role]="role" [title]="title">The request failed. Please try again.</c-callout>',
  }),
}

export const BodyOnly: Story = {
  args: { tone: 'info' },
  render: (args) => ({
    props: args,
    template: '<c-callout [tone]="tone">A callout with no title, just a body message.</c-callout>',
  }),
}
