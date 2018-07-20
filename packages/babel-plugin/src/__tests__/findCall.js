import {stripIndent} from 'common-tags'
import {sheets} from 'jss'
import {transform} from '../testUtils'

describe('find function call', () => {
  beforeEach(() => {
    sheets.reset()
  })

  test('support default createStyleSheet identifier', () => {
    const code = stripIndent`
      import jss from 'jss';
      jss.createStyleSheet({
        a: {
          color: 'red'
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('support package name with path to a module', () => {
    const code = stripIndent`
      import jss from 'jss/something';
      jss.createStyleSheet({
        a: {
          color: 'red'
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('accept custom identifier names over configuration', () => {
    const code = stripIndent`
      import xyz from 'x';
      xyz({
        a: {
          color: 'red'
        }
      });
    `
    const options = {identifiers: [{package: /x/, functions: ['xyz']}]}
    expect(transform(code, options)).toMatchSnapshot()
  })

  test('decorators', () => {
    const code = stripIndent`
      import injectSheet from 'react-jss';

      @injectSheet({
        a: {
          color: 'red'
        }
      })
      class A {}

      ;
    `
    expect(transform(code)).toMatchSnapshot()
  })
})
