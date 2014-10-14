(function() {

var rules = {}

rules['.square'] = {
    float: 'left',
    width: 100,
    height: 100,
    background: 'red',
    ' button': {
        padding: 20,
        background: 'blue'
    }
}

// Application
jss.createStyle(rules).attach()

}())
