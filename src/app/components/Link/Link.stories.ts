import type { Meta, StoryObj } from '@storybook/angular'
import { LinkComponent } from './Link.component'

const meta: Meta<LinkComponent> = {
  title: 'Components/Link',
  component: LinkComponent,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<LinkComponent>

export const Default: Story = {
  args: { href: 'https://example.com', label: 'Default Link', disabled: false },
  render: (args) => ({
    props: args,
    template: '<c-link [href]="href" [label]="label" [disabled]="disabled"></c-link>',
  }),
}

export const Disabled: Story = {
  args: { href: 'https://example.com', label: 'Disabled', disabled: true },
  render: (args) => ({
    props: args,
    template: '<c-link [href]="href" [label]="label" [disabled]="disabled"></c-link>',
  }),
}

export const NewTab: Story = {
  args: { href: 'https://example.com', label: 'Open in new tab', openInNewTab: true },
  render: (args) => ({
    props: args,
    template: '<c-link [href]="href" [label]="label" [openInNewTab]="openInNewTab"></c-link>',
  }),
}
