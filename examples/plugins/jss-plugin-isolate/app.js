import jss from 'jss'
import jssPluginIsolate from 'jss-plugin-isolate'

const styles = {
  button: {
    'background-color': '#50ee50',
    color: '#fff',
    'border-radius': '3px',
    padding: '10px 20px',
    'font-family': 'sans-serif'
  }
}

// JSS Setup
jss.use(jssPluginIsolate())
const {classes} = jss.createStyleSheet(styles).attach()

// Application logic.
const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `<button class="${classes.button}">Button</button>`
