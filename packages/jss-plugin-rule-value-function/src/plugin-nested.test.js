import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import pluginNested from '../../jss-plugin-nested'
import pluginFunction from '.'

const settings = {createGenerateId: () => rule => `${rule.key}-id`}

describe('jss-plugin-rule-value-function: plugin-nested', () => {
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

  describe('deeply nested selector as a fn value', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: {
              padding: '5px'
            },
            b: {
              background: 'blue'
            },
            c: {
              '&$a': {
                '& $b': {
                  margin: () => '10px'
                }
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
      sheet.update()
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          padding: 5px;
        }
        .b-id {
          background: blue;
        }
        .c-id {}
        .c-id.a-id {}
        .c-id.a-id .b-id {
          margin: 10px;
        }
      `)
    })
  })
})
