import expect from 'expect.js'
import kebabCase from '../../src/utils/kebabCase'

describe('Unit: jss - kebabCase', () => {
  it('should convert "a"', () => {
    expect(kebabCase('a')).to.be('a')
  })

  it('should convert "aB"', () => {
    expect(kebabCase('aB')).to.be('a-b')
  })

  it('should convert "aBa"', () => {
    expect(kebabCase('aBa')).to.be('a-ba')
  })

  it('should convert "aBaCa"', () => {
    expect(kebabCase('aBaCa')).to.be('a-ba-ca')
  })
})
