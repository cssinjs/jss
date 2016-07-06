import expect from 'expect.js'
import jss, {create, Rule} from 'jss'
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
      expect(sheet.classes.a).to.be('a-id')
      expect(rule.className).to.be('a-id')
      expect(rule.selector).to.be('.a-id')
    })

    it('should create an unnamed sheet', () => {
      const sheet = jss.createStyleSheet({'.a': {float: 'left'}}, {named: false})
      const rule = sheet.getRule('.a')
      expect(rule).to.be.a(Rule)
      expect(rule.options.named).to.be(false)
      expect(sheet.options.named).to.be(false)
      expect('.a' in sheet.classes).to.be(false)
    })

    it('should register a conditional child rule in classes', () => {
      const sheet = jss.createStyleSheet({
        '@media print': {
          a: {float: 'left'}
        }
      })
      expect(sheet.classes.a).to.be('a-id')
    })
  })

  describe('sheet.getRule()', () => {
    it('should return a rule by name and selector from named sheet', () => {
      const sheet = jss.createStyleSheet({a: {float: 'left'}})
      expect(sheet.getRule('a')).to.be.a(Rule)
      expect(sheet.getRule('.a-id')).to.be.a(Rule)
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

    it('should compile a single media query', () => {
      const sheet = jss.createStyleSheet({
        '@media (min-width: 1024px)': {'.a': {color: 'blue'}},
      }, {named: false})
      expect(sheet.toString()).to.be(
        '@media (min-width: 1024px) {\n' +
        '  .a {\n' +
        '    color: blue;\n' +
        '  }\n' +
        '}'
      )
    })

    it('should compile multiple media queries in unnamed sheet', () => {
      const sheet = jss.createStyleSheet({
        '.a': {color: 'red'},
        '@media (min-width: 1024px)': {'.a': {color: 'blue'}},
        '@media (min-width: 1000px)': {'.a': {color: 'green'}}
      }, {named: false})
      expect(sheet.toString()).to.be(
        '.a {\n' +
        '  color: red;\n' +
        '}\n' +
        '@media (min-width: 1024px) {\n' +
        '  .a {\n' +
        '    color: blue;\n' +
        '  }\n' +
        '}\n' +
        '@media (min-width: 1000px) {\n' +
        '  .a {\n' +
        '    color: green;\n' +
        '  }\n' +
        '}'
      )
    })

    it('should compile multiple media queries in named sheet', () => {
      const sheet = jss.createStyleSheet({
        a: {color: 'red'},
        '@media (min-width: 1024px)': {a: {color: 'blue'}},
        '@media (min-width: 1000px)': {a: {color: 'green'}}
      })
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
        '  color: red;\n' +
        '}\n' +
        '@media (min-width: 1024px) {\n' +
        '  .a-id {\n' +
        '    color: blue;\n' +
        '  }\n' +
        '}\n' +
        '@media (min-width: 1000px) {\n' +
        '  .a-id {\n' +
        '    color: green;\n' +
        '  }\n' +
        '}'
      )
    })

    it('should use the class name of a conditional child', () => {
      // Create new Jss instance with unmodified "jss.generateClassName()".
      const sheet = create().createStyleSheet({
        '@media print': {
          a: {float: 'left'}
        },
        a: {color: 'red'}
      })
      expect(sheet.toString()).to.be(
        '@media print {\n' +
        '  .a-3787690649 {\n' +
        '    float: left;\n' +
        '  }\n' +
        '}\n' +
        '.a-3787690649 {\n' +
        '  color: red;\n' +
        '}'
      )
    })

    describe('skip empty rules', () => {
      it('should skip empty rules', () => {
        const sheet = jss.createStyleSheet({
          a: {color: 'red'},
          b: {},
          c: {color: 'green'},
          d: {}
        })
        expect(sheet.toString()).to.be(
          '.a-id {\n' +
          '  color: red;\n' +
          '}\n' +
          '.c-id {\n' +
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
          '.a-id {\n' +
          '  color: red;\n' +
          '}\n' +
          '.c-id {\n' +
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
          '.a-id {\n' +
          '  color: red;\n' +
          '}'
        )
      })
    })
  })
})
