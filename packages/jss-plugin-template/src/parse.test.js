/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import sinon from 'sinon'
import parse from './parse'

describe('jss-plugin-template parse()', () => {
  let warnSpy

  beforeEach(() => {
    warnSpy = sinon.spy(console, 'warn')
  })

  afterEach(() => {
    console.warn.restore()
  })

  it('should convert a single single property/value', () => {
    const styles = parse(`
      color: red;
    `)
    expect(styles).to.eql({
      color: 'red'
    })
    expect(warnSpy.callCount).to.be(0)
  })

  it('should parse multiple props/values', () => {
    const styles = parse(`
      color: red;
      float: left;
    `)
    expect(styles).to.eql({
      color: 'red',
      float: 'left'
    })
    expect(warnSpy.callCount).to.be(0)
  })

  it('should warn when there is no colon found', () => {
    parse('color red;')
    expect(warnSpy.callCount).to.be(1)
    expect(warnSpy.args[0][0]).to.be('Warning: [JSS] Missing colon in "color red;".')
  })

  it('should strip spaces', () => {
    const styles = parse(`
        color:     red   ;
        float:   left   ;
    `)
    expect(styles).to.eql({
      color: 'red',
      float: 'left'
    })
    expect(warnSpy.callCount).to.be(0)
  })

  it('should not require semicolon', () => {
    const styles = parse(`
      color: red
      float: left
    `)
    expect(styles).to.eql({
      color: 'red',
      float: 'left'
    })
    expect(warnSpy.callCount).to.be(0)
  })

  it('should support nesting', () => {
    const styles = parse(`
      color: green;
      & .b     {
        color: red;
      }
    `)
    expect(styles).to.eql({
      color: 'green',
      '& .b': {
        color: 'red'
      }
    })
    expect(warnSpy.callCount).to.be(0)
  })

  it('should warn when opening curly brace is missing', () => {
    const styles = parse(`
      color: green;
      & .b
        color: red;
      }
    `)
    expect(styles).to.eql({
      color: 'green'
    })
    expect(warnSpy.args[0][0]).to.be('Warning: [JSS] Missing opening curly brace in "& .b".')
  })

  it('should warn when closing curly brace is not on an own line', () => {
    const styles = parse(`
      color: green;
      & .b {
        color: red;
      } .a { color: blue; }
    `)
    expect(styles).to.eql({
      color: 'green',
      '& .b': {
        color: 'red'
      }
    })
    expect(warnSpy.args[0][0]).to.be(
      'Warning: [JSS] Missing closing curly brace in "} .a { color: blue; }".'
    )
  })

  it('should support multiple first level nested rules', () => {
    const styles = parse(`
      color: green;
      & .b {
        color: red;
      }
      & .c {
        color: blue;
      }
    `)
    expect(styles).to.eql({
      color: 'green',
      '& .b': {
        color: 'red'
      },
      '& .c': {
        color: 'blue'
      }
    })
    expect(warnSpy.callCount).to.be(0)
  })

  it('should support multiple deeply nested rules', () => {
    const styles = parse(`
      color: green;
      & .b {
        color: red;
        & .c {
          color: blue;
        }
      }
    `)
    expect(styles).to.eql({
      color: 'green',
      '& .b': {
        color: 'red',
        '& .c': {
          color: 'blue'
        }
      }
    })
    expect(warnSpy.callCount).to.be(0)
  })

  it('should regular props after a nested rule', () => {
    const styles = parse(`
      color: green;
      & .b {
        color: red;
      }
      float: left;
    `)
    expect(styles).to.eql({
      color: 'green',
      '& .b': {
        color: 'red'
      },
      float: 'left'
    })
    expect(warnSpy.callCount).to.be(0)
  })

  it('should expect ampersand in the middle of the line', () => {
    const styles = parse(`
      color: green;
      body & .b {
        color: red;
      }
    `)
    expect(styles).to.eql({
      color: 'green',
      'body & .b': {
        color: 'red'
      }
    })
    expect(warnSpy.callCount).to.be(0)
  })
})
