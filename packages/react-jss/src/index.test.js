import expect from 'expect.js'
import {
  withStyles,
  jss,
  createGenerateId,
  ThemeProvider,
  JssProvider,
  SheetsRegistry,
  withTheme,
  createTheming,
  createUseStyles,
  useTheme
} from '.'

describe('React-JSS: exports', () => {
  it('should export withStyles', () => {
    expect(withStyles).to.be.a(Function)
  })

  it('should export jss', () => {
    expect(jss).to.be.an(jss.constructor)
  })

  it('should export createGenerateId', () => {
    expect(createGenerateId).to.be.a(Function)
  })

  it('should export ThemeProvider', () => {
    expect(ThemeProvider).to.be.a(Function)
  })

  it('should export JssProvider', () => {
    expect(JssProvider).to.be.a(Function)
  })

  it('should export SheetsRegistry', () => {
    expect(SheetsRegistry).to.be.a(Function)
  })

  it('should export withTheme', () => {
    expect(withTheme).to.be.a(Function)
  })

  it('should export createTheming', () => {
    expect(createTheming).to.be.a(Function)
  })

  it('should export createUseStyles', () => {
    expect(createUseStyles).to.be.a(Function)
  })

  it('should export useTheme', () => {
    expect(useTheme).to.be.a(Function)
  })
})
