/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import sinon from 'sinon'
import nested from 'jss-plugin-nested'
import template, {cache} from '.'

const settings = {
  createGenerateId: () => rule => `${rule.key}-id`
}

describe('jss-plugin-template', () => {
  let spy
  let jss

  beforeEach(() => {
    spy = sinon.spy(console, 'warn')
    jss = create(settings).use(template(), nested())
  })

  afterEach(() => {
    console.warn.restore()
  })

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

  it('should cache parsed template', () => {
    const a = `color: red`
    jss.createStyleSheet({a})
    expect(cache[a]).to.eql({color: 'red'})
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
    expect(spy.args[0][0]).to.be('Warning: [JSS] Missing colon in "color red;".')
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

  it('should not require semicolon', () => {
    const sheet = jss.createStyleSheet({
      a: `
          color: red
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

  it('should support nesting', () => {
    const sheet = jss.createStyleSheet({
      a: `
        color: green;
        & .b {
          color: red;
        }
      `
    })
    expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: green;
        }
        .a-id .b {
          color: red;
        }
      `)
  })

  it('should warn when opening curly brace is missing', () => {
    jss.createStyleSheet({
      a: `
        color: green;
        & .b
          color: red;
        }
      `
    })
    expect(spy.args[0][0]).to.be('Warning: [JSS] Missing opening curly brace in "& .b".')
  })

  it('should warn when closing curly brace is not on an own line', () => {
    jss.createStyleSheet({
      a: `
        color: green;
        & .b {
          color: red;
        } .a { color: blue; }
      `
    })
    expect(spy.args[0][0]).to.be(
      'Warning: [JSS] Missing closing curly brace in "} .a { color: blue; }".'
    )
  })

  it('should support multiple first level nested rules', () => {
    const sheet = jss.createStyleSheet({
      a: `
        color: green;
        & .b {
          color: red;
        }
        & .c {
          color: blue;
        }
      `
    })
    expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: green;
        }
        .a-id .b {
          color: red;
        }
        .a-id .c {
          color: blue;
        }
      `)
  })

  it('should support multiple deeply nested rules', () => {
    const sheet = jss.createStyleSheet({
      a: `
        color: green;
        & .b {
          color: red;
          & .c {
            color: blue;
          }
        }
      `
    })
    expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: green;
        }
        .a-id .b {
          color: red;
        }
        .a-id .b .c {
          color: blue;
        }
      `)
  })

  it('should regular props after a nested rule', () => {
    const sheet = jss.createStyleSheet({
      a: `
        color: green;
        & .b {
          color: red;
        }
        float: left;
      `
    })
    expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: green;
          float: left;
        }
        .a-id .b {
          color: red;
        }
      `)
  })
})
