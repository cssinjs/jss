import expect from 'expect.js'
import jss, {sheets} from '../../src'
import {resetSheets} from '../../../../tests/utils'

describe('Functional: rules', () => {
  beforeEach(resetSheets(sheets))

  describe('rule.applyTo()', () => {
    it('should apply float: left', () => {
      const div = document.createElement('div')
      jss
        .createRule({
          float: 'left'
        })
        .applyTo(div)
      expect(div.style.float).to.be('left')
    })
  })
})
