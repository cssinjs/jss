/* eslint-disable no-underscore-dangle */

import {stripIndent} from 'common-tags'
import expect from 'expect.js'
import vendorPrefixer from 'jss-vendor-prefixer'

import {create} from '../../src'
import {
  createGenerateClassName,
  getStyle,
  getCss,
  getCssFromSheet,
  removeWhitespace,
  removeVendorPrefixes
} from '../utils'

const settings = {createGenerateClassName}

describe('Functional: Function values', () => {
  let jss

  beforeEach(() => {
    jss = create(settings)
  })

  describe('.addRule() with @media with function values', () => {
    let style
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({}, {link: true}).attach()
      sheet.addRule('@media screen', {
        b: {
          color: props => (props.primary ? 'black' : 'white')
        }
      })
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render', () => {
      sheet.update({primary: true})
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })

    it('should update', () => {
      sheet.update({primary: true})
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })
  })

  describe('.addRule() with function values and attached sheet', () => {
    let style
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet(null, {link: true}).attach()
      sheet.addRule('a', {color: ({color}) => color})
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render an empty rule', () => {
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })

    it('should render rule with updated color', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
      `)
    })
  })

  describe('.addRule() with function values for rules from plugins queue', () => {
    let style
    let sheet

    beforeEach(() => {
      jss.use({
        onProcessRule(rule, ruleSheet) {
          const ruleName = 'plugin-rule'

          if (rule.key === ruleName) return

          ruleSheet.addRule(ruleName, {
            color: props => props.color
          })
        }
      })
      sheet = jss.createStyleSheet({}, {link: true}).attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render color for rule by plugin', () => {
      sheet.addRule('rule', {
        color: props => props.color
      })
      sheet.update({color: 'red'})
      style = getStyle()

      expect(sheet.toString()).to.be(stripIndent`
        .rule-id {
          color: red;
        }
        .plugin-rule-id {
          color: red;
        }
      `)
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })
  })

  describe('.addRule() with arrays returned from function values', () => {
    let style
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet(null, {link: true}).attach()
      sheet.addRule('a', {color: ({color}) => color})
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render an empty rule', () => {
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })

    it('should return correct CSS from an array with a single value', () => {
      sheet.update({color: ['blue']})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: blue;
        }
      `)
    })

    it('should return correct CSS from a double array with !important', () => {
      sheet.update({color: [['blue'], '!important']})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: blue !important;
        }
      `)
    })

    it('should return correct CSS from an array with !important', () => {
      sheet.update({color: ['blue', '!important']})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: blue !important;
        }
      `)
    })

    it('should return a property value from the CSSOM getPropertyValue function of "green" with important', () => {
      sheet.update({color: [['green'], '!important']})
      expect(
        document.styleSheets[0].cssRules[0].style.getPropertyValue('color')
      ).to.be('green')
    })

    it('should return a property value from the CSSOM getPropertyValue function of "green"', () => {
      sheet.update({color: ['green']})
      expect(
        document.styleSheets[0].cssRules[0].style.getPropertyValue('color')
      ).to.be('green')
    })

    it('should return a correct priority', () => {
      sheet.update({color: [['red'], '!important']})
      expect(
        document.styleSheets[0].cssRules[0].style.getPropertyPriority('color')
      ).to.be('important')
    })
  })

  describe('sheet.update()', () => {
    const styles = {
      a: {
        color: theme => theme.color
      },
      '@media all': {
        b: {
          color: theme => theme.color
        }
      },
      '@keyframes test': {
        '0%': {
          color: theme => theme.color
        }
      }
    }
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet(styles, {link: true})
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should return correct .toString() before .update()', () => {
      expect(removeVendorPrefixes(sheet.toString())).to.be(stripIndent`
        .a-id {
        }
        @media all {
          .b-id {
          }
        }
        @keyframes test {
          0% {
          }
        }
      `)
    })

    it('should return correct .toString() after single .update()', () => {
      sheet.update({
        color: 'green'
      })

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: green;
        }
        @media all {
          .b-id {
            color: green;
          }
        }
        @keyframes test {
          0% {
            color: green;
          }
        }
      `)
    })

    it('should return correct .toString() after double .update()', () => {
      sheet.update({
        color: 'green'
      })
      sheet.update({
        color: 'yellow'
      })

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: yellow;
        }
        @media all {
          .b-id {
            color: yellow;
          }
        }
        @keyframes test {
          0% {
            color: yellow;
          }
        }
      `)
    })

    it('should render sheet with updated props', () => {
      sheet.update({color: 'green'}).attach()
      expect(removeVendorPrefixes(getCss(getStyle()))).to.be(
        removeWhitespace(sheet.toString())
      )
    })

    it('should update specific rule', () => {
      sheet.update({color: 'yellow'})
      sheet.update('a', {color: 'green'})

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: green;
        }
        @media all {
          .b-id {
            color: yellow;
          }
        }
        @keyframes test {
          0% {
            color: yellow;
          }
        }
      `)
    })

    it('should render updated rule', () => {
      sheet.update('a', {color: 'green'}).attach()
      expect(removeVendorPrefixes(getCss(getStyle()))).to.be(
        removeWhitespace(sheet.toString())
      )
    })

    describe('sheet.update() after attach', () => {
      const assertSheet = () => {
        // skip this test for browsers,
        // that could not apply keyframes rule w/ or w/o prefix (like IE9)
        if (sheet.renderer.getRules().length < 3) return

        const [actual, expected] = [
          getCssFromSheet(sheet),
          removeWhitespace(sheet.toString())
        ].map(removeVendorPrefixes)

        expect(actual).to.be(expected)
      }

      beforeEach(() => {
        // we need to use vendor-prefixer, because keyframes rule may not to work
        // in some browsers wihtout prefix (like Safari 7.1.8)
        sheet = jss.use(vendorPrefixer()).createStyleSheet(styles, {link: true})
      })

      it('should render sheet with updated props after attach', () => {
        sheet.attach().update({color: 'green'})
        assertSheet()
      })

      it('should render updated rule after attach', () => {
        sheet.attach().update('a', {color: 'green'})
        assertSheet()
      })
    })
  })
})
