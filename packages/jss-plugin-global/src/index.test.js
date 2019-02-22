import {stripIndent} from 'common-tags'
import expect from 'expect.js'
import {create} from 'jss'
import nested from 'jss-plugin-nested'

import global from './index'

const settings = {
  createGenerateId: () => rule => `${rule.key}-id`
}

describe('jss-plugin-global', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(global())
  })

  describe('@global root container', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        '@global': {
          a: {color: 'red'},
          body: {color: 'green'}
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('@global')).to.not.be(undefined)
      expect(sheet.getRule('a')).to.be(undefined)
      expect(sheet.getRule('body')).to.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('a {\n  color: red;\n}\nbody {\n  color: green;\n}')
    })
  })

  describe('@global linked', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            '@global': {
              a: {
                color: 'red'
              }
            },
            '@global b': {
              color: 'red'
            }
          },
          {link: true}
        )
        .attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should link inside container', () => {
      expect(sheet.getRule('@global').getRule('a').renderable).to.not.be(undefined)
    })

    it('should link with prefix', () => {
      expect(sheet.getRule('@global b').renderable).to.not.be(undefined)
    })
  })

  describe('@global root container with @keyframes', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        '@global': {
          '@keyframes a': {
            to: {
              width: '100%'
            }
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('keyframes-a')).to.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(stripIndent`
        @keyframes a {
          to {
            width: 100%;
          }
        }
      `)
    })
  })

  describe('@global root prefix', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        '@global body': {
          color: 'red'
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('body')).to.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be('body {\n  color: red;\n}')
    })
  })

  describe('@global root prefix with keyframes', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        '@global @keyframes a': {
          to: {
            width: '100%'
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('keyframes-a')).to.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(stripIndent`
        @keyframes a {
          to {
            width: 100%;
          }
        }
      `)
    })
  })

  describe('@global scoped container', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        button: {
          float: 'left',
          '@global': {
            span: {color: 'red'}
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('button')).to.not.be(undefined)
      expect(sheet.getRule('.button-id span')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.button-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.button-id span {\n' +
          '  color: red;\n' +
          '}'
      )
    })
  })

  describe('@global scoped container with comma separated selectors', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        button: {
          float: 'left',
          '@global': {
            'a, b': {color: 'red'}
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('button')).to.not.be(undefined)
      expect(sheet.getRule('.button-id a, .button-id b')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.button-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.button-id a, .button-id b {\n' +
          '  color: red;\n' +
          '}'
      )
    })
  })

  describe('@global prefixed scoped rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        button: {
          float: 'left',
          '@global span': {
            color: 'red'
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('button')).to.not.be(undefined)
      expect(sheet.getRule('.button-id span')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.button-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.button-id span {\n' +
          '  color: red;\n' +
          '}'
      )
    })
  })

  describe('@global prefixed scoped rule with comma separate selectors', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        button: {
          float: 'left',
          '@global a, b': {
            color: 'red'
          }
        }
      })
    })

    it('should add rules', () => {
      expect(sheet.getRule('button')).to.not.be(undefined)
      expect(sheet.getRule('.button-id a, .button-id b')).to.not.be(undefined)
    })

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be(
        '.button-id {\n' +
          '  float: left;\n' +
          '}\n' +
          '.button-id a, .button-id b {\n' +
          '  color: red;\n' +
          '}'
      )
    })
  })

  describe('@global rules with null, undefined or empty value', () => {
    it('should generate correct CSS with prefix @global rules', () => {
      const sheet = jss.createStyleSheet({
        '@global a': undefined,
        '@global b': null
      })
      expect(sheet.toString()).to.be('')
    })

    it('should generate correct CSS with @global container rule', () => {
      const sheet = jss.createStyleSheet({
        '@global': {
          a: null,
          b: undefined
        }
      })
      expect(sheet.toString()).to.be('')
    })
  })

  describe('@global with nested rules inside', () => {
    let jss2

    beforeEach(() => {
      jss2 = create({plugins: [global(), nested()]})
    })

    it('should handle regular nested rules', () => {
      const sheet = jss2.createStyleSheet({
        '@global': {
          button: {
            color: 'red',
            '& span': {
              color: 'green'
            }
          }
        }
      })
      expect(sheet.toString()).to.be(
        'button {\n  color: red;\n}\nbutton span {\n  color: green;\n}'
      )
    })

    it('should handle nested rules inside of a rule with comma separated selector', () => {
      const sheet = jss2.createStyleSheet({
        '@global': {
          'button, a': {
            color: 'red',
            '& span': {
              color: 'green'
            }
          }
        }
      })

      expect(sheet.toString()).to.be(
        'button, a {\n' +
          '  color: red;\n' +
          '}\n' +
          'button span, a span {\n' +
          '  color: green;\n' +
          '}'
      )
    })

    it('should handle regular deep nested rules', () => {
      const sheet = jss2.createStyleSheet({
        '@global': {
          button: {
            color: 'red',
            '& span': {
              color: 'green',
              '& b': {
                color: 'blue'
              }
            }
          }
        }
      })

      expect(sheet.toString()).to.be(
        'button {\n' +
          '  color: red;\n' +
          '}\n' +
          'button span {\n' +
          '  color: green;\n' +
          '}\n' +
          'button span b {\n' +
          '  color: blue;\n' +
          '}'
      )
    })

    it('should handle nested conditional rules', () => {
      const sheet = jss2.createStyleSheet({
        '@global': {
          html: {
            color: 'red',
            '@media (max-width: 767px)': {
              color: 'green'
            }
          }
        }
      })
      expect(sheet.toString()).to.be(
        'html {\n' +
          '  color: red;\n' +
          '}\n' +
          '@media (max-width: 767px) {\n' +
          '  html {\n' +
          '    color: green;\n' +
          '  }\n' +
          '}'
      )
    })

    it('should handle conditionals with nesting inside', () => {
      const sheet = jss2.createStyleSheet({
        '@global': {
          '@media (max-width: 767px)': {
            html: {
              color: 'red',
              '& button': {
                color: 'green'
              }
            }
          }
        }
      })
      expect(sheet.toString()).to.be(
        '@media (max-width: 767px) {\n' +
          '  html {\n' +
          '    color: red;\n' +
          '  }\n' +
          '  html button {\n' +
          '    color: green;\n' +
          '  }\n' +
          '}'
      )
    })
  })
})
