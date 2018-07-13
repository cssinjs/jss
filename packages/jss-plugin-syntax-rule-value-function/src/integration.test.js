/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'

import {create} from 'jss'
import {createGenerateClassName} from '../../jss/tests/utils'
import functionPlugin from './'

const settings = {createGenerateClassName}

describe('Integration', () => {
  let jss

  beforeEach(() => {
    jss = create(settings).use(functionPlugin())
  })

  describe('rule.toJSON()', () => {
    it('should handle function values', () => {
      const sheet = jss.createStyleSheet({
        a: {color: () => 'red'}
      })
      sheet.update()
      expect(sheet.getRule('a').toJSON()).to.eql({color: 'red'})
    })
  })
})
