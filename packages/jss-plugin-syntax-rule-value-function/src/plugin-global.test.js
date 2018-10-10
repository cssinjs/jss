import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import pluginGlobal from '../../jss-plugin-syntax-global'
import pluginFunction from '.'

const settings = {createGenerateClassName: () => rule => `${rule.key}-id`}

describe.only('jss-plugin-syntax-rule-value-function: plugin-global', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(pluginGlobal(), pluginFunction())
  })

  describe('fn rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            '@global': {
              a: data => ({
                color: data.color
              }),
              '@media all': {
                a: {
                  color: 'green'
                }
              }
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
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        a {
          color: red;
        }
        @media all {
          a {
            color: green;
          }
        }
      `)
    })
  })

  describe('fn value', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            '@global': {
              a: {
                color: data => data.color
              }
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
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        a {
          color: red;
        }
      `)
    })
  })
})
