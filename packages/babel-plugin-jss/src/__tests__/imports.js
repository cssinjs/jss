import {stripIndent} from 'common-tags'
import {sheets} from 'jss'
import {transform} from './testUtils'

describe('imports', () => {
  beforeEach(() => {
    sheets.reset()
  })

  test('bail out on property access from imports', () => {
    const code = stripIndent`
      import jss from 'jss';
      import config from 'config';
      createStyleSheet({
        a: {
          color: config.primary
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('partially bail out per property on property access from imports', () => {
    const code = stripIndent`
      import jss from 'jss';
      import config from 'config';
      createStyleSheet({
        a: {
          width: 1,
          color: config.primary
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('partially bail out per rule on property access from imports', () => {
    const code = stripIndent`
      import jss from 'jss';
      import config from 'config';
      createStyleSheet({
        a: {
          width: 1,
        },
        b: {
          color: config.primary
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('unresolvable styles ref', () => {
    const code = stripIndent`
      import jss from 'jss';
      import styles from 'styles';
      createStyleSheet(styles);
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('extend imported options ref', () => {
    const code = stripIndent`
      import jss from 'jss';
      import options from 'options';
      createStyleSheet({
        a: {
          color: 'red'
        }
      }, options);
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test.skip('resolve imports avilable modules?', () => {})
})
