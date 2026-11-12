import {describe, expect, it} from 'vitest'
import cloneStyle from '../../src/utils/cloneStyle'

describe('Unit: jss - cloneStyle', () => {
  it('should return a cloned object', () => {
    const style = {color: 'red'}
    const clonedStyle = cloneStyle(style)
    expect(clonedStyle).not.toBe(style)
    expect(clonedStyle).toEqual(style)
  })

  it('should clone nested object', () => {
    const style = {
      color: 'red',
      '@media': {
        color: 'green'
      }
    }
    const clonedStyle = cloneStyle(style)
    expect(clonedStyle).toEqual(style)
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
    expect(clonedStyle).toEqual(style)
  })

  it('should accept number', () => {
    expect(cloneStyle(1)).toBe(1)
  })

  it('should accept null', () => {
    expect(cloneStyle(null)).toBeNull()
  })

  it('should accept undefined', () => {
    expect(cloneStyle(undefined)).toBeUndefined()
  })

  it('should accept string for SimpleRule', () => {
    expect(cloneStyle('something')).toBe('something')
  })
})
