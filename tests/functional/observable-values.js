import expect from 'expect.js'
import Observable from 'zen-observable'

import {create} from '../../src'
import {
  createGenerateClassName,
  computeStyle
} from '../utils'

const settings = {createGenerateClassName}

describe('Functional: Observable values', () => {
  let jss

  beforeEach(() => {
    jss = create(settings)
  })

  describe('Observables', () => {
    let sheet
    let observer

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: {
          height: new Observable((obs) => {
            observer = obs
          })
        }
      }, {link: true}).attach()
    })

    it('should subscribe the observer', () => {
      expect(observer).to.be.an(Object)
    })

    it('should accept an observable', () => {
      expect(computeStyle(sheet.classes.a).height).to.be('0px')
    })

    it('should update the value 1', () => {
      observer.next('10px')
      expect(computeStyle(sheet.classes.a).height).to.be('10px')
    })

    it('should update the value 2', () => {
      observer.next('20px')
      expect(computeStyle(sheet.classes.a).height).to.be('20px')
    })
  })
})
