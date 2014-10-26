(function() {

var rules = {}

rules['.square'] = {
    float: 'left',
    width: 100,
    height: 100,
    background: 'red'
}


// Application
var stylesheet = jss.createStylesheet(rules).attach()

var buttons = document.getElementsByTagName('button')

buttons[0].addEventListener('click', function() {
    stylesheet.detach()
})

buttons[1].addEventListener('click', function() {
    stylesheet.attach()
})

}())
