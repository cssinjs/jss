import {stripIndent} from 'common-tags'
import {sheets} from 'jss'
import {transform} from '../testUtils'

describe('styles creator function', () => {
  beforeEach(() => {
    sheets.reset()
  })

  test('arrow function', () => {
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

  test('arrow function with return', () => {
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

  test('function expression', () => {
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

  test('function ref', () => {
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

  test('prop access inside styles creator fn', () => {
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

  test('theme prop access over babel config as fn arg', () => {
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

  test('complex theme prop access over babel config as fn arg', () => {
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
})
