import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import pluginNested from '../../jss-plugin-syntax-nested'
import pluginFunction from '.'

const settings = {createGenerateClassName: () => rule => `${rule.key}-id`}

describe('jss-plugin-syntax-rule-value-function: plugin-nested', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(pluginNested(), pluginFunction())
  })

  describe('@media nested in fn rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: data => ({
              color: data.color,
              '@media all': {
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

    it('should return correct .toString()', () => {
      sheet.update({color: 'red'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
        @media all {
          .a-id {
            color: green;
          }
        }
      `)
    })
  })

  describe('@media nested as a fn rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: {
              color: 'red',
              '@media all': data => ({
                color: data.color
              })
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
      sheet.update({color: 'green'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
        @media all {
          .a-id {
            color: green;
          }
        }
      `)
    })
  })

  describe('nested selector inside of a fn rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: ({color}) => ({
              color: 'red',
              '& a': {
                color
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

    it('should return correct .toString()', () => {
      sheet.update({color: 'green'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
        .a-id a {
          color: green;
        }
      `)
    })
  })

  describe('nested selector as a fn rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: {
              color: 'red',
              '& a': ({color}) => ({
                color
              })
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
      sheet.update({color: 'green'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
        .a-id a {
          color: green;
        }
      `)
    })
  })
})
