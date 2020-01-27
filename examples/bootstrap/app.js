import jss from 'jss'
import preset from 'jss-preset-default'
import bootstrap from './bootstrap'
import bootstrapTheme from './bootstrap-theme'

// JSS setup.
jss.setup(preset())

// Application.
const styles = {
  bootstrap,
  theme: bootstrapTheme,
  app: {
    composes: ['$bootstrap', '$theme']
  },
  button: {
    composes: 'btn btn-primary btn-lg'
  }
}

const sheet = jss.createStyleSheet(styles).attach()
const classes = sheet.classes

const div = document.body.appendChild(document.createElement('div'))
div.innerHTML = `\
  <div class="${classes.app}">\
    <button class="${classes.button}">Button</button>\
  </div>\
`
