import jss from 'jss'
import preset from 'jss-preset-default'
import bootstrap from './bootstrap'
import bootstrapTheme from './bootstrap-theme'

// JSS setup.
jss.setup(preset())

// Application.
var styles = {
  bootstrap: bootstrap,
  theme: bootstrapTheme,
  app: {
    composes: ['$bootstrap', '$theme']
  },
  button: {
    composes: 'btn btn-primary btn-lg'
  }
}

var sheet = jss.createStyleSheet(styles).attach()
var classes = sheet.classes

var div = document.body.appendChild(document.createElement('div'))
div.innerHTML =
  '\
  <div class="' +
  classes.app +
  '">\
    <button class="' +
  classes.button +
  '">Button</button>\
  </div>\
'
