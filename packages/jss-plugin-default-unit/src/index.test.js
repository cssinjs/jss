import expect from 'expect.js'
import expand from 'jss-plugin-expand'
import {create} from 'jss'
import {stripIndent} from 'common-tags'
import Observable from 'zen-observable'
import observablePlugin from 'jss-plugin-rule-value-observable'
import functionPlugin from 'jss-plugin-rule-value-function'

import defaultUnit from './index'

const settings = {
  createGenerateId: () => (rule) => `${rule.key}-id`
}

describe('jss-plugin-default-unit', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(
      defaultUnit({'min-width': 'pc', 'max-width': (val) => `${val / 2}px`})
    )
  })

  describe('unitless values', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          zoom: 1
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  zoom: 1;\n}')
    })
  })

  describe('values with px units', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          width: 10
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  width: 10px;\n}')
    })
  })

  describe('values with ms units', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          'animation-duration': 200
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  animation-duration: 200ms;\n}')
    })
  })

  describe('values with % units', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          'transform-origin-x': 50
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  transform-origin-x: 50%;\n}')
    })
  })

  describe('0 values', () => {
    it('should generate 0 when value is unitless', () => {
      const sheet = jss.createStyleSheet({
        a: {
          zoom: 0
        }
      })
      expect(sheet.toString()).to.be('.a-id {\n  zoom: 0;\n}')
    })

    it('should generate 0 instead of 0px when default unit is px', () => {
      const sheet = jss.createStyleSheet({
        a: {
          width: 0
        }
      })
      expect(sheet.toString()).to.be('.a-id {\n  width: 0;\n}')
    })

    it('should generate 0ms when default unit is ms', () => {
      const sheet = jss.createStyleSheet({
        a: {
          'animation-duration': 0
        }
      })
      expect(sheet.toString()).to.be('.a-id {\n  animation-duration: 0ms;\n}')
    })

    it('should generate 0% when default unit is %', () => {
      const sheet = jss.createStyleSheet({
        a: {
          'transform-origin-x': 0
        }
      })
      expect(sheet.toString()).to.be('.a-id {\n  transform-origin-x: 0%;\n}')
    })
  })

  describe('leave non-regular rules unchanged', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        '@font-face': {
          'font-family': 'MyHelvetica',
          src: 'local("Helvetica")'
        },
        '@media print': {
          a: {
            'border-left': 1,
            border: 3
          }
        },
        '@keyframes a': {
          from: {top: 0},
          '30%': {top: 30},
          '60%, 70%': {top: 80}
        }
      })
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '@font-face {\n' +
          '  font-family: MyHelvetica;\n' +
          '  src: local("Helvetica");\n' +
          '}\n' +
          '@media print {\n' +
          '  .a-id {\n' +
          '    border-left: 1px;\n' +
          '    border: 3px;\n' +
          '  }\n' +
          '}\n' +
          '@keyframes keyframes-a-id {\n' +
          '  from {\n' +
          '    top: 0;\n' +
          '  }\n' +
          '  30% {\n' +
          '    top: 30px;\n' +
          '  }\n' +
          '  60%, 70% {\n' +
          '    top: 80px;\n' +
          '  }\n' +
          '}'
      )
    })
  })

  describe('comma-separated values', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          'background-size': [10, 15]
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  background-size: 10px, 15px;\n}')
    })
  })

  describe('comma-separated values', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          'background-size': [[10, 5]]
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  background-size: 10px 5px;\n}')
    })
  })

  describe('customized units via options object', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          'min-width': 20,
          'max-width': 20
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  min-width: 20pc;\n  max-width: 10px;\n}')
    })
  })

  describe('ignore falsy values', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          padding: 10,
          margin: null,
          width: undefined,
          height: NaN
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  padding: 10px;\n  height: NaN;\n}')
    })
  })

  describe('add default units to fallbacks', () => {
    let sheet

    beforeEach(() => {
      const localJss = create(settings).use(defaultUnit())
      sheet = localJss.createStyleSheet({
        a: {
          padding: 1,
          fallbacks: {
            padding: 5
          }
        },
        b: {
          padding: 1,
          fallbacks: [{padding: 5}, {padding: 10}]
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
      expect(sheet.getRule('b')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  padding: 5px;\n' +
          '  padding: 1px;\n' +
          '}\n' +
          '.b-id {\n' +
          '  padding: 5px;\n' +
          '  padding: 10px;\n' +
          '  padding: 1px;\n' +
          '}'
      )
    })
  })

  describe('add default units in combination with expand plugin', () => {
    let sheet

    beforeEach(() => {
      const localJss = create(settings).use(defaultUnit({'padding-top': 'rem'}), expand())
      sheet = localJss.createStyleSheet({
        a: {
          padding: {
            top: 5,
            left: 0,
            right: 10,
            bottom: 15
          }
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  padding: 5rem 10px 15px 0;\n}')
    })
  })

  describe('add default units in combination with expand plugin (objects inside arrays)', () => {
    let sheet

    beforeEach(() => {
      const localJss = create(settings).use(defaultUnit(), expand())
      sheet = localJss.createStyleSheet({
        a: {
          transition: [
            {
              timingFunction: 'linear',
              delay: 100,
              property: 'opacity',
              duration: 200
            },
            {
              timingFunction: 'linear',
              property: 'transform',
              duration: 300
            }
          ]
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n  transition: opacity 200ms linear 100ms, transform 300ms linear;\n}'
      )
    })
  })

  describe('support camel cased units', () => {
    it('should work with default units', () => {
      const sheet = jss.createStyleSheet({
        a: {
          borderBottom: 10
        }
      })
      expect(sheet.toString()).to.be('.a-id {\n  borderBottom: 10px;\n}')
    })

    it('should work with user units', () => {
      const localJss = create(settings).use(defaultUnit({borderBottom: 'pc'}))

      const sheet = localJss.createStyleSheet({
        a: {
          borderBottom: 10
        }
      })

      expect(sheet.toString()).to.be('.a-id {\n  borderBottom: 10pc;\n}')
    })
  })

  describe('support function values', () => {
    let sheet

    beforeEach(() => {
      jss.use(functionPlugin())

      sheet = jss.createStyleSheet({
        a: {
          width: () => 1
        }
      })
      sheet.update()
    })

    it('should add default unit', () => {
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          width: 1px;
        }
      `)
    })
  })

  describe('support observable values', () => {
    let sheet

    beforeEach(() => {
      jss.use(observablePlugin())

      sheet = jss.createStyleSheet({
        a: {
          width: new Observable((observer) => {
            observer.next(1)
          })
        }
      })
    })

    it('should add default unit', () => {
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          width: 1px;
        }
      `)
    })
  })

  describe('logical properties with px units', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          'margin-inline-start': 10
        }
      })
    })

    it('should add rule', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  margin-inline-start: 10px;\n}')
    })
  })
})
