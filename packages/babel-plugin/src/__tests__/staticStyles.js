import {stripIndent} from 'common-tags'
import {sheets} from 'jss'
import {transform} from '../testUtils'

describe('static styles', () => {
  beforeEach(() => {
    sheets.reset()
  })

  test('numeric value', () => {
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

  test('array value', () => {
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

  test('array in array value', () => {
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

  test('styles value returned from a function call', () => {
    const code = stripIndent`
      import jss from 'jss';

      const x = () => 10;

      createStyleSheet({
        a: {
          width: x()
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

  test('styles returned from a function returned from a function call with refs', () => {
    const code = stripIndent`
      import jss from 'jss';

      const getStyles = (width) => {
        const getAnchorStyles = width => ({
          a: {
            width: width
          }
        });

        return getAnchorStyles(width)
      }

      createStyleSheet(getStyles(5));
    `
    expect(transform(code)).toMatchSnapshot()
  })
})
