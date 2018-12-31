import expect from 'expect.js'
import cloneStyle from '../../src/utils/cloneStyle'
import {resetSheets} from '../../../../tests/utils'

describe('Unit: jss - cloneStyle', () => {
  beforeEach(resetSheets())

  it('should return a cloned object', () => {
    const style = {color: 'red'}
    const clonedStyle = cloneStyle(style)
    expect(clonedStyle).not.to.be(style)
    expect(clonedStyle).to.eql(style)
  })

  it('should clone nested object', () => {
    const style = {
      color: 'red',
      '@media': {
        color: 'green'
      }
    }
    const clonedStyle = cloneStyle(style)
    expect(clonedStyle).to.eql(style)
  })

  it('should clone array', () => {
    const style = [
      {
        'font-family': 'MyHelvetica',
        src: 'local("Helvetica")'
      },
      {
        'font-family': 'MyComicSans',
        src: 'local("ComicSans")'
      }
    ]
    const clonedStyle = cloneStyle(style)
    expect(clonedStyle).to.eql(style)
  })

  it('should accept number', () => {
    expect(cloneStyle(1)).to.be(1)
  })

  it('should accept null', () => {
    expect(cloneStyle(null)).to.be(null)
  })

  it('should accept undefined', () => {
    expect(cloneStyle(undefined)).to.be(undefined)
  })

  it('should accept string for SimpleRule', () => {
    expect(cloneStyle('something')).to.be('something')
  })
})
