import * as babel7 from '@babel/core'
// import * as babel6 from 'babel-core'
import plugin from '../index'

const createGenerateClassName = () => rule => `${rule.key}-id`

// eslint-disable-next-line import/prefer-default-export
export const transform = (source, pluginOptions) => {
  const plugins = [
    [plugin, {jssOptions: {createGenerateClassName}, ...pluginOptions}],
    'syntax-decorators'
  ]
  const {code} = babel7.transform(source, {ast: true, plugins})
  return code
}

// Make jest happy.
test('', () => {})
