/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import jss from '../../src'
import RulesFactory from '../../src/RulesFactory'
import {reset} from '../utils'

describe('Integration: rules', () => {
  afterEach(reset)

  describe('.createRule()', () => {
    it('should create a rule without args', () => {
      const rule = jss.createRule()
      expect(rule.type).to.be('regular')
      expect(rule.className).to.be('id')
      expect(rule.selector).to.be('.id')
    })

    it('should accept styles only', () => {
      const style = {float: 'left'}
      const rule = jss.createRule(style)
      expect(rule.style).to.eql(style)
      expect(rule.type).to.be('regular')
      expect(rule.className).to.be('id')
      expect(rule.selector).to.be('.id')
    })

    it('should accept styles and options', () => {
      const style = {float: 'left'}
      const options = {something: true}
      const rule = jss.createRule(style, options)
      expect(rule.style).to.eql(style)
      expect(rule.type).to.be('regular')
      expect(rule.className).to.be('id')
      expect(rule.selector).to.be('.id')
      expect(rule.options.jss).to.be(jss)
      expect(rule.options.something).to.be(true)
    })

    it('should accept all params', () => {
      const style = {float: 'left'}
      const options = {someOption: true}
      const rule = jss.createRule('a', style, options)
      expect(rule.style).to.eql(style)
      expect(rule.type).to.be('regular')
      expect(rule.className).to.be('a-id')
      expect(rule.selector).to.be('.a-id')
      expect(rule.options.someOption).to.be(true)
      expect(rule.options.jss).to.be(jss)
    })
  })

  describe('rule.toString()', () => {
    it('should return CSS', () => {
      const rule = jss.createRule('a', {float: 'left', width: '1px'})
      expect(rule.toString()).to.be('.a-id {\n  float: left;\n  width: 1px;\n}')
    })

    it('should return CSS without selector', () => {
      const rule = jss.createRule('a', {float: 'left'})
      expect(rule.toString({selector: false})).to.be('\nfloat: left;')
    })

    it('should return CSS with fallbacks object', () => {
      const rule = jss.createRule('a', {
        display: 'run-in',
        fallbacks: {display: 'inline'}
      })
      expect(rule.toString()).to.be('.a-id {\n  display: inline;\n  display: run-in;\n}')
    })

    it('should return CSS with fallbacks array', () => {
      const rule = jss.createRule('a', {
        display: 'run-in',
        fallbacks: [{display: 'inline'}]
      })
      expect(rule.toString()).to.be('.a-id {\n  display: inline;\n  display: run-in;\n}')
    })

    it('should return CSS with comma separated values', () => {
      const rule = jss.createRule('a', {
        border: ['1px solid red', '1px solid blue']
      })
      expect(rule.toString()).to.be('.a-id {\n  border: 1px solid red, 1px solid blue;\n}')
    })

    it('should return CSS with comma separated values inside of fallbacks', () => {
      let rule = jss.createRule('a', {
        fallbacks: {
          border: ['1px solid red', '1px solid blue']
        }
      })
      expect(rule.toString()).to.be('.a-id {\n  border: 1px solid red, 1px solid blue;\n}')

      rule = jss.createRule('a', {
        fallbacks: [{
          border: ['1px solid red', '1px solid blue']
        }]
      })
      expect(rule.toString()).to.be('.a-id {\n  border: 1px solid red, 1px solid blue;\n}')
    })

    it('should return CSS with space separated values', () => {
      const rule = jss.createRule('a', {
        margin: [['5px', '10px']]
      })
      expect(rule.toString()).to.be('.a-id {\n  margin: 5px 10px;\n}')
    })

    it('should return CSS from @charset rule', () => {
      const rule = jss.createRule('@charset', '"utf-8"')
      expect(rule.type).to.be('simple')
      expect(rule.name).to.be('@charset')
      expect(rule.value).to.be('"utf-8"')
      expect(rule.toString()).to.be('@charset "utf-8";')
    })

    describe('@import rule', () => {
      it('should return CSS from @import with single value', () => {
        let rule = jss.createRule('@import', '"something"')
        expect(rule.type).to.be('simple')
        expect(rule.name).to.be('@import')
        expect(rule.value).to.be('"something"')
        expect(rule.toString()).to.be('@import "something";')
        rule = jss.createRule('@import', 'url("something") print')
        expect(rule.toString()).to.be('@import url("something") print;')
      })

      it('should return CSS from @import with array value', () => {
        const value = [
          'url("something") print',
          'url("something") screen'
        ]
        const rule = jss.createRule('@import', value)
        expect(rule.type).to.be('simple')
        expect(rule.name).to.be('@import')
        expect(rule.value).to.eql(value)
        expect(rule.toString()).to.be(
          '@import url("something") print;\n' +
          '@import url("something") screen;'
        )
      })
    })

    it('should return CSS from @namespace rule', () => {
      const rule = jss.createRule('@namespace', 'svg url(http://www.w3.org/2000/svg)')
      expect(rule.type).to.be('simple')
      expect(rule.name).to.be('@namespace')
      expect(rule.value).to.be('svg url(http://www.w3.org/2000/svg)')
      expect(rule.toString()).to.be('@namespace svg url(http://www.w3.org/2000/svg);')
    })

    it('should return CSS from @keyframes rule', () => {
      const rule = jss.createRule('@keyframes id', {
        from: {top: 0},
        '30%': {top: 30},
        '60%, 70%': {top: 80}
      })
      expect(rule.type).to.be('keyframe')
      expect(rule.selector).to.be('@keyframes id')
      expect(rule.toString()).to.be(
        '@keyframes id {\n' +
        '  from {\n' +
        '    top: 0;\n' +
        '  }\n' +
        '  30% {\n' +
        '    top: 30;\n' +
        '  }\n' +
        '  60%, 70% {\n' +
        '    top: 80;\n' +
        '  }\n' +
        '}'
      )
    })

    describe('@media rule', () => {
      it('should return CSS from unnamed rule', () => {
        const rule = jss.createRule(
          '@media print',
          {a: {display: 'none'}}
        )
        expect(rule.type).to.be('conditional')
        expect(rule.selector).to.be('@media print')
        expect(rule.toString()).to.be(
          '@media print {\n' +
          '  .a-id {\n' +
          '    display: none;\n' +
          '  }\n' +
          '}'
        )
      })

      it('should return CSS from named rule', () => {
        const rule = jss.createRule(
          '@media print',
          {button: {display: 'none'}}
        )
        expect(rule.type).to.be('conditional')
        expect(rule.selector).to.be('@media print')
        expect(rule.toString()).to.be(
          '@media print {\n' +
          '  .button-id {\n' +
          '    display: none;\n' +
          '  }\n' +
          '}'
        )
      })

      it('should support @media without space', () => {
        const rule = jss.createRule(
          '@media(max-width: 715px)',
          {a: {color: 'red'}}
        )
        expect(rule.type).to.be('conditional')
        expect(rule.selector).to.be('@media(max-width: 715px)')
        expect(rule.toString()).to.be(
          '@media(max-width: 715px) {\n' +
          '  .a-id {\n' +
          '    color: red;\n' +
          '  }\n' +
          '}'
        )
      })

      it('should return CSS from named rule without empty rule', () => {
        const rule = jss.createRule(
          '@media print',
          {button: {}}
        )
        expect(rule.type).to.be('conditional')
        expect(rule.selector).to.be('@media print')
        expect(rule.toString()).to.be('')
      })
    })

    describe('@font-face rule', () => {
      function checkSingle(options) {
        const rule = jss.createRule('@font-face', {
          'font-family': 'MyHelvetica',
          src: 'local("Helvetica")'
        }, options)
        expect(rule.type).to.be('font-face')
        expect(rule.selector).to.be('@font-face')
        expect(rule.toString()).to.be(
          '@font-face {\n' +
          '  font-family: MyHelvetica;\n' +
          '  src: local("Helvetica");\n' +
          '}'
        )
      }

      function checkMulti(options) {
        const rule = jss.createRule('@font-face', [
          {
            'font-family': 'MyHelvetica',
            src: 'local("Helvetica")'
          },
          {
            'font-family': 'MyComicSans',
            src: 'local("ComicSans")'
          },
        ], options)
        expect(rule.type).to.be('font-face')
        expect(rule.selector).to.be('@font-face')
        expect(rule.toString()).to.be(
          '@font-face {\n' +
          '  font-family: MyHelvetica;\n' +
          '  src: local("Helvetica");\n' +
          '}\n' +
          '@font-face {\n' +
          '  font-family: MyComicSans;\n' +
          '  src: local("ComicSans");\n' +
          '}'
        )
      }

      it('should return CSS from named rule', () => {
        checkSingle()
      })

      it('should return CSS from unnamed rule', () => {
        checkSingle({named: false})
      })

      it('should handle multiple font-faces from named rule', () => {
        checkMulti()
      })

      it('should handle multiple font-faces from unnamed rule', () => {
        checkMulti({named: false})
      })
    })

    describe('at-rule', () => {
      let warned = false

      before(() => {
        RulesFactory.__Rewire__('warning', () => {
          warned = true
        })
      })

      it('should warn when using an unknown at-rule', () => {
        const rule = jss.createRule('@unknown', {
          color: 'red'
        })
        expect(warned).to.be(true)
        const css =
          '.@unknown-id {\n' +
          '  color: red;\n' +
          '}'
        expect(rule.toString()).to.be(css)
      })

      after(() => {
        RulesFactory.__ResetDependency__('warning')
      })
    })

    it('should return CSS from @supports rule', () => {
      const rule = jss.createRule('@supports ( display: flexbox )', {
        button: {
          display: 'none'
        }
      })
      expect(rule.type).to.be('conditional')
      expect(rule.selector).to.be('@supports ( display: flexbox )')
      const css =
        '@supports ( display: flexbox ) {\n' +
        '  .button-id {\n' +
        '    display: none;\n' +
        '  }\n' +
        '}'
      expect(rule.toString()).to.be(css)
    })
  })

  describe('rule.toJSON()', () => {
    it('should return style', () => {
      const style = {color: 'red'}
      const rule = jss.createRule(style)
      expect(rule.toJSON()).to.eql(style)
    })

    it('should skip nested rules', () => {
      const style = {color: 'red', '&:hover': {color: 'blue'}}
      const rule = jss.createRule(style)
      expect(rule.toJSON()).to.eql({color: 'red'})
    })

    it('should skip fallbacks', () => {
      const rule = jss.createRule({
        display: 'run-in',
        fallbacks: {display: 'inline'}
      })
      expect(rule.toJSON()).to.eql({display: 'run-in'})
    })

    it('should have proper comma separated values', () => {
      const rule = jss.createRule({
        border: ['1px solid red', '1px solid blue']
      })
      expect(rule.toJSON()).to.eql({border: '1px solid red, 1px solid blue'})
    })

    it('should have proper space separated values', () => {
      const rule = jss.createRule({
        margin: [['5px', '10px']]
      })
      expect(rule.toJSON()).to.eql({margin: '5px 10px'})
    })
  })

  describe('rule.prop()', () => {
    it('should get and set prop', () => {
      const rule = jss.createRule()
      rule.prop('float', 'left')
      expect(rule.prop('float')).to.be('left')
      rule.prop('width', 0)
      expect(rule.prop('width')).to.be(0)
    })
  })
})
