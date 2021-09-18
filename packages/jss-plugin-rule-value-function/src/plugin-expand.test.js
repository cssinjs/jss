import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import pluginExpand from '../../jss-plugin-expand'
import pluginFunction from '.'

const settings = {createGenerateId: () => (rule) => `${rule.key}-id`}

describe('jss-plugin-rule-value-function: plugin-expand', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(pluginFunction(), pluginExpand())
  })

  describe('expanding in fn values', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: {
              border: (props) => ({
                top: props.border,
                bottom: props.border
              })
            }
          },
          {link: true}
        )
        .attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it.skip('should return correct .toString()', () => {
      sheet.update({border: '1px'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          border-top: 1px;
          border-bottom: 1px;
        }
      `)
    })

    it.skip('should handle when updating multiple times', () => {
      sheet.update({border: '1px'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          border-top: 1px;
          border-bottom: 1px;
        }
      `)

      sheet.update({border: '5px'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          border-top: 5px;
          border-bottom: 5px;
        }
      `)
    })
  })

  describe('expanding in fn rules', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: (props) => ({border: {color: props.color}})
          },
          {link: true}
        )
        .attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should return correct .toString()', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          border-color: red;
        }
      `)
    })

    it('should handle updating multiple times', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          border-color: red;
        }
      `)

      sheet.update({color: 'blue'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          border-color: blue;
        }
      `)
    })
  })
})
