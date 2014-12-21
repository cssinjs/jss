(function () {
    var sheet = jss.createStyleSheet(window.styles, {
        named: true,
        link: true
    }).attach()

    var section = document.querySelectorAll('section')[0]
    for (var i = 0; i < 100; i++) {
        var box = document.createElement('div')
        box.className = sheet.classes.box
        section.appendChild(box)
    }

    var toArray = Array.prototype.slice
    var buttons = toArray.call(document.querySelectorAll('button'))
    buttons.forEach(function (button) {
        button.addEventListener('click', setColor)
    })

    function setColor(e) {
        sheet.getRule('box').prop('background', e.target.innerHTML)
    }
}())
