import expect from 'expect.js'
import Observable from 'zen-observable'

import {create} from '../../src'
import {
  createGenerateClassName,
  computeStyle
} from '../utils'

const settings = {createGenerateClassName}

describe('Functional: Observable rules', () => {
  let jss

  beforeEach(() => {
    jss = create(settings)
  })

  describe('Observables', () => {
    let sheet
    let observer

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        div: new Observable((obs) => {
          observer = obs
        }),
      }, {link: true}).attach()
    })

    it('should subscribe the observer', () => {
      expect(observer).to.be.an(Object)
    })

    it('should update the value', () => {
      observer.next({opacity: '0', height: '5px'})

      const result = computeStyle(sheet.classes.div)

      expect(result.opacity).to.be('0')
      expect(result.height).to.be('5px')
    })

    it('should update the value when it receives a new emission', () => {
      observer.next({opacity: '0', height: '5px'})
      observer.next({opacity: '1', height: '10px'})

      const result = computeStyle(sheet.classes.div)

      expect(result.opacity).to.be('1')
      expect(result.height).to.be('10px')
    })

    it('should work with multiple rules', () => {
      let divObs
      let buttonObs

      sheet = jss.createStyleSheet({
        div: new Observable((obs) => {
          divObs = obs
        }),
        button: new Observable((obs) => {
          buttonObs = obs
        })
      }, {link: true}).attach()

      divObs.next({display: 'flex'})
      buttonObs.next({height: '3px'})

      expect(computeStyle(sheet.classes.div).display).to.be('flex')
      expect(computeStyle(sheet.classes.button).height).to.be('3px')
    })

    it('should work with mixed sheets', () => {
      let divObs
      let buttonObs

      sheet = jss.createStyleSheet({
        div: new Observable((obs) => {
          divObs = obs
        }),
        button: new Observable((obs) => {
          buttonObs = obs
        }),
        a: {
          opacity: '0',
        }
      }, {link: true}).attach()

      divObs.next({display: 'flex'})
      buttonObs.next({height: '3px'})

      expect(computeStyle(sheet.classes.div).display).to.be('flex')
      expect(computeStyle(sheet.classes.button).height).to.be('3px')
      expect(computeStyle(sheet.classes.a).opacity).to.be('0')
    })

    it('should accept synchronous values', () => {
      sheet = jss.createStyleSheet({
        div: new Observable((obs) => {
          obs.next({display: 'flex'})
        })
      }, {link: true}).attach()

      expect(computeStyle(sheet.classes.div).display).to.be('flex')
    })

    it('should update synchronous values when it receives a new emission', () => {
      sheet = jss.createStyleSheet({
        div: new Observable((obs) => {
          obs.next({display: 'flex'})
          observer = obs
        })
      }, {link: true}).attach()

      observer.next({display: 'inline-flex'})

      expect(computeStyle(sheet.classes.div).display).to.be('inline-flex')
    })
  })
})

describe('Functional: Observable props', () => {
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
