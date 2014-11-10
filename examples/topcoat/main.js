var jss = require('../..')
var normalize = jss.createStylesheet(require('./normalize')).attach()
var hogan = window.Hogan;

function $(selector) {
    return document.querySelectorAll(selector)
}

(function () {
    var buttonBar = jss.createStylesheet(require('./topcoat-button-bar'), true).attach()
    var button = jss.createStylesheet(require('./topcoat-button'), true).attach()
    var tplEl = $('.button-bar-tpl')[0]
    var buttonBarTpl = Hogan.compile(tplEl.innerHTML)

    document.body.innerHTML = buttonBarTpl.render({
        buttonBar: buttonBar.classes,
        button: button.classes
    })
}())
