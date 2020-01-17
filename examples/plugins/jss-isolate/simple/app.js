// Styles
var styles = {
  button: {
    'background-color': '#50ee50',
    color: '#fff',
    'border-radius': '3px',
    padding: '10px 20px',
    'font-family': 'sans-serif'
  }
}

// JSS Setup
jss.default.use(jssIsolate.default())
var sheet = jss.default.createStyleSheet(styles).attach()

// Application logic.
var div = document.body.appendChild(document.createElement('div'))
div.innerHTML = '<a class="' + sheet.classes.button + '">Button</a>'
