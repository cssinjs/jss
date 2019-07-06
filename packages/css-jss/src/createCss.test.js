// @flow
import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create as createJss} from 'jss'
import {createGenerateId} from '../../../tests/utils'
import {create as createCss} from './index'

describe('css-jss', () => {
  let css

  beforeEach(() => {
    const jss = createJss({createGenerateId})
    css = createCss(jss)
  })

  it('should accept a single style object argument', () => {
    const className = css({color: 'red'})
    expect(className).to.be('css-0-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .css-0-id {
        color: red;
      }
    `)
  })

  it('should accept multiple style object arguments', () => {
    const className = css({color: 'red'}, {background: 'green'})
    expect(className).to.be('css-0-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .css-0-id {
        color: red;
        background: green;
      }
    `)
  })

  it('should accept multiple style object array', () => {
    const className = css([{color: 'red'}, {background: 'green'}])
    expect(className).to.be('css-0-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .css-0-id {
        color: red;
        background: green;
      }
    `)
  })

  it('should accept multiple style object array and style objects', () => {
    const className = css([{color: 'red'}, {background: 'green'}], {float: 'left'})
    expect(className).to.be('css-0-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .css-0-id {
        color: red;
        background: green;
        float: left;
      }
    `)
  })

  it('should accept multiple style object arrays', () => {
    const className = css([{color: 'red'}, {background: 'green'}], [{float: 'left'}])
    expect(className).to.be('css-0-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .css-0-id {
        color: red;
        background: green;
        float: left;
      }
    `)
  })

  it('should compose css() calls', () => {
    const className = css(css({color: 'red'}), css({background: 'green'}))
    expect(className).to.be('css-2-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .css-0-id {
        color: red;
      }
      .css-1-id {
        background: green;
      }
      .css-2-id {
        color: red;
        background: green;
      }
    `)
  })

  it('should compose css() calls inside of array arg', () => {
    const className = css([css({color: 'red'}), css({background: 'green'})])
    expect(className).to.be('css-2-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .css-0-id {
        color: red;
      }
      .css-1-id {
        background: green;
      }
      .css-2-id {
        color: red;
        background: green;
      }
    `)
  })

  it('should compose css() calls from mixed array and strings', () => {
    const className = css([css({color: 'red'}), css({background: 'green'})], css({float: 'left'}))
    expect(className).to.be('css-3-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .css-0-id {
        color: red;
      }
      .css-1-id {
        background: green;
      }
      .css-2-id {
        float: left;
      }
      .css-3-id {
        color: red;
        background: green;
        float: left;
      }
    `)
  })

  it('should ignore empty values', () => {
    const className = css(null, {color: 'red'}, '', {background: 'green'}, undefined)
    expect(className).to.be('css-0-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .css-0-id {
        color: red;
        background: green;
      }
    `)
  })

  it('should accept label', () => {
    const className = css({color: 'red', label: 'xxx'}, {background: 'green'})
    expect(className).to.be('xxx-0-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .xxx-0-id {
        color: red;
        background: green;
      }
    `)
  })

  it('should merge label', () => {
    const className = css(
      {color: 'red', label: 'xxx'},
      {background: 'green', label: 'yyy'},
      {float: 'left', label: 'yyy'}
    )
    expect(className).to.be('xxx-yyy-0-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .xxx-yyy-0-id {
        color: red;
        background: green;
        float: left;
      }
    `)
  })

  it('should cache a single style', () => {
    const style = {color: 'red'}
    const className1 = css(style)
    const className2 = css(style)
    expect(className1).to.be('css-0-id')
    expect(className2).to.be('css-0-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .css-0-id {
        color: red;
      }
    `)
  })

  it('should cache multiple styles', () => {
    const style1 = {color: 'red'}
    const style2 = {background: 'green'}
    const className1 = css(style1, style2)
    const className2 = css(style1, style2)
    expect(className1).to.be('css-0-id')
    expect(className2).to.be('css-0-id')
    expect(css.getSheet().toString()).to.be(stripIndent`
      .css-0-id {
        color: red;
        background: green;
      }
    `)
  })

  it('should try get the cached rule by using a ref first before trying to stringify', () => {})
})
