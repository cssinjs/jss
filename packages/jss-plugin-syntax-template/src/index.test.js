/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import template from '.'
import parse from './parse'

const settings = {
  createGenerateId: () => rule => `${rule.key}-id`
}

describe('jss-plugin-syntax-template', () => {
  let jss
  let warning

  beforeEach(() => {
    parse.__Rewire__('warning', (condition, message) => {
      warning = message
    })

    jss = create(settings).use(template())
  })

  afterEach(() => {
    parse.__ResetDependency__('warning')
    warning = undefined
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
      expect(warning).to.be(undefined)
    })

    it('should warn when there is no colon found', () => {
      jss.createStyleSheet({
        a: 'color red;'
      })
      jss.createStyleSheet({
        a: `
          color: red;
          float: left;
        `
      })
      expect(warning).to.not.be(undefined)
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
