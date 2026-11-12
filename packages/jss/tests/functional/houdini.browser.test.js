import {beforeEach, describe, expect, it} from 'vitest'
import {create, hasCSSTOMSupport} from '../../src'
import {resetSheets, createGenerateId, computeStyle} from '../../../../tests/utils'

describe('Functional: houdini', () => {
  if (!hasCSSTOMSupport) return

  beforeEach(resetSheets())

  let jss

  beforeEach(() => {
    jss = create({createGenerateId})
  })

  describe('use unit value', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: {
              margin: CSS.px(42)
            }
          },
          {link: true}
        )
        .attach()
    })

    it('should render correctly', () => {
      expect(computeStyle(sheet.classes.a).margin).toBe('42px')
    })

    it('should delete property', () => {
      sheet.getRule('a').prop('margin', null)
      expect(computeStyle(sheet.classes.a).margin).toBe('0px')
    })
  })
})
