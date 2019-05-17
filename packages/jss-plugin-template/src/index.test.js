/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import nested from 'jss-plugin-nested'
import template, {cache} from '.'

const settings = {
  createGenerateId: () => rule => `${rule.key}-id`
}

describe('jss-plugin-template', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(template(), nested())
  })

  it('should cache parsed template', () => {
    const a = `color: red`
    jss.createStyleSheet({a})
    expect(cache[a]).to.eql({color: 'red'})
  })

  it('should support @media', () => {
    const sheet = jss.createStyleSheet({
      '@media print': {
        button: 'color: black;'
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
        from: 'opacity: 0;',
        to: 'opacity: 1;'
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
