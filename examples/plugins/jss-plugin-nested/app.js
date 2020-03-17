import jss from 'jss'
import jssPluginNested from 'jss-plugin-nested'

const styles = {
  square: {
    float: 'left',
    width: '100px',
    height: '100px',
    background: 'red',
    '&:hover': {
      background: 'yellow'
    },
    // Use whatever selector you want.
    '& button': {
      padding: '20px',
      background: 'blue'
    }
  }
}

// JSS Setup
jss.use(jssPluginNested())
const {classes} = jss.createStyleSheet(styles).attach()

// Application logic.
const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `<div class="${classes.square}"><button>Button</button></div>`
