import expect from 'expect.js'
import jss from 'jss'
import {reset} from '../utils'

afterEach(reset)

describe('Functional: rules', () => {
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
