(function() {

var rules = {
    '.square': {
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
}

// Application
console.log(jss.createStyle(rules).attach())


}())
