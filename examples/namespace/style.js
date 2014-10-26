(function() {

var rule1 = {
    padding: 20,
    background: 'blue'
}

var rule2 = {
    padding: 20,
    background: 'green'
}

// Application
var stylesheet = jss.createStylesheet().attach()

var button1 = stylesheet.addRule(rule1)
var button2 = stylesheet.addRule(rule2)

document.body.innerHTML = '<button class="'+ button1.className +'">Button 1</button>' +
    '<button class="'+ button2.className +'">Button 2</button>'

}())
