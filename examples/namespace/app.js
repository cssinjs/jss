(function () {
    var classes = jss.createStyleSheet(window.styles, true).attach().classes

    document.body.innerHTML = '<button class="'+ classes.button1 +'">Button 1</button>' +
        '<button class="'+ classes.button2 +'">Button 2</button>'

}())
