import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import Observable from 'zen-observable'

import {create} from 'jss'
import pluginDefaultUnit from 'jss-plugin-default-unit'
import pluginCamelCase from 'jss-plugin-camel-case'
import pluginObservable from '.'

const settings = {createGenerateId: () => rule => `${rule.key}-id`}

describe('jss-plugin-rule-value-observable: rules', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(pluginObservable())
  })

  describe('.toString()', () => {
    let sheet
    let observer

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            div: new Observable(obs => {
              observer = obs
            })
          },
          {link: true}
        )
        .attach()
    })

    it('should subscribe the observer', () => {
      expect(observer).to.be.an(Object)
    })

    it('should update the value', () => {
      observer.next({opacity: '0', height: '5px'})

      expect(sheet.toString()).to.be(stripIndent`
        .div-id {
          opacity: 0;
          height: 5px;
        }
      `)
    })

    it('should update the value when it receives a new emission', () => {
      observer.next({opacity: '0', height: '5px'})
      observer.next({opacity: '1', height: '10px'})

      expect(sheet.toString()).to.be(stripIndent`
        .div-id {
          opacity: 1;
          height: 10px;
        }
      `)
    })

    it('should work with multiple rules', () => {
      let divObs
      let buttonObs

      sheet = jss
        .createStyleSheet(
          {
            div: new Observable(obs => {
              divObs = obs
            }),
            button: new Observable(obs => {
              buttonObs = obs
            })
          },
          {link: true}
        )
        .attach()

      divObs.next({display: 'block'})
      buttonObs.next({height: '3px'})

      expect(sheet.toString()).to.be(stripIndent`
        .div-id {
          display: block;
        }
        .button-id {
          height: 3px;
        }
      `)
    })

    it('should work with mixed sheets', () => {
      let divObs
      let buttonObs

      sheet = jss
        .createStyleSheet(
          {
            div: new Observable(obs => {
              divObs = obs
            }),
            button: new Observable(obs => {
              buttonObs = obs
            }),
            a: {
              opacity: '0'
            }
          },
          {link: true}
        )
        .attach()

      divObs.next({display: 'block'})
      buttonObs.next({height: '3px'})

      expect(sheet.toString()).to.be(stripIndent`
        .div-id {
          display: block;
        }
        .button-id {
          height: 3px;
        }
        .a-id {
          opacity: 0;
        } 
      `)
    })

    it('should accept synchronous values', () => {
      sheet = jss
        .createStyleSheet(
          {
            div: new Observable(obs => {
              obs.next({display: 'block'})
            })
          },
          {link: true}
        )
        .attach()

      expect(sheet.toString()).to.be(stripIndent`
        .div-id {
          display: block;
        }
      `)
    })

    it('should update synchronous values when it receives a new emission', () => {
      sheet = jss
        .createStyleSheet(
          {
            a: new Observable(obs => {
              obs.next({display: 'block'})
              observer = obs
            })
          },
          {link: true}
        )
        .attach()

      observer.next({display: 'inline-block'})

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          display: inline-block;
        }
      `)
    })

    it('should not process props or values', () => {
      jss = create(settings).use(
        pluginObservable({process: false}),
        pluginDefaultUnit(),
        pluginCamelCase()
      )
      sheet = jss.createStyleSheet(
        {
          a: new Observable(obs => {
            observer = obs
          })
        },
        {link: true}
      )
      observer.next({marginLeft: 20})

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          marginLeft: 20;
        }
      `)
    })

    it('should process props and values', () => {
      jss = create(settings).use(pluginObservable(), pluginDefaultUnit(), pluginCamelCase())
      sheet = jss.createStyleSheet(
        {
          a: new Observable(obs => {
            observer = obs
          })
        },
        {link: true}
      )

      observer.next({marginLeft: 20})

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          margin-left: 20px;
        }
      `)
    })
  })

  describe('.toJSON()', () => {
    let sheet
    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            div: new Observable(observer => {
              observer.next({color: 'red'})
            })
          },
          {link: true}
        )
        .attach()
    })

    it('should handle observable rules', () => {
      const rule = sheet.getRule('div')
      expect(rule.toJSON()).to.eql({color: 'red'})
    })
  })
})
