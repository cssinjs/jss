import expect from 'expect.js'
import jss, {create, Jss, StyleSheet} from 'jss'
import {reset} from '../utils'

afterEach(reset)

describe('Integration: jss', () => {
  describe('exports', () => {
    it('should export default Jss instance', () => {
      expect(jss).to.be.a(Jss)
    })

    it('should export create function', () => {
      expect(create).to.be.a(Function)
    })

    it('should provide .version prop', () => {
      expect(jss.version).to.be.a('string')
    })
  })

  describe('.create()', () => {
    it('should create a Jss instance', () => {
      expect(create()).to.be.a(Jss)
    })
  })

  describe('.sheets registry', () => {
    let sheet1
    let sheet2

    beforeEach(() => {
      sheet1 = jss.createStyleSheet({a: {color: 'red'}})
      sheet2 = jss.createStyleSheet({a: {color: 'blue'}})
    })

    it('should be StyleSheet instances', () => {
      expect(sheet1).to.be.a(StyleSheet)
      expect(sheet2).to.be.a(StyleSheet)
    })

    it('should register sheets in registry', () => {
      expect(jss.sheets.registry.indexOf(sheet1)).to.not.be(-1)
      expect(jss.sheets.registry.indexOf(sheet2)).to.not.be(-1)
    })

    it('should return CSS of all sheets from .sheets.toString()', () => {
      const css =
        '.a-id {\n' +
        '  color: red;\n' +
        '}\n' +
        '.a-id {\n' +
        '  color: blue;\n' +
        '}'
      expect(jss.sheets.toString()).to.be(css)
    })
  })

  describe('.use()', () => {
    describe('.createStyleSheet()', () => {
      it('should pass rule correctly', () => {
        let receivedRule
        let executed = 0
        jss.use(rule => {
          receivedRule = rule
          executed++
        })
        const sheet = jss.createStyleSheet({
          a: {float: 'left'}
        })
        expect(sheet.getRule('a')).to.be(receivedRule)
        expect(executed).to.be(1)
      })
    })

    describe('.createRule()', () => {
      it('should pass rule correctly', () => {
        let receivedRule
        let executed = 0
        jss.use(rule => {
          receivedRule = rule
          executed++
        })
        const rule = jss.createRule()
        expect(rule).to.be(receivedRule)
        expect(executed).to.be(1)
      })

      it('should run plugins on @media rule', () => {
        let executed = 0
        jss.use(() => executed++)
        jss.createRule('@media', {
          button: {float: 'left'}
        })
        expect(executed).to.be(2)
      })

      it('should run plugins on @keyframes rule', () => {
        let executed = 0
        jss.use(() => executed++)
        jss.createRule('@keyframes', {
          from: {top: 0},
          to: {top: 10}
        })
        expect(executed).to.be(3)
      })

      it('should accept multiple plugins', () => {
        let receivedRule1
        let receivedRule2
        const plugin1 = rule => {
          receivedRule1 = rule
        }
        const plugin2 = rule => {
          receivedRule2 = rule
        }
        jss.use(plugin1, plugin2)
        const rule = jss.createRule()
        expect(jss.plugins.registry.length).to.be(2)
        expect(jss.plugins.registry[0]).to.be(plugin1)
        expect(jss.plugins.registry[1]).to.be(plugin2)
        expect(receivedRule1).to.be(rule)
        expect(receivedRule2).to.be(rule)
      })
    })
  })

  describe('.setup()', () => {
    it('should set up plugins', () => {
      const local = create()
      const fn1 = () => {}
      const fn2 = () => {}
      local.setup({
        plugins: [fn1, fn2]
      })
      expect(local.plugins.registry[0]).to.be(fn1)
      expect(local.plugins.registry[1]).to.be(fn2)
    })
  })
})
