import jss from 'jss'
import componentA from './component-a-style'
import componentB from './component-b-style'

const sheetA = jss.createStyleSheet(componentA).attach()
const sheetB = jss.createStyleSheet(componentB).attach()

const tpl = document.getElementById('template').innerHTML
const div = document.createElement('div')
div.innerHTML = tpl
  .replace('{button-a}', sheetA.classes.button)
  .replace('{button-b}', sheetB.classes.button)
document.body.appendChild(div)
