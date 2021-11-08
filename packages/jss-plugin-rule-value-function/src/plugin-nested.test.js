import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'
import pluginNested from '../../jss-plugin-nested'
import pluginFunction from '.'

const settings = {createGenerateId: () => (rule) => `${rule.key}-id`}

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
            a: (data) => ({
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
              '@media all': (data) => ({
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

    describe('should update', () => {
      beforeEach(() => {
        sheet.update({color: 'green'})
      })

      describe('first update', () => {
        const expectedCSS = stripIndent`
          .a-id {
            color: red;
          }
          .a-id a {
            color: green;
          }
        `
        it('should return correct .toString()', () => {
          expect(sheet.toString()).to.be(expectedCSS)
        })
      })

      describe('second update', () => {
        beforeEach(() => {
          sheet.update({color: 'yellow'})
        })
        const expectedCSS = stripIndent`
          .a-id {
            color: red;
          }
          .a-id a {
            color: yellow;
          }
        `
        it('should return correct .toString()', () => {
          expect(sheet.toString()).to.be(expectedCSS)
        })
      })
    })

    describe('updates should replace rules, so that we dont generate more and more of them', () => {
      beforeEach(() => {
        sheet.update({color: 'green'})
        sheet.update({color: 'red'})
        sheet.update({color: 'yellow'})
        sheet.update({color: 'green'})
      })

      const expectedCSS = stripIndent`
        .a-id {
          color: red;
        }
        .a-id a {
          color: green;
        }
      `
      it('should return correct .toString()', () => {
        expect(sheet.toString()).to.be(expectedCSS)
      })
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

      sheet.update({color: 'green'})
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should return correct .toString() on first update', () => {
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
        .a-id a {
          color: green;
        }
      `)
    })

    it('should return correct .toString() on second update', () => {
      sheet.update({color: 'blue'})

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
        .a-id a {
          color: blue;
        }
      `)
    })
  })

  describe('nested identical selector as a fn rule', () => {
    let sheet

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: {
              color: 'red',
              '&': ({width}) => ({
                width
              })
            }
          },
          {link: true}
        )
        .attach()

      sheet.update({width: '10px'})
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should return correct .toString() on first update', () => {
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
        .a-id {
          width: 10px;
        }
      `)
    })

    it('should return correct .toString() on second update', () => {
      sheet.update({width: '100px'})
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          color: red;
        }
        .a-id {
          width: 100px;
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
                  margin: ({margin}) => margin
                }
              }
            }
          },
          {link: true}
        )
        .attach()

      sheet.update({margin: '10px'})
    })

    afterEach(() => {
      sheet.detach()
    })

    it('should return correct .toString() on first update', () => {
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

    it('should return correct .toString() on  update', () => {
      sheet.update({margin: '99px'})

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
          margin: 99px;
        }
      `)
    })
  })
})
