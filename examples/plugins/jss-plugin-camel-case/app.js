import jss from 'jss'
import jssPluginCamelCase from 'jss-plugin-camel-case'

const styles = {
  button: {
    fontSize: '50px',
    zIndex: 1,
    lineHeight: 1.2
  }
}

// JSS Setup
jss.use(jssPluginCamelCase())
const {classes} = jss.createStyleSheet(styles).attach()

// Application logic.
const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `<button class="${classes.button}">Button</button>`
