import {describe, it, expect} from 'vitest'
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
    expect(withStyles).toBeInstanceOf(Function)
  })

  it('should export jss', () => {
    expect(jss).toBeInstanceOf(jss.constructor)
  })

  it('should export createGenerateId', () => {
    expect(createGenerateId).toBeInstanceOf(Function)
  })

  it('should export ThemeProvider', () => {
    expect(ThemeProvider).toBeInstanceOf(Function)
  })

  it('should export JssProvider', () => {
    expect(JssProvider).toBeInstanceOf(Function)
  })

  it('should export SheetsRegistry', () => {
    expect(SheetsRegistry).toBeInstanceOf(Function)
  })

  it('should export withTheme', () => {
    expect(withTheme).toBeInstanceOf(Function)
  })

  it('should export createTheming', () => {
    expect(createTheming).toBeInstanceOf(Function)
  })

  it('should export createUseStyles', () => {
    expect(createUseStyles).toBeInstanceOf(Function)
  })

  it('should export useTheme', () => {
    expect(useTheme).toBeInstanceOf(Function)
  })
})
