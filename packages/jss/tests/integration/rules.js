/* eslint-disable no-underscore-dangle */

import {stripIndent} from 'common-tags'
import expect from 'expect.js'
import Observable from 'zen-observable'

import {create} from '../../src'
import createRule from '../../src/utils/createRule'
import {createGenerateClassName} from '../utils'

describe('Integration: rules', () => {
  let jss

  beforeEach(() => {
    jss = create({createGenerateClassName})
  })

  describe('.createRule()', () => {
    it('should create a rule without args', () => {
      const rule = jss.createRule()
      expect(rule.type).to.be('style')
      expect(rule.selector).to.be('.unnamed-id')
    })

    it('should accept styles only', () => {
      const style = {float: 'left'}
      const rule = jss.createRule(style)
      expect(rule.style).to.eql(style)
      expect(rule.type).to.be('style')
      expect(rule.selector).to.be('.unnamed-id')
    })

    it('should accept styles and options', () => {
      const style = {float: 'left'}
      const options = {something: true}
      const rule = jss.createRule(style, options)
      expect(rule.style).to.eql(style)
      expect(rule.type).to.be('style')
      expect(rule.selector).to.be('.unnamed-id')
      expect(rule.options.jss).to.be(jss)
      expect(rule.options.something).to.be(true)
    })

    it('should accept all params', () => {
      const style = {float: 'left'}
      const options = {someOption: true}
      const rule = jss.createRule('a', style, options)
      expect(rule.style).to.eql(style)
      expect(rule.type).to.be('style')
      expect(rule.selector).to.be('.a-id')
      expect(rule.options.someOption).to.be(true)
      expect(rule.options.jss).to.be(jss)
    })
  })

  describe('rule.toString()', () => {
    it('should return CSS', () => {
      const rule = jss.createRule('a', {float: 'left', width: '1px'})
      expect(rule.toString()).to.be(stripIndent`
        .a-id {
          float: left;
          width: 1px;
        }
      `)
    })

    describe('array values', () => {
      it('should return CSS with comma separated values', () => {
        const rule = jss.createRule('a', {
          border: ['1px solid red', '1px solid blue']
        })
        expect(rule.toString()).to.be(stripIndent`
          .a-id {
            border: 1px solid red, 1px solid blue;
          }
        `)
      })

      it('should return CSS with space separated values', () => {
        const rule = jss.createRule('a', {
          margin: [['5px', '10px']]
        })
        expect(rule.toString()).to.be(stripIndent`
          .a-id {
            margin: 5px 10px;
          }
        `)
      })
    })

    describe('fallbacks', () => {
      it('should return CSS with fallbacks object', () => {
        const rule = jss.createRule('a', {
          display: 'run-in',
          fallbacks: {display: 'inline'}
        })
        expect(rule.toString()).to.be(stripIndent`
          .a-id {
            display: inline;
            display: run-in;
          }
        `)
      })

      it('should return CSS with fallbacks array', () => {
        const rule = jss.createRule('a', {
          display: 'run-in',
          fallbacks: [{display: 'inline'}]
        })
        expect(rule.toString()).to.be(stripIndent`
          .a-id {
            display: inline;
            display: run-in;
          }
        `)
      })

      it('should return CSS with comma separated values inside of fallbacks', () => {
        let rule = jss.createRule('a', {
          fallbacks: {
            border: ['1px solid red', '1px solid blue']
          }
        })
        expect(rule.toString()).to.be(stripIndent`
          .a-id {
            border: 1px solid red, 1px solid blue;
          }
        `)

        rule = jss.createRule('a', {
          fallbacks: [
            {
              border: ['1px solid red', '1px solid blue']
            }
          ]
        })
        expect(rule.toString()).to.be(stripIndent`
          .a-id {
            border: 1px solid red, 1px solid blue;
          }
        `)
      })
    })

    it('should return CSS from @charset rule', () => {
      const rule = jss.createRule('@charset', '"utf-8"')
      expect(rule.type).to.be('simple')
      expect(rule.key).to.be('@charset')
      expect(rule.value).to.be('"utf-8"')
      expect(rule.toString()).to.be('@charset "utf-8";')
    })

    describe('@import rule', () => {
      it('should return CSS from @import with single value', () => {
        let rule = jss.createRule('@import', '"something"')
        expect(rule.type).to.be('simple')
        expect(rule.key).to.be('@import')
        expect(rule.value).to.be('"something"')
        expect(rule.toString()).to.be('@import "something";')
        rule = jss.createRule('@import', 'url("something") print')
        expect(rule.toString()).to.be('@import url("something") print;')
      })

      it('should return CSS from @import with array value', () => {
        const value = ['url("something") print', 'url("something") screen']
        const rule = jss.createRule('@import', value)
        expect(rule.type).to.be('simple')
        expect(rule.key).to.be('@import')
        expect(rule.value).to.eql(value)
        expect(rule.toString()).to.be(stripIndent`
          @import url("something") print;
          @import url("something") screen;
        `)
      })
    })

    it('should return CSS from @namespace rule', () => {
      const rule = jss.createRule('@namespace', 'svg url(http://www.w3.org/2000/svg)')
      expect(rule.type).to.be('simple')
      expect(rule.key).to.be('@namespace')
      expect(rule.value).to.be('svg url(http://www.w3.org/2000/svg)')
      expect(rule.toString()).to.be('@namespace svg url(http://www.w3.org/2000/svg);')
    })

    it('should return CSS from @keyframes rule', () => {
      const rule = jss.createRule('@keyframes id', {
        from: {top: 0},
        '30%': {top: 30},
        '60%, 70%': {top: 80}
      })
      expect(rule.type).to.be('keyframes')
      expect(rule.key).to.be('@keyframes id')
      expect(rule.toString()).to.be(stripIndent`
        @keyframes id {
          from {
            top: 0;
          }
          30% {
            top: 30;
          }
          60%, 70% {
            top: 80;
          }
        }
      `)
    })

    describe('@media rule', () => {
      it('should return CSS from unnamed rule', () => {
        const rule = jss.createRule('@media print', {a: {display: 'none'}})
        expect(rule.type).to.be('conditional')
        expect(rule.key).to.be('@media print')
        expect(rule.toString()).to.be(stripIndent`
          @media print {
            .a-id {
              display: none;
            }
          }
        `)
      })

      it('should return CSS from named rule', () => {
        const rule = jss.createRule('@media print', {
          button: {display: 'none'}
        })
        expect(rule.type).to.be('conditional')
        expect(rule.key).to.be('@media print')
        expect(rule.toString()).to.be(stripIndent`
          @media print {
            .button-id {
              display: none;
            }
          }
        `)
      })

      it('should support @media without space', () => {
        const rule = jss.createRule('@media(max-width: 715px)', {
          a: {color: 'red'}
        })
        expect(rule.type).to.be('conditional')
        expect(rule.key).to.be('@media(max-width: 715px)')
        expect(rule.toString()).to.be(stripIndent`
          @media(max-width: 715px) {
            .a-id {
              color: red;
            }
          }
        `)
      })

      it('should return CSS from named rule without empty rule', () => {
        const rule = jss.createRule('@media print', {button: {}})
        expect(rule.type).to.be('conditional')
        expect(rule.key).to.be('@media print')
        expect(rule.toString()).to.be('')
      })
    })

    describe('@font-face rule', () => {
      function checkSingle(options) {
        const rule = jss.createRule(
          '@font-face',
          {
            'font-family': 'MyHelvetica',
            src: 'local("Helvetica")'
          },
          options
        )
        expect(rule.type).to.be('font-face')
        expect(rule.key).to.be('@font-face')
        expect(rule.toString()).to.be(stripIndent`
          @font-face {
            font-family: MyHelvetica;
            src: local("Helvetica");
          }
        `)
      }

      function checkMulti(options) {
        const rule = jss.createRule(
          '@font-face',
          [
            {
              'font-family': 'MyHelvetica',
              src: 'local("Helvetica")'
            },
            {
              'font-family': 'MyComicSans',
              src: 'local("ComicSans")'
            }
          ],
          options
        )
        expect(rule.type).to.be('font-face')
        expect(rule.key).to.be('@font-face')
        expect(rule.toString()).to.be(stripIndent`
          @font-face {
            font-family: MyHelvetica;
            src: local("Helvetica");
          }
          @font-face {
            font-family: MyComicSans;
            src: local("ComicSans");
          }
        `)
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

    describe('unknown at-rule', () => {
      let warned = false

      before(() => {
        createRule.__Rewire__('warning', () => {
          warned = true
        })
      })

      it('should warn', () => {
        const rule = jss.createRule('@unknown', {
          color: 'red'
        })
        expect(warned).to.be(true)
        const css =
          '.@unknown-id {\n' + //
          '  color: red;\n' +
          '}'
        expect(rule.toString()).to.be(css)
      })

      after(() => {
        createRule.__ResetDependency__('warning')
      })
    })

    it('should return CSS from @supports rule', () => {
      const rule = jss.createRule('@supports ( display: flexbox )', {
        button: {
          display: 'none'
        }
      })
      expect(rule.type).to.be('conditional')
      expect(rule.key).to.be('@supports ( display: flexbox )')
      expect(rule.toString()).to.be(stripIndent`
        @supports ( display: flexbox ) {
          .button-id {
            display: none;
          }
        }
      `)
    })

    describe('@viewport rule', () => {
      it('should return CSS from @viewport rule', () => {
        const rule = jss.createRule('@viewport', {
          zoom: 1
        })
        expect(rule.type).to.be('viewport')
        expect(rule.key).to.be('@viewport')
        expect(rule.toString()).to.be(stripIndent`
          @viewport {
            zoom: 1;
          }
        `)
      })

      it('should return CSS from @-ms-viewport rule', () => {
        const rule = jss.createRule('@-ms-viewport', {
          zoom: 1
        })
        expect(rule.type).to.be('viewport')
        expect(rule.key).to.be('@-ms-viewport')
        expect(rule.toString()).to.be(stripIndent`
          @-ms-viewport {
            zoom: 1;
          }
        `)
      })
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

    it('should handle function values', () => {
      const sheet = jss.createStyleSheet({
        a: {color: () => 'red'}
      })
      sheet.update()
      expect(sheet.getRule('a').toJSON()).to.eql({color: 'red'})
    })

    it('should handle observable values', () => {
      const rule = jss.createRule({
        color: new Observable(observer => {
          observer.next('red')
        })
      })
      expect(rule.toJSON()).to.eql({color: 'red'})
    })
  })

  describe('rule.prop()', () => {
    describe('get and set prop', () => {
      it('should get a prop', () => {
        const rule = jss.createRule({color: 'red'})
        expect(rule.prop('color')).to.be('red')
      })

      it('should set a prop', () => {
        const rule = jss.createRule({color: 'red'})
        rule.prop('color', 'green')
        expect(rule.prop('color')).to.be('green')
      })
    })

    describe('handle null or undefined value', () => {
      it("should ignore null when prop wasn't defined before", () => {
        const rule = jss.createRule()
        rule.prop('abc', null)
        expect('abc' in rule.style).to.be(false)
      })

      it("should ignore undefined when prop wasn't defined before", () => {
        const rule = jss.createRule()
        rule.prop('abc', undefined)
        expect('abc' in rule.style).to.be(false)
      })

      it('should remove prop when null was passed and prop was defined before', () => {
        const rule = jss.createRule({color: 'red'})
        rule.prop('color', null)
        expect('color' in rule.style).to.be(false)
      })
    })

    describe('handle null or undefined returned from fn value', () => {
      it("should not use null when prop wasn't defined before", () => {
        jss.use({onChangeValue: () => null})
        const rule = jss.createRule()
        rule.prop('abc', 'red')
        expect('abc' in rule.style).to.be(false)
      })

      it("should not use undefined when prop wasn't defined before", () => {
        jss.use({onChangeValue: () => undefined})
        const rule = jss.createRule()
        rule.prop('abc', 'red')
        expect('abc' in rule.style).to.be(false)
      })

      it('should use null to remove the prop when it was defined before', () => {
        jss.use({onChangeValue: () => null})
        const rule = jss.createRule({color: 'red'})
        rule.prop('color', 'anything')
        expect('color' in rule.style).to.be(false)
      })

      it('should use undefined to remove the prop when it was defined before', () => {
        jss.use({onChangeValue: () => undefined})
        const rule = jss.createRule({color: 'red'})
        rule.prop('color', 'anything')
        expect('color' in rule.style).to.be(false)
      })
    })
  })
})
