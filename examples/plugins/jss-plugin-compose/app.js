import jss from 'jss'
import jssPluginCompose from 'jss-plugin-compose'

const styles = {
  button: {
    composes: 'btn btn-primary',
    color: 'red'
  },
  buttonActive: {
    composes: ['btn', 'btn-primary'],
    color: 'blue'
  },
  buttonActiveDisabled: {
    composes: '$buttonActive',
    opacity: 0.5
  }
}

// JSS Setup
jss.use(jssPluginCompose())
const {classes} = jss.createStyleSheet(styles).attach()

// Application logic.
const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `
  <button class="${classes.button}">Button</button>
  <button class="${classes.buttonActive}">Active Button</button>
  <button class="${classes.buttonActiveDisabled}">Disabled Active Button</button>
`
