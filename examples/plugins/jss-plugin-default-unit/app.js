import jss from 'jss'
import jssPluginDefaultUnit from 'jss-plugin-default-unit'

const styles = {
  button: {
    'font-size': 20,
    'z-index': 1,
    'line-height': 2
  }
}

// JSS Setup
jss.use(jssPluginDefaultUnit())
const {classes} = jss.createStyleSheet(styles).attach()

// Application logic.
const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `<button class="${classes.button}">Button</button>`
