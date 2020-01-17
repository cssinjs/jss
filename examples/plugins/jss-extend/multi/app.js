// Styles
var button0 = {
  padding: '20px',
  background: 'blue'
}

var redButton = {
  background: 'red'
}

var styles = {
  button0: button0,
  button1: {
    extend: [button0, redButton],
    'font-size': '20px'
  }
}

// JSS Setup
jss.default.use(jssExtend.default())
var sheet = jss.default.createStyleSheet(styles).attach()

// Application logic.
var div = document.body.appendChild(document.createElement('div'))
div.innerHTML =
  '\
  <button class="' +
  sheet.classes.button0 +
  '">Button 1</button>\
  <button class="' +
  sheet.classes.button1 +
  '">Button 2</button>\
'
