var jss = require('../..')
var normalize = jss.createStyleSheet(require('./normalize'), {named: false}).attach()
var hogan = window.Hogan;

function $(selector) {
    return document.querySelectorAll(selector)
}

(function () {
    var buttonBar = jss.createStyleSheet(require('./topcoat-button-bar')).attach()
    var button = jss.createStyleSheet(require('./topcoat-button')).attach()
    var tplEl = $('.button-bar-tpl')[0]
    var buttonBarTpl = Hogan.compile(tplEl.innerHTML)

    document.body.innerHTML = buttonBarTpl.render({
        buttonBar: buttonBar.classes,
        button: button.classes
    })
}())
