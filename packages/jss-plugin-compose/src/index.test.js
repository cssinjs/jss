/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import {create} from 'jss'
import sinon from 'sinon'
import compose from '.'

const settings = {createGenerateId: () => (rule) => `${rule.key}-id`}

describe('jss-plugin-compose', () => {
  let jss
  let spy

  beforeEach(() => {
    spy = sinon.spy(console, 'warn')
    jss = create(settings).use(compose())
  })

  afterEach(() => {
    console.warn.restore()
  })

  describe('Ref composition', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: '$a',
          color: 'red'
        }
      })
    })

    afterEach(() => {
      expect(spy.callCount).to.be(0)
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('b')).to.not.be(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.classes.b).to.be('b-id a-id')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  float: left;\n}\n.b-id {\n  color: red;\n}')
    })
  })

  describe('Global class composition', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          composes: 'b',
          color: 'red'
        }
      })
    })

    afterEach(() => {
      expect(spy.callCount).to.be(0)
    })

    it('should compose classes', () => {
      expect(sheet.classes.a).to.be('a-id b')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  color: red;\n}')
    })
  })

  describe('Array of refs composition', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          color: 'red'
        },
        c: {
          background: 'blue'
        },
        d: {
          composes: ['$a', '$b', '$c'],
          border: 'none'
        },
        e: {
          composes: '$a $b $c',
          border: 'none'
        },
        f: {
          composes: ['$a', ['$b', '$c']],
          border: 'none'
        }
      })
    })

    afterEach(() => {
      expect(spy.callCount).to.be(0)
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('b')).to.not.be(undefined)
      expect(sheet.getRule('c')).to.not.be(undefined)
      expect(sheet.getRule('d')).to.not.be(undefined)
      expect(sheet.getRule('e')).to.not.be(undefined)
      expect(sheet.getRule('f')).to.not.be(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.classes.d).to.be('d-id a-id b-id c-id')
      expect(sheet.classes.e).to.be('e-id a-id b-id c-id')
      expect(sheet.classes.f).to.be('f-id a-id b-id c-id')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.b-id {\n' +
          '  color: red;\n' +
          '}\n' +
          '.c-id {\n' +
          '  background: blue;\n' +
          '}\n' +
          '.d-id {\n' +
          '  border: none;\n' +
          '}\n' +
          '.e-id {\n' +
          '  border: none;\n' +
          '}\n' +
          '.f-id {\n' +
          '  border: none;\n' +
          '}'
      )
    })
  })

  describe('Mixed composition', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: ['$a', 'c', 'd'],
          color: 'red'
        },
        e: {
          composes: '$a c d',
          color: 'red'
        }
      })
    })

    afterEach(() => {
      expect(spy.callCount).to.be(0)
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('b')).to.not.be(undefined)
      expect(sheet.getRule('e')).to.not.be(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.classes.b).to.be('b-id a-id c d')
      expect(sheet.classes.e).to.be('e-id a-id c d')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.b-id {\n' +
          '  color: red;\n' +
          '}\n' +
          '.e-id {\n' +
          '  color: red;\n' +
          '}'
      )
    })
  })

  describe('Nested compositions (compose composed)', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          float: 'left'
        },
        b: {
          composes: ['$a', 'd'],
          color: 'red'
        },
        c: {
          composes: ['$b'],
          background: 'blue'
        }
      })
    })

    afterEach(() => {
      expect(spy.callCount).to.be(0)
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('b')).to.not.be(undefined)
      expect(sheet.getRule('c')).to.not.be(undefined)
    })

    it('should compose classes', () => {
      expect(sheet.classes.b).to.be('b-id a-id d')
      expect(sheet.classes.c).to.be('c-id b-id a-id d')
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.b-id {\n' +
          '  color: red;\n' +
          '}\n' +
          '.c-id {\n' +
          '  background: blue;\n' +
          '}'
      )
    })
  })

  describe('Warnings', () => {
    it('should warn when rule try to compose itself', () => {
      jss.createStyleSheet({
        a: {
          composes: ['$a'],
          color: 'red'
        }
      })

      expect(spy.callCount).to.be(1)
      expect(
        spy.calledWithExactly(
          'Warning: [JSS] Cyclic composition detected. \n' +
            '.a-id {\n' +
            '  composes: $a;\n' +
            '  color: red;\n' +
            '}'
        )
      ).to.be(true)
    })

    it("should warn when try to compose ref which can't be resolved", () => {
      jss.createStyleSheet({
        a: {
          composes: ['$b'],
          color: 'red'
        }
      })

      expect(spy.callCount).to.be(1)
      expect(
        spy.calledWithExactly(
          'Warning: [JSS] Referenced rule is not defined. \n.a-id {\n  composes: $b;\n  color: red;\n}'
        )
      ).to.be(true)
    })
  })
})
