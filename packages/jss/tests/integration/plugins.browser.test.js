import {beforeEach, describe, expect, it, vi} from 'vitest'
import {stripIndent} from 'common-tags'
import {create} from '../../src'
import StyleSheet from '../../src/StyleSheet'
import {resetSheets, createGenerateId} from '../../../../tests/utils'

describe('Integration: plugins', () => {
  let jss

  beforeEach(resetSheets())

  beforeEach(() => {
    jss = create({createGenerateId})
  })

  describe('common', () => {
    it('should not call hooks twice on the same rule to enable cache plugin', () => {
      const styles = {a: {color: 'red'}}
      let receivedRule
      let processed = 0
      jss.use({
        onCreateRule: () => receivedRule,
        onProcessRule: (rule) => {
          receivedRule = rule
          processed++
        }
      })
      // Process rules once.
      jss.createStyleSheet(styles)
      jss.createStyleSheet(styles)
      expect(processed).toBe(1)
    })

    it('should call hooks in the correct order', () => {
      jss.use({
        onProcessRule: (rule) => {
          if (rule.key === 'a') {
            rule.options.sheet.addRule('b', {color: 'green'}, {index: 1})
          }
        }
      })

      const selectors = []
      jss.use({
        onProcessRule: (rule) => {
          selectors.push(rule.selector)
        }
      })

      const sheet = jss.createStyleSheet({
        a: {color: 'red'},
        c: {color: 'blue'}
      })

      expect(sheet.indexOf(sheet.getRule('a'))).toBe(0)
      expect(sheet.indexOf(sheet.getRule('b'))).toBe(1)
      expect(sheet.indexOf(sheet.getRule('c'))).toBe(2)
      expect(sheet.toString()).toBe(stripIndent`
        .a-id {
          color: red;
        }
        .b-id {
          color: green;
        }
        .c-id {
          color: blue;
        }
      `)
      expect(selectors).toEqual(['.b-id', '.a-id', '.c-id'])
    })

    it('should warn when unknown hook name is used', () => {
      const spy = vi.spyOn(console, 'warn')

      jss.use({
        unknownHook: () => null
      })

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('Warning: [JSS] Unknown hook "unknownHook".')

      vi.restoreAllMocks()
    })

    it('should run user-defined plugins in .setup() first, internal second', () => {
      jss = create({
        createGenerateId,
        plugins: [
          {
            onProcessStyle(style) {
              if ('animationName' in style) {
                return {'animation-name': style.animationName}
              }
              return style
            }
          }
        ]
      })

      const sheet = jss.createStyleSheet({
        '@keyframes a': {
          to: {height: '100%'}
        },
        b: {
          animationName: '$a'
        }
      })

      expect(sheet.toString()).toBe(stripIndent`
        @keyframes keyframes-a-id {
          to {
            height: 100%;
          }
        }
        .b-id {
          animation-name: keyframes-a-id;
        }
      `)
    })

    it('should run user-defined plugins in .use() first, internal second', () => {
      jss = create({createGenerateId}).use({
        onProcessStyle(style) {
          if ('animationName' in style) {
            return {'animation-name': style.animationName}
          }
          return style
        }
      })

      const sheet = jss.createStyleSheet({
        '@keyframes a': {
          to: {height: '100%'}
        },
        b: {
          animationName: '$a'
        }
      })

      expect(sheet.toString()).toBe(stripIndent`
        @keyframes keyframes-a-id {
          to {
            height: 100%;
          }
        }
        .b-id {
          animation-name: keyframes-a-id;
        }
      `)
    })
  })

  describe('onProcessRule', () => {
    let sheet
    let receivedRule
    let receivedSheet
    let executed = 0

    beforeEach(() => {
      jss.use({
        onProcessRule: (rule, passedSheet) => {
          receivedRule = rule
          receivedSheet = passedSheet
          executed++
        }
      })
      sheet = jss.createStyleSheet({
        a: {color: 'red'}
      })
    })

    it('should be executed just once', () => {
      expect(executed).toBe(1)
    })

    it('should pass right arguments', () => {
      expect(sheet).toBe(receivedSheet)
      expect(sheet.getRule('a')).toBe(receivedRule)
    })
  })

  describe('onCreateRule', () => {
    let receivedName
    let receivedDecl
    let rawStyle
    let receivedOptions
    let executed = 0
    const style = {float: 'left'}

    beforeEach(() => {
      jss.use({
        onCreateRule: (name, decl, options) => {
          receivedName = name
          receivedDecl = decl
          receivedOptions = options
          rawStyle = options.parent.rules.raw[name]
          executed++
        }
      })
      jss.createStyleSheet({
        a: style
      })
    })

    it('should be executed just once', () => {
      expect(executed).toBe(1)
    })

    it('should pass right arguments', () => {
      expect(receivedName).toBe('a')
      expect(receivedDecl).toEqual({float: 'left'})
      expect(receivedOptions).toBeInstanceOf(Object)
    })

    it('should have referenced the raw decl before', () => {
      expect(rawStyle).toBe(style)
    })
  })

  describe('onProcessSheet', () => {
    let receivedSheet
    let executed = 0

    beforeEach(() => {
      jss.use({
        onProcessSheet: (sheet) => {
          receivedSheet = sheet
          executed++
        }
      })
      jss.createStyleSheet({
        a: {float: 'left'}
      })
    })

    it('should be executed just once', () => {
      expect(executed).toBe(1)
    })

    it('should pass right arguments', () => {
      expect(receivedSheet).toBeInstanceOf(StyleSheet)
    })
  })

  describe('.createRule() with onProcessRule and onCreateRule', () => {
    let receivedRule
    let executed = 0

    beforeEach(() => {
      executed = 0
      jss.use({
        onProcessRule: (rule) => {
          receivedRule = rule
          executed++
        }
      })
    })

    it('should pass rule correctly', () => {
      const rule = jss.createRule()
      expect(rule).toBe(receivedRule)
      expect(executed).toBe(1)
    })

    it('should run plugins on @media rule', () => {
      const rule = jss.createRule('@media', {
        button: {float: 'left'}
      })
      expect(rule).toBe(receivedRule)
      expect(executed).toBe(2)
    })

    it('should run plugins on @keyframes rule', () => {
      const rule = jss.createRule('@keyframes a', {
        from: {top: 0},
        to: {top: 10}
      })
      expect(rule).toBe(receivedRule)
      expect(executed).toBe(3)
    })

    it('should accept multiple plugins', () => {
      let receivedRule1
      let receivedRule2
      const plugin1 = {
        onProcessRule: (rule) => {
          receivedRule1 = rule
        }
      }
      const plugin2 = {
        onProcessRule: (rule) => {
          receivedRule2 = rule
        }
      }
      jss.use(plugin1, plugin2)
      const rule = jss.createRule()
      expect(receivedRule1).toBe(rule)
      expect(receivedRule2).toBe(rule)
    })
  })

  describe('onChangeValue', () => {
    let receivedValue
    let receivedProp
    let receivedRule
    let executed = 0
    let sheet

    beforeEach(() => {
      jss.use({
        onChangeValue: (value, prop, rule) => {
          receivedValue = value
          receivedProp = prop
          receivedRule = rule
          executed++
          return value
        }
      })
      sheet = jss.createStyleSheet({
        a: {color: 'red'}
      })
    })

    it('should be executed just once', () => {
      sheet.getRule('a').prop('color', 'green')
      expect(executed).toBe(1)
    })

    it('should receive correct arguments', () => {
      const rule = sheet.getRule('a')
      rule.prop('color', 'green')
      expect(receivedValue).toBe('green')
      expect(receivedProp).toBe('color')
      expect(receivedRule).toBe(rule)
    })

    it('should compile to correct CSS string', () => {
      expect(sheet.toString()).toBe(stripIndent`
        .a-id {
          color: red;
        }
      `)
      sheet.getRule('a').prop('color', 'green')
      expect(sheet.toString()).toBe(stripIndent`
        .a-id {
          color: green;
        }
      `)
    })

    it('should pass the new value to the next hook', () => {
      jss.use({onChangeValue: (value) => `${value}-first`})
      jss.use({onChangeValue: (value) => `${value}-second`})
      sheet.getRule('a').prop('color', 'green')
      expect(sheet.toString()).toBe(stripIndent`
        .a-id {
          color: green-first-second;
        }
      `)
    })
  })

  describe('onProcessStyle', () => {
    let receivedStyle
    let receivedRule
    let receivedSheet
    let executed = 0
    let sheet
    const newStyle = {color: 'green'}

    beforeEach(() => {
      jss.use({
        onProcessStyle: (style, rule, passedSheet) => {
          receivedStyle = style
          receivedRule = rule
          receivedSheet = passedSheet
          executed++
          return newStyle
        }
      })
      sheet = jss.createStyleSheet({
        a: {color: 'red'}
      })
    })

    it('should be executed just once', () => {
      expect(executed).toBe(1)
    })

    it('should receive correct arguments', () => {
      expect(receivedStyle).toEqual({color: 'red'})
      expect(receivedRule).toBe(sheet.getRule('a'))
      expect(receivedSheet).toBe(sheet)
    })

    it('should set the returned style', () => {
      expect(sheet.getRule('a').style).toBe(newStyle)
    })

    it('should compile to correct CSS string', () => {
      expect(sheet.toString()).toBe(stripIndent`
        .a-id {
          color: green;
        }
      `)
    })

    it('should not call the hook if rule has no .style', () => {
      let localExecuted = 0
      jss.use({
        onProcessStyle: (style, rule, passedSheet) => {
          receivedStyle = style
          receivedRule = rule
          receivedSheet = passedSheet
          localExecuted++
          return style
        }
      })
      sheet = jss.createStyleSheet({
        '@media all': {
          a: {color: 'red'}
        }
      })

      expect(receivedStyle).toBe(newStyle)
      expect(receivedRule.type).toBe('style')
      expect(receivedSheet).toBe(sheet)
      expect(localExecuted).toBe(1)
    })

    it('should pass the style object to the next hook', () => {
      let passedStyle
      jss.use({
        onProcessStyle: (style) => {
          passedStyle = style
          return style
        }
      })
      sheet = jss.createStyleSheet({
        a: {color: 'red'}
      })
      expect(sheet.getRule('a').style).toBe(newStyle)
      expect(passedStyle).toBe(newStyle)
    })
  })

  describe('onUpdate (internal)', () => {
    let receivedData
    let receivedRule
    let receivedSheet
    let executed = 0
    let sheet

    beforeEach(() => {
      jss.use({
        onUpdate: (data, rule, styleSheet) => {
          receivedData = data
          receivedRule = rule
          receivedSheet = styleSheet
          executed++
        }
      })
      sheet = jss.createStyleSheet({
        a: {
          color: 'green'
        }
      })
    })

    it('should be executed just once', () => {
      sheet.update({})
      expect(executed).toBe(1)
    })

    it('should receive correct arguments', () => {
      const data = {color: 'green'}
      const rule = sheet.getRule('a')
      sheet.update(data)
      expect(receivedData).toBe(data)
      expect(receivedRule).toBe(rule)
      expect(receivedSheet).toBe(sheet)
      expect(rule.prop('color')).toBe('green')
    })

    it('should compile to correct CSS string', () => {
      sheet.update({color: 'green'})
      expect(sheet.toString()).toBe(stripIndent`
        .a-id {
          color: green;
        }
      `)
    })
  })
})
