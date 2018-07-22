import {stripIndent} from 'common-tags'
import {sheets} from 'jss'
import {transform} from './testUtils'

describe('call arguments', () => {
  beforeEach(() => {
    sheets.reset()
  })

  test('accept call without arguments', () => {
    const code = `createStyleSheet();`
    expect(transform(code)).toMatchSnapshot()
  })

  test('accept null as styles argument', () => {
    const code = stripIndent`
      import jss from 'jss';
      createStyleSheet(null);
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('accept undefined as styles argument', () => {
    const code = stripIndent`
      import jss from 'jss';
      createStyleSheet(undefined);
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('accept jss.setup options over configuration', () => {
    let called
    const onProcessSheet = () => {
      called = true
    }
    const jssOptions = {plugins: [{onProcessSheet}]}
    transform(
      stripIndent`
        import jss from 'jss';
        createStyleSheet({});
      `,
      {jssOptions}
    )
    expect(called).toBe(true)
  })

  test('extend options object literal', () => {
    const code = stripIndent`
      import jss from 'jss';
      createStyleSheet({
        a: {
          width: 0
        }
      }, {a: 1});
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('extend options object ref', () => {
    const code = stripIndent`
      import jss from 'jss';
      const options = {
        a: 1
      };
      createStyleSheet({
        a: {
          width: 0
        }
      }, options);
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('test', () => {
    const code = `f(([a, b]) => {});`
    expect(transform(code)).toBe(code)
  })
})
