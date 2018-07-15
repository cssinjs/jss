import expect from 'expect.js'
import {stripIndent} from 'common-tags'

import {create} from 'jss'
import functionPlugin from './'

const settings = {createGenerateClassName: () => rule => `${rule.key}-id`}

describe('jss-plugin-syntax-rule-value-function: Function rules', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(functionPlugin())
  })

  describe('.createStyleSheet()', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: data => ({
              color: data.color,
              display: 'block'
            })
          },
          {link: true}
        )
        .attach()
      // style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should compile correctly', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
          display: block;
        }
      `)
    })
  })

  describe('.addRule() with styleRule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet(null, {link: true}).attach()
      sheet.addRule('a', data => ({
        color: data.primary ? 'black' : 'white'
      }))
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should compile correct CSS', () => {
      sheet.update({primary: true})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: black;
        }
      `)
    })

    it('should render rule with updated color', () => {
      sheet.update({primary: false})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: white;
        }
      `)
    })
  })

  describe('.addRule() with @media', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({}, {link: true}).attach()
      sheet.addRule('@media screen', {
        b: data => ({
          color: data.primary ? 'black' : 'white'
        })
      })
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should compile correct CSS', () => {
      sheet.update({primary: true})
      expect(sheet.toString()).to.be(stripIndent`
        @media screen {
          .b-id {
            color: black;
          }
        }
      `)
    })
  })
})
