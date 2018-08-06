import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import {create} from 'jss'

import keyframes, {resetRegistry, getSheets} from './index'

const demoKeyframes = {
  from: {transform: 'scale(1)'},
  to: {transform: 'scale(0)'}
}

const settings = {
  createGenerateClassName: () => rule => `${rule.key}-id`
}

describe('jss-keyframes-helper', () => {
  let jss

  beforeEach(() => {
    jss = create(settings)
  })

  afterEach(() => {
    resetRegistry()
  })

  describe('basic usage', () => {
    it('should return the name of the animation', () => {
      const animationName = keyframes(demoKeyframes, {jss})

      expect(animationName).to.eql('animation-id')
    })

    it('should add the created sheet to the registry', () => {
      keyframes(demoKeyframes, {jss, name: 'anim1'})

      expect(getSheets().registry.length).to.eql(1)
    })

    it('should reuse a StyleSheet for the same jss instance', () => {
      keyframes(demoKeyframes, {jss, name: 'anim1'})
      keyframes(demoKeyframes, {jss, name: 'anim2'})

      expect(getSheets().registry.length).to.eql(1)
      expect(getSheets().toString()).to.eql(stripIndent`
        @keyframes anim1-id {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(0);
          }
        }
        @keyframes anim2-id {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(0);
          }
        }
      `)
    })

    describe('should create two stylesheets when two different jss instances are passed', () => {
      const jss1 = create()
      const jss2 = create()
      keyframes(demoKeyframes, {jss: jss1})
      keyframes(demoKeyframes, {jss: jss2})

      expect(getSheets().registry.length).to.eql(2)
    })
  })

  describe('with option: name', () => {
    it('should prefix it with a custom name', () => {
      const animationName = keyframes(demoKeyframes, {name: 'scale', jss})

      expect(animationName).to.eql('scale-id')
    })
  })

  describe('with option: sheet', () => {
    it('should add the keyframe to the provided sheet', () => {
      const sheet = jss.createStyleSheet({})

      keyframes(demoKeyframes, {sheet, jss})

      expect(getSheets().registry.length).to.eql(0)
      expect(sheet.toString()).to.eql(stripIndent`
        @keyframes animation-id {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(0);
          }
        }
      `)
    })
  })
})
