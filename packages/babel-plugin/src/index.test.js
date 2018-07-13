import * as babel7 from '@babel/core'
import {stripIndent} from 'common-tags'
import {sheets} from 'jss'
import plugin from './index'

const createGenerateClassName = () => rule => `${rule.key}-id`

const transform = (source, pluginOptions) => {
  const plugins = [[plugin, {jssOptions: {createGenerateClassName}, ...pluginOptions}]]
  const {code} = babel7.transform(source, {ast: true, plugins})
  return code
}

describe('index', () => {
  beforeEach(() => {
    sheets.reset()
  })

  test('support default createStyleSheet identifier', () => {
    const before = stripIndent`
      createStyleSheet({
        a: {
          color: 'red'
        }
      });
    `
    const after = stripIndent`
      createStyleSheet({
        "@raw": ".a-id {\\n  color: red;\\n}"
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('accept identifier names over configuration', () => {
    const before = stripIndent`
      xyz({
        a: {
          color: 'red'
        }
      });
    `
    const after = stripIndent`
      xyz({
        "@raw": ".a-id {\\n  color: red;\\n}"
      });
    `
    expect(transform(before, {identifiers: ['xyz']})).toBe(after)
  })

  test('extract static rules', () => {
    const before = stripIndent`
      createStyleSheet({
        a: {
          color: 'red'
        },
        b: {
          color: () => {}
        }
      });
    `
    const after = stripIndent`
      createStyleSheet({
        "@raw": ".a-id {\\n  color: red;\\n}",
        b: {
          color: () => {}
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('accept call without arguments', () => {})

  test('accept call with null as styles', () => {})

  test('accept jss.setup options over configuration', () => {
    let called
    const onProcessSheet = () => {
      called = true
    }
    const jssOptions = {plugins: [{onProcessSheet}]}
    transform('createStyleSheet({})', {jssOptions})
    expect(called).toBe(true)
  })

  test('extract styles with references', () => {})

  test('extract static properties', () => {})

  test('add sheet options with classes when there was no options', () => {})

  test('add sheet options with classes when there was options', () => {})
})
