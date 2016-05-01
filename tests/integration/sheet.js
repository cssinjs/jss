import expect from 'expect.js'
import jss, {Rule} from 'jss'
import {reset} from '../utils'

afterEach(reset)

describe('Integration: sheet', () => {
  describe('.createStyleSheet()', () => {
    it('should create a sheet without args', () => {
      const sheet = jss.createStyleSheet()
      expect(sheet.deployed).to.be(false)
      expect(sheet.attached).to.be(false)
      expect(sheet.options.named).to.be(true)
      expect(sheet.classes).to.eql({})
    })

    it('should create a sheet with one rule', () => {
      const sheet = jss.createStyleSheet({a: {float: 'left'}})
      const rule = sheet.getRule('a')
      expect(rule).to.be.a(Rule)
      expect(sheet.classes.a).to.be('a--jss-0-0')
      expect(rule.className).to.be('a--jss-0-0')
      expect(rule.selector).to.be('.a--jss-0-0')
    })

    it('should create an unnamed sheet', () => {
      const sheet = jss.createStyleSheet({'.a': {float: 'left'}}, {named: false})
      const rule = sheet.getRule('.a')
      expect(rule).to.be.a(Rule)
      expect(rule.options.named).to.be(false)
      expect(sheet.options.named).to.be(false)
      expect('.a' in sheet.classes).to.be(false)
    })
  })

  describe('sheet.getRule()', () => {
    it('should return a rule by name and selector from named sheet', () => {
      const sheet = jss.createStyleSheet({a: {float: 'left'}})
      expect(sheet.getRule('a')).to.be.a(Rule)
      expect(sheet.getRule('.a--jss-0-0')).to.be.a(Rule)
    })

    it('should return a rule by selector from unnamed sheet', () => {
      const sheet = jss.createStyleSheet({a: {float: 'left'}}, {named: false})
      expect(sheet.getRule('a')).to.be.a(Rule)
    })
  })

  describe('sheet.toString()', () => {
    it('should compile all rule types to CSS', () => {
      const sheet = jss.createStyleSheet({
        '@charset': '"utf-8"',
        '@import': 'bla',
        '@namespace': 'bla',
        '.a': {
          float: 'left'
        },
        '@font-face': {
          'font-family': 'MyHelvetica',
          src: 'local("Helvetica")'
        },
        '@keyframes id': {
          from: {top: 0}
        },
        '@media print': {
          button: {display: 'none'}
        },
        '@supports ( display: flexbox )': {
          button: {
            display: 'none'
          }
        }
      }, {named: false})

      expect(sheet.toString()).to.be(
        '@charset "utf-8";\n' +
        '@import bla;\n' +
        '@namespace bla;\n' +
        '.a {\n  float: left;\n}\n' +
        '@font-face {\n  font-family: MyHelvetica;\n  src: local("Helvetica");\n}\n' +
        '@keyframes id {\n  from {\n    top: 0;\n  }\n}\n' +
        '@media print {\n  button {\n    display: none;\n  }\n}\n' +
        '@supports ( display: flexbox ) {\n  button {\n    display: none;\n  }\n}'
      )
    })
  })

  describe('sheet.toString() should compile to CSS and skip empty rules', () => {
    it('should skip empty rules', () => {
      const sheet = jss.createStyleSheet({
        a: {color: 'red'},
        b: {},
        c: {color: 'green'},
        d: {}
      })
      expect(sheet.toString()).to.be(
        '.a--jss-0-0 {\n' +
        '  color: red;\n' +
        '}\n' +
        '.c--jss-0-2 {\n' +
        '  color: green;\n' +
        '}'
      )
    })

    it('should skip empty font-face rule', () => {
      const sheet = jss.createStyleSheet({
        a: {color: 'red'},
        b: {},
        c: {color: 'green'},
        '@font-face': {}
      })
      expect(sheet.toString()).to.be(
        '.a--jss-0-0 {\n' +
        '  color: red;\n' +
        '}\n' +
        '.c--jss-0-2 {\n' +
        '  color: green;\n' +
        '}'
      )
    })

    it('should skip empty conditional rule', () => {
      const sheet = jss.createStyleSheet({
        a: {color: 'red'},
        '@media print': {}
      })
      expect(sheet.toString()).to.be(
        '.a--jss-0-0 {\n' +
        '  color: red;\n' +
        '}'
      )
    })
  })
})
