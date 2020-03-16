import jss from 'jss'
import jssPluginVendorPrefixer from 'jss-plugin-vendor-prefixer'

const styles = {
  button: {
    transform: 'translateX(100px)'
  }
}

// JSS Setup
jss.use(jssPluginVendorPrefixer())
const {classes} = jss.createStyleSheet(styles).attach()

// Application logic.
const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `<button class="${classes.button}">Button</button>`
