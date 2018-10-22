import expect from 'expect.js'
import {create} from 'jss'

import propsSort from './index'

const settings = {
  createGenerateId: () => rule => `${rule.key}-id`
}

describe('jss-plugin-props-sort', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(propsSort())
  })

  describe('sort props by length', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          'border-left': '1px',
          border: '3px'
        }
      })
    })

    it('should have a rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  border: 3px;\n  border-left: 1px;\n}')
    })
  })

  describe('leave non-style rules unchanged', () => {
    describe('@font-face', () => {
      let sheet

      beforeEach(() => {
        sheet = jss.createStyleSheet({
          '@font-face': {
            'font-family': 'MyHelvetica',
            src: 'local("Helvetica")'
          }
        })
      })

      it('should generate correct CSS', () => {
        expect(sheet.toString()).to.be(
          '@font-face {\n  font-family: MyHelvetica;\n  src: local("Helvetica");\n}'
        )
      })
    })

    describe('@media', () => {
      let sheet

      beforeEach(() => {
        sheet = jss.createStyleSheet({
          '@media print': {
            a: {
              'border-left': '1px',
              border: '3px'
            }
          }
        })
      })

      it('should generate correct CSS', () => {
        expect(sheet.toString()).to.be(
          '@media print {\n  .a-id {\n    border: 3px;\n    border-left: 1px;\n  }\n}'
        )
      })
    })
  })
})
