import {stripIndent} from 'common-tags'
import {sheets} from 'jss'
import {transform} from '../testUtils'

describe('variables refs', () => {
  beforeEach(() => {
    sheets.reset()
  })

  test('support property identifier', () => {
    const code = stripIndent`
      import jss from 'jss';
      const prop = 'a'
      createStyleSheet({
        [prop]: {
          color: 'red'
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('resolve styles ref', () => {
    const code = stripIndent`
      import jss from 'jss';
      const styles = {
        a: {
          color: 'red'
        }
      };
      createStyleSheet(styles);
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('extract styles with nested references', () => {
    const code = stripIndent`
      import jss from 'jss';
      const color = 'red';
      const a = {
        color: color
      };
      const styles = {
        a: a
      };
      createStyleSheet(styles);
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('resolve property access from scope var', () => {
    const code = stripIndent`
      import jss from 'jss';
      const config = {
        primary: 'red'
      };
      createStyleSheet({
        a: {
          color: config.primary
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })
})
