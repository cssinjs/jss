import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import functionPlugin from '.'

const settings = {createGenerateId: () => rule => `${rule.key}-id`}

describe('jss-plugin-rule-value-function: Function rules', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(functionPlugin())
  })

  describe('basic', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: data => ({
              color: data.color,
              display: 'block'
            })
          },
          {link: true}
        )
        .attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should compile correctly', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
          display: block;
        }
      `)
    })
  })

  describe('remove props', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: data => {
              if (data.removeAll) {
                return null
              }
              if (data.noDisplay) {
                return {color: data.color}
              }
              return {
                color: data.color,
                display: 'block'
              }
            }
          },
          {link: true}
        )
        .attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should compile with color and display', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
          display: block;
        }
      `)
    })

    it('should compile with color', () => {
      sheet.update({color: 'red'})
      sheet.update({color: 'red', noDisplay: true})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
      `)
    })

    it('should remove all props', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
          display: block;
        }
      `)
      sheet.update({removeAll: true})
      expect(sheet.toString()).to.be('.a-id {}')
    })
  })

  describe('fallbacks inside', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: data => ({
              color: data.color,
              fallbacks: {
                color: 'green'
              }
            })
          },
          {link: true}
        )
        .attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should output with fallbacks', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: green;
          color: red;
        }
      `)
    })
  })

  describe('@media with fn values', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            '@media all': {
              a: {
                color: ({color}) => color
              }
            }
          },
          {link: true}
        )
        .attach()
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should return correct .toString()', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        @media all {
          .a-id {
            color: red;
          }
        }
      `)
    })
  })

  describe('.addRule() with style rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet(null, {link: true}).attach()
      sheet.addRule('a', data => ({
        color: data.primary ? 'black' : 'white'
      }))
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should compile correct CSS', () => {
      sheet.update({primary: true})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: black;
        }
      `)
    })

    it('should return correct .toString()', () => {
      sheet.update({primary: false})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: white;
        }
      `)
    })
  })

  describe('.addRule() with @media', () => {
    let sheet

    beforeEach(() => {
      sheet = jss.createStyleSheet({}, {link: true}).attach()
      sheet.addRule('@media screen', {
        b: data => ({
          color: data.primary ? 'black' : 'white'
        })
      })
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should return correct .toString()', () => {
      sheet.update({primary: true})
      expect(sheet.toString()).to.be(stripIndent`
        @media screen {
          .b-id {
            color: black;
          }
        }
      `)
    })
  })
})
