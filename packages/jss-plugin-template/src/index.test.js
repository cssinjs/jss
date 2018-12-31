/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import sinon from 'sinon'
import template from '.'

const settings = {
  createGenerateId: () => rule => `${rule.key}-id`
}

describe('jss-plugin-template', () => {
  let spy
  let jss

  beforeEach(() => {
    spy = sinon.spy(console, 'warn')
    jss = create(settings).use(template())
  })

  afterEach(() => {
    console.warn.restore()
  })

  describe('template literals', () => {
    it('should convert a single single property/value', () => {
      const sheet = jss.createStyleSheet({
        a: `
          color: red;
        `
      })
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
      `)
    })

    it('should parse multiple props/values', () => {
      const sheet = jss.createStyleSheet({
        a: `
          color: red;
          float: left;
        `
      })
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
          float: left;
        }
      `)
      expect(spy.callCount).to.be(0)
    })

    it('should warn when there is no colon found', () => {
      jss.createStyleSheet({
        a: 'color red;'
      })

      expect(spy.callCount).to.be(1)
      expect(spy.calledWithExactly('Warning: [JSS] Malformed CSS string "color red;"')).to.be(true)
    })

    it('should strip spaces', () => {
      const sheet = jss.createStyleSheet({
        a: `
            color:     red   ;
            float:   left   ;
        `
      })
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
          float: left;
        }
      `)
    })

    it('should allow skiping last semicolon', () => {
      const sheet = jss.createStyleSheet({
        a: `
          color: red;
          float: left
        `
      })
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
          float: left;
        }
      `)
    })

    it('should support @media', () => {
      const sheet = jss.createStyleSheet({
        '@media print': {
          button: 'color: black'
        }
      })
      expect(sheet.toString()).to.be(stripIndent`
        @media print {
          .button-id {
            color: black;
          }
        }
      `)
    })

    it('should support @keyframes', () => {
      const sheet = jss.createStyleSheet({
        '@keyframes a': {
          from: 'opacity: 0',
          to: 'opacity: 1'
        }
      })
      expect(sheet.toString()).to.be(stripIndent`
        @keyframes keyframes-a-id {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `)
    })
  })
})
