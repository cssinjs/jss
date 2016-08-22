import expect from 'expect.js'
import jss from 'jss'
import {reset} from '../utils'

describe('Functional: rules', () => {
  afterEach(reset)

  describe('rule.applyTo()', () => {
    it('should apply float: left', () => {
      const div = document.createElement('div')
      jss.createRule({
        float: 'left'
      }).applyTo(div)
      expect(div.style.float).to.be('left')
    })
  })
})
