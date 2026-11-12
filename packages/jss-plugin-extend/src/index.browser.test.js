/* eslint-disable no-underscore-dangle */

import {stripIndent} from 'common-tags'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import nested from 'jss-plugin-nested'
import expand from 'jss-plugin-expand'
import functionPlugin from 'jss-plugin-rule-value-function'
import {create} from 'jss'

import extend from './index'

const settings = {
  createGenerateId: () => (rule) => `${rule.key}-id`
}

describe('jss-plugin-extend', () => {
  let spy
  let jss

  beforeEach(() => {
    spy = vi.spyOn(console, 'warn')
    jss = create(settings).use(functionPlugin(), extend(), nested(), expand())
  })

  afterEach(() => {
    spy.mockRestore()
  })

  describe('simple extend', () => {
    let sheet

    beforeEach(() => {
      const a = {float: 'left'}
      sheet = jss.createStyleSheet({
        a,
        b: {
          extend: a,
          width: '1px'
        }
      })
    })

    it('should extend', () => {
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('b')).not.toBe(undefined)
      expect(sheet.toString()).toBe(
        '.a-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.b-id {\n' +
          '  float: left;\n' +
          '  width: 1px;\n' +
          '}'
      )
    })
  })

  describe('ensure override order', () => {
    let sheet

    beforeEach(() => {
      const a = {
        float: 'left',
        color: 'red'
      }
      sheet = jss.createStyleSheet({
        a: {
          extend: a,
          float: 'right'
        }
      })
    })

    it('should have correct order', () => {
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.toString()).toBe('.a-id {\n  float: right;\n  color: red;\n}')
    })
  })

  describe('multi extend', () => {
    let sheet

    beforeEach(() => {
      const a = {float: 'left'}
      const b = {position: 'absolute'}
      sheet = jss.createStyleSheet({
        c: {
          extend: [a, b],
          width: '1px'
        }
      })
    })

    it('should have correct output', () => {
      expect(sheet.getRule('c')).not.toBe(undefined)
      expect(sheet.toString()).toBe(
        '.c-id {\n  float: left;\n  position: absolute;\n  width: 1px;\n}'
      )
    })
  })

  describe('multi rule name extend', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {float: 'left'},
        b: {position: 'absolute'},
        c: {
          extend: ['a', 'b'],
          width: '1px'
        }
      })
    })

    it('should have correct output', () => {
      expect(sheet.getRule('c')).not.toBe(undefined)
      expect(sheet.toString()).toBe(
        '.a-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.b-id {\n' +
          '  position: absolute;\n' +
          '}\n' +
          '.c-id {\n' +
          '  float: left;\n' +
          '  width: 1px;\n' +
          '  position: absolute;\n' +
          '}'
      )
    })
  })

  describe('multi mixed rule name and style objects extend', () => {
    let sheet

    beforeEach(() => {
      const a = {float: 'left'}
      sheet = jss.createStyleSheet({
        b: {position: 'absolute'},
        c: {
          extend: [a, 'b'],
          width: '1px'
        }
      })
    })

    it('should have correct output', () => {
      expect(sheet.getRule('c')).not.toBe(undefined)
      expect(sheet.toString()).toBe(
        '.b-id {\n' +
          '  position: absolute;\n' +
          '}\n' +
          '.c-id {\n' +
          '  float: left;\n' +
          '  position: absolute;\n' +
          '  width: 1px;\n' +
          '}'
      )
    })
  })

  describe('nested extend 1', () => {
    let sheet

    beforeEach(() => {
      const c = {float: 'left'}
      const b = {extend: c, display: 'none'}
      sheet = jss.createStyleSheet({
        a: {
          extend: b,
          width: '1px'
        }
      })
    })

    it('should should have correct output', () => {
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.toString()).toBe('.a-id {\n  float: left;\n  display: none;\n  width: 1px;\n}')
    })
  })

  describe('nested extend 2', () => {
    let sheet

    beforeEach(() => {
      const b = {
        '&:hover': {
          float: 'left',
          width: '3px'
        }
      }
      sheet = jss.createStyleSheet({
        a: {
          extend: b,
          width: '1px',
          '&:hover': {
            width: '2px',
            height: '2px'
          }
        }
      })
    })

    it('should have correct output', () => {
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.toString()).toBe(
        '.a-id {\n' +
          '  width: 1px;\n' +
          '}\n' +
          '.a-id:hover {\n' +
          '  float: left;\n' +
          '  width: 2px;\n' +
          '  height: 2px;\n' +
          '}'
      )
    })
  })

  describe('deep nested extend', () => {
    let sheet

    beforeEach(() => {
      const a = {
        '&:hover': {width: '5px', height: '5px'},
        border: {width: '3px'}
      }
      const b = {
        extend: a,
        '&:hover': {width: '4px'},
        border: {color: 'blue'}
      }
      const c = {
        extend: b,
        '&:hover': {height: '2px'}
      }
      const d = {
        extend: c,
        '&:hover': {width: '2px'}
      }
      sheet = jss.createStyleSheet({
        a: {
          extend: d,
          width: '2px',
          border: {
            width: '1px',
            color: 'red',
            style: 'solid'
          },
          '&:hover': {
            color: 'red'
          }
        }
      })
    })

    it('should have correct output', () => {
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.toString()).toBe(
        '.a-id {\n' +
          '  width: 2px;\n' +
          '  border-width: 1px;\n' +
          '  border-style: solid;\n' +
          '  border-color: red;\n' +
          '}\n' +
          '.a-id:hover {\n' +
          '  width: 2px;\n' +
          '  height: 2px;\n' +
          '  color: red;\n' +
          '}'
      )
    })
  })

  describe('multi child extend with css state', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        base: {
          '&:hover': {width: '1px'}
        },
        child1: {
          extend: 'base',
          '&:hover': {width: '5px'}
        },
        child2: {
          extend: 'base'
        }
      })
    })

    it('should have correct output', () => {
      expect(sheet.getRule('base')).not.toBe(undefined)
      expect(sheet.getRule('child1')).not.toBe(undefined)
      expect(sheet.getRule('child2')).not.toBe(undefined)
      expect(sheet.toString()).toBe(
        '.base-id:hover {\n' +
          '  width: 1px;\n' +
          '}\n' +
          '.child1-id:hover {\n' +
          '  width: 5px;\n' +
          '}\n' +
          '.child2-id:hover {\n' +
          '  width: 1px;\n' +
          '}'
      )
    })
  })

  describe('extend using rule name', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {float: 'left'},
        b: {
          extend: 'a',
          width: '1px'
        }
      })
    })

    it('should have correct output', () => {
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('b')).not.toBe(undefined)
      expect(sheet.toString()).toBe(
        '.a-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.b-id {\n' +
          '  float: left;\n' +
          '  width: 1px;\n' +
          '}'
      )
    })
  })

  describe('extend value with fallbacks', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          color: 'blue',
          fallbacks: {color: 'green'}
        },
        b: {
          extend: 'a',
          float: 'left'
        }
      })
    })

    it('should have correct output', () => {
      expect(sheet.toString()).toBe(stripIndent`
        .a-id {
          color: green;
          color: blue;
        }
        .b-id {
          color: green;
          color: blue;
          float: left;
        }
      `)
    })
  })

  describe('extend using rule name with cyclic warning', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          extend: 'a',
          width: '1px'
        }
      })
    })

    it('error if extend using same rule name', () => {
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        'Warning: [JSS] A rule tries to extend itself \n.a-id {\n  extend: a;\n  width: 1px;\n}'
      )

      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.toString()).toBe('.a-id {\n  width: 1px;\n}')
    })
  })

  describe('extend inside of a function rule', () => {
    let sheet

    beforeEach(() => {
      const styles = {
        a: (data) => ({
          extend: data.redContainer,
          height: '200px'
        })
      }

      sheet = jss.createStyleSheet(styles, {link: true}).attach()

      sheet.update({
        redContainer: {
          background: 'red'
        }
      })
    })

    it('should have correct output', () => {
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.toString()).toBe('.a-id {\n  background: red;\n  height: 200px;\n}')
    })
  })

  describe('extend function', () => {
    let sheet

    beforeEach(() => {
      const b = {display: 'block'}
      sheet = jss.createStyleSheet({
        a: {
          extend: (data) => data.block && b,
          color: 'red',
          '& span': {
            extend: (data) => data.block && b,
            color: 'blue'
          }
        }
      })
    })

    it('should have correct output', () => {
      expect(sheet.getRule('a')).not.toBe(undefined)
      sheet.update({block: true})
      expect(sheet.toString()).toBe(
        '.a-id {\n' +
          '  color: red;\n' +
          '  display: block;\n' +
          '}\n' +
          '.a-id span {\n' +
          '  color: blue;\n' +
          '  display: block;\n' +
          '}'
      )

      sheet.update({block: false})

      expect(sheet.toString()).toBe('.a-id {\n  color: red;\n}\n.a-id span {\n  color: blue;\n}')
    })
  })
})
