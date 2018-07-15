import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import Observable from 'zen-observable'

import {create} from 'jss'
import observable from './'

const settings = {createGenerateClassName: () => rule => `${rule.key}-id`}

describe('jss-plugin-syntax-rule-value-observable', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(observable())
  })

  describe('Rules', () => {
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
            div: new Observable(obs => {
              obs.next({display: 'block'})
              observer = obs
            })
          },
          {link: true}
        )
        .attach()

      observer.next({display: 'inline-block'})

      expect(sheet.toString()).to.be(stripIndent`
        .div-id {
          display: inline-block;
        }
      `)
    })
  })

  describe('Values', () => {
    let sheet
    let observer

    beforeEach(() => {
      sheet = jss
        .createStyleSheet(
          {
            a: {
              height: new Observable(obs => {
                observer = obs
              })
            }
          },
          {link: true}
        )
        .attach()
    })

    it('should subscribe the observer', () => {
      expect(observer).to.be.an(Object)
    })

    it('should accept an observable', () => {
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
        }
      `)
    })

    it('should update the value 1', () => {
      observer.next('10px')

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          height: 10px;
        }
      `)
    })

    it('should update the value 2', () => {
      observer.next('20px')

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          height: 20px;
        }
      `)
    })
  })

  describe('rule.toJSON()', () => {
    it('should handle observable values', () => {
      const rule = jss.createRule({
        color: new Observable(observer => {
          observer.next('red')
        })
      })

      expect(rule.toJSON()).to.eql({color: 'red'})
    })
  })
})
