/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import jssExtend from 'jss-plugin-extend'
import {create} from 'jss'
import sinon from 'sinon'
import functionPlugin from 'jss-plugin-rule-value-function'
import nested from '.'

const settings = {
  createGenerateId: () => rule => `${rule.key}-id`
}

describe('jss-plugin-nested', () => {
  let jss
  let spy

  beforeEach(() => {
    spy = sinon.spy(console, 'warn')
    jss = create(settings).use(nested())
  })

  afterEach(() => {
    console.warn.restore()
  })

  describe('nesting with space', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left',
          '& b': {float: 'left'}
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('.a-id b')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  float: left;\n}\n.a-id b {\n  float: left;\n}')
    })
  })

  describe('nesting without space', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left',
          '&b': {float: 'left'}
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('.a-idb')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  float: left;\n}\n.a-idb {\n  float: left;\n}')
    })
  })

  describe('multi nesting', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left',
          '&b': {float: 'left'},
          '& c': {float: 'left'}
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('.a-idb')).to.not.be(undefined)
      expect(sheet.getRule('.a-id c')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.a-idb {\n' +
          '  float: left;\n' +
          '}\n' +
          '.a-id c {\n' +
          '  float: left;\n' +
          '}'
      )
    })
  })

  describe('multi nesting in one selector', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left',
          '&b, &c': {float: 'left'}
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('.a-idb, .a-idc')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n  float: left;\n}\n.a-idb, .a-idc {\n  float: left;\n}'
      )
    })
  })

  describe('.addRules()', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          height: '1px'
        }
      })

      sheet.addRules({
        b: {
          height: '2px',
          '& c': {
            height: '3px'
          }
        }
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  height: 1px;\n' +
          '}\n' +
          '.b-id {\n' +
          '  height: 2px;\n' +
          '}\n' +
          '.b-id c {\n' +
          '  height: 3px;\n' +
          '}'
      )
    })
  })

  describe('nesting in a conditional', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          color: 'green'
        },
        '@media': {
          a: {
            '&:hover': {color: 'red'}
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('@media')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  color: green;\n' +
          '}\n' +
          '@media {\n' +
          '  .a-id:hover {\n' +
          '    color: red;\n' +
          '  }\n' +
          '}'
      )
    })
  })

  describe('nesting a conditional rule inside a regular rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          color: 'green',
          '@media': {
            width: '200px'
          }
        },
        b: {
          color: 'red'
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('@media')).to.not.be(undefined)
      expect(sheet.getRule('b')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  color: green;\n' +
          '}\n' +
          '@media {\n' +
          '  .a-id {\n' +
          '    width: 200px;\n' +
          '  }\n' +
          '}\n' +
          '.b-id {\n' +
          '  color: red;\n' +
          '}'
      )
    })
  })

  describe('nesting a conditional rule inside of a nested rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          '&:hover': {
            color: 'red',
            '@media': {
              color: 'green'
            }
          }
        }
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(stripIndent`
        .a-id:hover {
          color: red;
        }
        @media {
          .a-id:hover {
            color: green;
          }
        }
      `)
    })
  })

  describe('order of nested conditionals', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          '@media a': {
            color: 'red'
          },
          '@media b': {
            color: 'green'
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('@media a')).to.not.be(undefined)
      expect(sheet.getRule('@media b')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '@media a {\n' +
          '  .a-id {\n' +
          '    color: red;\n' +
          '  }\n' +
          '}\n' +
          '@media b {\n' +
          '  .a-id {\n' +
          '    color: green;\n' +
          '  }\n' +
          '}'
      )
    })
  })

  describe('adding a rule with a conditional rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet()
      sheet.addRule('a', {
        color: 'green',
        '@media': {
          width: '200px'
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('@media')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  color: green;\n' +
          '}\n' +
          '@media {\n' +
          '  .a-id {\n' +
          '    width: 200px;\n' +
          '  }\n' +
          '}'
      )
    })
  })

  describe('do not merge nested conditional to container conditional with existing rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          color: 'green',
          '@media': {
            width: '200px'
          },
          '@media large': {
            width: '300px'
          }
        },
        '@media': {
          b: {
            color: 'blue'
          }
        },
        c: {
          color: 'red'
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('@media')).to.not.be(undefined)
      expect(sheet.getRule('c')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  color: green;\n' +
          '}\n' +
          '@media {\n' +
          '  .a-id {\n' +
          '    width: 200px;\n' +
          '  }\n' +
          '}\n' +
          '@media large {\n' +
          '  .a-id {\n' +
          '    width: 300px;\n' +
          '  }\n' +
          '}\n' +
          '@media {\n' +
          '  .b-id {\n' +
          '    color: blue;\n' +
          '  }\n' +
          '}\n' +
          '.c-id {\n' +
          '  color: red;\n' +
          '}'
      )
    })
  })

  describe('warnings', () => {
    it('should warn when referenced rule is not found', () => {
      jss.createStyleSheet({
        a: {
          '& $b': {float: 'left'}
        }
      })

      expect(spy.callCount).to.be(1)
      expect(
        spy.calledWithExactly(
          'Warning: [JSS] Could not find the referenced rule b in .a-id {\n  & $b: [object Object];\n}.'
        )
      ).to.be(true)
    })
  })

  describe('local refs', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left',
          '& $b': {float: 'left'},
          '& $b-warn': {float: 'right'}
        },
        b: {
          color: 'red'
        },
        'b-warn': {
          color: 'orange'
        }
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.a-id .b-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.a-id .b-warn-id {\n' +
          '  float: right;\n' +
          '}\n' +
          '.b-id {\n' +
          '  color: red;\n' +
          '}\n' +
          '.b-warn-id {\n' +
          '  color: orange;\n' +
          '}'
      )
    })
  })

  describe.skip('nesting conditionals in combination with extend plugin', () => {
    let sheet

    beforeEach(() => {
      const localJss = create(settings).use(jssExtend(), nested())
      sheet = localJss.createStyleSheet({
        button: {
          color: 'green',
          'background-color': 'aqua',
          '@media': {
            width: '200px'
          }
        },
        redButton: {
          extend: 'button',
          color: 'red'
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('button')).to.not.be(undefined)
      expect(sheet.getRule('@media')).to.not.be(undefined)
      expect(sheet.getRule('redButton')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.button-id {\n' +
          '  color: green;\n' +
          '  background-color: aqua;\n' +
          '}\n' +
          '@media {\n' +
          '  .button-id {\n' +
          '    width: 200px;\n' +
          '  }\n' +
          '}\n' +
          '.redButton-id {\n' +
          '  color: red;\n' +
          '  background-color: aqua;\n' +
          '}\n' +
          '@media {\n' +
          '  .redButton-id {\n' +
          '    width: 200px;\n' +
          '  }\n' +
          '}'
      )
    })
  })

  describe('deep nesting', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        button: {
          color: 'black',
          '& .a': {
            color: 'red',
            '& .c': {
              color: 'gold'
            }
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('button')).to.not.be(undefined)
      expect(sheet.getRule('.button-id .a')).to.not.be(undefined)
      expect(sheet.getRule('.button-id .a .c')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.button-id {\n' +
          '  color: black;\n' +
          '}\n' +
          '.button-id .a {\n' +
          '  color: red;\n' +
          '}\n' +
          '.button-id .a .c {\n' +
          '  color: gold;\n' +
          '}'
      )
    })
  })

  describe('deep nesting with multiple nestings in one selector', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        button: {
          color: 'black',
          '& .a, .b': {
            color: 'red',
            '& .c, &:hover': {
              color: 'gold'
            }
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('button')).to.not.be(undefined)
      expect(sheet.getRule('.button-id .a, .button-id .b')).to.not.be(undefined)
      expect(
        sheet.getRule(
          '.button-id .a .c, .button-id .a:hover, .button-id .b .c, .button-id .b:hover'
        )
      ).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.button-id {\n' +
          '  color: black;\n' +
          '}\n' +
          '.button-id .a, .button-id .b {\n' +
          '  color: red;\n' +
          '}\n' +
          '.button-id .a .c, .button-id .a:hover, ' +
          '.button-id .b .c, .button-id .b:hover {\n' +
          '  color: gold;\n' +
          '}'
      )
    })
  })

  describe('support & at any position', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          'input:focus + &': {
            color: 'red'
          }
        }
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('input:focus + .a-id {\n  color: red;\n}')
    })
  })

  describe('function values', () => {
    let sheet

    beforeEach(() => {
      const localJss = create(settings).use(nested(), functionPlugin())
      sheet = localJss.createStyleSheet({
        a: {
          color: ({color}) => color,
          '&:hover': {
            color: ({color}) => color
          }
        }
      })
    })

    it('should generate color red', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
        .a-id:hover {
          color: red;
        }
      `)
    })

    it('should generate color green', () => {
      sheet.update({color: 'green'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: green;
        }
        .a-id:hover {
          color: green;
        }
      `)
    })
  })

  describe('nest rules inside media query', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {},
        b: {
          '@media (min-width: 576px)': {
            '& $a': {
              margin: '15px'
            }
          }
        }
      })
    })

    it('should generate nested rules inside media queries', () => {
      expect(sheet.toString()).to.be(stripIndent`
        @media (min-width: 576px) {
          .b-id .a-id {
            margin: 15px;
          }
        }
      `)
    })
  })
})
