import type { Meta, StoryObj } from '@storybook/angular'
import { PageComponent } from './Page.component'

const meta: Meta<PageComponent> = {
  title: 'Layouts/Page',
  component: PageComponent,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PageComponent>

export const Default: Story = {
  args: {
    title: 'Dashboard',
    subtitle: 'Welcome back',
  },
  render: (args) => ({
    props: args,
    template:
      '<l-page [title]="title" [subtitle]="subtitle"><p>Main content goes here.</p></l-page>',
  }),
}

export const Narrow: Story = {
  args: {
    title: 'Settings',
    narrow: true,
  },
  render: (args) => ({
    props: args,
    template:
      '<l-page [title]="title" [narrow]="narrow"><p>Settings content with constrained width.</p></l-page>',
  }),
}

export const Centered: Story = {
  args: {
    title: 'Hello',
    centered: true,
  },
  render: (args) => ({
    props: args,
    template:
      '<l-page [title]="title" [centered]="centered"><p>Vertically centered content.</p></l-page>',
  }),
}
