import jss from 'jss'
import jssPluginPropsSort from 'jss-plugin-props-sort'

// Styles
const styles = {
  button: {
    'border-left': '3px solid red',
    border: '3px solid green'
  }
}

// JSS Setup
jss.use(jssPluginPropsSort())
const {classes} = jss.createStyleSheet(styles).attach()

// Application logic.
const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `<button class="${classes.button}">Button</button>`
