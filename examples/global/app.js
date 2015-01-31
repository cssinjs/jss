(function () {
    var ss = jss.createStyleSheet(window.styles, {named: false}).attach()

    var buttons = document.getElementsByTagName('button')

    buttons[0].addEventListener('click', function() {
        ss.detach()
    })

    buttons[1].addEventListener('click', function() {
        ss.attach()
    })
}())
