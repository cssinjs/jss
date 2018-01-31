import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from '../../src'
import StyleRule from '../../src/rules/StyleRule'
import {createGenerateClassName} from '../utils'

describe('Integration: sheet', () => {
  let jss

  beforeEach(() => {
    jss = create({createGenerateClassName})
  })

  describe('.createStyleSheet()', () => {
    it('should create a sheet without args', () => {
      const sheet = jss.createStyleSheet()
      expect(sheet.deployed).to.be(false)
      expect(sheet.attached).to.be(false)
      expect(sheet.linked).to.be(false)
      expect(sheet.classes).to.eql({})
      expect(sheet.options).to.be.an(Object)
      expect(sheet.options.index).to.be(0)
      expect(sheet.options.sheet).to.be(sheet)
      expect(sheet.options.parent).to.be(sheet)
    })

    it('should create a sheet with one rule', () => {
      const sheet = jss.createStyleSheet({a: {float: 'left'}})
      const rule = sheet.getRule('a')
      expect(rule).to.be.a(StyleRule)
      expect(sheet.classes.a).to.be('a-id')
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

    it('should create rule classNames using the rule name', () => {
      const styles = {bar: {color: 'red'}}
      const sheet = jss.createStyleSheet(styles)
      expect(sheet.classes.bar).to.be('bar-id')
    })

    it('should ref original style object in RuleList#raw', () => {
      const styles = {a: {color: 'red'}}
      const sheet = jss.createStyleSheet(styles)
      // jss-cache relies on `a` being a ref to the original object.
      expect(sheet.getRule('a').options.parent.rules.raw.a).to.be(styles.a)
    })

    it('should allow generateClassName override', () => {
      const generateClassName = () => {}
      const sheet = jss.createStyleSheet(null, {generateClassName})
      expect(sheet.options.generateClassName).to.be(generateClassName)
    })
  })

  describe('sheet.getRule()', () => {
    it('should return a rule by name and selector from named sheet', () => {
      const sheet = jss.createStyleSheet({a: {float: 'left'}})
      expect(sheet.getRule('a')).to.be.a(StyleRule)
    })

    it('should return a rule by selector from unnamed sheet', () => {
      const sheet = jss.createStyleSheet({a: {float: 'left'}}, {named: false})
      expect(sheet.getRule('a')).to.be.a(StyleRule)
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
    it('should add a rule with "selector" option', () => {
      const sheet = jss.createStyleSheet()
      const rule = sheet.addRule('a', {color: 'red'}, {selector: '.test'})
      expect(rule.selector).to.be('.test')
      expect(sheet.getRule('a')).to.be(rule)
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
      const sheet = jss.createStyleSheet(
        {
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
        },
        {named: false}
      )

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
        '@media (min-width: 1024px)': {a: {color: 'blue'}}
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

    it('should not throw when rule is undefined', () => {
      const sheet = jss.createStyleSheet({a: undefined})
      expect(sheet.toString()).to.be('')
    })

    describe('class names of conditional rules', () => {
      let id
      const options = {
        generateClassName: () => {
          id = `c${Math.random()
            .toString()
            .substr(2)}`
          return id
        }
      }

      it('should use the class name of a conditional child', () => {
        const sheet = create().createStyleSheet(
          {
            '@media print': {
              a: {float: 'left'}
            },
            a: {color: 'red'}
          },
          options
        )
        expect(sheet.toString()).to.be(stripIndent`
          @media print {
            .${id} {
              float: left;
            }
          }
          .${id} {
            color: red;
          }
        `)
      })

      it('should use the class name of the first conditional child', () => {
        const sheet = create().createStyleSheet(
          {
            '@media print': {
              a: {float: 'left'}
            },
            '@media screen': {
              a: {float: 'right'}
            }
          },
          options
        )
        expect(sheet.toString()).to.be(stripIndent`
          @media print {
            .${id} {
              float: left;
            }
          }
          @media screen {
            .${id} {
              float: right;
            }
          }
        `)
      })
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
          '.a-id {\n' + //
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
        '.a-id {\n' + //
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

  describe('escape class names', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        'a()': {
          color: 'red'
        }
      })
    })

    it('should escape class name', () => {
      expect(sheet.toString()).to.be(stripIndent`
        .a\\(\\)-id {
          color: red;
        }
      `)
    })

    it('should not escape class ref', () => {
      expect(sheet.classes['a()']).to.be('a()-id')
    })
  })
})
