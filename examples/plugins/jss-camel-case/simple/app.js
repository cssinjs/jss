// Styles
var styles = {
  button: {
    fontSize: '50px',
    zIndex: 1,
    lineHeight: 1.2
  }
}

// JSS Setup
jss.default.use(jssCamelCase.default())
var sheet = jss.default.createStyleSheet(styles).attach()

// Application logic.
var div = document.body.appendChild(document.createElement('div'))
div.innerHTML = '<button class="' + sheet.classes.button + '">Button</button>'
