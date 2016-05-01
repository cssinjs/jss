import expect from 'expect.js'
import jss from 'jss'
import {reset} from '../utils'

afterEach(reset)

describe('Functional: rules', () => {
  describe('rule.applyTo()', () => {
    const div = document.createElement('div')

    it('should apply float: left', () => {
      jss.createRule({
        float: 'left'
      }).applyTo(div)
      expect(div.style.float).to.be('left')
    })

    it('should apply display: inline', () => {
      jss.createRule({
        display: ['inline', 'something-unsupported']
      }).applyTo(div)
      expect(div.style.display).to.be('inline')
    })
  })
})
