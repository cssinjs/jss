/* eslint-disable no-underscore-dangle */

import {stripIndent} from 'common-tags'
import expect from 'expect.js'

import {create} from 'jss'
import functionPlugin from '.'

const settings = {createGenerateId: () => rule => `${rule.key}-id`}

describe('jss-plugin-rule-value-function: Function values', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(functionPlugin())
  })

  describe('.addRule() with @media with function values', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({}, {link: true}).attach()
      sheet.addRule('@media screen', {
        b: {
          color: props => (props.primary ? 'black' : 'white')
        }
      })
    })

    afterEach(() => {
      sheet.detach()
    })
  })

  describe('.addRule() with function values and attached sheet', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet(null, {link: true}).attach()
      sheet.addRule('a', {color: ({color}) => color})
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render an empty rule', () => {
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {}
      `)
    })

    it('should render rule with updated color', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
      `)
    })
  })

  describe('.addRule() with function values for rules from plugins queue', () => {
    let sheet

    beforeEach(() => {
      jss.use({
        onProcessRule(rule, ruleSheet) {
          const ruleName = 'plugin-rule'

          if (rule.key === ruleName) return

          ruleSheet.addRule(ruleName, {
            color: props => props.color
          })
        }
      })
      sheet = jss.createStyleSheet({}, {link: true}).attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render color for rule by plugin', () => {
      sheet.addRule('rule', {
        color: props => props.color
      })
      sheet.update({color: 'red'})

      expect(sheet.toString()).to.be(stripIndent`
        .rule-id {
          color: red;
        }
        .plugin-rule-id {
          color: red;
        }
      `)
    })
  })

  describe('.addRule() with arrays returned from function values', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet(null, {link: true}).attach()
      sheet.addRule('a', {color: ({color}) => color})
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should render an empty rule', () => {
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {}
      `)
    })

    it('should return correct CSS from an array with a single value', () => {
      sheet.update({color: ['blue']})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: blue;
        }
      `)
    })

    it('should return correct CSS from a double array with !important', () => {
      sheet.update({color: [['blue'], '!important']})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: blue !important;
        }
      `)
    })

    it('should return correct CSS from an array with !important', () => {
      sheet.update({color: ['blue', '!important']})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: blue !important;
        }
      `)
    })

    it('should return a property value from the CSSOM getPropertyValue function of "green" with important', () => {
      sheet.update({color: [['green'], '!important']})

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: green !important;
        }
      `)
    })

    it('should return a property value from the CSSOM getPropertyValue function of "green"', () => {
      sheet.update({color: ['green']})

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: green;
        }
      `)
    })

    it('should return a correct priority', () => {
      sheet.update({color: [['red'], '!important']})

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red !important;
        }
      `)
    })
  })

  describe('sheet.update()', () => {
    let sheet

    const styles = {
      a: {
        color: theme => theme.color
      },
      '@media all': {
        b: {
          color: theme => theme.color
        }
      },
      '@keyframes a': {
        '0%': {
          color: theme => theme.color
        }
      }
    }

    beforeEach(() => {
      sheet = jss.createStyleSheet(styles, {link: true})
    })

    afterEach(() => {
      sheet.detach()
    })

    describe('.toString()', () => {
      it('should return correct .toString() before .update()', () => {
        expect(sheet.toString()).to.be(stripIndent`
          .a-id {}
          @media all {
            .b-id {  }
          }
          @keyframes keyframes-a-id {
            0% {  }
          }
        `)
      })

      it('should return correct .toString() after single .update()', () => {
        sheet.update({
          color: 'green'
        })

        expect(sheet.toString()).to.be(stripIndent`
          .a-id {
            color: green;
          }
          @media all {
            .b-id {
              color: green;
            }
          }
          @keyframes keyframes-a-id {
            0% {
              color: green;
            }
          }
        `)
      })

      it('should return correct .toString() after double .update()', () => {
        sheet.update({
          color: 'green'
        })
        sheet.update({
          color: 'yellow'
        })

        expect(sheet.toString()).to.be(stripIndent`
          .a-id {
            color: yellow;
          }
          @media all {
            .b-id {
              color: yellow;
            }
          }
          @keyframes keyframes-a-id {
            0% {
              color: yellow;
            }
          }
        `)
      })

      it('should update specific rule', () => {
        sheet.update({color: 'yellow'})
        sheet.update('a', {color: 'green'})

        expect(sheet.toString()).to.be(stripIndent`
          .a-id {
            color: green;
          }
          @media all {
            .b-id {
              color: yellow;
            }
          }
          @keyframes keyframes-a-id {
            0% {
              color: yellow;
            }
          }
        `)
      })

      it('should remove declarations when value is null', () => {
        sheet.update({color: null})

        expect(sheet.toString()).to.be(stripIndent`
          .a-id {}
          @media all {
            .b-id {  }
          }
          @keyframes keyframes-a-id {
            0% {  }
          }
        `)
      })

      it('should remove declarations when value is undefined', () => {
        sheet.update({color: undefined})

        expect(sheet.toString()).to.be(stripIndent`
          .a-id {}
          @media all {
            .b-id {  }
          }
          @keyframes keyframes-a-id {
            0% {  }
          }
        `)
      })

      it('should remove declarations when value is false', () => {
        sheet.update({color: false})

        expect(sheet.toString()).to.be(stripIndent`
          .a-id {}
          @media all {
            .b-id {  }
          }
          @keyframes keyframes-a-id {
            0% {  }
          }
        `)
      })
    })

    describe('sheet.update() after attach', () => {
      beforeEach(() => {
        sheet = jss.createStyleSheet(
          {
            a: {
              color: theme => theme.color
            }
          },
          {link: true}
        )
      })

      it('should render sheet with updated props after attach', () => {
        sheet.attach().update({color: 'green'})

        expect(sheet.toString()).to.be(stripIndent`
          .a-id {
            color: green;
          }
        `)
      })

      it('should render updated rule after attach', () => {
        sheet.attach().update('a', {color: 'green'})

        expect(sheet.toString()).to.be(stripIndent`
          .a-id {
            color: green;
          }
        `)
      })
    })
  })

  describe('keyframe names', () => {
    it('should work with animation-name', () => {
      const sheet = jss.createStyleSheet({
        '@keyframes animateIn': {},

        '@keyframes animateOut': {},

        a: {'animation-name': ({name}) => name}
      })

      sheet.update({name: '$animateIn'})

      expect(sheet.toString()).to.be(stripIndent`
        @keyframes keyframes-animateIn-id {}
        @keyframes keyframes-animateOut-id {}
        .a-id {
          animation-name: keyframes-animateIn-id;
        }
      `)

      sheet.update({name: '$animateOut'})

      expect(sheet.toString()).to.be(stripIndent`
        @keyframes keyframes-animateIn-id {}
        @keyframes keyframes-animateOut-id {}
        .a-id {
          animation-name: keyframes-animateOut-id;
        }
      `)
    })

    it('should work with animation prop', () => {
      const sheet = jss.createStyleSheet({
        '@keyframes animateIn': {},

        '@keyframes animateOut': {},

        a: {animation: ({name}) => `${name} 5s`}
      })

      sheet.update({name: '$animateIn'})

      expect(sheet.toString()).to.be(stripIndent`
        @keyframes keyframes-animateIn-id {}
        @keyframes keyframes-animateOut-id {}
        .a-id {
          animation: keyframes-animateIn-id 5s;
        }
      `)

      sheet.update({name: '$animateOut'})

      expect(sheet.toString()).to.be(stripIndent`
        @keyframes keyframes-animateIn-id {}
        @keyframes keyframes-animateOut-id {}
        .a-id {
          animation: keyframes-animateOut-id 5s;
        }
      `)
    })
  })

  describe('rule.toJSON()', () => {
    it('should handle function values', () => {
      const sheet = jss.createStyleSheet({
        a: {color: () => 'red'}
      })
      sheet.update()
      expect(sheet.getRule('a').toJSON()).to.eql({color: 'red'})
    })
  })
})
