(function() {

var style1 = {
    padding: 20,
    background: 'blue'
}

var style2 = {
    padding: 20,
    background: 'green'
}

// Application
var button1 = jss.createRule(style1)
var button2 = jss.createRule(style2)

document.body.innerHTML = '<button class="'+ button1.className +'">Button 1</button>' +
    '<button class="'+ button2.className +'">Button 2</button>'

}())
