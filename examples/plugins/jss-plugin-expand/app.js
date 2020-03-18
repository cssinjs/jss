import jss from 'jss'
import jssPluginExpand from 'jss-plugin-expand'

const styles = {
  button: {
    border: {
      color: 'black',
      width: 1,
      style: 'solid'
    }
  }
}

// JSS Setup
jss.use(jssPluginExpand())
const {classes} = jss.createStyleSheet(styles).attach()

// Application logic.
const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `<button class="${classes.button}">Button</button>`
