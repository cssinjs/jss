import * as babel7 from '@babel/core'
import {stripIndent} from 'common-tags'
import {sheets} from 'jss'
import plugin from './index'

const createGenerateClassName = () => rule => `${rule.key}-id`

const transform = (source, pluginOptions) => {
  const plugins = [
    [plugin, {jssOptions: {createGenerateClassName}, ...pluginOptions}],
    'syntax-decorators'
  ]
  const {code} = babel7.transform(source, {ast: true, plugins})
  return code
}

describe('index', () => {
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

  test('support numeric value', () => {
    const code = stripIndent`
      import jss from 'jss';
      createStyleSheet({
        a: {
          width: 0
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('support array value', () => {
    const code = stripIndent`
      import jss from 'jss';
      createStyleSheet({
        a: {
          x: [0, 1]
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('support array in array value', () => {
    const code = stripIndent`
      import jss from 'jss';
      createStyleSheet({
        a: {
          x: [[0, 1]]
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

  test('support multiple calls', () => {
    const code = stripIndent`
      import jss from 'jss';
      createStyleSheet({
        a: {
          color: 'red'
        }
      });
      createStyleSheet({
        a: {
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

  test('support styles creator arrow function', () => {
    const code = stripIndent`
      import injectSheet from 'react-jss';
      injectSheet(() => ({
        a: {
          color: 'red'
        }
      }));
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('support styles creator arrow function with return', () => {
    const code = stripIndent`
      import injectSheet from 'react-jss';
      injectSheet(() => {
        return {
          a: {
            color: 'red'
          }
        };
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('support styles creator function expression', () => {
    const code = stripIndent`
      import injectSheet from 'react-jss';
      injectSheet(function () {
        return {
          a: {
            color: 'red'
          }
        };
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('support styles creator function ref', () => {
    const code = stripIndent`
      import injectSheet from 'react-jss';

      function getStyles() {
        return {
          a: {
            color: 'red'
          }
        };
      }

      injectSheet(getStyles);
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('support object prop access inside styles creator fn', () => {
    const code = stripIndent`
      import injectSheet from 'react-jss';
      const config = {
        primary: 'red'
      };
      injectSheet(() => ({
        a: {
          color: config.primary
        }
      }));
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('support theme prop access over babel config as fn arg', () => {
    const code = stripIndent`
      import injectSheet from 'react-jss';
      injectSheet(theme => ({
        a: {
          color: theme.primary
        }
      }));
    `
    const options = {theme: {primary: 'red'}}
    expect(transform(code, options)).toMatchSnapshot()
  })

  test('support complex theme prop access over babel config as fn arg', () => {
    const code = stripIndent`
      import injectSheet from 'react-jss';
      injectSheet(theme => ({
        a: {
          color: theme.x[0].color
        }
      }));
    `
    const options = {theme: {x: [{color: 'red'}]}}
    expect(transform(code, options)).toMatchSnapshot()
  })

  test('throw prop access error complex theme prop access over babel config as fn arg', () => {
    const code = stripIndent`
      import injectSheet from 'react-jss';
      injectSheet(theme => ({
        a: {
          color: theme.x[0].color
        }
      }));
    `
    expect(() => transform(code, {})).toThrowError()
  })

  test('decorators (add syntax-decorators to the package)', () => {
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

  test('simple binary expression', () => {
    const code = stripIndent`
      import jss from 'jss';
      createStyleSheet({
        a: {
          width: 5 + 10
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('complex binary expression', () => {
    const code = stripIndent`
      import jss from 'jss';
      createStyleSheet({
        a: {
          width: 5 + 10 * 4 / 2
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('binary expression with refs', () => {
    const code = stripIndent`
      import jss from 'jss';
      const x = 10;
      createStyleSheet({
        a: {
          width: 5 + x
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('binary expression with a function call into fn expression', () => {
    const code = stripIndent`
      import jss from 'jss';

      const x = () => 10;

      createStyleSheet({
        a: {
          width: 5 + x()
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('binary expression with a function call into named fn', () => {
    const code = stripIndent`
      import jss from 'jss';

      function x() {
        return 10;
      }

      createStyleSheet({
        a: {
          width: 5 + x()
        }
      });
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('styles returned from a named function call', () => {
    const code = stripIndent`
      import jss from 'jss';

      function getStyles() {
        return {
          a: {
            width: 5
          }
        };
      }

      createStyleSheet(getStyles());
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('styles returned from a named function call with refs', () => {
    const code = stripIndent`
      import jss from 'jss';
      const a = 5;
      const b = 3;

      function getStyles() {
        return {
          a: {
            w: a + b,
            a: a,
            b: b
          }
        };
      }

      createStyleSheet(getStyles());
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('styles returned from a function expression call', () => {
    const code = stripIndent`
      import jss from 'jss';

      const getStyles = () => ({
        a: {
          width: 5
        }
      });

      createStyleSheet(getStyles());
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('styles returned from a function expression call with arguments', () => {
    const code = stripIndent`
      import jss from 'jss';

      const getStyles = width => ({
        a: {
          width: width
        }
      });

      createStyleSheet(getStyles(5));
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('styles returned from a function expression call with ref arguments', () => {
    const code = stripIndent`
      import jss from 'jss';

      const getStyles = width => ({
        a: {
          width: width
        }
      });

      const value = 5;
      createStyleSheet(getStyles(value));
    `
    expect(transform(code)).toMatchSnapshot()
  })

  test('styles returned from a function returned from a function call with refs', () => {})
  test('value returned from a function call', () => {})
  test('resolve imports avilable modules?', () => {})
})
