import jss from 'jss'
import componentA from './component-a-style'
import componentB from './component-b-style'

var sheetA = jss.createStyleSheet(componentA).attach()
var sheetB = jss.createStyleSheet(componentB).attach()

var tpl = document.getElementById('template').innerHTML
var div = document.createElement('div')
div.innerHTML = tpl
  .replace('{button-a}', sheetA.classes.button)
  .replace('{button-b}', sheetB.classes.button)
document.body.appendChild(div)
