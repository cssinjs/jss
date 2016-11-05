import expect from 'expect.js'
import jss, {create, RegularRule} from '../../src'
import {reset} from '../utils'

describe('Integration: sheet', () => {
  afterEach(reset)

  describe('.createStyleSheet()', () => {
    it('should create a sheet without args', () => {
      const sheet = jss.createStyleSheet()
      expect(sheet.deployed).to.be(false)
      expect(sheet.attached).to.be(false)
      expect(sheet.classes).to.eql({})
    })

    it('should create a sheet with one rule', () => {
      const sheet = jss.createStyleSheet({a: {float: 'left'}})
      const rule = sheet.getRule('a')
      expect(rule).to.be.a(RegularRule)
      expect(sheet.classes.a).to.be('a-id')
      expect(rule.className).to.be('a-id')
      expect(rule.selector).to.be('.a-id')
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
      expect(sheet.getRule('a')).to.be.a(RegularRule)
      expect(sheet.getRule('.a-id')).to.be.a(RegularRule)
    })

    it('should return a rule by selector from unnamed sheet', () => {
      const sheet = jss.createStyleSheet({a: {float: 'left'}}, {named: false})
      expect(sheet.getRule('a')).to.be.a(RegularRule)
    })
  })

  describe('sheet.indexOf()', () => {
    it('should return the index of a rule', () => {
      const sheet = jss.createStyleSheet({
        a: {color: 'red'},
        b: {color: 'blue'}
      })
      expect(sheet.indexOf(sheet.getRule('a'))).to.be(0)
      expect(sheet.indexOf(sheet.getRule('b'))).to.be(1)
      expect(sheet.indexOf(sheet.getRule('c'))).to.be(-1)
    })
  })

  describe('sheet.addRule()', () => {
    it('should add a rule with "className" in options', () => {
      const sheet = jss.createStyleSheet()
      const rule = sheet.addRule('a', {color: 'red'}, {className: 'test'})
      expect(rule.className).to.be('test')
      expect(rule.selector).to.be('.test')
      expect(sheet.getRule('.test')).to.be(rule)
    })

    it('should add a rule with "index" in options', () => {
      const sheet = jss.createStyleSheet({
        a: {color: 'red'},
        c: {color: 'blue'}
      })
      sheet.addRule('b', {color: 'green'}, {index: 1})
      expect(sheet.indexOf(sheet.getRule('a'))).to.be(0)
      expect(sheet.indexOf(sheet.getRule('b'))).to.be(1)
      expect(sheet.indexOf(sheet.getRule('c'))).to.be(2)
      expect(sheet.toString()).to.equal(
        '.a-id {\n' +
        '  color: red;\n' +
        '}\n' +
        '.b-id {\n' +
        '  color: green;\n' +
        '}\n' +
        '.c-id {\n' +
        '  color: blue;\n' +
        '}'
      )
    })

    it('should apply plugins in the correct order', () => {
      jss.use((rule) => {
        if (rule.name === 'a') {
          rule.options.sheet.addRule('b', {color: 'green'}, {index: 1})
        }
      })

      const classNames = []
      jss.use((rule) => {
        classNames.push(rule.className)
      })

      const sheet = jss.createStyleSheet({
        a: {color: 'red'},
        c: {color: 'blue'}
      })

      expect(sheet.indexOf(sheet.getRule('a'))).to.be(0)
      expect(sheet.indexOf(sheet.getRule('b'))).to.be(1)
      expect(sheet.indexOf(sheet.getRule('c'))).to.be(2)
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
        '  color: red;\n' +
        '}\n' +
        '.b-id {\n' +
        '  color: green;\n' +
        '}\n' +
        '.c-id {\n' +
        '  color: blue;\n' +
        '}'
      )
      expect(classNames).to.eql(['b-id', 'a-id', 'c-id'])
    })
  })

  describe('sheet.deleteRule()', () => {
    it('should delete a rule', () => {
      const sheet = jss.createStyleSheet({a: {color: 'red'}})
      expect(sheet.deleteRule('a')).to.be(true)
      expect(sheet.toString()).to.equal('')
    })
  })

  describe('sheet.toString()', () => {
    it('should compile all rule types to CSS', () => {
      const sheet = jss.createStyleSheet({
        '@charset': '"utf-8"',
        '@import': 'bla',
        '@namespace': 'bla',
        a: {
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
          b: {display: 'none'}
        },
        '@supports ( display: flexbox )': {
          c: {
            display: 'none'
          }
        }
      }, {named: false})

      expect(sheet.toString()).to.be(
        '@charset "utf-8";\n' +
        '@import bla;\n' +
        '@namespace bla;\n' +
        '.a-id {\n  float: left;\n}\n' +
        '@font-face {\n  font-family: MyHelvetica;\n  src: local("Helvetica");\n}\n' +
        '@keyframes id {\n  from {\n    top: 0;\n  }\n}\n' +
        '@media print {\n  .b-id {\n    display: none;\n  }\n}\n' +
        '@supports ( display: flexbox ) {\n  .c-id {\n    display: none;\n  }\n}'
      )
    })

    it('should compile a single media query', () => {
      const sheet = jss.createStyleSheet({
        '@media (min-width: 1024px)': {a: {color: 'blue'}},
      })
      expect(sheet.toString()).to.be(
        '@media (min-width: 1024px) {\n' +
        '  .a-id {\n' +
        '    color: blue;\n' +
        '  }\n' +
        '}'
      )
    })

    it('should compile multiple media queries in unnamed sheet', () => {
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
      // Create new Jss instance with unmodified `generateClassName`.
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

    it('should use the class name of the first conditional child', () => {
      // Create new Jss instance with unmodified `generateClassName`.
      const sheet = create().createStyleSheet({
        '@media print': {
          a: {float: 'left'}
        },
        '@media screen': {
          a: {float: 'right'}
        }
      })
      expect(sheet.toString()).to.be(
        '@media print {\n' +
        '  .a-3787690649 {\n' +
        '    float: left;\n' +
        '  }\n' +
        '}\n' +
        '@media screen {\n' +
        '  .a-3787690649 {\n' +
        '    float: right;\n' +
        '  }\n' +
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

  describe('skip empty values', () => {
    it('should skip empty values', () => {
      const sheet = jss.createStyleSheet({
        a: {
          margin: 0,
          color: null
        }
      })
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
        '  margin: 0;\n' +
        '}'
      )
    })

    it('should skip rule if empty value was skipped', () => {
      const sheet = jss.createStyleSheet({
        a: {
          color: null
        }
      })
      expect(sheet.toString()).to.be('')
    })
  })
})
