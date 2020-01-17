// Styles
var styles = {
  square: {
    float: 'left',
    width: '100px',
    height: '100px',
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
jss.default.use(jssNested.default())
var sheet = jss.default.createStyleSheet(styles).attach()

// Application logic.
var div = document.body.appendChild(document.createElement('div'))
div.innerHTML =
  '\
  <div class="' + sheet.classes.square + '">\
    <button>Button</button>\
  </div>\
'
