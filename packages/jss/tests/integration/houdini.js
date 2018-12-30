import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create, hasCSSTOMSupport} from '../../src'
import {resetSheets, createGenerateId} from '../../../../tests/utils'

describe('Integration: houdini', () => {
  if (!hasCSSTOMSupport) return

  beforeEach(resetSheets())

  let jss

  beforeEach(() => {
    jss = create({createGenerateId})
  })

  describe('use unit value', () => {
    let sheet
    const margin = CSS.px(42)

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          margin
        }
      })
    })

    it('should get value from .prop()', () => {
      expect(sheet.getRule('a').prop('margin')).to.be(margin)
    })

    it('should set valid value with .prop()', () => {
      const width = CSS.px(10)
      const rule = sheet.getRule('a')
      rule.prop('width', width)
      expect(rule.prop('width')).to.be(width)
    })

    it('should return valid .toString()', () => {
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          margin: 42px;
        }
      `)
    })
  })
})
