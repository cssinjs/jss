/* eslint-disable no-underscore-dangle */

import {stripIndent} from 'common-tags'
import expect from 'expect.js'
import sinon from 'sinon'

import {create} from '../../src'
import {
  resetSheets,
  createGenerateId,
  computeStyle,
  getStyle,
  getCss,
  getRules,
  removeWhitespace,
  removeVendorPrefixes
} from '../../../../tests/utils'

const settings = {createGenerateId}

const isKeyframesSupported = 'animationName' in document.body.style

describe('Functional: sheet', () => {
  let jss
  let spy

  beforeEach(resetSheets())

  beforeEach(() => {
    spy = sinon.spy(console, 'warn')
    jss = create(settings)
  })

  afterEach(() => {
    console.warn.restore()
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

  describe('sheet.attach() with nonce', () => {
    let sheet
    let style
    let nonce

    beforeEach(() => {
      nonce = document.createElement('meta')
      nonce.setAttribute('property', 'csp-nonce')
      nonce.setAttribute('content', 'test')
      document.head.appendChild(nonce)

      sheet = jss.createStyleSheet().attach()
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
      nonce.parentNode.removeChild(nonce)
    })

    it('should have a nonce attribute if nonce is found', () => {
      expect(style.getAttribute('nonce')).to.be('test')
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
      expect(style.getAttribute('media')).to.be('screen')
      expect(style.getAttribute('data-meta')).to.be('test')
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

    it('should warn if added rule is invalid', () => {
      sheet = jss.createStyleSheet(null, {link: true})
      const rule = sheet.addRule('a', {color: 'red'}, {selector: ':wrong'})
      sheet.attach()
      expect(spy.callCount).to.be(1)
      expect(rule.renderable).to.be(undefined)
    })

    it('should insert a valid rule after an invalid one', () => {
      sheet = jss.createStyleSheet(null, {link: true})
      sheet.addRule('a', {color: 'red'}, {selector: ':wrong'})
      const rule = sheet.addRule('b', {color: 'red'})
      sheet.attach()
      expect(spy.callCount).to.be(1)
      expect(rule.renderable).to.not.be(undefined)
    })
  })

  describe('Option {Renderer: null}', () => {
    it('should not render style', () => {
      const localJss = create({Renderer: null})
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
      ;[-50, 0, 50, 9999].forEach((n) => {
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

    it('should not duplicate cssRules when adding rules to a detached sheet with link: true', () => {
      sheet.detach()
      sheet = jss.createStyleSheet(null, {link: true}).attach()
      sheet.addRule('a', {float: 'left'})
      sheet.detach()
      sheet.addRule('b', {float: 'right'})
      sheet.attach()
      style = getStyle()
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
      expect(getCss(style)).to.be('.a-id{float:left;}.b-id{float:right;}')
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

    beforeEach(() => {
      sheet = jss.createStyleSheet().attach()
      sheet.addRule('a', {})
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should not render', () => {
      expect(getCss(style)).to.be('')
    })

    it('should not warn', () => {
      expect(spy.callCount).to.be(0)
    })
  })

  describe('.addRule() with @keyframes and attached sheet', () => {
    let style
    let sheet

    // We skip this test as keyframes are not supported by browser.
    if (!isKeyframesSupported) return

    beforeEach(() => {
      sheet = jss.createStyleSheet().attach()
      sheet.addRule('@keyframes a', {
        '0%': {top: '0px'}
      })
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render @keyframes', () => {
      const css = removeVendorPrefixes(getCss(style))
      expect(css).to.be(removeWhitespace(sheet.toString()))
    })
  })

  describe('.addRules() with an attached sheet', () => {
    let sheet
    beforeEach(() => {
      sheet = jss
        .createStyleSheet({
          a: {width: '1px'}
        })
        .attach()
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
    it('should delete a style rule from the sheet and DOM', () => {
      const sheet = jss.createStyleSheet({a: {width: '1px'}}, {link: true}).attach()
      const className = sheet.classes.a
      expect(computeStyle(className).width).to.be('1px')
      expect(sheet.deleteRule('a')).to.be(true)
      expect(sheet.getRule('a')).to.be(undefined)
      expect(computeStyle(className).width).not.to.be('1px')
      sheet.detach()
    })

    it('should delete a media rule from the sheet and DOM', () => {
      const sheet = jss
        .createStyleSheet(
          {
            a: {
              color: 'red'
            },
            '@media all': {
              a: {width: '1px'}
            }
          },
          {link: true}
        )
        .attach()
      const className = sheet.classes.a
      expect(computeStyle(className).width).to.be('1px')
      expect(sheet.deleteRule('@media all')).to.be(true)
      expect(sheet.getRule('@media all')).to.be(undefined)
      expect(computeStyle(className).width).not.to.be('1px')
      sheet.detach()
    })
  })

  describe('rule.prop()', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet(
        {
          a: {
            width: '10px',
            'max-width': '50px'
          },
          '@media all': {
            b: {
              width: '1px',
              'max-width': '50px'
            }
          },
          '@keyframes a': {
            '100%': {
              opacity: 1
            }
          }
        },
        {link: true}
      )
      sheet.attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should have initial color', () => {
      expect(computeStyle(sheet.classes.a).width).to.be('10px')
    })

    it('should apply a style prop', () => {
      sheet.getRule('a').prop('width', '12px')
      expect(computeStyle(sheet.classes.a).width).to.be('12px')
    })

    it('should set the new prop on style', () => {
      sheet.getRule('a').prop('color', 'red')
      expect(sheet.getRule('a').style.color).to.be('red')
    })

    it('should apply a style prop in @media rule child', () => {
      const rule = sheet.getRule('@media all').rules.get('b')
      rule.prop('width', '12px')
      expect(computeStyle(sheet.classes.b).width).to.be('12px')
    })

    it('should apply a style prop in @keyframes rule child', () => {
      if (!isKeyframesSupported) return
      const rule = sheet.getRule('keyframes-a').rules.get('100%')
      rule.prop('opacity', 0)
      // We can't compute styles from keyframes.
      expect(removeVendorPrefixes(getCss(getStyle()))).to.be(removeWhitespace(sheet.toString()))
    })

    it('should return a new prop from toString()', () => {
      sheet.getRule('a').prop('display', 'block')
      expect(sheet.getRule('a').toString()).to.be(stripIndent`
        .a-id {
          width: 10px;
          max-width: 50px;
          display: block;
        }
      `)
    })

    it('should remove a prop in @media rule child when null value is passed', () => {
      const rule = sheet.getRule('@media all').rules.get('b')
      rule.prop('width', null)
      expect(computeStyle(sheet.classes.b).width).to.be('50px')
    })

    it('should remove a prop in @keyframes rule child when null value is passed', () => {
      if (!isKeyframesSupported) return
      const rule = sheet.getRule('keyframes-a').rules.get('100%')
      rule.prop('opacity', null)
      // We can't compute styles from keyframes.
      expect(removeVendorPrefixes(getCss(getStyle()))).to.be(removeWhitespace(sheet.toString()))
    })
  })

  describe('warn on rule.prop() call', () => {
    it('should warn when sheet not linked but attached', () => {
      const sheet = jss.createStyleSheet({a: {color: 'green'}}).attach()
      sheet.getRule('a').prop('color', 'red')
      expect(spy.callCount).to.be(1)
      expect(
        spy.calledWithExactly(
          'Warning: [JSS] Rule is not linked. Missing sheet option "link: true".'
        )
      ).to.be(true)
    })

    it('should not warn when sheet is not linked but also not attached', () => {
      const sheet = jss.createStyleSheet({a: {color: 'green'}})
      sheet.getRule('a').prop('color', 'red')
      expect(spy.callCount).to.be(0)
    })

    it('should not warn when there is no sheet', () => {
      jss.createRule({color: 'green'}).prop('color', 'red')
      expect(spy.callCount).to.be(0)
    })
  })

  describe('sheet.update()', () => {
    let sheet
    beforeEach(() => {
      const onUpdate = (data, rule) => {
        rule.style = data
      }
      sheet = create()
        .use({onUpdate})
        .createStyleSheet({a: {display: 'inline'}}, {link: true})
        .attach()

      expect(computeStyle(sheet.classes.a).display).to.be('inline')
    })

    it('should remove a prop when it is missing in a new rule.style', () => {
      sheet.update({})
      expect(computeStyle(sheet.classes.a).display).to.be('block')
    })

    it('should remove a prop when value is null in a new rule.style', () => {
      sheet.update({display: null})
      expect(computeStyle(sheet.classes.a).display).to.be('block')
    })

    it('should remove a prop when value is false in a new rule.style', () => {
      sheet.update({display: false})
      expect(computeStyle(sheet.classes.a).display).to.be('block')
    })
  })

  describe('rule.selector', () => {
    let sheet
    let rule

    beforeEach(() => {
      sheet = jss.createStyleSheet({a: {width: '1px'}}, {link: true}).attach()
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

  describe('escaping', () => {
    describe('escape class names', () => {
      let sheet

      beforeEach(() => {
        sheet = jss.createStyleSheet({'test()': {width: '1px'}}).attach()
      })

      afterEach(() => {
        sheet.detach()
      })

      it('should apply selector to the DOM', () => {
        expect(computeStyle(sheet.classes['test()']).width).to.be('1px')
      })
    })

    describe('allow emojis as a key', () => {
      let sheet

      beforeEach(() => {
        sheet = jss.createStyleSheet({'😅': {width: '1px'}}).attach()
      })

      afterEach(() => {
        sheet.detach()
      })

      it('should apply selector to the DOM', () => {
        expect(computeStyle(sheet.classes['😅']).width).to.be('1px')
      })
    })
  })

  describe('.replaceRule()', () => {
    let sheet
    let rule
    let replaceResult
    let style

    beforeEach(() => {
      sheet = jss.createStyleSheet().attach()
      rule = sheet.addRule('a', {float: 'left'})
      replaceResult = sheet.replaceRule('a', {float: 'right'})
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
      expect(sheet.getRule('a')).not.to.be(rule)
      expect(sheet.getRule('a')).to.be(replaceResult)
    })

    it('should add a rule to a detached sheet', () => {
      sheet.detach()
      sheet.addRule('b', {display: 'block'})
      const newRule = sheet.replaceRule('b', {display: 'flex'})
      sheet.attach()
      expect(sheet.getRule('b')).to.be(newRule)
    })

    it('should link sheet in rules options', () => {
      expect(sheet.getRule('a').options.sheet).to.be(sheet)
    })

    it('should not duplicate cssRules when replacing a rule in a detached sheet with link: true', () => {
      sheet.detach()
      sheet = jss.createStyleSheet(null, {link: true}).attach()
      sheet.addRule('a', {float: 'left'})
      sheet.detach()
      sheet.addRule('b', {display: 'block'})
      sheet.replaceRule('b', {display: 'flex'})
      sheet.attach()
      style = getStyle()
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
      expect(getCss(style)).to.be('.a-id{float:left;}.b-id{display:flex;}')
    })
  })

  describe('.replaceRule() with @media and attached sheet', () => {
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
      sheet.replaceRule('@media all', {
        a: {color: 'yellow'}
      })
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render @media', () => {
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })

    it('should render @media and replaced rule', () => {
      sheet.replaceRule('a', {
        color: 'red'
      })
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })
  })

  describe('.replaceRule() with empty styles', () => {
    let sheet
    let style

    beforeEach(() => {
      sheet = jss.createStyleSheet().attach()
      sheet.addRule('a', {zIndex: 1})
      sheet.replaceRule('a', {})
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should not render', () => {
      expect(getCss(style)).to.be('')
    })

    it('should not warn', () => {
      expect(spy.callCount).to.be(0)
    })
  })

  describe('.replaceRule() with @keyframes and attached sheet', () => {
    let style
    let sheet

    // We skip this test as keyframes are not supported by browser.
    if (!isKeyframesSupported) return

    beforeEach(() => {
      sheet = jss.createStyleSheet().attach()
      sheet.addRule('@keyframes a', {
        '0%': {top: '0px'}
      })
      sheet.replaceRule('@keyframes a', {
        '0%': {top: '10px'}
      })
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render @keyframes', () => {
      const css = removeVendorPrefixes(getCss(style))
      expect(css).to.be(removeWhitespace(sheet.toString()))
    })
  })

  describe('replaceRule in sheet with many rules', () => {
    let sheet
    beforeEach(() => {
      sheet = jss.createStyleSheet({}, {link: true}).attach()
      sheet.addRule('a', {top: '0px'})
      sheet.addRule('b', {color: 'blue'})
      sheet.addRule('c', {margin: '10px'})
      sheet.addRule('d', {display: 'block'})
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should replace rule a', () => {
      sheet.replaceRule('a', {width: '1px'})
      const style = getStyle()
      expect(getCss(style)).to.be(
        removeWhitespace(stripIndent`
        .a-id {
          width: 1px;
        }
        .b-id {
          color: blue;
        }
        .c-id {
          margin: 10px;
        }
        .d-id {
          display: block;
        }
      `)
      )
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })

    it('should replace rule b', () => {
      sheet.replaceRule('b', {float: 'left'})
      const style = getStyle()
      expect(getCss(style)).to.be(
        removeWhitespace(stripIndent`
        .a-id {
          top: 0px;
        }
        .b-id {
          float: left;
        }
        .c-id {
          margin: 10px;
        }
        .d-id {
          display: block;
        }
      `)
      )
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })

    it('should replace multiple rules', () => {
      sheet.replaceRule('c', {background: 'green'})
      sheet.replaceRule('d', {gap: '0px'})
      const style = getStyle()
      expect(getCss(style)).to.be(
        removeWhitespace(stripIndent`
        .a-id {
          top: 0px;
        }
        .b-id {
          color: blue;
        }
        .c-id {
          background: green;
        }
        .d-id {
          gap: 0px;
        }
      `)
      )
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })

    it('should replace rule multiple times', () => {
      sheet.replaceRule('c', {background: 'green'})
      sheet.replaceRule('c', {border: 'solid'})
      const style = getStyle()
      expect(getCss(style)).to.be(
        removeWhitespace(stripIndent`
        .a-id {
          top: 0px;
        }
        .b-id {
          color: blue;
        }
        .c-id {
          border: solid;
        }
        .d-id {
          display: block;
        }
      `)
      )
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })

    it("should add rule if name doesn't match any", () => {
      sheet.replaceRule('e', {background: 'green'})
      const style = getStyle()
      expect(getCss(style)).to.be(
        removeWhitespace(stripIndent`
        .a-id {
          top: 0px;
        }
        .b-id {
          color: blue;
        }
        .c-id {
          margin: 10px;
        }
        .d-id {
          display: block;
        }
        .e-id {
          background: green;
        }
      `)
      )
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })
  })
})
