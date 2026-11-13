/* eslint-disable no-underscore-dangle */

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {create} from 'jss'
import compose from '.'

const settings = {createGenerateId: () => (rule) => `${rule.key}-id`}

describe('jss-plugin-compose', () => {
  let jss
  let spy

  beforeEach(() => {
    spy = vi.spyOn(console, 'warn')
    jss = create(settings).use(compose())
  })

  afterEach(() => {
    spy.mockRestore()
  })

  describe('Ref composition', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: '$a',
          color: 'red'
        }
      })
    })

    afterEach(() => {
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('b')).not.toBe(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.classes.b).toBe('b-id a-id')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe('.a-id {\n  float: left;\n}\n.b-id {\n  color: red;\n}')
    })
  })

  describe('Global class composition', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          composes: 'b',
          color: 'red'
        }
      })
    })

    afterEach(() => {
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should compose classes', () => {
      expect(sheet.classes.a).toBe('a-id b')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe('.a-id {\n  color: red;\n}')
    })
  })

  describe('Array of refs composition', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          color: 'red'
        },
        c: {
          background: 'blue'
        },
        d: {
          composes: ['$a', '$b', '$c'],
          border: 'none'
        },
        e: {
          composes: '$a $b $c',
          border: 'none'
        },
        f: {
          composes: ['$a', ['$b', '$c']],
          border: 'none'
        }
      })
    })

    afterEach(() => {
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('b')).not.toBe(undefined)
      expect(sheet.getRule('c')).not.toBe(undefined)
      expect(sheet.getRule('d')).not.toBe(undefined)
      expect(sheet.getRule('e')).not.toBe(undefined)
      expect(sheet.getRule('f')).not.toBe(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.classes.d).toBe('d-id a-id b-id c-id')
      expect(sheet.classes.e).toBe('e-id a-id b-id c-id')
      expect(sheet.classes.f).toBe('f-id a-id b-id c-id')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
        '.a-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.b-id {\n' +
          '  color: red;\n' +
          '}\n' +
          '.c-id {\n' +
          '  background: blue;\n' +
          '}\n' +
          '.d-id {\n' +
          '  border: none;\n' +
          '}\n' +
          '.e-id {\n' +
          '  border: none;\n' +
          '}\n' +
          '.f-id {\n' +
          '  border: none;\n' +
          '}'
      )
    })
  })

  describe('Mixed composition', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: ['$a', 'c', 'd'],
          color: 'red'
        },
        e: {
          composes: '$a c d',
          color: 'red'
        }
      })
    })

    afterEach(() => {
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('b')).not.toBe(undefined)
      expect(sheet.getRule('e')).not.toBe(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.classes.b).toBe('b-id a-id c d')
      expect(sheet.classes.e).toBe('e-id a-id c d')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
        '.a-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.b-id {\n' +
          '  color: red;\n' +
          '}\n' +
          '.e-id {\n' +
          '  color: red;\n' +
          '}'
      )
    })
  })

  describe('Nested compositions (compose composed)', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: ['$a', 'd'],
          color: 'red'
        },
        c: {
          composes: ['$b'],
          background: 'blue'
        }
      })
    })

    afterEach(() => {
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).not.toBe(undefined)
      expect(sheet.getRule('b')).not.toBe(undefined)
      expect(sheet.getRule('c')).not.toBe(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.classes.b).toBe('b-id a-id d')
      expect(sheet.classes.c).toBe('c-id b-id a-id d')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).toBe(
        '.a-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.b-id {\n' +
          '  color: red;\n' +
          '}\n' +
          '.c-id {\n' +
          '  background: blue;\n' +
          '}'
      )
    })
  })

  describe('Warnings', () => {
    it('should warn when rule try to compose itself', () => {
      jss.createStyleSheet({
        a: {
          composes: ['$a'],
          color: 'red'
        }
      })

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        'Warning: [JSS] Cyclic composition detected. \n' +
          '.a-id {\n' +
          '  composes: $a;\n' +
          '  color: red;\n' +
          '}'
      )
    })

    it("should warn when try to compose ref which can't be resolved", () => {
      jss.createStyleSheet({
        a: {
          composes: ['$b'],
          color: 'red'
        }
      })

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        'Warning: [JSS] Referenced rule is not defined. \n.a-id {\n  composes: $b;\n  color: red;\n}'
      )
    })
  })
})
