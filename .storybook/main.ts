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
   * for `.css` imports in story files. This registers the minimal loader
   * chain so stories can import plain stylesheets (e.g. Tokens.stories.css
   * for the token-override demo).
   */
  webpackFinal: (config: Configuration) => {
    config.module?.rules?.push({
      test: /\.css$/,
      // Only CSS imported from story files — Angular's own pipeline keeps
      // handling component styles and the global src/styles/index.css.
      issuer: /\.stories\.(ts|tsx)$/,
      use: ['style-loader', { loader: 'css-loader', options: { url: false } }],
    })
    return config
  },
}

export default config
