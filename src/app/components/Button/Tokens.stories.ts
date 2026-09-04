import type { Meta, StoryObj } from '@storybook/angular'
import { ButtonComponent } from './Button.component'
import './Tokens.stories.css'

const meta: Meta<ButtonComponent> = {
  title: 'Design System/Token Overrides',
  component: ButtonComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates how consumers can override `css-starter` design tokens ' +
          'locally, without touching the design system itself. Custom properties ' +
          'inherit down the DOM tree, so redefining the `--c-primary*` / ' +
          '`--c-focus-ring` custom properties on a wrapper element re-themes every ' +
          'token-driven style inside it — the wrapper takes precedence over the ' +
          'layered `css-starter.tokens` declarations on `:root` for its ' +
          'descendants. Because the override is unlayered, it also beats the layered ' +
          'design-system declarations without `!important`.',
      },
    },
  },
}

export default meta
type Story = StoryObj<ButtonComponent>

/**
 * Buttons using the consumer's default token palette (Angular ember red).
 * Each button is a **static swatch** for one of the `--c-primary*` /
 * `--c-focus-ring` tokens — they are not interactive states.
 */
export const DefaultTokens: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default consumer tokens. Each button below is a static swatch ' +
          '(not an interactive state) whose colour reads from one of ' +
          '`--c-primary`, `--c-primary-hover`, `--c-primary-active`, ' +
          '`--c-primary-subtle` or `--c-focus-ring`, which resolve to the ' +
          'ember-red brand palette defined on `:root` in `src/styles/index.css`.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="token-swatch-row">
        <c-button class="token-swatch--primary" label="Primary"></c-button>
        <c-button class="token-swatch--hover" label="Hover (swatch)"></c-button>
        <c-button class="token-swatch--active" label="Active (swatch)"></c-button>
        <c-button class="token-swatch--subtle" label="Subtle (swatch)"></c-button>
        <c-button class="token-swatch--focus" label="Focus ring (swatch)"></c-button>
      </div>
    `,
    imports: [ButtonComponent],
  }),
}

/**
 * The same static token swatches wrapped in a `.token-override` container
 * that redefines the design-system tokens with a purple palette. The wrapper
 * is a closer ancestor than `:root`, so its custom-property values are
 * inherited by everything inside it, taking precedence over the layered
 * `css-starter.tokens` declarations on `:root` — no `!important` needed.
 * The override is scoped to the wrapper, so `:root` and everything outside
 * `.token-override` keep the default ember-red palette.
 */
export const ConsumerOverride: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The same static swatches, but wrapped in an element that redefines ' +
          'the tokens. The override stylesheet (imported by this story) declares ' +
          'the custom properties on the `.token-override` wrapper, which is a ' +
          'closer ancestor than `:root` — so its values are inherited by every ' +
          'token-driven style inside the wrapper, winning over the layered ' +
          '`css-starter.tokens` declarations on `:root`. Being unlayered, the ' +
          'override also beats the layered design-system declarations without ' +
          '`!important`. Everything outside the wrapper stays on the default ' +
          'ember-red brand.',
      },
    },
  },
  render: () => ({
    template: `
      <div class="token-override">
        <div class="token-swatch-row">
          <c-button class="token-swatch--primary" label="Primary"></c-button>
          <c-button class="token-swatch--hover" label="Hover (swatch)"></c-button>
          <c-button class="token-swatch--active" label="Active (swatch)"></c-button>
          <c-button class="token-swatch--subtle" label="Subtle (swatch)"></c-button>
          <c-button class="token-swatch--focus" label="Focus ring (swatch)"></c-button>
        </div>
      </div>
    `,
    imports: [ButtonComponent],
  }),
}
