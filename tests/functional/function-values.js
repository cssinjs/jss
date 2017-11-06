/* eslint-disable no-underscore-dangle */

import {stripIndent} from 'common-tags'
import expect from 'expect.js'

import {create} from '../../src'
import {
  createGenerateClassName,
  getStyle,
  getCss,
  removeWhitespace
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
      sheet = jss.createStyleSheet().attach().link()
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
})
