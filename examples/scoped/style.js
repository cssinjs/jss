(function() {

var rules = {}

rules['.square'] = {
    float: 'left',
    width: 100,
    height: 100,
    '& button': {
        padding: 20,
        background: 'blue'
    },
    '&.red': {
        background: 'red'
    }
}

// Application
jss.createStyle(rules).attach()

}())
