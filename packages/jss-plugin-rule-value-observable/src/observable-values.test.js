import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import Observable from 'zen-observable'
import {create} from 'jss'

import pluginDefaultUnit from 'jss-plugin-default-unit'
import pluginObservable from '.'

const settings = {createGenerateId: () => rule => `${rule.key}-id`}

describe('jss-plugin-rule-value-observable: values', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(pluginObservable(), pluginDefaultUnit())
  })

  describe('.toString()', () => {
    let sheet
    let observer

    beforeEach(() => {
      sheet = jss.createStyleSheet(
        {
          a: {
            height: new Observable(obs => {
              observer = obs
            })
          }
        },
        {link: true}
      )
    })

    it('should subscribe the observer', () => {
      expect(observer).to.be.an(Object)
    })

    it('should accept an observable', () => {
      expect(sheet.toString()).to.be(stripIndent`
        .a-id {}
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

    it('should not process value', () => {
      jss = create(settings).use(pluginObservable({process: false}), pluginDefaultUnit())
      sheet = jss.createStyleSheet(
        {
          a: {
            height: new Observable(obs => {
              observer = obs
            })
          }
        },
        {link: true}
      )

      observer.next(20)

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          height: 20;
        }
      `)
    })

    it('should process the value', () => {
      jss = create(settings).use(pluginObservable(), pluginDefaultUnit())
      sheet = jss.createStyleSheet(
        {
          a: {
            height: new Observable(obs => {
              observer = obs
            })
          }
        },
        {link: true}
      )

      observer.next(20)

      expect(sheet.toString()).to.be(stripIndent`
        .a-id {
          height: 20px;
        }
      `)
    })
  })

  describe('.toJSON()', () => {
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
