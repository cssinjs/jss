import expect from 'expect.js'
import injectSheet, {
  jss,
  createGenerateClassName,
  ThemeProvider,
  JssProvider,
  SheetsRegistry,
  withTheme,
  createTheming
} from './index'

describe('exports', () => {
  it('should export injectSheet', () => {
    expect(injectSheet).to.be.a(Function)
  })

  it('should export jss', () => {
    expect(jss).to.be.an(jss.constructor)
  })

  it('should export createGenerateClassName', () => {
    expect(createGenerateClassName).to.be.a(Function)
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
})
