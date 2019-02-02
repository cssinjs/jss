import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import functionPlugin from 'jss-plugin-rule-value-function'

import camelCase from './index'

const settings = {
  createGenerateId: () => rule => `${rule.key}-id`
}

describe('jss-plugin-camel-case', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(camelCase())
  })

  describe('regular rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          fontSize: '20px',
          zIndex: 1,
          lineHeight: 1.2
        }
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n  font-size: 20px;\n  z-index: 1;\n  line-height: 1.2;\n}'
      )
    })
  })

  describe('@font-face with array of styles', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        '@font-face': [
          {
            fontFamily: 'Lato-Light',
            src: 'url("/fonts/Lato-Light.ttf") format("truetype")'
          },
          {
            fontFamily: 'Lato-Bold',
            src: 'url("/fonts/Lato-Bold.ttf") format("truetype")'
          }
        ]
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '@font-face {\n' +
          '  font-family: Lato-Light;\n' +
          '  src: url("/fonts/Lato-Light.ttf") format("truetype");\n' +
          '}\n' +
          '@font-face {\n' +
          '  font-family: Lato-Bold;\n' +
          '  src: url("/fonts/Lato-Bold.ttf") format("truetype");\n' +
          '}'
      )
    })
  })

  describe('fallbacks object', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        '@font-face': {
          fontFamily: 'MyWebFont',
          fallbacks: {
            fontFamily: 'MyWebFontFallback'
          }
        }
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '@font-face {\n' +
          '  font-family: MyWebFontFallback;\n' +
          '  font-family: MyWebFont;\n' +
          '}'
      )
    })
  })

  describe('fallbacks array', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        '@font-face': {
          fontFamily: 'MyWebFont',
          fallbacks: [{fontFamily: 'MyWebFontFallback'}]
        }
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '@font-face {\n' +
          '  font-family: MyWebFontFallback;\n' +
          '  font-family: MyWebFont;\n' +
          '}'
      )
    })
  })

  describe('font faces with fallbacks', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        '@font-face': [
          {
            fontFamily: 'MyWebFont',
            fallbacks: {
              fontFamily: 'MyWebFontFallback'
            }
          }
        ]
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '@font-face {\n' +
          '  font-family: MyWebFontFallback;\n' +
          '  font-family: MyWebFont;\n' +
          '}'
      )
    })
  })

  describe('function values', () => {
    let sheet

    beforeEach(() => {
      const localJss = create(settings).use(functionPlugin(), camelCase())
      sheet = localJss.createStyleSheet({
        a: {
          fontSize: () => 12
        }
      })
    })

    it('should generate correct CSS', () => {
      sheet.update()
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          font-size: 12;
        }
      `)
    })
  })

  describe('css variables', () => {
    let localJss
    beforeEach(() => {
      localJss = create(settings).use(functionPlugin(), camelCase())
    })

    it('with static css variable', () => {
      const sheet = localJss.createStyleSheet({
        a: {
          '--fontSize': 12
        }
      })
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          --fontSize: 12;
        }
      `)
    })

    it('with dynamic css variable', () => {
      const sheet = localJss.createStyleSheet({
        a: {
          '--fontSize': size => size
        }
      })

      sheet.update(12)

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          --fontSize: 12;
        }
      `)

      sheet.update(16)

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          --fontSize: 16;
        }
      `)
    })
  })
})
