import expect from 'expect.js'
import {create} from 'jss'
import * as cssVendor from 'css-vendor'
import browser from 'detect-browser'
import functionPlugin from 'jss-plugin-rule-value-function'

import vendorPrefixer from './index'

const settings = {
  createGenerateId: () => rule => `${rule.key}-id`
}

const isIE9 = browser.name === 'ie' && browser.version === '9.0.0'
const isIEorEdge = browser.name === 'edge' || browser.name === 'ie'

describe('jss-plugin-vendor-prefixer', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(vendorPrefixer())
  })

  describe('prefixed property', () => {
    if (isIE9) {
      return
    }

    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {animation: 'yyy'}
      })
    })

    it('should generate correct CSS', () => {
      const prefixedProp = cssVendor.supportedProperty('animation')
      expect(sheet.toString()).to.be(`.a-id {\n  ${prefixedProp}: yyy;\n}`)
    })
  })

  describe('@keyframes', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        '@keyframes a': {}
      })
    })

    it('should generate correct CSS', () => {
      if (isIEorEdge) {
        expect(sheet.toString()).to.be('@keyframes keyframes-a-id {}')
        return
      }
      const prefixedKeyframes = `@${cssVendor.prefix.css}keyframes`
      expect(sheet.toString()).to.be(`${prefixedKeyframes} keyframes-a-id {}`)
    })
  })

  describe('unknown property', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {xxx: 'block'}
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  xxx: block;\n}')
    })
  })

  describe('unknown value', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {display: 'yyy'}
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  display: yyy;\n}')
    })
  })

  describe('unknown property and value', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {xxx: 'yyy'}
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  xxx: yyy;\n}')
    })
  })

  describe('array value', () => {
    it('should generate correct border', () => {
      const sheet = jss.createStyleSheet({
        a: {border: ['red', 'green']}
      })
      expect(sheet.toString()).to.be('.a-id {\n  border: red, green;\n}')
    })

    it('should generate correct margin', () => {
      const sheet = jss.createStyleSheet({
        a: {margin: [['10px', '20px']]}
      })
      expect(sheet.toString()).to.be('.a-id {\n  margin: 10px 20px;\n}')
    })

    it('should generate correct important', () => {
      const sheet = jss.createStyleSheet({
        a: {margin: [['10px', '20px'], '!important']}
      })
      expect(sheet.toString()).to.be('.a-id {\n  margin: 10px 20px !important;\n}')
    })
  })

  describe('prefixed value', () => {
    if (isIE9) {
      return
    }

    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {display: 'flex'}
      })
    })

    it('should generate correct CSS', () => {
      const supportedValue = cssVendor.supportedValue('display', 'flex')
      expect(sheet.toString()).to.be(`.a-id {\n  display: ${supportedValue};\n}`)
    })
  })

  describe('prefix function values', () => {
    if (isIE9) {
      return
    }

    let sheet

    beforeEach(() => {
      const localJss = create(settings).use(functionPlugin(), vendorPrefixer())
      sheet = localJss.createStyleSheet({
        a: {display: () => 'flex'}
      })
      sheet.update()
    })

    it('should generate correct CSS', () => {
      const supportedValue = cssVendor.supportedValue('display', 'flex')
      expect(sheet.toString()).to.be(`.a-id {\n  display: ${supportedValue};\n}`)
    })
  })
})
