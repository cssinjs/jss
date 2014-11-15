(function() {

var styles = window.styles = {}

var button1 = {
    padding: '20px',
    background: 'blue'
}

styles['.button-1'] = button1

var redButton = {
    background: 'red'
}

styles['.button-2'] = {
    extend: [button1, redButton],
    'font-size': '20px'
}

}())
