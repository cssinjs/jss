/* eslint-disable no-underscore-dangle */

import {beforeEach, describe, expect, it} from 'vitest'
import {create} from 'jss'

import cache from './index'

describe('jss-plugin-cache', () => {
  let jss

  beforeEach(() => {
    jss = create().use(cache())
  })

  describe('ensure cache is used', () => {
    it('should not call onCreateRule', () => {
      const styles = {a: {color: 'red'}}
      let onCreateRuleCalled = false
      // After the first call its cached.
      jss.createStyleSheet(styles)
      jss.use({
        onCreateRule: () => {
          onCreateRuleCalled = true
        }
      })
      jss.createStyleSheet(styles)
      expect(onCreateRuleCalled).toBe(false)
    })

    it('should not call processors on a cached rule', () => {
      const styles = {a: {color: 'red'}}
      let onProcessRuleCalled = false
      // After the first call its cached.
      jss.createStyleSheet(styles)
      jss.use({
        onProcessRule: () => {
          onProcessRuleCalled = true
        }
      })
      jss.createStyleSheet(styles)
      expect(onProcessRuleCalled).toBe(false)
    })
  })

  describe('linked rules should not be cached', () => {
    it('should call onCreateRule', () => {
      const styles = {a: {color: 'red'}}
      const options = {link: true}
      let onCreateRuleCalled = false
      // After the first call it should not be cached.
      jss.createStyleSheet(styles, options)
      jss.use({
        onCreateRule: () => {
          onCreateRuleCalled = true
        }
      })
      jss.createStyleSheet(styles, options)
      expect(onCreateRuleCalled).toBe(true)
    })
  })
})
