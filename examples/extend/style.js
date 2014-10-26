(function() {

var rules = {}

rules['.button-1'] = {
    padding: 20,
    background: 'blue'
}

rules['.button-2'] = {
    extend: rules['.button-1'],
    padding: 30
}

// Application
jss.createStylesheet(rules).attach()

}())
