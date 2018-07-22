import * as babel7 from '@babel/core'
import * as babel6 from 'babel-core'
import plugin from '../index'

const createGenerateClassName = () => rule => `${rule.key}-id`

// eslint-disable-next-line import/prefer-default-export
export const transform = (source, pluginOptions) => {
  const options = {
    ast: true,
    plugins: [
      [plugin, {jssOptions: {createGenerateClassName}, ...pluginOptions}],
      'syntax-decorators'
    ]
  }

  return [
    '[v6]',
    babel6.transform(source, options).code,
    '[v7]',
    babel7.transform(source, options).code
  ].join('\n')
}

// Make jest happy.
test('', () => {})
