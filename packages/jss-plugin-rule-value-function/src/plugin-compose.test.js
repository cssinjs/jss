import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import pluginCompose from 'jss-plugin-compose'
import pluginFunction from '.'

const settings = {createGenerateId: () => (rule) => `${rule.key}-id`}

describe('jss-plugin-rule-value-function: plugin-compose', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(pluginFunction(), pluginCompose())
  })

  describe('composing fn value', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: {
              color: () => 'red'
            },
            b: {
              color: 'green',
              composes: '$a'
            }
          },
          {link: true}
        )
        .attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should return correct .toString()', () => {
      sheet.update()
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
        .b-id {
          color: green;
        }
      `)
    })

    it('should have composed class names', () => {
      expect(sheet.classes).to.eql({a: 'a-id', b: 'b-id a-id'})
    })
  })

  describe('composing fn rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: () => ({
              color: 'red'
            }),
            b: {
              color: 'green',
              composes: '$a'
            }
          },
          {link: true}
        )
        .attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should return correct .toString()', () => {
      sheet.update()
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
        .b-id {
          color: green;
        }
      `)
    })

    it('should have composed class names', () => {
      expect(sheet.classes).to.eql({a: 'a-id', b: 'b-id a-id'})
    })
  })
})
