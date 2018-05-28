/* eslint-disable no-underscore-dangle */

import {stripIndent} from 'common-tags'
import expect from 'expect.js'

import {create} from '../../src'
import {createGenerateClassName, getStyle, getCss, removeWhitespace} from '../utils'

const settings = {createGenerateClassName}

describe('Functional: Function rules', () => {
  let jss

  beforeEach(() => {
    jss = create(settings)
  })

  describe('.createStyleSheet()', () => {
    let style
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
      style = getStyle()
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

    it('should render', () => {
      sheet.update({color: 'red'})
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })
  })

  describe('.addRule() with styleRule', () => {
    let style
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet(null, {link: true}).attach()
      sheet.addRule('a', data => ({
        color: data.primary ? 'black' : 'white'
      }))
      style = getStyle()
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

    it('should render', () => {
      sheet.update({primary: true})
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
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
    let style
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({}, {link: true}).attach()
      sheet.addRule('@media screen', {
        b: data => ({
          color: data.primary ? 'black' : 'white'
        })
      })
      style = getStyle()
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

    it('should render', () => {
      sheet.update({primary: true})
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })

    it('should update', () => {
      sheet.update({primary: false})
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })
  })
})
