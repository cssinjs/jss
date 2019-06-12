// @flow
import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create as createJss} from 'jss'
import {createGenerateId} from '../../../tests/utils'
import {create as createCss} from './index'

describe('css-jss', () => {
  let sheet
  let css

  beforeEach(() => {
    sheet = createJss({createGenerateId}).createStyleSheet()
    css = createCss(sheet)
  })

  it('should accept style object argument', () => {
    const result = css({color: 'red'})
    expect(result).to.be('css0-id')
    expect(sheet.toString()).to.be(stripIndent`
      .css0-id {
        color: red;
      }
    `)
  })

  it('should accept multiple style object arguments', () => {
    const result = css({color: 'red'}, {background: 'green'})
    expect(result).to.be('css0-id')
    expect(sheet.toString()).to.be(stripIndent`
      .css0-id {
        color: red;
        background: green;
      }
    `)
  })

  it('should ignore empty values', () => {
    const result = css(null, {color: 'red'}, '', {background: 'green'}, undefined)
    expect(result).to.be('css0-id')
    expect(sheet.toString()).to.be(stripIndent`
      .css0-id {
        color: red;
        background: green;
      }
    `)
  })

  it('should accept label', () => {
    const result = css({color: 'red', label: 'xxx'}, {background: 'green'})
    expect(result).to.be('xxx0-id')
    expect(sheet.toString()).to.be(stripIndent`
      .xxx0-id {
        color: red;
        background: green;
      }
    `)
  })

  describe('cache', () => {
    it('should cache a single style by ref', () => {
      const style = {color: 'red'}
      const result1 = css(style)
      const result2 = css(style)
      expect(result1).to.be('css0-id')
      expect(result2).to.be('css0-id')
      expect(sheet.toString()).to.be(stripIndent`
        .css0-id {
          color: red;
        }
      `)
    })
    it('should cache multiple styles by ref', () => {
      const style1 = {color: 'red'}
      const style2 = {background: 'green'}
      const result1 = css(style1, style2)
      const result2 = css(style1, style2)
      expect(result1).to.be('css0-id')
      expect(result2).to.be('css0-id')
      expect(sheet.toString()).to.be(stripIndent`
        .css0-id {
          color: red;
          background: green;
        }
      `)
    })

    it('should not cache by ref if any of the styles refs changes', () => {
      const style1 = {color: 'red'}
      const result1 = css(style1, {background: 'green'})
      const result2 = css(style1, {background: 'purpule'})
      expect(result1).to.be('css0-id')
      expect(result2).to.be('css1-id')
      expect(sheet.toString()).to.be(stripIndent`
        .css0-id {
          color: red;
          background: green;
        }
        .css1-id {
          color: red;
          background: purpule;
        }
      `)
    })
  })
})
