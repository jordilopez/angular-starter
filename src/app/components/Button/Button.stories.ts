import type { Meta, StoryObj } from '@storybook/angular'
import { ButtonComponent } from './Button.component'

const meta: Meta<ButtonComponent> = {
  title: 'Components/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<ButtonComponent>

export const Default: Story = {
  args: { label: 'Default Button', disabled: false },
  render: (args) => ({
    props: args,
    template: '<c-button [label]="label" [disabled]="disabled"></c-button>',
  }),
}

export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true },
  render: (args) => ({
    props: args,
    template: '<c-button [label]="label" [disabled]="disabled"></c-button>',
  }),
}
