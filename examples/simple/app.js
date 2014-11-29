(function () {
    var ss = jss.createStyleSheet(window.styles).attach()

    var buttons = document.getElementsByTagName('button')

    buttons[0].addEventListener('click', function() {
        ss.detach()
    })

    buttons[1].addEventListener('click', function() {
        ss.attach()
    })
}())
