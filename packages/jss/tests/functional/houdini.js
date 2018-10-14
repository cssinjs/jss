import expect from 'expect.js'
import {create} from '../../src'
import {createGenerateClassName, hasCSSTOMSupport, computeStyle} from '../utils'

describe('Functional: houdini', () => {
  if (!hasCSSTOMSupport) return

  let jss

  beforeEach(() => {
    jss = create({createGenerateClassName})
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
      expect(computeStyle(sheet.classes.a).margin).to.be('42px')
    })

    it('should delete property', () => {
      sheet.getRule('a').prop('margin', null)
      expect(computeStyle(sheet.classes.a).margin).to.be('0px')
    })
  })
})
