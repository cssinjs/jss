import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {create, sheets} from 'jss'

import nested from 'jss-plugin-nested'
import isolate from './index'

describe('jss-plugin-isolate', () => {
  let jss

  beforeEach(() => {
    jss = create().use(isolate())
  })

  afterEach(() => {
    sheets.registry.forEach((sheet) => sheet.detach())
    sheets.reset()
  })

  describe('reset sheet is not created if there is nothing to reset', () => {
    beforeEach(() => {
      jss.createStyleSheet()
    })

    it('should have no reset sheets in registry', () => {
      expect(sheets.registry.length).toBe(1)
    })
  })

  describe('ignores atRules', () => {
    beforeEach(() => {
      jss.createStyleSheet({
        '@media print': {},
        '@font-face': {
          'font-family': 'MyHelvetica',
          src: 'local("Helvetica")'
        },
        '@keyframes id': {
          from: {top: 0},
          '30%': {top: 30},
          '60%, 70%': {top: 80}
        },
        '@supports ( display: flexbox )': {}
      })
    })

    it('should have no reset sheets in registry', () => {
      expect(sheets.registry.length).toBe(1)
    })
  })

  describe('works with classes', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        link: {
          color: 'red'
        },
        linkItem: {
          color: 'blue'
        }
      })
    })

    it('should add selectors to the reset rule', () => {
      const resetRule = sheets.registry[0].getRule('reset')
      expect(resetRule.selector).toContain(sheet.classes.linkItem)
      expect(resetRule.selector).toContain(sheet.classes.link)
    })

    it('should have expected reset props', () => {
      const resetRule = sheets.registry[0].getRule('reset')
      expect(resetRule.prop('border-collapse')).toBe('separate')
      expect(resetRule.prop('font-family')).toBe('initial')
    })
  })

  describe('works in multiple StyleSheets', () => {
    let sheet1
    let sheet2

    beforeEach(() => {
      sheet1 = jss.createStyleSheet({
        link: {
          color: 'red'
        }
      })
      sheet2 = jss.createStyleSheet({
        linkItem: {
          color: 'blue'
        }
      })
    })

    it('should add selectors to the reset rule', () => {
      const resetRule = sheets.registry[0].getRule('reset')
      expect(resetRule.selector).toContain(sheet1.classes.link)
      expect(resetRule.selector).toContain(sheet2.classes.linkItem)
    })
  })

  describe('global option "isolate"', () => {
    beforeEach(() => {
      jss = create().use(
        isolate({
          isolate: false
        })
      )

      jss.createStyleSheet({
        a: {
          color: 'blue'
        }
      })
    })

    it('should use global option', () => {
      expect(sheets.registry[0].getRule('reset')).toBe(undefined)
    })
  })

  describe('ignores rules if they are ignored in StyleSheet options', () => {
    let sheet1
    let sheet2

    beforeEach(() => {
      sheet1 = jss.createStyleSheet({
        link: {
          color: 'red'
        }
      })
      sheet2 = jss.createStyleSheet(
        {
          linkItem: {
            color: 'blue'
          }
        },
        {isolate: false}
      )
    })

    it('should not add selectors to the reset rule', () => {
      const resetRule = sheets.registry[0].getRule('reset')
      expect(resetRule.selector).toContain(sheet1.classes.link)
      expect(resetRule.selector).not.toContain(sheet2.classes.linkItem)
    })
  })

  describe('isolate rules if they have isolate: true even if StyleSheet options is isolate: false', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet(
        {
          link: {
            isolate: true,
            color: 'blue'
          }
        },
        {isolate: false}
      )
    })

    it('should add selectors to the reset rule', () => {
      const resetRule = sheets.registry[0].getRule('reset')
      expect(resetRule.selector).toContain(sheet.classes.link)
    })
  })

  describe('isolate option as a string', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet(
        {
          root: {
            color: 'blue'
          },
          a: {
            color: 'red'
          }
        },
        {isolate: 'root'}
      )
    })

    it('should only isolate rules with matching name', () => {
      const resetRule = sheets.registry[0].getRule('reset')
      expect(resetRule.selector).toContain(sheet.classes.root)
      expect(resetRule.selector).not.toContain(sheet.classes.a)
    })
  })

  describe('ignore rules if property isolate is set to false', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        link: {
          color: 'red'
        },
        linkItem: {
          color: 'blue',
          isolate: false
        }
      })
    })

    it('should add selectors to the reset rule', () => {
      const resetRule = sheets.registry[0].getRule('reset')
      expect(resetRule.selector).toContain(sheet.classes.link)
      expect(resetRule.selector).not.toContain(sheet.classes.linkItem)
    })

    it('should have expected reset props', () => {
      expect(sheet.getRule('linkItem').prop('isolate')).toBe(undefined)
    })
  })

  describe("don't duplicate selectors", () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        link: {
          color: 'blue'
        },
        '@media (min-width: 320px)': {
          link: {
            color: 'red'
          }
        }
      })
    })

    it('should add selectors to the reset rule', () => {
      const resetRule = sheets.registry[0].getRule('reset')
      expect(resetRule.selector).toBe(`.${sheet.classes.link}`)
    })
  })

  describe('option "reset={width}" with custom props', () => {
    beforeEach(() => {
      jss = create().use(
        isolate({
          reset: {
            width: '1px'
          }
        })
      )

      jss.createStyleSheet({
        a: {
          color: 'blue'
        }
      })
    })

    it('should add width prop to the reset rule', () => {
      const resetRule = sheets.registry[0].getRule('reset')
      expect(resetRule.prop('width')).toBe('1px')
    })
  })

  describe('createRule()', () => {
    it('should not create reset sheet', () => {
      jss.createRule({
        color: 'red'
      })

      expect(sheets.registry.length).toBe(0)
    })

    it('should not throw', () => {
      expect(() => {
        jss.createRule({
          color: 'red'
        })
      }).not.toThrow()
    })
  })

  describe('nested media queries with jss-plugin-nested', () => {
    let sheet

    beforeEach(() => {
      jss = create().use(isolate(), nested())
      sheet = jss.createStyleSheet({
        link: {
          color: 'darksalmon',
          '@media (min-width: 320px)': {
            color: 'steelblue'
          }
        }
      })
    })

    it('should add selectors to the reset rule', () => {
      const resetRule = sheets.registry[0].getRule('reset')
      expect(resetRule.selector).toContain(sheet.classes.link)
    })
  })

  describe('nested media queries with jss-plugin-nested with isolate:false', () => {
    beforeEach(() => {
      jss = create().use(isolate(), nested())
      jss.createStyleSheet({
        link: {
          isolate: false,
          color: 'darksalmon',
          '@media (min-width: 320px)': {
            color: 'steelblue'
          }
        }
      })
    })

    it('should not add selectors to the reset rule', () => {
      const resetRule = sheets.registry[0].getRule('reset')
      expect(resetRule).toBe(undefined)
    })
  })
})
