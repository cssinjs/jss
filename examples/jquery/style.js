(function() {

var rule = jss.createRule({
    padding: '20px',
    background: 'blue'
})

$('button').css(rule.style)

}())
