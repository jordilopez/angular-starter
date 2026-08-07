import type { Meta, StoryObj } from '@storybook/angular'
import { AccordionComponent, AccordionItem } from './Accordion.component'

const items: AccordionItem[] = [
  { title: 'Getting started', content: 'Install the dependencies and run `npm run dev`.' },
  {
    title: 'Components',
    content:
      'Each component lives in its own folder with its component, css, spec, and stories files.',
  },
  {
    title: 'Styling',
    content:
      'Angular components use emulated view encapsulation. State uses data attributes instead of modifier classes.',
  },
]

const meta: Meta<AccordionComponent> = {
  title: 'Components/Accordion',
  component: AccordionComponent,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<AccordionComponent>

export const Default: Story = {
  args: { items },
  render: (args) => ({
    props: args,
    template: '<c-accordion [items]="items"></c-accordion>',
  }),
}
