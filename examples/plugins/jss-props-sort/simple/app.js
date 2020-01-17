// Styles
var styles = {
  button: {
    'border-left': '3px solid red',
    border: '3px solid green'
  }
}

// JSS Setup
jss.default.use(jssPropsSort.default())
var sheet = jss.default.createStyleSheet(styles).attach()

// Application logic.
var div = document.body.appendChild(document.createElement('div'))
div.innerHTML = '<button class="' + sheet.classes.button + '">Button</button>'
