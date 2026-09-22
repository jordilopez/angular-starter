import type { StorybookConfig } from '@storybook/angular'
import type { Configuration } from 'webpack'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-themes',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/angular',

  /**
   * The @storybook/angular builder's default webpack config has no loader
   * for `.css` imports in story files or the preview entry. This registers
   * the minimal loader chain so imports like docs.css and story-level
   * stylesheets work in the Storybook build.
   */
  webpackFinal: (config: Configuration) => {
    config.module?.rules?.push({
      test: /\.css$/,
      // Angular's own pipeline keeps handling component styles and the
      // global src/styles/index.css; this only covers Storybook-specific
      // CSS imports.
      issuer: /(?:preview|.*stories)\.(ts|tsx)$/,
      use: ['style-loader', { loader: 'css-loader', options: { url: false } }],
    })
    return config
  },
}

export default config
