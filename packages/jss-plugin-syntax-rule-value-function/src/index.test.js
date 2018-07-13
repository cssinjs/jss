/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'

import {create} from 'jss'
import {createGenerateClassName} from '../../jss/tests/utils'
import functionPlugin from './'

import './function-rules.test'
import './function-values.test'

const settings = {createGenerateClassName}

describe('jss-plugin-syntax-rule-value-function: Integration', () => {
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
