var rules = exports.rules = {}

var square = exports.square = {
    width: 100,
    height: 100
}

rules['.square'] = {
    float: 'left',
    background: 'red',
    width: square.width + 'px',
    height: square.height + 'px'
}
