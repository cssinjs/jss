/* eslint-disable no-underscore-dangle */

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import template from '.'

const settings = {
  createGenerateId: () => (rule) => `${rule.key}-id`
}

describe('jss-plugin-template', () => {
  let spy
  let jss

  beforeEach(() => {
    spy = vi.spyOn(console, 'warn')
    jss = create(settings).use(template())
  })

  afterEach(() => {
    spy.mockRestore()
  })

  describe('template literals', () => {
    it('should convert a single single property/value', () => {
      const sheet = jss.createStyleSheet({
        a: `
          color: red;
        `
      })
      expect(sheet.toString()).toBe(stripIndent`
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
      expect(sheet.toString()).toBe(stripIndent`
        .a-id {
          color: red;
          float: left;
        }
      `)
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should warn when there is no colon found', () => {
      jss.createStyleSheet({
        a: 'color red;'
      })

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('Warning: [JSS] Malformed CSS string "color red;"')
    })

    it('should strip spaces', () => {
      const sheet = jss.createStyleSheet({
        a: `
            color:     red   ;
            float:   left   ;
        `
      })
      expect(sheet.toString()).toBe(stripIndent`
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
      expect(sheet.toString()).toBe(stripIndent`
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
      expect(sheet.toString()).toBe(stripIndent`
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
      expect(sheet.toString()).toBe(stripIndent`
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
