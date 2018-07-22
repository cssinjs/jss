import {stripIndent} from 'common-tags'
import {sheets} from 'jss'
import {transform} from './testUtils'

describe('dynamic styles (with function values or rules)', () => {
  beforeEach(() => {
    sheets.reset()
  })

  test('extract static rule, dynamic rule is an arrow function', () => {
    const code = stripIndent`
      import jss from 'jss';
      createStyleSheet({
        a: {
          color: 'red'
        },
        b: {
          color: () => {}
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('extract static rule, dynamic rule is a function', () => {
    const code = stripIndent`
      import jss from 'jss';
      createStyleSheet({
        a: {
          color: 'red'
        },
        b: {
          color: function () {}
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('extract static rule, dynamic rule is a ref', () => {
    const code = stripIndent`
      import jss from 'jss';

      function f() {}

      createStyleSheet({
        a: {
          color: 'red'
        },
        b: {
          color: f
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('extract static properties from mixed rules', () => {
    const code = stripIndent`
      import jss from 'jss';
      createStyleSheet({
        a: {
          color: 'red',
          width: () => {}
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })
})
