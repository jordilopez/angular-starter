import type { Preview } from '@storybook/angular'
import './docs.css'

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'todo' },
    backgrounds: { disable: true },
  },
}

export default preview
