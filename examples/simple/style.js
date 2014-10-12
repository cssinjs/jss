var rules = {}

rules['.square'] = {
    float: 'left',
    width: 100,
    height: 100,
    background: 'red'
}


// Application
var style = jss.createStyle(rules).attach()

document.getElementsByTagName('button')[0].addEventListener('click', function() {
    style.detach()
})
