import expect from 'expect.js'
import Observable from 'zen-observable'
import {create} from 'jss'
import observablePlugin from 'jss-plugin-rule-value-observable'

import expand from '.'

const settings = {
  createGenerateId: () => (rule) => `${rule.key}-id`
}

describe('jss-plugin-expand', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(expand())
  })

  describe('space-separated values as arrays', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          padding: [20, 10],
          'background-size': [10, 'auto'],
          'border-radius': [10, 15, 20, 20]
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  padding: 20 10;\n' +
          '  background-size: 10 auto;\n' +
          '  border-radius: 10 15 20 20;\n' +
          '}'
      )
    })
  })

  describe('comma-separated values as arrays (using double arrays)', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          transition: [
            ['opacity', 1, 'linear'],
            ['transform', 300, 'ease']
          ]
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n  transition: opacity 1 linear, transform 300 ease;\n}'
      )
    })
  })

  describe('simple expanded rules', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          border: {
            width: 1,
            style: 'solid',
            color: '#f00'
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  border-width: 1;\n' +
          '  border-style: solid;\n' +
          '  border-color: #f00;\n' +
          '}'
      )
    })
  })

  describe('expanded rules multiple objects as entry', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          transition: [
            {
              property: 'all',
              delay: 2,
              duration: 5,
              timingFunction: 'linear'
            },
            {
              property: 'opacity',
              duration: 1
            }
          ]
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  transition: all 5 linear 2, opacity 1;\n}')
    })
  })

  describe('expanded rules as an object (without some styles)', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          background: {
            color: '#000',
            image: 'url(test.jpg)',
            position: [0, 0],
            repeat: 'no-repeat'
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  background: #000 0 0 no-repeat;\n' +
          '  background-image: url(test.jpg);\n' +
          '}'
      )
    })
  })

  describe('expand with fallbacks', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          background: {
            color: 'rgba(255, 255, 255, 0.8)'
          },
          padding: 50,
          fallbacks: {
            background: {
              color: 'white'
            },
            padding: 20
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  background: white;\n' +
          '  padding: 20;\n' +
          '  background: rgba(255, 255, 255, 0.8);\n' +
          '  padding: 50;\n' +
          '}'
      )
    })
  })

  describe('expand with multiple fallbacks for the same prop', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          background: 'linear-gradient(red 0%, green 100%)',
          fallbacks: [
            {
              background: 'red'
            },
            {
              background: {
                color: 'url(test.png)',
                repeat: 'no-repeat',
                position: [0, 0]
              }
            }
          ]
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  background: red;\n' +
          '  background: url(test.png) 0 0 no-repeat;\n' +
          '  background: linear-gradient(red 0%, green 100%);\n' +
          '}'
      )
    })
  })

  describe('expand with fallbacks and custom properties', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          background: {
            image: 'linear-gradient(red 0%, green 100%)',
            size: [10, 20]
          },
          fallbacks: {
            background: {
              image: 'url(gradient.png)',
              size: 'auto'
            }
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  background-size: auto;\n' +
          '  background-image: url(gradient.png);\n' +
          '  background-size: 10 20;\n' +
          '  background-image: linear-gradient(red 0%, green 100%);\n' +
          '}'
      )
    })
  })

  describe('integration with jss-plugin-camel-case', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          transition: {
            timingFunction: 'linear',
            delay: '300ms',
            property: 'opacity',
            duration: '200ms'
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  transition: opacity 200ms linear 300ms;\n}')
    })
  })

  describe('non-standart properties support', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          border: {
            width: ['2px', '3px'],
            style: 'solid',
            color: 'black',
            radius: ['5px', '10px']
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.a-id {\n' +
          '  border-radius: 5px 10px;\n' +
          '  border-width: 2px 3px;\n' +
          '  border-style: solid;\n' +
          '  border-color: black;\n' +
          '}'
      )
    })
  })

  describe('non-standart properties should not overwrite standart properties notation', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          border: {
            radius: ['5px', '10px']
          },
          'border-radius': '10px'
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  border-radius: 10px;\n}')
    })
  })

  describe('gracefully handle invalid values', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          padding: [], // Empty: incorrect, to ignore
          color: '',
          margin: 0,
          'border-radius': '10px' // Still one correct value
        },
        p: {
          margin: [] // Will lead to empty rule, eliminated
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  margin: 0;\n  border-radius: 10px;\n}')
    })
  })

  describe('support observable value', () => {
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

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('.a-id {\n  width: 1;\n}')
    })
  })
})
