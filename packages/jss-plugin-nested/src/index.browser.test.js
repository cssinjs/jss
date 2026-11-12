/* eslint-disable no-underscore-dangle */

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {stripIndent} from 'common-tags'
import jssExtend from 'jss-plugin-extend'
import {create} from 'jss'
import functionPlugin from 'jss-plugin-rule-value-function'
import nested from '.'

const settings = {
  createGenerateId: () => (rule) => `${rule.key}-id`
}

describe('jss-plugin-nested', () => {
  let jss
  let spy

  beforeEach(() => {
    spy = vi.spyOn(console, 'warn')
    jss = create(settings).use(nested())
  })

  afterEach(() => {
    spy.mockRestore()
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
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('.a-id b')).not.toBe(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe('.a-id {\n  float: left;\n}\n.a-id b {\n  float: left;\n}')
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
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('.a-idb')).not.toBe(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe('.a-id {\n  float: left;\n}\n.a-idb {\n  float: left;\n}')
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
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('.a-idb')).not.toBe(undefined)
      expect(sheet.getRule('.a-id c')).not.toBe(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
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
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('.a-idb, .a-idc')).not.toBe(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
        '.a-id {\n  float: left;\n}\n.a-idb, .a-idc {\n  float: left;\n}'
      )
    })
  })

  describe('identical nest', () => {
    describe('single nest', () => {
      let sheet

      beforeEach(() => {
        sheet = jss.createStyleSheet({
          a: {
            float: 'left',
            '&': {color: 'blue'}
          }
        })
      })

      it('should add rule', () => {
        expect(sheet.getRule('a')).not.toBe(undefined)
      })

      it('should generate correct CSS', () => {
        expect(sheet.toString()).toBe(stripIndent`
        .a-id {
          float: left;
        }
        .a-id {
          color: blue;
        }
      `)
      })
    })

    describe('deep nest', () => {
      let sheet

      beforeEach(() => {
        sheet = jss.createStyleSheet({
          a: {
            float: 'left',
            '&': {
              color: 'blue',
              '&': {
                width: 0,
                '&.b': {
                  'z-index': 1,
                  '&': {
                    top: 0
                  }
                }
              }
            }
          }
        })
      })

      it('should add rules', () => {
        expect(sheet.getRule('a')).not.toBe(undefined)
        expect(sheet.getRule('.a-id.b')).not.toBe(undefined)
      })

      it('should generate correct CSS', () => {
        expect(sheet.toString()).toBe(stripIndent`
        .a-id {
          float: left;
        }
        .a-id {
          color: blue;
        }
        .a-id {
          width: 0;
        }
        .a-id.b {
          z-index: 1;
        }
        .a-id.b {
          top: 0;
        }
      `)
      })
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
      expect(sheet.toString()).toBe(
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
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('@media')).not.toBe(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
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
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('@media')).not.toBe(undefined)
      expect(sheet.getRule('b')).not.toBe(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
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
      expect(sheet.toString()).toBe(stripIndent`
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
      expect(sheet.getRule('@media a')).not.toBe(undefined)
      expect(sheet.getRule('@media b')).not.toBe(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
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
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('@media')).not.toBe(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
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
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('@media')).not.toBe(undefined)
      expect(sheet.getRule('c')).not.toBe(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
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

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        'Warning: [JSS] Could not find the referenced rule "b" in ".a-id {\n  & $b: [object Object];\n}".'
      )
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
      expect(sheet.toString()).toBe(
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
      expect(sheet.getRule('button')).not.toBe(undefined)
      expect(sheet.getRule('@media')).not.toBe(undefined)
      expect(sheet.getRule('redButton')).not.toBe(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
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
      expect(sheet.getRule('button')).not.toBe(undefined)
      expect(sheet.getRule('.button-id .a')).not.toBe(undefined)
      expect(sheet.getRule('.button-id .a .c')).not.toBe(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
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
      expect(sheet.getRule('button')).not.toBe(undefined)
      expect(sheet.getRule('.button-id .a, .button-id .b')).not.toBe(undefined)
      expect(
        sheet.getRule(
          '.button-id .a .c, .button-id .a:hover, .button-id .b .c, .button-id .b:hover'
        )
      ).not.toBe(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
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
      expect(sheet.toString()).toBe('input:focus + .a-id {\n  color: red;\n}')
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
      expect(sheet.toString()).toBe(stripIndent`
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
      expect(sheet.toString()).toBe(stripIndent`
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
      expect(sheet.toString()).toBe(stripIndent`
        @media (min-width: 576px) {
          .b-id .a-id {
            margin: 15px;
          }
        }
      `)
    })
  })
})
