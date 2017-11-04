/* eslint-disable no-underscore-dangle */

import {stripIndent} from 'common-tags'
import expect from 'expect.js'

import {create} from '../../src'
import {
  createGenerateClassName,
  getStyle,
  getCss,
  removeWhitespace
} from '../utils'

const settings = {createGenerateClassName}

describe('Functional: Function rules', () => {
  let jss

  beforeEach(() => {
    jss = create(settings)
  })

  describe('.createStyleSheet() with a function rule', () => {
    let style
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: data => ({color: data.color, display: 'flex'})
      }, {link: true}).attach()
      style = getStyle()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should return correct toString()', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
          display: flex;
        }
      `)
    })

    it('should render', () => {
      sheet.update({color: 'red'})
      expect(getCss(style)).to.be(removeWhitespace(sheet.toString()))
    })
  })
})
