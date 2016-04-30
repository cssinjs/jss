import jss from 'jss'
import {setup} from '../utils'

QUnit.module('Functional rules', setup)

test('.applyTo()', () => {
  const div = document.createElement('div')
  jss.createRule({
    float: 'left'
  }).applyTo(div)
  equal(div.style.float, 'left')

  jss.createRule({
    display: ['inline', 'something-unsupported']
  }).applyTo(div)
  equal(div.style.display, 'inline')
})
