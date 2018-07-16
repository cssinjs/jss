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
      }, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('accept custom identifier names over configuration', () => {
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
      }, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before, {identifiers: ['xyz']})).toBe(after)
  })

  test('extract static rule, dynamic rule is an arrow function', () => {
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
      }, {
        "classes": {
          "a": "a-id",
          "b": "b-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('extract static rule, dynamic rule is a function', () => {
    const before = stripIndent`
      createStyleSheet({
        a: {
          color: 'red'
        },
        b: {
          color: function () {}
        }
      });
    `
    const after = stripIndent`
      createStyleSheet({
        "@raw": ".a-id {\\n  color: red;\\n}",
        b: {
          color: function () {}
        }
      }, {
        "classes": {
          "a": "a-id",
          "b": "b-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('extract static rule, dynamic rule is a ref', () => {
    const before = stripIndent`
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
    const after = stripIndent`
      function f() {}

      createStyleSheet({
        "@raw": ".a-id {\\n  color: red;\\n}",
        b: {
          color: f
        }
      }, {
        "classes": {
          "a": "a-id",
          "b": "b-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('accept call without arguments', () => {
    const code = `createStyleSheet();`
    expect(transform(code)).toBe(code)
  })

  test('accept null as styles argument', () => {
    const code = `createStyleSheet(null);`
    expect(transform(code)).toBe(code)
  })

  test('accept undefined as styles argument', () => {
    const code = `createStyleSheet(undefined);`
    expect(transform(code)).toBe(code)
  })

  test('accept jss.setup options over configuration', () => {
    let called
    const onProcessSheet = () => {
      called = true
    }
    const jssOptions = {plugins: [{onProcessSheet}]}
    transform('createStyleSheet({})', {jssOptions})
    expect(called).toBe(true)
  })

  test('support property identifier', () => {
    const before = stripIndent`
      const prop = 'a'
      createStyleSheet({
        [prop]: {
          color: 'red'
        }
      });
    `
    const after = stripIndent`
      const prop = 'a';
      createStyleSheet({
        "@raw": ".a-id {\\n  color: red;\\n}"
      }, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('support numeric value', () => {
    const before = stripIndent`
      createStyleSheet({
        a: {
          width: 0
        }
      });
    `
    const after = stripIndent`
      createStyleSheet({
        "@raw": ".a-id {\\n  width: 0;\\n}"
      }, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('support array value', () => {
    const before = stripIndent`
      createStyleSheet({
        a: {
          x: [0, 1]
        }
      });
    `
    const after = stripIndent`
      createStyleSheet({
        "@raw": ".a-id {\\n  x: 0, 1;\\n}"
      }, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('support array in array value', () => {
    const before = stripIndent`
      createStyleSheet({
        a: {
          x: [[0, 1]]
        }
      });
    `
    const after = stripIndent`
      createStyleSheet({
        "@raw": ".a-id {\\n  x: 0 1;\\n}"
      }, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('extract static properties from mixed rules', () => {
    const before = stripIndent`
      createStyleSheet({
        a: {
          color: 'red',
          width: () => {}
        }
      });
    `
    const after = stripIndent`
      createStyleSheet({
        "@raw": ".a-id {\\n  color: red;\\n}",
        a: {
          width: () => {}
        }
      }, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('support multiple calls', () => {
    const before = stripIndent`
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
    const after = stripIndent`
      createStyleSheet({
        "@raw": ".a-id {\\n  color: red;\\n}"
      }, {
        "classes": {
          "a": "a-id"
        }
      });
      createStyleSheet({
        "@raw": ".a-id {\\n  color: red;\\n}"
      }, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('resolve styles ref', () => {
    const before = stripIndent`
      const styles = {
        a: {
          color: 'red'
        }
      };
      createStyleSheet(styles);
    `
    const after = stripIndent`
      const styles = {
        "@raw": ".a-id {\\n  color: red;\\n}"
      };
      createStyleSheet(styles, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('extract styles with nested references', () => {
    const before = stripIndent`
      const color = 'red';
      const a = {
        color: color
      };
      const styles = {
        a: a
      };
      createStyleSheet(styles);
    `
    const after = stripIndent`
      const color = 'red';
      const a = {
        color: color
      };
      const styles = {
        "@raw": ".a-id {\\n  color: red;\\n}"
      };
      createStyleSheet(styles, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('resolve property access from scope var', () => {
    const before = stripIndent`
      const config = {
        primary: 'red'
      };
      createStyleSheet({
        a: {
          color: config.primary
        }
      });
    `
    const after = stripIndent`
      const config = {
        primary: 'red'
      };
      createStyleSheet({
        "@raw": ".a-id {\\n  color: red;\\n}"
      }, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('bail out on property access from imports', () => {
    const code = stripIndent`
      import config from 'config';
      createStyleSheet({
        a: {
          color: config.primary
        }
      });
    `
    expect(transform(code)).toBe(code)
  })

  test('partially bail out per property on property access from imports', () => {
    const before = stripIndent`
      import config from 'config';
      createStyleSheet({
        a: {
          width: 1,
          color: config.primary
        }
      });
    `
    const after = stripIndent`
      import config from 'config';
      createStyleSheet({
        \"@raw\": \".a-id {\\n  width: 1;\\n}\",
        a: {
          color: config.primary
        }
      }, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('partially bail out per rule on property access from imports', () => {
    const before = stripIndent`
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
    const after = stripIndent`
      import config from 'config';
      createStyleSheet({
        \"@raw\": \".a-id {\\n  width: 1;\\n}\",
        b: {
          color: config.primary
        }
      }, {
        "classes": {
          "a": "a-id",
          "b": "b-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('extend options object literal', () => {
    const before = stripIndent`
      createStyleSheet({
        a: {
          width: 0
        }
      }, {a: 1});
    `
    const after = stripIndent`
      createStyleSheet({
        "@raw": ".a-id {\\n  width: 0;\\n}"
      }, {
        "classes": {
          "a": "a-id"
        },
        a: 1
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('extend options object ref', () => {
    const before = stripIndent`
      const options = {
        a: 1
      };
      createStyleSheet({
        a: {
          width: 0
        }
      }, options);
    `
    const after = stripIndent`
      const options = {
        "classes": {
          "a": "a-id"
        },
        a: 1
      };
      createStyleSheet({
        "@raw": ".a-id {\\n  width: 0;\\n}"
      }, options);
    `
    expect(transform(before)).toBe(after)
  })

  test('unresolvable styles ref', () => {
    const code = stripIndent`
      import styles from 'styles';
      createStyleSheet(styles);
    `
    expect(transform(code)).toBe(code)
  })

  test('extend imported options ref', () => {
    const before = stripIndent`
      import options from 'options';
      createStyleSheet({
        a: {
          color: 'red'
        }
      }, options);
    `
    const after = stripIndent`
      import options from 'options';
      createStyleSheet({
        "@raw": ".a-id {\\n  color: red;\\n}"
      }, Object.assign({
        "classes": {
          "a": "a-id"
        }
      }, options));
    `
    expect(transform(before)).toBe(after)
  })

  test('support styles creator arrow function', () => {
    const before = stripIndent`
      injectSheet(() => ({
        a: {
          color: 'red'
        }
      }));
    `
    const after = stripIndent`
      injectSheet(() => ({
        "@raw": ".a-id {\\n  color: red;\\n}"
      }), {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('support styles creator arrow function with return', () => {
    const before = stripIndent`
      injectSheet(() => {
        return {
          a: {
            color: 'red'
          }
        };
      });
    `
    const after = stripIndent`
      injectSheet(() => {
        return {
          "@raw": ".a-id {\\n  color: red;\\n}"
        };
      }, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('support styles creator function expression', () => {
    const before = stripIndent`
      injectSheet(function () {
        return {
          a: {
            color: 'red'
          }
        };
      });
    `
    const after = stripIndent`
      injectSheet(function () {
        return {
          "@raw": ".a-id {\\n  color: red;\\n}"
        };
      }, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('support styles creator function ref', () => {
    const before = stripIndent`
      function getStyles() {
        return {
          a: {
            color: 'red'
          }
        };
      }

      injectSheet(getStyles);
    `
    const after = stripIndent`
      function getStyles() {
        return {
          "@raw": ".a-id {\\n  color: red;\\n}"
        };
      }

      injectSheet(getStyles, {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('support object prop access inside styles creator fn', () => {
    const before = stripIndent`
      const config = {
        primary: 'red'
      };
      injectSheet(() => ({
        a: {
          color: config.primary
        }
      }));
    `
    const after = stripIndent`
      const config = {
        primary: 'red'
      };
      injectSheet(() => ({
        "@raw": ".a-id {\\n  color: red;\\n}"
      }), {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before)).toBe(after)
  })

  test('support theme prop access over babel config as fn arg', () => {
    const before = stripIndent`
      injectSheet(theme => ({
        a: {
          color: theme.primary
        }
      }));
    `
    const after = stripIndent`
      injectSheet(theme => ({
        "@raw": ".a-id {\\n  color: red;\\n}"
      }), {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before, {theme: {primary: 'red'}})).toBe(after)
  })

  test('support complex theme prop access over babel config as fn arg', () => {
    const before = stripIndent`
      injectSheet(theme => ({
        a: {
          color: theme.x[0].color
        }
      }));
    `
    const after = stripIndent`
      injectSheet(theme => ({
        "@raw": ".a-id {\\n  color: red;\\n}"
      }), {
        "classes": {
          "a": "a-id"
        }
      });
    `
    expect(transform(before, {theme: {x: [{color: 'red'}]}})).toBe(after)
  })

  test('throw prop access error complex theme prop access over babel config as fn arg', () => {
    const before = stripIndent`
      injectSheet(theme => ({
        a: {
          color: theme.x[0].color
        }
      }));
    `
    expect(() => transform(before, {})).toThrowError()
  })

  test('support object prop access', () => {})

  test('resolve refs from a different module', () => {})

  test('make sure identifier is imported from a specific package', () => {})

  test('support configurable package name', () => {})

  test('handle refs from an external module', () => {})

  test('styles returned from a function call', () => {})
  test('property returned from a function call', () => {})

  test('decorators?', () => {})
})
