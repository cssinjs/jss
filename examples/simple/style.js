(function() {

var style = {}

style['.square'] = {
    float: 'left',
    width: 100,
    height: 100,
    background: 'red'
}


// Application
var style = jss.createStyle(rules).attach()

var buttons = document.getElementsByTagName('button')

buttons[0].addEventListener('click', function() {
    style.detach()
})

buttons[1].addEventListener('click', function() {
    style.attach()
})

}())
