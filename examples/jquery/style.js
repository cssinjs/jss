(function() {

var rule = jss.createRule({
    padding: 20,
    background: 'blue'
})

$('button').css(rule.style)

}())
