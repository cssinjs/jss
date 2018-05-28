import expect from 'expect.js'
import Observable from 'zen-observable'

import {create} from '../../src'
import {createGenerateClassName, computeStyle} from '../utils'

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

      expect(computeStyle(sheet.classes.div).display).to.be('block')
      expect(computeStyle(sheet.classes.button).height).to.be('3px')
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

      expect(computeStyle(sheet.classes.div).display).to.be('block')
      expect(computeStyle(sheet.classes.button).height).to.be('3px')
      expect(computeStyle(sheet.classes.a).opacity).to.be('0')
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
      expect(computeStyle(sheet.classes.div).display).to.be('block')
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

      expect(computeStyle(sheet.classes.div).display).to.be('inline-block')
    })
  })
})
