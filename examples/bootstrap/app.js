import jss from 'jss'
import preset from 'jss-preset-default'
import bootstrap from './bootstrap'
import bootstrapTheme from './bootstrap-theme'

// JSS setup.
jss.setup(preset())

// Application.
const styles = {
  ...bootstrap,
  ...bootstrapTheme,
  button: {
    composes: 'btn btn-primary btn-lg'
  }
}

const sheet = jss.createStyleSheet(styles).attach()
const classes = sheet.classes

const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `<button class="${classes.button}">Button</button>`
