/* eslint-disable no-underscore-dangle */

import {stripIndent} from 'common-tags'
import expect from 'expect.js'

import {create} from '../../src'
import DomRenderer from '../../src/renderers/DomRenderer'
import StyleRule from '../../src/rules/StyleRule'
import {
  createGenerateClassName,
  computeStyle,
  getStyle,
  getCss,
  getRules,
  removeWhitespace
} from '../utils'

const settings = {createGenerateClassName}

describe('Functional: sheet', () => {
  let jss

  beforeEach(() => {
    jss = create(settings)
  })

  describe('sheet.attach() CSS check from DOM', () => {
    function check(styles, options) {
      const sheet = jss.createStyleSheet(styles, options).attach()
      const style = getStyle()
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
      sheet.detach()
    }

    it('should render simple sheet', () => {
      check({a: {width: '1px', float: 'left'}})
    })

    it('should render sheet with media query', () => {
      check({
        a: {color: 'red'},
        '@media all and (min-width: 1024px)': {
          a: {color: 'blue'},
          b: {color: 'white'}
        },
        '@media all and (min-width: 100px)': {
          a: {color: 'green'}
        }
      })
    })
  })

  describe('sheet.attach() and sheet.detach()', () => {
    let sheet
    let style

    beforeEach(() => {
      sheet = jss.createStyleSheet().attach()
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should have attached the sheet', () => {
      expect(sheet.attached).to.be(true)
      expect(style).to.be.an(Element)
      expect(style.parentNode).to.be.an(Element)
    })

    it('should have rendered nothing inside', () => {
      expect(style.innerHTML.trim()).to.be(sheet.toString().trim())
    })

    it('should detach sheet', () => {
      sheet.detach()
      expect(sheet.attached).to.be(false)
      expect(style.parentNode).to.be(null)
    })
  })

  describe('Options: {media, meta}', () => {
    let sheet
    let style

    beforeEach(() => {
      sheet = jss.createStyleSheet(null, {media: 'screen', meta: 'test'}).attach()
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should have right options', () => {
      expect(sheet.options.media).to.be('screen')
      expect(sheet.options.meta).to.be('test')
    })

    it('should have rendered attributes', () => {
      expect(style.getAttribute('media'), 'screen')
      expect(style.getAttribute('data-meta'), 'test')
    })
  })

  describe('Option: {link: true}', () => {
    let sheet

    afterEach(() => {
      sheet.detach()
    })

    it('should link the DOM node', () => {
      sheet = jss.createStyleSheet({a: {float: 'left'}}, {link: true}).attach()
      expect(sheet.getRule('a').renderable).to.be.a(CSSStyleRule)
    })

    it('should link the DOM node to added rule', () => {
      sheet = jss.createStyleSheet(null, {link: true}).attach()
      sheet.addRule('a', {color: 'red'})
      expect(sheet.getRule('a').renderable).to.be.a(CSSStyleRule)
    })

    it('should link a rule with CSS escaped chars within selector', () => {
      sheet = jss.createStyleSheet(null, {link: true})
      const rule = sheet.addRule('a', {color: 'red'}, {selector: ':not(#\\20)'})
      sheet.attach()
      expect(rule.renderable).to.not.be(undefined)
    })
  })

  describe('Option {virtual: true}', () => {
    it('should not render style', () => {
      const localJss = create({virtual: true})
      const sheet = localJss.createStyleSheet({a: {float: 'left'}})
      sheet.attach()
      expect(getStyle()).to.be(undefined)
      sheet.detach()
    })
  })

  describe('Option {element}', () => {
    it('should render style using provided element', () => {
      const element = document.createElement('style')
      element.type = 'text/css'
      const sheet = jss.createStyleSheet({a: {float: 'left'}}, {element})
      sheet.attach()
      expect(getCss(element)).to.be(removeWhitespace(sheet.toString()))
      sheet.detach()
    })
  })

  describe('Option: {index}', () => {
    it('should be 0 by default', () => {
      const sheet = jss.createStyleSheet({})
      expect(sheet.options.index).to.be(0)
    })

    it('should be set by the options argument', () => {
      [-50, 0, 50, 9999].forEach((n) => {
        const sheet2 = jss.createStyleSheet({}, {index: n})
        expect(sheet2.options.index).to.be(n)
      })
    })
  })

  describe('.addRule()', () => {
    let sheet
    let rule
    let style

    beforeEach(() => {
      sheet = jss.createStyleSheet().attach()
      rule = sheet.addRule('a', {float: 'left'})
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render only 1 rule', () => {
      expect(getRules(style).length).to.be(1)
    })

    it('should render correct CSS', () => {
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })

    it('should register the rule', () => {
      expect(sheet.getRule('a')).to.be(rule)
    })

    it('should add a rule to a detached sheet', () => {
      sheet.detach()
      const newRule = sheet.addRule('b', {float: 'right'})
      sheet.attach()
      expect(sheet.getRule('b')).to.be(newRule)
    })

    it('should link sheet in rules options', () => {
      expect(sheet.getRule('a').options.sheet).to.be(sheet)
    })
  })

  describe('.addRule() with .addRule() call within a plugin and attached sheet', () => {
    let style
    let sheet

    beforeEach(() => {
      function addRule(rule) {
        if (rule.key === 'a') {
          rule.options.sheet.addRule('b', {color: 'red'})
        }
      }
      const localJss = create(settings).use(addRule)
      sheet = localJss.createStyleSheet().attach()
      sheet.addRule('a', {color: 'green'})
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render rules in the right order', () => {
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })
  })

  describe('.addRule() with @media and attached sheet', () => {
    let style
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({}, {link: true}).attach()
      sheet.addRule('a', {color: 'red'})
      // It is important to use exactly this query, because
      // IE will add "all" always when `cssRules.insertRule` is used,
      // however all others will always remove "all" if query contains a second
      // condition.
      sheet.addRule('@media all', {
        a: {color: 'green'}
      })
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render @media', () => {
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })

    it('should render @media and added rule', () => {
      sheet.addRule('b', {
        color: 'red'
      })
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })
  })

  describe('.addRule() with empty styles', () => {
    let sheet
    let style
    let warned = false

    beforeEach(() => {
      DomRenderer.__Rewire__('warning', () => {
        warned = true
      })
      sheet = jss.createStyleSheet().attach()
      sheet.addRule('a', {})
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
      DomRenderer.__ResetDependency__('warning')
      warned = false
    })

    it('should not render', () => {
      expect(getCss(style)).to.be('')
    })

    it('should not warn', () => {
      expect(warned).to.be(false)
    })
  })

  describe('.addRule() with @keyframes and attached sheet', () => {
    const isSupported = 'animationName' in document.body.style
    let style
    let sheet

    // We skip this test as keyframes are not supported by browser.
    if (!isSupported) return

    beforeEach(() => {
      sheet = jss.createStyleSheet().attach()
      sheet.addRule('@keyframes id', {
        '0%': {top: '0px'}
      })
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render @keyframes', () => {
      // Safari adds the prefix automatically.
      const css = getCss(style).replace('-webkit-', '')
      expect(css).to.be(removeWhitespace(sheet.toString()))
    })
  })

  describe('.addRule() with invalid decl to attached sheet', () => {
    let warned = false
    let sheet

    beforeEach(() => {
      DomRenderer.__Rewire__('warning', () => {
        warned = true
      })
    })

    afterEach(() => {
      DomRenderer.__ResetDependency__('warning')
      sheet.detach()
      warned = false
    })

    it('should not throw', () => {
      sheet = jss.createStyleSheet().attach()
      sheet.addRule('%%%%', {color: 'red'})
      expect(warned).to.be(true)
    })
  })

  describe('.addRules() with an attached sheet', () => {
    let sheet
    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {width: '1px'}
      }).attach()
      sheet.addRules({
        b: {
          width: '2px'
        }
      })
    })

    it('should add rules to an attached sheet', () => {
      expect(computeStyle(sheet.classes.a).width).to.be('1px')
      expect(computeStyle(sheet.classes.b).width).to.be('2px')
    })

    it('should keep the values after reattaching', () => {
      sheet.detach().attach()
      expect(computeStyle(sheet.classes.a).width).to.be('1px')
      expect(computeStyle(sheet.classes.b).width).to.be('2px')
    })
  })

  describe('.deleteRule()', () => {
    it('should delete a rule from the sheet and DOM', () => {
      const sheet = jss.createStyleSheet(
        {a: {width: '1px'}},
        {link: true}
      ).attach()
      expect(computeStyle(sheet.classes.a).width).to.be('1px')
      expect(sheet.deleteRule('a')).to.be(true)
      expect(sheet.getRule('a')).to.be(undefined)
      expect(computeStyle(sheet.classes.a).width).not.to.be('1px')
      sheet.detach()
    })
  })

  describe('rule.prop()', () => {
    let rule
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({a: {color: 'green'}}, {link: true})
      rule = sheet.getRule('a')
      sheet.attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should have initial color', () => {
      expect(rule.style.color).to.be('green')
    })

    it('should apply a style prop', () => {
      rule.prop('color', 'red')
      expect(rule.prop('color')).to.be('red')
    })

    it('should cache the new prop', () => {
      rule.prop('color', 'red')
      expect(rule.style.color).to.be('red')
    })

    it('should return a new prop from toString()', () => {
      rule.prop('display', 'block')
      expect(rule.toString()).to.be(stripIndent`
        .a-id {
          color: green;
          display: block;
        }
      `)
    })
  })

  describe('warn on rule.prop() call', () => {
    let warned = false

    beforeEach(() => {
      StyleRule.__Rewire__('warning', () => {
        warned = true
      })
    })

    afterEach(() => {
      warned = false
      StyleRule.__ResetDependency__('warning')
    })

    it('should warn when sheet not linked but attached', () => {
      const sheet = jss.createStyleSheet({a: {color: 'green'}}).attach()
      sheet.getRule('a').prop('color', 'red')
      expect(warned).to.be(true)
    })

    it('should not warn when sheet is not linked but also not attached', () => {
      const sheet = jss.createStyleSheet({a: {color: 'green'}})
      sheet.getRule('a').prop('color', 'red')
      expect(warned).to.be(false)
    })

    it('should not warn when there is no sheet', () => {
      jss.createRule({color: 'green'}).prop('color', 'red')
      expect(warned).to.be(false)
    })
  })

  describe('rule.selector', () => {
    let sheet
    let rule

    beforeEach(() => {
      sheet = jss.createStyleSheet(
        {a: {width: '1px'}},
        {link: true}
      ).attach()
      rule = sheet.getRule('a')
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should set the selector', () => {
      rule.selector = '.test'
      expect(rule.selector).to.be('.test')
    })

    it('should apply selector to the DOM', () => {
      rule.selector = '.test'
      expect(computeStyle('test').width).to.be('1px')
    })

    it('should register the class name in sheet.classes', () => {
      expect(sheet.classes.a, 'test')
    })
  })

  describe('allow emojis as a key', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet(
        {'😅': {width: '1px'}}
      ).attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should apply selector to the DOM', () => {
      expect(computeStyle(sheet.classes['😅']).width).to.be('1px')
    })
  })
})
