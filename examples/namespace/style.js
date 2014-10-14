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
var style = jss.createStyle().attach()

var button1 = style.addRule(rule1)
var button2 = style.addRule(rule2)

document.body.innerHTML = '<button class="'+ button1.className +'">Button 1</button>' +
    '<button class="'+ button2.className +'">Button 2</button>'

}())
